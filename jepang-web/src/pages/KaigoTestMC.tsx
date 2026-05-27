import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Hash,
  RefreshCcw,
  Type,
  XCircle,
} from "lucide-react";
import Timer from "../components/Timer";
import { sample, shuffle } from "../lib/shuffle";
import { useApp } from "../contexts/AppContext";
import { getKaigoModule, type FlatKaigoItem } from "../data/kaigo";

type Stage = "config" | "running" | "result";
type Direction = "kanji-to-arti" | "arti-to-kanji" | "arti-to-romaji";

interface Question {
  word: FlatKaigoItem;
  options: string[];
  correctIndex: number;
}

const COUNT_OPTIONS = [10, 20, 30, 50];

function distractorsForArti(
  correct: FlatKaigoItem,
  pool: FlatKaigoItem[],
  count: number
): string[] {
  const taken = new Set<string>([correct.arti]);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const out: string[] = [];
  for (const w of shuffled) {
    if (taken.has(w.arti)) continue;
    taken.add(w.arti);
    out.push(w.arti);
    if (out.length >= count) break;
  }
  return out;
}

function distractorsForKanji(
  correct: FlatKaigoItem,
  pool: FlatKaigoItem[],
  count: number
): string[] {
  const taken = new Set<string>([correct.kanji]);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const out: string[] = [];
  for (const w of shuffled) {
    if (taken.has(w.kanji)) continue;
    taken.add(w.kanji);
    out.push(w.kanji);
    if (out.length >= count) break;
  }
  return out;
}

function distractorsForRomaji(
  correct: FlatKaigoItem,
  pool: FlatKaigoItem[],
  count: number
): string[] {
  const taken = new Set<string>([correct.romaji]);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const out: string[] = [];
  for (const w of shuffled) {
    if (taken.has(w.romaji)) continue;
    taken.add(w.romaji);
    out.push(w.romaji);
    if (out.length >= count) break;
  }
  return out;
}

function directionLabel(d: Direction): string {
  switch (d) {
    case "kanji-to-arti":
      return "Kanji → Arti";
    case "arti-to-kanji":
      return "Arti → Kanji";
    case "arti-to-romaji":
      return "Arti → Romaji";
  }
}

