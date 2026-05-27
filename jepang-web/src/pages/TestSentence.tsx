import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import PageSelector, { pageKey } from "../components/PageSelector";
import SpeakButton from "../components/SpeakButton";
import Timer from "../components/Timer";
import { sample, shuffle } from "../lib/shuffle";
import { wordsFromPages } from "../lib/vocabHelpers";
import {
  SENTENCES,
  filterByAvailableVocab,
  type SentenceItem,
} from "../data/sentences";
import { useApp } from "../contexts/AppContext";
import { VOCAB_SECTIONS } from "../data/vocab";

type Stage = "config" | "running" | "result";
type Mode = "arti-to-kanji" | "arti-to-romaji";

const MIN_PAGES = 3;

interface QState {
  sentence: SentenceItem;
  pool: string[]; // shuffled available tokens
  arrangement: { token: string; poolIndex: number }[]; // tokens user placed
}

export default function TestSentence() {
  const { addRun } = useApp();
  const [stage, setStage] = useState<Stage>("config");

  const [pages, setPages] = useState<Set<string>>(() => defaultPages());
  const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [mode, setMode] = useState<Mode>("arti-to-kanji");
  const [timePerQ, setTimePerQ] = useState(60);
  const [count, setCount] = useState(5);

  const [questions, setQuestions] = useState<SentenceItem[]>([]);
  const [qStates, setQStates] = useState<QState[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<
    { sentence: SentenceItem; correct: boolean; elapsedMs: number; userOrder: string[] }[]
  >([]);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [runStart, setRunStart] = useState(Date.now());

  // Available kanji from selected pages
  const availableKanji = useMemo(() => {
    const set = new Set<string>();
    wordsFromPages(pages).forEach((w) => set.add(w.kanji));
    return set;
  }, [pages]);

  const eligible = useMemo(() => {
    return filterByAvailableVocab(level, availableKanji);
  }, [level, availableKanji]);

  const maxCount = eligible.length;

  useEffect(() => {
    if (count > maxCount && maxCount > 0) setCount(maxCount);
  }, [maxCount, count]);

  const startTest = () => {
    if (pages.size < MIN_PAGES) return;
    if (eligible.length < 1) return;
    const qs = sample(eligible, Math.min(count, eligible.length));
    const initial: QState[] = qs.map((s) => {
      const tokens = mode === "arti-to-kanji" ? s.tokens : s.romajiTokens;
      return {
        sentence: s,
        pool: shuffle(tokens.map((t, i) => `${t}__${i}`)),
        arrangement: [],
      };
    });
    setQuestions(qs);
    setQStates(initial);
    setIdx(0);
    setRevealed(false);
    setResults([]);
    setQuestionStart(Date.now());
    setRunStart(Date.now());
    setStage("running");
  };

  const finishRun = (finalResults = results) => {
    const correctCount = finalResults.filter((r) => r.correct).length;
    const avg = finalResults.length > 0
      ? finalResults.reduce((a, r) => a + r.elapsedMs, 0) / finalResults.length
      : 0;
    addRun({
      id: `sent-${Date.now()}`,
      kind: "sentence",
      variant: mode,
      startedAt: runStart,
      finishedAt: Date.now(),
      total: questions.length,
      correct: correctCount,
      timePerQuestionSec: timePerQ,
      avgAnswerMs: avg,
      pages: Array.from(pages),
      level,
    });
    setStage("result");
  };

  const evaluate = () => {
    if (revealed) return;
    const q = questions[idx];
    const state = qStates[idx];
    const target = mode === "arti-to-kanji" ? q.tokens : q.romajiTokens;
    const userTokens = state.arrangement.map((a) => a.token);
    const correct =
      userTokens.length === target.length &&
      userTokens.every((t, i) => t === target[i]);
    setRevealed(true);
    setResults((prev) => [
      ...prev,
      {
        sentence: q,
        correct,
        elapsedMs: Date.now() - questionStart,
        userOrder: userTokens,
      },
    ]);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      finishRun([
        ...results,
      ]);
    } else {
      setIdx((v) => v + 1);
      setRevealed(false);
      setQuestionStart(Date.now());
    }
  };

  // Enter to advance to next question after the answer is revealed
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

  if (stage === "config") {
    return (
      <div className="space-y-6">
        <Link
          to="/tes"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Kembali
        </Link>
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tes Susun Kalimat</h1>
          <p className="mt-2 text-neutral-400">
            5 level kesulitan, 2 mode: arti → kanji dan arti → romaji. Pilih minimal{" "}
            {MIN_PAGES} halaman untuk memulai.
          </p>
        </header>

        <div className="jp-card grid grid-cols-1 gap-4 rounded-2xl p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">
              Level kesulitan
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l as 1 | 2 | 3 | 4 | 5)}
                  className={`h-10 w-10 rounded-lg border text-sm font-semibold ${
                    level === l
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 text-neutral-300 hover:bg-white/5"
                  }`}
                >
                  L{l}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              {SENTENCES.filter((s) => s.level === level).length} kalimat tersedia di level
              ini.
            </p>
          </div>

          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">
              Mode susun
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setMode("arti-to-kanji")}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  mode === "arti-to-kanji"
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5"
                }`}
              >
                Arti → Kanji
              </button>
              <button
                type="button"
                onClick={() => setMode("arti-to-romaji")}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  mode === "arti-to-romaji"
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5"
                }`}
              >
                Arti → Romaji
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">
              Jumlah soal
            </div>
            <div className="flex flex-wrap gap-2">
              {[3, 5, 10, 15].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCount(c)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    count === c
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 text-neutral-300 hover:bg-white/5"
                  }`}
                >
                  {c}
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
            <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">
              Waktu / soal
            </div>
            <div className="flex flex-wrap gap-2">
              {[30, 45, 60, 90, 120].map((s) => (
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
        </div>

        <PageSelector selected={pages} onChange={setPages} minPages={MIN_PAGES} />

        <div className="jp-card flex flex-col items-center justify-between gap-3 rounded-2xl p-5 md:flex-row">
          <div className="text-sm text-neutral-400">
            {pages.size < MIN_PAGES
              ? `Pilih minimal ${MIN_PAGES} halaman untuk memulai (${pages.size}/${MIN_PAGES}).`
              : `${maxCount} kalimat cocok dengan halamanmu di level ${level}.`}
          </div>
          <button
            type="button"
            onClick={startTest}
            disabled={pages.size < MIN_PAGES || maxCount < 1}
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
          to="/tes"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Tes lain
        </Link>
        <header>
          <p className="text-xs uppercase tracking-wider text-neutral-500">Hasil</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Susun Kalimat (Level {level})
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard label="Skor" value={`${correct}/${total}`} sub={`${accuracy}% benar`} />
          <SummaryCard
            label="Akurasi"
            value={`${accuracy}%`}
            sub={accuracy >= 80 ? "Hebat!" : "Coba ulang dengan level berbeda."}
          />
          <SummaryCard
            label="Kecepatan"
            value={`${speedPct}%`}
            sub={`Rata-rata ${(avgMs / 1000).toFixed(1)}d / soal`}
          />
        </div>

        <div className="jp-card rounded-2xl p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Detail soal
          </h2>
          <ul className="space-y-3">
            {results.map((r, i) => (
              <li key={i} className="rounded-xl border border-white/5 p-3 text-sm">
                <div className="flex items-center gap-2">
                  {r.correct ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <XCircle size={16} className="text-rose-400" />
                  )}
                  <span className="text-neutral-400">#{i + 1}</span>
                  <span className="text-neutral-100">{r.sentence.arti}</span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-neutral-400">
                  <div>
                    Kanji:{" "}
                    <span className="text-jp font-medium text-neutral-100">
                      {r.sentence.kanji}
                    </span>
                  </div>
                  <div>
                    Romaji:{" "}
                    <span className="font-medium text-neutral-200">
                      {r.sentence.romaji}
                    </span>
                  </div>
                </div>
                {!r.correct && (
                  <div className="mt-1 text-xs text-rose-300/70">
                    Susunanmu: {r.userOrder.length > 0 ? r.userOrder.join(" ") : "(kosong)"}
                  </div>
                )}
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

  // Running
  const q = questions[idx];
  const state = qStates[idx];
  const targetTokens = mode === "arti-to-kanji" ? q.tokens : q.romajiTokens;
  const progressPct = (idx / questions.length) * 100;
  const isJp = mode === "arti-to-kanji";

  const moveToArrangement = (poolIndex: number) => {
    if (revealed) return;
    setQStates((prev) => {
      const copy = [...prev];
      const cur = { ...copy[idx] };
      const token = cur.pool[poolIndex];
      if (!token) return prev;
      const newPool = [...cur.pool];
      newPool[poolIndex] = "";
      cur.pool = newPool;
      cur.arrangement = [
        ...cur.arrangement,
        { token: token.split("__")[0], poolIndex },
      ];
      copy[idx] = cur;
      return copy;
    });
  };

  const removeFromArrangement = (arrIndex: number) => {
    if (revealed) return;
    setQStates((prev) => {
      const copy = [...prev];
      const cur = { ...copy[idx] };
      const item = cur.arrangement[arrIndex];
      if (!item) return prev;
      const newPool = [...cur.pool];
      const original = newPool[item.poolIndex];
      // restore token text
      if (!original) {
        // find original token using poolIndex
        const initialTokens =
          mode === "arti-to-kanji" ? q.tokens : q.romajiTokens;
        // The pool was made from shuffle(tokens.map((t, i) => `${t}__${i}`))
        // poolIndex is the position in shuffled pool. We stored the actual token.
        newPool[item.poolIndex] = `${item.token}__${initialTokens.indexOf(item.token)}`;
      }
      const newArr = cur.arrangement.filter((_, i) => i !== arrIndex);
      cur.pool = newPool;
      cur.arrangement = newArr;
      copy[idx] = cur;
      return copy;
    });
  };

  const resetArrangement = () => {
    if (revealed) return;
    setQStates((prev) => {
      const copy = [...prev];
      const tokens = mode === "arti-to-kanji" ? q.tokens : q.romajiTokens;
      copy[idx] = {
        sentence: q,
        pool: shuffle(tokens.map((t, i) => `${t}__${i}`)),
        arrangement: [],
      };
      return copy;
    });
  };

  const userOrder = state.arrangement.map((a) => a.token);
  const finished = userOrder.length === targetTokens.length;

  return (
    <div className="space-y-6">
      <Link
        to="/tes"
        className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Kembali ke daftar tes
      </Link>

      <div className="jp-card space-y-4 rounded-2xl p-5">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Soal {idx + 1} dari {questions.length}</span>
          <span>
            Level {q.level} ·{" "}
            {mode === "arti-to-kanji" ? "Arti → Kanji" : "Arti → Romaji"}
          </span>
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
            if (!revealed) evaluate();
          }}
        />
      </div>

      <div className="jp-card rounded-3xl p-6 text-center">
        <div className="text-xs uppercase tracking-wider text-neutral-500">
          Susun kalimat dari arti berikut
        </div>
        <p className="mt-3 text-2xl font-medium leading-snug md:text-3xl">{q.arti}</p>
      </div>

      {/* Arrangement area */}
      <div className="jp-card min-h-28 rounded-2xl p-4">
        <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">
          Susunanmu
        </div>
        <div className="flex flex-wrap gap-2">
          {state.arrangement.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Klik token di bawah untuk menyusun kalimat.
            </p>
          ) : (
            state.arrangement.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => removeFromArrangement(i)}
                disabled={revealed}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  revealed
                    ? userOrder[i] === targetTokens[i]
                      ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                      : "border-rose-400/60 bg-rose-400/10 text-rose-200"
                    : "border-white/20 bg-white/10 text-neutral-100 hover:bg-white/15"
                } ${isJp ? "text-jp" : ""}`}
              >
                {a.token}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Pool */}
      <div className="jp-card rounded-2xl p-4">
        <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">
          Token tersedia
        </div>
        <div className="flex flex-wrap gap-2">
          {state.pool.map((token, i) =>
            token ? (
              <button
                key={i}
                type="button"
                onClick={() => moveToArrangement(i)}
                disabled={revealed}
                className={`rounded-lg border border-white/10 px-3 py-2 text-sm text-neutral-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 ${
                  isJp ? "text-jp" : ""
                }`}
              >
                {token.split("__")[0]}
              </button>
            ) : (
              <span
                key={i}
                className="rounded-lg border border-dashed border-white/5 px-3 py-2 text-sm text-neutral-700"
              >
                &nbsp;·&nbsp;
              </span>
            )
          )}
        </div>
      </div>

      {revealed && (
        <div className="jp-card space-y-3 rounded-2xl p-4 text-sm">
          {results[results.length - 1]?.correct ? (
            <p className="text-emerald-300">Benar! 🎉</p>
          ) : (
            <p className="text-rose-300">Belum tepat.</p>
          )}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs uppercase tracking-wider text-neutral-500">
                Jawaban benar
              </div>
              <SpeakButton text={q.kanji} stopPropagation={false} />
            </div>
            <div className="mt-1 space-y-1">
              <div>
                <span className="text-xs text-neutral-500">Kanji: </span>
                <span className="text-jp font-medium text-neutral-100">{q.kanji}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-500">Romaji: </span>
                <span className="font-medium text-neutral-200">{q.romaji}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-500">Arti: </span>
                <span className="text-neutral-300">{q.arti}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            Tekan Enter untuk soal berikutnya.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => finishRun(results)}
            className="text-sm text-neutral-500 hover:text-neutral-300"
          >
            Akhiri tes
          </button>
          <button
            type="button"
            onClick={resetArrangement}
            disabled={revealed}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Acak ulang
          </button>
        </div>
        {!revealed ? (
          <button
            type="button"
            onClick={evaluate}
            disabled={!finished}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Periksa jawaban
          </button>
        ) : (
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

function defaultPages(): Set<string> {
  const out = new Set<string>();
  // Pre-select first page of first 3 sections so user has min 3 by default
  for (let i = 0; i < Math.min(3, VOCAB_SECTIONS.length); i++) {
    out.add(pageKey(VOCAB_SECTIONS[i].id, 0));
  }
  return out;
}

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="jp-card rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-neutral-400">{sub}</p>
    </div>
  );
}
