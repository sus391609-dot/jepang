import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  EyeOff,
  Headphones,
  Hourglass,
  Languages,
  Play,
  RefreshCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import type { JLPTRun, JLPTSectionResult } from "../contexts/AppContext";
import { sample, shuffle } from "../lib/shuffle";
import {
  buildGoiQuestions,
  type GoiQuestion,
} from "../lib/jlptQuestions";
import { GRAMMAR_PATTERNS, type GrammarPattern } from "../data/grammar";
import { DOKKAI_PASSAGES, type DokkaiPassage } from "../data/dokkai";
import { CHOUKAI_ITEMS, type ChoukaiItem } from "../data/choukai";
import { isTTSSupported, speakJa } from "../lib/tts";
import SpeakButton from "../components/SpeakButton";

// === Konfigurasi seksi (disederhanakan, mengikuti format JLPT N4) ===
const GOI_COUNT = 30;
const GRAMMAR_COUNT = 30;
const DOKKAI_PASSAGE_COUNT = 3;
const CHOUKAI_COUNT = 25;
const GOI_SEC = 25 * 60;
const BUNPOU_DOKKAI_SEC = 55 * 60;
const CHOUKAI_SEC = 35 * 60;
const MAX_PLAY_CHOUKAI = 2;
const MIN_PER_SECTION = 19;
const MIN_TOTAL = 90;

type SectionKey = "goi" | "bunpou-dokkai" | "choukai";
type Stage = "intro" | "section" | "between" | "result";

interface GrammarQ {
  pattern: GrammarPattern;
  exampleIndex: number;
  options: string[];
  correctIndex: number;
}

interface DokkaiFlatQ {
  passageId: string;
  passageTitle: string;
  passageKanji: string;
  passageRomaji: string;
  passageLevel: string;
  q: string;
  options: string[];
  correctIndex: number;
  passageIndex: number; // urutan passage di set ini
  questionIndex: number; // urutan question di passage
  isFirstOfPassage: boolean;
}

interface BunpouDokkaiSet {
  grammar: GrammarQ[];
  dokkai: DokkaiFlatQ[];
}

function makeGrammarQ(pattern: GrammarPattern): GrammarQ {
  const exampleIndex = Math.floor(Math.random() * pattern.examples.length);
  const overlap = GRAMMAR_PATTERNS.filter(
    (p) =>
      p.id !== pattern.id &&
      p.pattern !== pattern.pattern &&
      p.tags.some((t) => pattern.tags.includes(t))
  );
  const rest = GRAMMAR_PATTERNS.filter(
    (p) =>
      p.id !== pattern.id &&
      p.pattern !== pattern.pattern &&
      !overlap.includes(p)
  );
  const distractors: string[] = [];
  const taken = new Set<string>([pattern.pattern]);
  for (const p of [...shuffle(overlap), ...shuffle(rest)]) {
    if (taken.has(p.pattern)) continue;
    distractors.push(p.pattern);
    taken.add(p.pattern);
    if (distractors.length >= 3) break;
  }
  const options = shuffle([pattern.pattern, ...distractors]);
  return {
    pattern,
    exampleIndex,
    options,
    correctIndex: options.indexOf(pattern.pattern),
  };
}

function buildBunpouDokkai(): BunpouDokkaiSet {
  const grammarPicked = sample(
    GRAMMAR_PATTERNS,
    Math.min(GRAMMAR_COUNT, GRAMMAR_PATTERNS.length)
  ).map(makeGrammarQ);
  const passagesPicked = sample(
    DOKKAI_PASSAGES,
    Math.min(DOKKAI_PASSAGE_COUNT, DOKKAI_PASSAGES.length)
  );
  const dokkaiFlat: DokkaiFlatQ[] = [];
  passagesPicked.forEach((p: DokkaiPassage, pi) => {
    p.questions.forEach((q, qi) => {
      dokkaiFlat.push({
        passageId: p.id,
        passageTitle: p.title,
        passageKanji: p.bodyKanji,
        passageRomaji: p.bodyRomaji,
        passageLevel: p.level,
        q: q.q,
        options: q.options,
        correctIndex: q.correctIndex,
        passageIndex: pi,
        questionIndex: qi,
        isFirstOfPassage: qi === 0,
      });
    });
  });
  return { grammar: grammarPicked, dokkai: dokkaiFlat };
}