export default function KaigoTestMC() {
  const { moduleId = "" } = useParams<{ moduleId: string }>();
  const { addRun, setMemorized } = useApp();
  const mod = getKaigoModule(moduleId);

  const [stage, setStage] = useState<Stage>("config");
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    () => new Set(mod?.sections.map((s) => s.id) ?? [])
  );
  const [count, setCount] = useState(10);
  const [timePerQ, setTimePerQ] = useState(15);
  const [direction, setDirection] = useState<Direction>("kanji-to-arti");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<
    { correct: boolean; elapsedMs: number; word: FlatKaigoItem; chosen: string | null }[]
  >([]);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [runStart, setRunStart] = useState(Date.now());

  const pool = useMemo<FlatKaigoItem[]>(() => {
    if (!mod) return [];
    return mod.sections
      .filter((s) => selectedSections.has(s.id))
      .flatMap((section) =>
        section.pages.flatMap((page) =>
          page.items.map((item, itemIndex) => ({
            ...item,
            moduleId: mod.id,
            sectionId: section.id,
            pageIndex: page.pageIndex,
            itemIndex,
            globalId: `kaigo:${mod.id}:${section.id}-${page.pageIndex}-${itemIndex}`,
          }))
        )
      );
  }, [mod, selectedSections]);

  const maxCount = pool.length;

  useEffect(() => {
    if (count > maxCount && maxCount > 0) setCount(maxCount);
  }, [maxCount, count]);

  useEffect(() => {
    if (stage !== "running" || !revealed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, revealed, idx, questions.length]);

  if (!mod) {
    return (
      <div className="space-y-4">
        <Link to="/kaigo" className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white">
          <ArrowLeft size={14} /> Semua modul Kaigo
        </Link>
        <p className="text-neutral-400">Modul Kaigo tidak ditemukan.</p>
      </div>
    );
  }

  const startTest = () => {
    if (pool.length < 4) return;
    const selectedWords = sample(pool, Math.min(count, pool.length));
    const qs: Question[] = selectedWords.map((w) => {
      if (direction === "kanji-to-arti") {
        const distractors = distractorsForArti(w, pool, 3);
        const opts = shuffle([w.arti, ...distractors]);
        return { word: w, options: opts, correctIndex: opts.indexOf(w.arti) };
      } else if (direction === "arti-to-kanji") {
        const distractors = distractorsForKanji(w, pool, 3);
        const opts = shuffle([w.kanji, ...distractors]);
        return { word: w, options: opts, correctIndex: opts.indexOf(w.kanji) };
      } else {
        // arti-to-romaji
        const distractors = distractorsForRomaji(w, pool, 3);
        const opts = shuffle([w.romaji, ...distractors]);
        return { word: w, options: opts, correctIndex: opts.indexOf(w.romaji) };
      }
    });
    setQuestions(qs);
    setIdx(0);
    setResults([]);
    setSelected(null);
    setRevealed(false);
    setQuestionStart(Date.now());
    setRunStart(Date.now());
    setStage("running");
  };

  const submitAnswer = (chosenIndex: number | null) => {
    if (revealed) return;
    const q = questions[idx];
    const elapsedMs = Date.now() - questionStart;
    const correct = chosenIndex !== null && chosenIndex === q.correctIndex;
    setSelected(chosenIndex);
    setRevealed(true);
    setResults((prev) => [
      ...prev,
      {
        correct,
        elapsedMs,
        word: q.word,
        chosen: chosenIndex !== null ? q.options[chosenIndex] : null,
      },
    ]);
    if (correct) setMemorized(q.word.globalId, true);
  };

  const next = () => {
    if (idx + 1 >= questions.length) finishRun();
    else {
      setIdx((v) => v + 1);
      setSelected(null);
      setRevealed(false);
      setQuestionStart(Date.now());
    }
  };

  const finishRun = () => {
    const correctCount = results.filter((r) => r.correct).length;
    const avg = results.length > 0
      ? results.reduce((acc, r) => acc + r.elapsedMs, 0) / results.length
      : 0;
    addRun({
      id: `kaigo-mc-${Date.now()}`,
      kind: "mc",
      variant: `${mod.id}:${direction}`,
      startedAt: runStart,
      finishedAt: Date.now(),
      total: questions.length,
      correct: correctCount,
      timePerQuestionSec: timePerQ,
      avgAnswerMs: avg,
      pages: Array.from(selectedSections).map((sid) => `kaigo:${mod.id}:${sid}`),
    });
    setStage("result");
  };

  const toggleSection = (id: string) => {
    setSelectedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (stage === "config") {
    const canStart = maxCount >= 4 && selectedSections.size >= 1 && count > 0;
    return (
      <div className="space-y-6">
        <Link
          to={`/kaigo/${mod.id}`}
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Kembali ke {mod.label}
        </Link>
        <header>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            {mod.emoji} {mod.label}
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tes Pilihan Ganda Kaigo</h1>
          <p className="mt-2 text-neutral-400">
            Pilih kategori kosakata yang ingin diuji, atur jumlah soal, waktu per soal, dan
            arah pertanyaan.
          </p>
        </header>

        <div className="jp-card grid grid-cols-1 gap-4 rounded-2xl p-5 md:grid-cols-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
              <Hash size={14} /> Jumlah soal
            </div>
            <div className="flex flex-wrap gap-2">
              {COUNT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCount(opt)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    count === opt
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 text-neutral-300 hover:bg-white/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCount(maxCount)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  count === maxCount && maxCount > 0
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5"
                }`}
              >
                Semua ({maxCount})
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
              <Clock size={14} /> Waktu per soal
            </div>
            <div className="flex flex-wrap gap-2">
              {[10, 15, 20, 30, 60].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTimePerQ(s)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    timePerQ === s
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 text-neutral-300 hover:bg-white/5"
                  }`}
                >
                  {s}d
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
              <Type size={14} /> Arah soal
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setDirection("kanji-to-arti")}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  direction === "kanji-to-arti"
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5"
                }`}
              >
                Kanji → Arti
              </button>
              <button
                type="button"
                onClick={() => setDirection("arti-to-kanji")}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  direction === "arti-to-kanji"
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5"
                }`}
              >
                Arti → Kanji
              </button>
              <button
                type="button"
                onClick={() => setDirection("arti-to-romaji")}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  direction === "arti-to-romaji"
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5"
                }`}
              >
                Arti → Romaji
              </button>
            </div>
          </div>
        </div>

        <div className="jp-card rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Kategori kosakata
            </h2>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  setSelectedSections(new Set(mod.sections.map((s) => s.id)))
                }
                className="rounded-md border border-white/10 px-2 py-1 text-neutral-300 hover:bg-white/5"
              >
                Pilih semua
              </button>
              <button
                type="button"
                onClick={() => setSelectedSections(new Set())}
                className="rounded-md border border-white/10 px-2 py-1 text-neutral-300 hover:bg-white/5"
              >
                Kosongkan
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {mod.sections.map((s) => {
              const checked = selectedSections.has(s.id);
              return (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                    checked
                      ? "border-white/30 bg-white/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSection(s.id)}
                      className="h-4 w-4 accent-white"
                    />
                    <span aria-hidden>{s.emoji}</span>
                    <span>{s.label}</span>
                  </span>
                  <span className="text-xs text-neutral-500">{s.totalWords}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="jp-card flex flex-col items-center justify-between gap-3 rounded-2xl p-5 md:flex-row">
          <div className="text-sm text-neutral-400">
            {maxCount} kosakata tersedia.{" "}
            {maxCount < 4 && "Pilih kategori lain untuk memulai (butuh ≥4)."}
          </div>
          <button
            type="button"
            onClick={startTest}
            disabled={!canStart}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mulai Tes
          </button>
        </div>
      </div>
    );
  }

  if (stage === "result") {
    const total = results.length;
    const correct = results.filter((r) => r.correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const avgMs = total > 0 ? results.reduce((a, r) => a + r.elapsedMs, 0) / total : 0;
    const speedPct = Math.max(
      0,
      Math.min(100, Math.round((1 - avgMs / (timePerQ * 1000)) * 100))
    );

    return (
      <div className="space-y-6">
        <Link
          to={`/kaigo/${mod.id}`}
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Kembali ke {mod.label}
        </Link>
        <header>
          <p className="text-xs uppercase tracking-wider text-neutral-500">Hasil</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tes Pilihan Ganda Kaigo</h1>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard label="Skor" value={`${correct}/${total}`} sub={`${accuracy}% benar`} />
          <SummaryCard
            label="Akurasi"
            value={`${accuracy}%`}
            sub={accuracy >= 80 ? "Bagus!" : "Coba lagi."}
          />
          <SummaryCard
            label="Kecepatan"
            value={`${speedPct}%`}
            sub={`Rata-rata ${(avgMs / 1000).toFixed(1)}d / soal`}
          />
        </div>

        <div className="jp-card rounded-2xl p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Riwayat jawaban
          </h2>
          <ul className="divide-y divide-white/5">
            {results.map((r, i) => (
              <li
                key={i}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  {r.correct ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <XCircle size={16} className="text-rose-400" />
                  )}
                  <span className="text-neutral-400">#{i + 1}</span>
                  <span
                    className={`text-lg ${
                      direction === "kanji-to-arti" ? "text-jp" : ""
                    }`}
                  >
                    {direction === "kanji-to-arti" ? r.word.kanji : r.word.arti}
                  </span>
                </div>
                <div className="text-right text-xs text-neutral-400">
                  <div>
                    Benar:{" "}
                    <span className="font-medium text-neutral-100">
                      {direction === "kanji-to-arti"
                        ? r.word.arti
                        : direction === "arti-to-kanji"
                        ? r.word.kanji
                        : r.word.romaji}
                    </span>
                  </div>
                  <div className="text-neutral-500">
                    Romaji:{" "}
                    <span className="font-medium text-neutral-300">{r.word.romaji}</span>
                  </div>
                  {!r.correct && r.chosen && (
                    <div className="text-rose-300/80">Jawaban kamu: {r.chosen}</div>
                  )}
                  <div>{(r.elapsedMs / 1000).toFixed(1)}d</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setStage("config")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5"
          >
            <RefreshCcw size={16} /> Tes lagi
          </button>
        </div>
      </div>
    );
  }

  // running
  const q = questions[idx];
  const progressPct = (idx / questions.length) * 100;
  return (
    <div className="space-y-6">
      <Link
        to={`/kaigo/${mod.id}`}
        className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Akhiri & kembali
      </Link>

      <div className="jp-card space-y-4 rounded-2xl p-5">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>
            Soal {idx + 1} dari {questions.length}
          </span>
          <span>{directionLabel(direction)}</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neutral-200 to-neutral-400 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <Timer
          duration={timePerQ}
          questionKey={idx}
          onExpire={() => {
            if (!revealed) submitAnswer(null);
          }}
        />
      </div>

      <div className="jp-card rounded-3xl p-6 text-center sm:p-8">
        <div className="text-xs uppercase tracking-wider text-neutral-500">
          {direction === "kanji-to-arti"
            ? "Apa arti dari kata ini?"
            : direction === "arti-to-kanji"
            ? "Apa kanji untuk arti ini?"
            : "Apa romaji untuk arti ini?"}
        </div>
        <div className="mt-3 break-words">
          <span
            className={
              direction === "kanji-to-arti"
                ? "text-jp text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
                : "text-xl font-medium leading-snug sm:text-2xl md:text-3xl"
            }
          >
            {direction === "kanji-to-arti" ? q.word.kanji : q.word.arti}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isChosen = selected === i;
          let cls = "border-white/10 bg-white/5 hover:bg-white/10 text-neutral-100";
          if (revealed) {
            if (isCorrect) cls = "border-emerald-400/60 bg-emerald-400/10 text-emerald-200";
            else if (isChosen) cls = "border-rose-400/60 bg-rose-400/10 text-rose-200";
            else cls = "border-white/5 bg-white/[0.02] text-neutral-400";
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => submitAnswer(i)}
              disabled={revealed}
              className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${cls}`}
            >
              <span
                className={
                  direction === "arti-to-kanji"
                    ? "text-jp text-xl font-medium"
                    : direction === "arti-to-romaji"
                    ? "text-base font-medium tracking-wide"
                    : "text-base"
                }
              >
                {opt}
              </span>
              {revealed && isCorrect && (
                <CheckCircle2 size={18} className="text-emerald-400" />
              )}
              {revealed && isChosen && !isCorrect && (
                <XCircle size={18} className="text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="jp-card rounded-2xl p-4 text-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Jawaban benar</div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-jp text-2xl font-semibold text-neutral-100">
              {q.word.kanji}
            </span>
            <span className="text-base text-neutral-300">{q.word.romaji}</span>
            <span className="text-base text-neutral-400">— {q.word.arti}</span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">Tekan Enter untuk soal berikutnya.</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={finishRun}
          className="text-sm text-neutral-500 hover:text-neutral-300"
        >
          Akhiri tes
        </button>
        {revealed && (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
          >
            {idx + 1 >= questions.length ? "Lihat hasil" : "Soal berikutnya"}
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="jp-card rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-neutral-400">{sub}</p>
    </div>
  );
}
