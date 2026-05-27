import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Ear,
  Headphones,
  Play,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import { CHOUKAI_ITEMS, type ChoukaiItem } from "../data/choukai";
import { sample } from "../lib/shuffle";
import { useApp } from "../contexts/AppContext";
import { isTTSSupported, speakJa } from "../lib/tts";

type Stage = "config" | "running" | "result";

interface AnswerResult {
  item: ChoukaiItem;
  chosen: number | null;
  correct: boolean;
  elapsedMs: number;
  playCount: number;
}

const MAX_PLAY = 2;
const COUNT_OPTIONS = [5, 10, 20, 30];

export default function Choukai() {
  const { addChoukaiRun } = useApp();
  const [stage, setStage] = useState<Stage>("config");
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<ChoukaiItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [runStart, setRunStart] = useState(Date.now());

  const ttsSupported = useMemo(() => isTTSSupported(), []);
  const max = CHOUKAI_ITEMS.length;

  useEffect(() => {
    if (count > max) setCount(max);
  }, [count, max]);

  const startTest = () => {
    const picked = sample(CHOUKAI_ITEMS, Math.min(count, max));
    setQuestions(picked);
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setPlayCount(0);
    setResults([]);
    setQuestionStart(Date.now());
    setRunStart(Date.now());
    setStage("running");
  };

  const play = () => {
    if (playCount >= MAX_PLAY) return;
    const q = questions[idx];
    if (!q) return;
    speakJa(q.audioText, { rate: 0.85 });
    setPlayCount((c) => c + 1);
  };

  const submitAnswer = (chosen: number | null) => {
    if (revealed) return;
    const q = questions[idx];
    if (!q) return;
    const elapsedMs = Date.now() - questionStart;
    const correct = chosen !== null && chosen === q.correctIndex;
    setSelected(chosen);
    setRevealed(true);
    setResults((prev) => [
      ...prev,
      { item: q, chosen, correct, elapsedMs, playCount },
    ]);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      finish();
    } else {
      setIdx((v) => v + 1);
      setSelected(null);
      setRevealed(false);
      setPlayCount(0);
      setQuestionStart(Date.now());
    }
  };

  const finish = () => {
    const correctCount = results.filter((r) => r.correct).length;
    const avg =
      results.length > 0
        ? results.reduce((a, r) => a + r.elapsedMs, 0) / results.length
        : 0;
    addChoukaiRun({
      id: `choukai-${Date.now()}`,
      kind: "choukai",
      variant: "listening-mc",
      startedAt: runStart,
      finishedAt: Date.now(),
      total: questions.length,
      correct: correctCount,
      timePerQuestionSec: 0,
      avgAnswerMs: avg,
      pages: [],
    });
    setStage("result");
  };

  // Enter untuk lanjut soal setelah revealed.
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
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
            <Headphones size={14} /> Tes Choukai
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Choukai N4 — Listening
          </h1>
          <p className="mt-2 text-neutral-400">
            Dengarkan teks Jepang (TTS) lalu pilih jawaban yang benar. Maksimal
            <span className="mx-1 rounded bg-white/10 px-1.5">{MAX_PLAY}x</span>
            putar per soal. Transcript baru muncul setelah Anda menjawab.
          </p>
          {!ttsSupported && (
            <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
              Browser ini sepertinya tidak mendukung Web Speech API. Audio
              mungkin tidak terdengar. Gunakan Chrome/Edge untuk pengalaman
              terbaik.
            </p>
          )}
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
          <p className="mt-2 text-xs text-neutral-500">
            Total pool soal: {max}.
          </p>
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
    if (!q) return null;
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

        <section className="jp-card space-y-4 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={play}
              disabled={playCount >= MAX_PLAY}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
            >
              <Play size={16} /> Putar
            </button>
            <span className="text-xs text-neutral-400">
              {playCount}/{MAX_PLAY}x diputar
            </span>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-neutral-400">
              <Ear size={10} /> {q.mondai}
            </span>
          </div>
          <p className="text-sm text-neutral-300">{q.question}</p>
          {q.hint && !revealed && (
            <p className="text-xs italic text-neutral-500">Hint: {q.hint}</p>
          )}
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
                key={i}
                type="button"
                disabled={revealed}
                onClick={() => submitAnswer(i)}
                className={`rounded-2xl border px-5 py-4 text-left transition ${stateClass}`}
              >
                {opt.kanji && (
                  <p className="text-jp text-lg font-semibold">{opt.kanji}</p>
                )}
                <p className="text-sm text-neutral-300">{opt.arti}</p>
              </button>
            );
          })}
        </section>

        {revealed && (
          <div className="jp-card space-y-2 rounded-2xl p-4 text-sm text-neutral-300">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Transcript
            </p>
            <p className="text-jp text-base text-neutral-100">{q.audioText}</p>
            <p className="text-xs text-neutral-500">
              Jawaban benar: opsi {q.correctIndex + 1} — {q.options[q.correctIndex].arti}.
            </p>
            <p className="text-xs text-neutral-500">
              Tekan{" "}
              <kbd className="rounded border border-white/10 px-1.5">Enter</kbd>{" "}
              untuk lanjut.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => submitAnswer(null)}
            disabled={revealed}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Lewati
          </button>
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
  const pct =
    results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Hasil Choukai</h1>
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
            <div className="min-w-0 flex-1">
              <p className="text-jp text-sm font-medium text-neutral-100">
                {r.item.audioText}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Benar: {r.item.options[r.item.correctIndex].arti} &middot; Diputar{" "}
                {r.playCount}x
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
          to="/tes"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
        >
          Kembali ke daftar tes
        </Link>
      </div>
    </div>
  );
}