function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function scoreSection(correct: number, total: number): number {
  // Normalisasi ke skala 60 (3 seksi × 60 = 180).
  if (total <= 0) return 0;
  return Math.round((correct / total) * 60);
}

interface SectionMeta {
  key: SectionKey;
  label: string;
  durationSec: number;
}

const SECTION_ORDER: SectionMeta[] = [
  { key: "goi", label: "Goi (Kosakata)", durationSec: GOI_SEC },
  {
    key: "bunpou-dokkai",
    label: "Bunpou + Dokkai",
    durationSec: BUNPOU_DOKKAI_SEC,
  },
  { key: "choukai", label: "Choukai (Listening)", durationSec: CHOUKAI_SEC },
];

interface Answers {
  goi: (number | null)[];
  bunpou: (number | null)[];
  dokkai: (number | null)[];
  choukai: (number | null)[];
}

export default function SimulasiJLPT() {
  const { addJLPTRun } = useApp();
  const [stage, setStage] = useState<Stage>("intro");
  const [sectionIdx, setSectionIdx] = useState(0);

  // Soal-soal per seksi (digenerate sekali per run).
  const [goi, setGoi] = useState<GoiQuestion[]>([]);
  const [bunpouDokkai, setBunpouDokkai] = useState<BunpouDokkaiSet>({
    grammar: [],
    dokkai: [],
  });
  const [choukai, setChoukai] = useState<ChoukaiItem[]>([]);

  // Jawaban user per seksi.
  const [answers, setAnswers] = useState<Answers>({
    goi: [],
    bunpou: [],
    dokkai: [],
    choukai: [],
  });

  // Pointer di dalam seksi.
  const [innerIdx, setInnerIdx] = useState(0);
  // Untuk seksi 2: pakai gabungan bunpou + dokkai sebagai list datar.
  // 0..bunpou.length-1 = bunpou; bunpou.length..end = dokkai.

  // Choukai play count per soal.
  const [choukaiPlays, setChoukaiPlays] = useState<number[]>([]);

  // Dokkai romaji toggle per passage (untuk seksi 2).
  const [showRomaji, setShowRomaji] = useState<Record<number, boolean>>({});

  // Timer.
  const [secLeft, setSecLeft] = useState(0);
  const [sectionStarts, setSectionStarts] = useState<number[]>([0, 0, 0]);
  const [runStart, setRunStart] = useState(0);
  const [sectionResults, setSectionResults] = useState<JLPTSectionResult[]>([]);
  const finalizedRef = useRef(false);
  const ttsSupported = useMemo(() => isTTSSupported(), []);

  // Mulai dari awal.
  const startRun = useCallback(() => {
    finalizedRef.current = false;
    const goiSet = buildGoiQuestions(GOI_COUNT);
    const bunSet = buildBunpouDokkai();
    const choukaiSet = sample(
      CHOUKAI_ITEMS,
      Math.min(CHOUKAI_COUNT, CHOUKAI_ITEMS.length)
    );
    setGoi(goiSet);
    setBunpouDokkai(bunSet);
    setChoukai(choukaiSet);
    setAnswers({
      goi: new Array(goiSet.length).fill(null),
      bunpou: new Array(bunSet.grammar.length).fill(null),
      dokkai: new Array(bunSet.dokkai.length).fill(null),
      choukai: new Array(choukaiSet.length).fill(null),
    });
    setChoukaiPlays(new Array(choukaiSet.length).fill(0));
    setShowRomaji({});
    setInnerIdx(0);
    setSectionIdx(0);
    setSecLeft(SECTION_ORDER[0].durationSec);
    const now = Date.now();
    setRunStart(now);
    setSectionStarts([now, 0, 0]);
    setSectionResults([]);
    setStage("section");
  }, []);

  // Hitung skor seksi yang sedang berjalan saat di-submit.
  const finalizeSection = useCallback(
    (sIdx: number, autoSubmitted: boolean) => {
      const meta = SECTION_ORDER[sIdx];
      let correct = 0;
      let total = 0;
      if (meta.key === "goi") {
        total = goi.length;
        correct = goi.reduce(
          (acc, q, i) => (answers.goi[i] === q.correctIndex ? acc + 1 : acc),
          0
        );
      } else if (meta.key === "bunpou-dokkai") {
        total = bunpouDokkai.grammar.length + bunpouDokkai.dokkai.length;
        correct =
          bunpouDokkai.grammar.reduce(
            (acc, q, i) =>
              answers.bunpou[i] === q.correctIndex ? acc + 1 : acc,
            0
          ) +
          bunpouDokkai.dokkai.reduce(
            (acc, q, i) =>
              answers.dokkai[i] === q.correctIndex ? acc + 1 : acc,
            0
          );
      } else {
        total = choukai.length;
        correct = choukai.reduce(
          (acc, q, i) =>
            answers.choukai[i] === q.correctIndex ? acc + 1 : acc,
          0
        );
      }
      const score = scoreSection(correct, total);
      const startMs = sectionStarts[sIdx] || runStart;
      const durationSec = Math.max(
        1,
        Math.round((Date.now() - startMs) / 1000)
      );
      const result: JLPTSectionResult = {
        id: meta.key,
        label: meta.label,
        total,
        correct,
        score,
        durationSec,
        autoSubmitted,
      };
      setSectionResults((prev) => [...prev, result]);
      return result;
    },
    [
      goi,
      bunpouDokkai,
      choukai,
      answers,
      sectionStarts,
      runStart,
    ]
  );

  const goToNextSection = useCallback(() => {
    const nextIdx = sectionIdx + 1;
    if (nextIdx >= SECTION_ORDER.length) {
      setStage("result");
      return;
    }
    setSectionIdx(nextIdx);
    setInnerIdx(0);
    setSecLeft(SECTION_ORDER[nextIdx].durationSec);
    setSectionStarts((prev) => {
      const cp = [...prev];
      cp[nextIdx] = Date.now();
      return cp;
    });
    setStage("section");
  }, [sectionIdx]);

  const submitSection = useCallback(
    (autoSubmitted: boolean) => {
      finalizeSection(sectionIdx, autoSubmitted);
      if (sectionIdx + 1 >= SECTION_ORDER.length) {
        // hasil akan dihitung di useEffect bawah ketika sectionResults siap.
        setStage("result");
      } else {
        setStage("between");
      }
    },
    [finalizeSection, sectionIdx]
  );

  // Timer ticker.
  useEffect(() => {
    if (stage !== "section") return;
    const id = window.setInterval(() => {
      setSecLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [stage]);

  // Auto-submit jika waktu habis.
  useEffect(() => {
    if (stage !== "section") return;
    if (secLeft > 0) return;
    submitSection(true);
  }, [secLeft, stage, submitSection]);

  // Hitung final run saat masuk ke result.
  useEffect(() => {
    if (stage !== "result") return;
    if (finalizedRef.current) return;
    if (sectionResults.length !== SECTION_ORDER.length) return;
    finalizedRef.current = true;
    const totalScore = sectionResults.reduce((a, r) => a + r.score, 0);
    const minSection = Math.min(...sectionResults.map((r) => r.score));
    const passed = totalScore >= MIN_TOTAL && minSection >= MIN_PER_SECTION;
    let reason: string;
    if (passed) {
      reason = `Total ${totalScore}/180 (≥${MIN_TOTAL}) dan setiap seksi ≥${MIN_PER_SECTION}.`;
    } else if (totalScore < MIN_TOTAL) {
      reason = `Total ${totalScore}/180 kurang dari ${MIN_TOTAL}.`;
    } else {
      reason = `Ada seksi di bawah skor minimum ${MIN_PER_SECTION}/60.`;
    }
    const run: JLPTRun = {
      id: `jlpt-${Date.now()}`,
      startedAt: runStart,
      finishedAt: Date.now(),
      sections: sectionResults,
      totalScore,
      passed,
      passReason: reason,
    };
    addJLPTRun(run);
  }, [stage, sectionResults, runStart, addJLPTRun]);

  // === INTRO STAGE ===
  if (stage === "intro") {
    return (
      <div className="space-y-6">
        <Link
          to="/tes"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Kembali
        </Link>
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
            <ClipboardCheck size={14} /> Simulasi JLPT N4
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Simulasi JLPT N4 — Penuh
          </h1>
          <p className="text-neutral-400">
            3 seksi berurutan dengan timer per seksi. Tidak boleh kembali ke
            seksi sebelumnya. Hasil disimpan di{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
              jepang:jlpt:runs
            </code>
            .
          </p>
        </header>

        <section className="jp-card grid grid-cols-1 gap-4 rounded-2xl p-5 md:grid-cols-3">
          <div className="rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-2 text-neutral-300">
              <Languages size={16} />{" "}
              <h3 className="font-semibold">Goi (Kosakata)</h3>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {GOI_COUNT} soal &middot; {GOI_SEC / 60} menit
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Bacaan kanji, kanji untuk bacaan, sinonim, dan pemakaian.
            </p>
          </div>
          <div className="rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-2 text-neutral-300">
              <BookOpen size={16} />{" "}
              <h3 className="font-semibold">Bunpou + Dokkai</h3>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {GRAMMAR_COUNT} grammar + {DOKKAI_PASSAGE_COUNT} passage &middot;{" "}
              {BUNPOU_DOKKAI_SEC / 60} menit
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Tata bahasa pilihan ganda + bacaan dengan pertanyaan.
            </p>
          </div>
          <div className="rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-2 text-neutral-300">
              <Headphones size={16} />{" "}
              <h3 className="font-semibold">Choukai (Listening)</h3>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {CHOUKAI_COUNT} soal &middot; {CHOUKAI_SEC / 60} menit
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Maks {MAX_PLAY_CHOUKAI}x putar per soal. Transcript muncul setelah
              tes selesai.
            </p>
          </div>
        </section>

        <section className="jp-card flex items-start gap-3 rounded-2xl p-4 text-sm text-neutral-300">
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0 text-amber-300"
          />
          <div>
            <p className="font-medium text-neutral-100">
              Kriteria kelulusan (JLPT asli):
            </p>
            <p className="text-xs text-neutral-400">
              Total minimal{" "}
              <span className="text-neutral-200">{MIN_TOTAL}/180</span> dan
              setiap seksi minimal{" "}
              <span className="text-neutral-200">
                {MIN_PER_SECTION}/60
              </span>
              . Jika ada seksi di bawah {MIN_PER_SECTION}, status TIDAK LULUS
              walaupun total cukup.
            </p>
          </div>
        </section>

        {!ttsSupported && (
          <div className="jp-card rounded-2xl border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
            Browser ini sepertinya tidak mendukung Web Speech API. Seksi
            Choukai mungkin tidak terdengar. Gunakan Chrome/Edge untuk
            pengalaman terbaik.
          </div>
        )}

        <button
          type="button"
          onClick={startRun}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
        >
          <Sparkles size={16} /> Mulai simulasi
        </button>
      </div>
    );
  }

  // === BETWEEN STAGE ===
  if (stage === "between") {
    const justFinished = sectionResults[sectionResults.length - 1];
    const next = SECTION_ORDER[sectionIdx + 1];
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Seksi {sectionIdx + 1} selesai
          </h1>
          <p className="text-neutral-400">
            Skor sementara{" "}
            <span className="text-neutral-200">
              {justFinished?.score ?? 0}/60
            </span>{" "}
            ({justFinished?.correct ?? 0}/{justFinished?.total ?? 0} benar
            {justFinished?.autoSubmitted ? " · auto-submit" : ""}).
          </p>
        </header>

        {next && (
          <section className="jp-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Seksi berikutnya
            </p>
            <h2 className="mt-1 text-lg font-semibold text-neutral-100">
              {next.label}
            </h2>
            <p className="text-sm text-neutral-400">
              Waktu: {next.durationSec / 60} menit.
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Setelah Anda klik Mulai, timer akan berjalan dan tidak bisa
              dijeda. Anda tidak bisa kembali ke seksi sebelumnya.
            </p>
            <button
              type="button"
              onClick={goToNextSection}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
            >
              Mulai seksi berikutnya <ArrowRight size={14} />
            </button>
          </section>
        )}
      </div>
    );
  }

  // === SECTION STAGE ===
  if (stage === "section") {
    const meta = SECTION_ORDER[sectionIdx];
    return (
      <div className="space-y-6">
        {/* Header: timer + progress — sticky on mobile so timer always visible */}
        <div className="sticky top-[58px] z-10 -mx-4 border-b border-white/5 bg-neutral-950/85 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 sm:text-xs">
                Seksi {sectionIdx + 1} dari {SECTION_ORDER.length}
              </p>
              <h2 className="truncate text-base font-semibold text-neutral-100 sm:text-lg">
                {meta.label}
              </h2>
            </div>
            <div
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-mono text-sm tabular-nums sm:gap-2 sm:px-3 ${
                secLeft <= 60
                  ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
                  : "border-white/10 bg-white/5 text-neutral-200"
              }`}
            >
              <Hourglass size={14} /> {formatTime(secLeft)}
            </div>
          </div>
        </div>

        {meta.key === "goi" && (
          <GoiSection
            questions={goi}
            innerIdx={innerIdx}
            setInnerIdx={setInnerIdx}
            answers={answers.goi}
            setAnswer={(i, v) =>
              setAnswers((prev) => {
                const cp = [...prev.goi];
                cp[i] = v;
                return { ...prev, goi: cp };
              })
            }
            onSubmit={() => submitSection(false)}
          />
        )}

        {meta.key === "bunpou-dokkai" && (
          <BunpouDokkaiSection
            set={bunpouDokkai}
            innerIdx={innerIdx}
            setInnerIdx={setInnerIdx}
            bunpouAnswers={answers.bunpou}
            dokkaiAnswers={answers.dokkai}
            setBunpouAnswer={(i, v) =>
              setAnswers((prev) => {
                const cp = [...prev.bunpou];
                cp[i] = v;
                return { ...prev, bunpou: cp };
              })
            }
            setDokkaiAnswer={(i, v) =>
              setAnswers((prev) => {
                const cp = [...prev.dokkai];
                cp[i] = v;
                return { ...prev, dokkai: cp };
              })
            }
            showRomaji={showRomaji}
            toggleRomaji={(pIdx) =>
              setShowRomaji((prev) => ({ ...prev, [pIdx]: !prev[pIdx] }))
            }
            onSubmit={() => submitSection(false)}
          />
        )}

        {meta.key === "choukai" && (
          <ChoukaiSection
            items={choukai}
            innerIdx={innerIdx}
            setInnerIdx={setInnerIdx}
            answers={answers.choukai}
            setAnswer={(i, v) =>
              setAnswers((prev) => {
                const cp = [...prev.choukai];
                cp[i] = v;
                return { ...prev, choukai: cp };
              })
            }
            plays={choukaiPlays}
            onPlay={(i) =>
              setChoukaiPlays((prev) => {
                const cp = [...prev];
                cp[i] = (cp[i] || 0) + 1;
                return cp;
              })
            }
            onSubmit={() => submitSection(false)}
          />
        )}
      </div>
    );
  }

  // === RESULT STAGE ===
  const totalScore = sectionResults.reduce((a, r) => a + r.score, 0);
  const minSection = sectionResults.length
    ? Math.min(...sectionResults.map((r) => r.score))
    : 0;
  const passed = totalScore >= MIN_TOTAL && minSection >= MIN_PER_SECTION;
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
          <Trophy size={14} /> Hasil Simulasi JLPT N4
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {passed ? "LULUS" : "TIDAK LULUS"}
        </h1>
        <p className="text-neutral-400">
          Total skor{" "}
          <span className="text-neutral-100">{totalScore}/180</span>. Kriteria:
          ≥{MIN_TOTAL}/180 dan setiap seksi ≥{MIN_PER_SECTION}/60.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {sectionResults.map((r) => (
          <div
            key={r.id}
            className={`jp-card rounded-2xl p-4 ${
              r.score >= MIN_PER_SECTION
                ? "border-emerald-400/30"
                : "border-rose-400/40"
            }`}
          >
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              {r.label}
            </p>
            <p className="mt-1 text-2xl font-semibold">{r.score}/60</p>
            <p className="text-xs text-neutral-400">
              {r.correct} dari {r.total} benar &middot;{" "}
              {Math.round(r.durationSec / 60)} menit{" "}
              {r.autoSubmitted && (
                <span className="text-amber-300">(auto-submit)</span>
              )}
            </p>
          </div>
        ))}
      </section>

      <section className="jp-card rounded-2xl p-4 text-sm text-neutral-300">
        <p className="font-medium text-neutral-100">
          {passed ? "Selamat! Berdasarkan simulasi, Anda lolos." : "Belum lolos di simulasi ini."}
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Catatan: ini simulasi internal, bukan hasil JLPT resmi. Skor dihitung
          dengan menormalkan ke skala 60 per seksi.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setStage("intro");
            setSectionResults([]);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/5"
        >
          <RefreshCcw size={14} /> Coba lagi
        </button>
        <Link
          to="/statistik"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
        >
          Lihat statistik
        </Link>
      </div>
    </div>
  );
}

// =============================================================
// Sub-komponen seksi
// =============================================================

interface GoiProps {
  questions: GoiQuestion[];
  innerIdx: number;
  setInnerIdx: (n: number) => void;
  answers: (number | null)[];
  setAnswer: (i: number, v: number | null) => void;
  onSubmit: () => void;
}

function GoiSection({
  questions,
  innerIdx,
  setInnerIdx,
  answers,
  setAnswer,
  onSubmit,
}: GoiProps) {
  if (questions.length === 0) return null;
  const q = questions[innerIdx];
  const answered = answers.filter((a) => a !== null).length;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>
          Soal {innerIdx + 1} dari {questions.length}
        </span>
        <span>
          Dijawab: {answered}/{questions.length}
        </span>
      </div>
      <section className="jp-card space-y-3 rounded-2xl p-4 sm:p-5">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          {q.prompt}
        </p>
        {q.subPrompt && (
          <p className="text-jp text-xl font-semibold sm:text-2xl">{q.subPrompt}</p>
        )}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {q.options.map((opt, i) => {
            const chosen = answers[innerIdx] === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setAnswer(innerIdx, i)}
                className={`min-h-[48px] rounded-xl border px-4 py-3 text-left text-sm transition ${
                  chosen
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/10 hover:border-white/30 hover:bg-white/5 text-neutral-200"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </section>
      <SectionNav
        innerIdx={innerIdx}
        total={questions.length}
        setInnerIdx={setInnerIdx}
        onSubmit={onSubmit}
      />
    </div>
  );
}

interface BunpouDokkaiProps {
  set: BunpouDokkaiSet;
  innerIdx: number;
  setInnerIdx: (n: number) => void;
  bunpouAnswers: (number | null)[];
  dokkaiAnswers: (number | null)[];
  setBunpouAnswer: (i: number, v: number | null) => void;
  setDokkaiAnswer: (i: number, v: number | null) => void;
  showRomaji: Record<number, boolean>;
  toggleRomaji: (passageIdx: number) => void;
  onSubmit: () => void;
}

function BunpouDokkaiSection({
  set,
  innerIdx,
  setInnerIdx,
  bunpouAnswers,
  dokkaiAnswers,
  setBunpouAnswer,
  setDokkaiAnswer,
  showRomaji,
  toggleRomaji,
  onSubmit,
}: BunpouDokkaiProps) {
  const total = set.grammar.length + set.dokkai.length;
  if (total === 0) return null;
  const isGrammar = innerIdx < set.grammar.length;
  const dokkaiIdx = innerIdx - set.grammar.length;
  const answered =
    bunpouAnswers.filter((a) => a !== null).length +
    dokkaiAnswers.filter((a) => a !== null).length;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>
          Soal {innerIdx + 1} dari {total} &middot;{" "}
          {isGrammar ? "Bunpou" : "Dokkai"}
        </span>
        <span>
          Dijawab: {answered}/{total}
        </span>
      </div>

      {isGrammar ? (
        <BunpouQuestion
          q={set.grammar[innerIdx]}
          chosen={bunpouAnswers[innerIdx]}
          onChoose={(v) => setBunpouAnswer(innerIdx, v)}
        />
      ) : (
        <DokkaiQuestion
          q={set.dokkai[dokkaiIdx]}
          chosen={dokkaiAnswers[dokkaiIdx]}
          onChoose={(v) => setDokkaiAnswer(dokkaiIdx, v)}
          showRomaji={!!showRomaji[set.dokkai[dokkaiIdx].passageIndex]}
          toggleRomaji={() => toggleRomaji(set.dokkai[dokkaiIdx].passageIndex)}
        />
      )}

      <SectionNav
        innerIdx={innerIdx}
        total={total}
        setInnerIdx={setInnerIdx}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function BunpouQuestion({
  q,
  chosen,
  onChoose,
}: {
  q: GrammarQ;
  chosen: number | null;
  onChoose: (v: number) => void;
}) {
  const ex = q.pattern.examples[q.exampleIndex];
  return (
    <section className="jp-card space-y-3 rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Pola apa yang dipakai pada kalimat berikut?
          </p>
          <p className="text-jp text-lg font-semibold leading-relaxed sm:text-xl">
            {ex.kanji}
          </p>
          <p className="text-xs text-neutral-400">{ex.romaji}</p>
          <p className="text-xs text-neutral-300">{ex.arti}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {q.options.map((opt, i) => {
          const isChosen = chosen === i;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChoose(i)}
              className={`text-jp min-h-[48px] rounded-xl border px-4 py-3 text-left text-base transition ${
                isChosen
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/10 hover:border-white/30 hover:bg-white/5 text-neutral-200"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DokkaiQuestion({
  q,
  chosen,
  onChoose,
  showRomaji,
  toggleRomaji,
}: {
  q: DokkaiFlatQ;
  chosen: number | null;
  onChoose: (v: number) => void;
  showRomaji: boolean;
  toggleRomaji: () => void;
}) {
  return (
    <section className="jp-card space-y-3 rounded-2xl p-4 sm:p-5">
      {q.isFirstOfPassage ? (
        <div className="rounded-xl border border-white/5 bg-white/5 p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                {q.passageLevel} &middot; Passage {q.passageIndex + 1}
              </p>
              <h3 className="text-jp text-base font-semibold sm:text-lg">{q.passageTitle}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleRomaji}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1 text-xs text-neutral-300 hover:bg-white/5"
              >
                {showRomaji ? <EyeOff size={12} /> : <Eye size={12} />}
                {showRomaji ? "Sembunyikan romaji" : "Tampilkan romaji"}
              </button>
              <SpeakButton text={q.passageKanji} rate={0.9} />
            </div>
          </div>
          <p className="mt-3 text-jp text-sm leading-relaxed">{q.passageKanji}</p>
          {showRomaji && (
            <p className="mt-2 border-t border-white/5 pt-2 text-xs italic text-neutral-400">
              {q.passageRomaji}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-neutral-400">
          Lanjutan passage: <span className="text-jp text-neutral-200">{q.passageTitle}</span>
        </div>
      )}
      <p className="text-sm font-medium text-neutral-100">{q.q}</p>
      <div className="grid grid-cols-1 gap-2">
        {q.options.map((opt, i) => {
          const isChosen = chosen === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChoose(i)}
              className={`min-h-[48px] rounded-xl border px-4 py-3 text-left text-sm transition ${
                isChosen
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/10 hover:border-white/30 hover:bg-white/5 text-neutral-200"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </section>
  );
}

interface ChoukaiSectionProps {
  items: ChoukaiItem[];
  innerIdx: number;
  setInnerIdx: (n: number) => void;
  answers: (number | null)[];
  setAnswer: (i: number, v: number | null) => void;
  plays: number[];
  onPlay: (i: number) => void;
  onSubmit: () => void;
}

function ChoukaiSection({
  items,
  innerIdx,
  setInnerIdx,
  answers,
  setAnswer,
  plays,
  onPlay,
  onSubmit,
}: ChoukaiSectionProps) {
  if (items.length === 0) return null;
  const q = items[innerIdx];
  const used = plays[innerIdx] || 0;
  const answered = answers.filter((a) => a !== null).length;

  const handlePlay = () => {
    if (used >= MAX_PLAY_CHOUKAI) return;
    speakJa(q.audioText, { rate: 0.85 });
    onPlay(innerIdx);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>
          Soal {innerIdx + 1} dari {items.length}
        </span>
        <span>
          Dijawab: {answered}/{items.length}
        </span>
      </div>

      <section className="jp-card space-y-3 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handlePlay}
            disabled={used >= MAX_PLAY_CHOUKAI}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
          >
            <Play size={16} /> Putar
          </button>
          <span className="text-xs text-neutral-400">
            {used}/{MAX_PLAY_CHOUKAI}x diputar
          </span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-neutral-400">
            {q.mondai}
          </span>
        </div>
        <p className="text-sm text-neutral-300">{q.question}</p>
      </section>

      <section className="grid grid-cols-1 gap-2">
        {q.options.map((opt, i) => {
          const isChosen = answers[innerIdx] === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setAnswer(innerIdx, i)}
              className={`min-h-[56px] rounded-xl border px-4 py-3 text-left transition ${
                isChosen
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/10 hover:border-white/30 hover:bg-white/5 text-neutral-200"
              }`}
            >
              {opt.kanji && (
                <p className="text-jp text-base font-semibold">{opt.kanji}</p>
              )}
              <p className="text-sm text-neutral-300">{opt.arti}</p>
            </button>
          );
        })}
      </section>

      <SectionNav
        innerIdx={innerIdx}
        total={items.length}
        setInnerIdx={setInnerIdx}
        onSubmit={onSubmit}
      />
    </div>
  );
}

interface NavProps {
  innerIdx: number;
  total: number;
  setInnerIdx: (n: number) => void;
  onSubmit: () => void;
}

function SectionNav({ innerIdx, total, setInnerIdx, onSubmit }: NavProps) {
  const last = innerIdx >= total - 1;
  return (
    <div
      className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 bg-neutral-950/90 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-0"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <button
        type="button"
        onClick={() => setInnerIdx(Math.max(0, innerIdx - 1))}
        disabled={innerIdx === 0}
        className="inline-flex items-center gap-1 rounded-xl border border-white/15 px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
      >
        <ArrowLeft size={14} /> <span className="hidden sm:inline">Sebelumnya</span><span className="sm:hidden">Prev</span>
      </button>
      <div className="flex items-center gap-2">
        {!last && (
          <button
            type="button"
            onClick={() => setInnerIdx(Math.min(total - 1, innerIdx + 1))}
            className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 sm:px-4"
          >
            <span className="hidden sm:inline">Selanjutnya</span><span className="sm:hidden">Next</span> <ArrowRight size={14} />
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/20 sm:px-4"
        >
          <CheckCircle2 size={14} /> <span className="hidden sm:inline">Kumpulkan seksi</span><span className="sm:hidden">Kumpulkan</span>
        </button>
      </div>
    </div>
  );
}

