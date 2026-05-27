import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpenCheck, CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import SpeakButton from "../components/SpeakButton";
import { sample, shuffle } from "../lib/shuffle";
import { GRAMMAR_PATTERNS } from "../data/grammar";
import type { GrammarPattern } from "../data/grammar";
import { useApp } from "../contexts/AppContext";

type Stage = "config" | "running" | "result";

interface Question {
  pattern: GrammarPattern;
  exampleIndex: number;
  options: string[]; // pattern.pattern strings
  correctIndex: number;
}

const COUNT_OPTIONS = [5, 10, 20];

function makeQuestion(pattern: GrammarPattern): Question {
  // Pilih contoh acak dari pola.
  const exampleIndex = Math.floor(Math.random() * pattern.examples.length);
  // Distractor: pola lain, lebih disukai yang punya tag mirip.
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
  const distractorsPool = [...shuffle(overlap), ...shuffle(rest)];
  const distractorPatterns = [];
  const taken = new Set<string>([pattern.pattern]);
  for (const p of distractorsPool) {
    if (taken.has(p.pattern)) continue;
    distractorPatterns.push(p.pattern);
    taken.add(p.pattern);
    if (distractorPatterns.length >= 3) break;
  }
  const options = shuffle([pattern.pattern, ...distractorPatterns]);
  return {
    pattern,
    exampleIndex,
    options,
    correctIndex: options.indexOf(pattern.pattern),
  };
}

export default function GrammarTest() {
  const { addGrammarRun } = useApp();
  const [stage, setStage] = useState<Stage>("config");
  const [count, setCount] = useState(10);
  const [timePerQ] = useState(20);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<
    { correct: boolean; pattern: GrammarPattern; elapsedMs: number }[]
  >([]);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [runStart, setRunStart] = useState(Date.now());

  const maxCount = GRAMMAR_PATTERNS.length;
  useEffect(() => {
    if (count > maxCount && maxCount > 0) setCount(maxCount);
  }, [count, maxCount]);

  const startTest = () => {
    const picked = sample(GRAMMAR_PATTERNS, Math.min(count, GRAMMAR_PATTERNS.length));
    setQuestions(picked.map((p) => makeQuestion(p)));
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setResults([]);
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
      { correct, pattern: q.pattern, elapsedMs },
    ]);
  };

  const next = () => {
    if (idx + 1 >= questions.length) finish();
    else {
      setIdx((v) => v + 1);
      setSelected(null);
      setRevealed(false);
      setQuestionStart(Date.now());
    }
  };

  // Enter to advance.
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

  const finish = () => {
    const correctCount = results.filter((r) => r.correct).length;
    const avg = results.length > 0
      ? results.reduce((acc, r) => acc + r.elapsedMs, 0) / results.length
      : 0;
    addGrammarRun({
      id: `grammar-${Date.now()}`,
      kind: "grammar",
      variant: "kalimat-ke-pola",
      startedAt: runStart,
      finishedAt: Date.now(),
      total: questions.length,
      correct: correctCount,
      timePerQuestionSec: timePerQ,
      avgAnswerMs: avg,
      pages: [],
    });
    setStage("result");
  };

  if (stage === "config") {
    return (
      <div className="space-y-6">
        <Link
          to="/tata-bahasa"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Kembali
        </Link>
        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
            <BookOpenCheck size={14} /> Tes Tata Bahasa
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Lengkapi Kalimat — Pilihan Ganda</h1>
          <p className="mt-2 text-neutral-400">
            Anda akan ditunjukkan kalimat contoh. Pilih pola tata bahasa yang
            membentuk kalimat tersebut dari 4 pilihan.
          </p>
        </header>

        <section className="jp-card rounded-2xl p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Jumlah soal
          </h2>
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
          </div>
        </section>

        <button
          type="button"
          onClick={startTest}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
        >
          Mulai tes
        </button>
      </div>
    );
  }

  if (stage === "running") {
    const q = questions[idx];
    const ex = q.pattern.examples[q.exampleIndex];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            Soal {idx + 1} dari {questions.length}
          </p>
          <div className="text-sm text-neutral-400">
            Benar: {results.filter((r) => r.correct).length}
          </div>
        </div>

        <section className="jp-card flex items-start justify-between gap-3 rounded-2xl p-4 sm:p-6">
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Pola apa yang dipakai pada kalimat berikut?
            </p>
            <p className="text-jp text-xl font-semibold leading-relaxed text-neutral-50 break-words sm:text-2xl">
              {ex.kanji}
            </p>
            <p className="text-sm text-neutral-400">{ex.romaji}</p>
            <p className="text-sm text-neutral-300">{ex.arti}</p>
          </div>
          <SpeakButton text={ex.kanji} />
        </section>

        <section className="grid grid-cols-1 gap-3">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isChosen = selected === i;
            const stateClass = !revealed
              ? "border-white/10 hover:border-white/30 hover:bg-white/5"
              : isCorrect
              ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-100"
              : isChosen
              ? "border-rose-400/50 bg-rose-400/10 text-rose-100"
              : "border-white/10 opacity-60";
            return (
              <button
                key={opt}
                type="button"
                disabled={revealed}
                onClick={() => submitAnswer(i)}
                className={`text-jp min-h-[56px] rounded-2xl border px-4 py-3.5 text-left text-base transition sm:px-5 sm:py-4 sm:text-lg ${stateClass}`}
              >
                {opt}
              </button>
            );
          })}
        </section>

        {revealed && (
          <div className="jp-card rounded-2xl p-4 text-sm text-neutral-300">
            <p>
              Pola benar:{" "}
              <span className="text-jp font-semibold text-white">
                {q.pattern.pattern}
              </span>{" "}
              ({q.pattern.romaji}) — {q.pattern.arti}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Tekan <kbd className="rounded border border-white/10 px-1.5">Enter</kbd> untuk lanjut.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={next}
            disabled={!revealed}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
          >
            {idx + 1 < questions.length ? "Selanjutnya" : "Selesai"}
          </button>
        </div>
      </div>
    );
  }

  // Result
  const correctCount = results.filter((r) => r.correct).length;
  const pct = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Hasil Tes Tata Bahasa</h1>
        <p className="mt-2 text-neutral-400">
          {correctCount} dari {results.length} benar &middot; {pct}%
        </p>
      </header>

      <section className="space-y-2">
        {results.map((r, i) => (
          <div
            key={i}
            className={`jp-card flex items-start justify-between gap-3 rounded-2xl p-4 ${
              r.correct ? "border-emerald-400/30" : "border-rose-400/30"
            }`}
          >
            <div className="flex-1">
              <p className="text-jp text-base font-semibold">
                {r.pattern.pattern}
              </p>
              <p className="text-xs text-neutral-400">
                {r.pattern.romaji} — {r.pattern.arti}
              </p>
            </div>
            {r.correct ? (
              <CheckCircle2 size={20} className="text-emerald-300" />
            ) : (
              <XCircle size={20} className="text-rose-300" />
            )}
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStage("config")}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/5"
        >
          <RefreshCcw size={14} /> Ulangi
        </button>
        <Link
          to="/tata-bahasa"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
        >
          Kembali ke daftar
        </Link>
      </div>
    </div>
  );
}
