import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import SpeakButton from "../components/SpeakButton";
import { DOKKAI_PASSAGES, type DokkaiPassage } from "../data/dokkai";
import { sample } from "../lib/shuffle";
import { useApp } from "../contexts/AppContext";

type Stage = "config" | "running" | "result";

interface QResult {
  passageId: string;
  passageTitle: string;
  q: string;
  options: string[];
  correctIndex: number;
  chosen: number | null;
  correct: boolean;
}

const COUNT_OPTIONS = [3, 5, 8, 12];

export default function Dokkai() {
  const { addDokkaiRun } = useApp();
  const [stage, setStage] = useState<Stage>("config");
  const [count, setCount] = useState(5);
  const [passages, setPassages] = useState<DokkaiPassage[]>([]);
  const [pIdx, setPIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<QResult[]>([]);
  const [runStart, setRunStart] = useState(Date.now());

  const max = DOKKAI_PASSAGES.length;
  useEffect(() => {
    if (count > max) setCount(max);
  }, [count, max]);

  const startTest = () => {
    const picked = sample(DOKKAI_PASSAGES, Math.min(count, max));
    setPassages(picked);
    setPIdx(0);
    setQIdx(0);
    setShowRomaji(false);
    setSelected(null);
    setRevealed(false);
    setResults([]);
    setRunStart(Date.now());
    setStage("running");
  };

  const currentPassage = passages[pIdx];
  const currentQuestion = currentPassage?.questions[qIdx];

  const submitAnswer = (chosen: number | null) => {
    if (revealed) return;
    if (!currentPassage || !currentQuestion) return;
    const correct =
      chosen !== null && chosen === currentQuestion.correctIndex;
    setSelected(chosen);
    setRevealed(true);
    setResults((prev) => [
      ...prev,
      {
        passageId: currentPassage.id,
        passageTitle: currentPassage.title,
        q: currentQuestion.q,
        options: currentQuestion.options,
        correctIndex: currentQuestion.correctIndex,
        chosen,
        correct,
      },
    ]);
  };

  const totalQuestions = useMemo(
    () => passages.reduce((acc, p) => acc + p.questions.length, 0),
    [passages]
  );

  const answeredCount = results.length;

  const next = () => {
    if (!currentPassage) return;
    if (qIdx + 1 < currentPassage.questions.length) {
      setQIdx((v) => v + 1);
      setSelected(null);
      setRevealed(false);
      return;
    }
    if (pIdx + 1 < passages.length) {
      setPIdx((v) => v + 1);
      setQIdx(0);
      setSelected(null);
      setRevealed(false);
      setShowRomaji(false);
      return;
    }
    finish();
  };

  const finish = () => {
    const correctCount = results.filter((r) => r.correct).length;
    addDokkaiRun({
      id: `dokkai-${Date.now()}`,
      kind: "dokkai",
      variant: "passage-mc",
      startedAt: runStart,
      finishedAt: Date.now(),
      total: results.length || totalQuestions,
      correct: correctCount,
      timePerQuestionSec: 0,
      avgAnswerMs: 0,
      pages: passages.map((p) => p.id),
    });
    setStage("result");
  };

  // Enter to advance after revealing.
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
  }, [stage, revealed, qIdx, pIdx, passages.length]);

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
            <BookOpen size={14} /> Tes Dokkai
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Dokkai N4 — Reading
          </h1>
          <p className="mt-2 text-neutral-400">
            Baca passage pendek, lalu jawab pertanyaan pilihan ganda. Anda bisa
            menyalakan/mematikan romaji per passage dan memutar TTS.
          </p>
        </header>

        <section className="jp-card rounded-2xl p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Jumlah passage
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
            Total passage tersedia: {max}.
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
    if (!currentPassage || !currentQuestion) return null;
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-neutral-400">
            Passage {pIdx + 1} / {passages.length} &middot; Pertanyaan {qIdx + 1} / {currentPassage.questions.length}
          </p>
          <div className="text-sm text-neutral-400">
            Benar: {results.filter((r) => r.correct).length} dari{" "}
            {answeredCount}
          </div>
        </div>

        <section className="jp-card space-y-3 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                {currentPassage.level} &middot; Passage
              </p>
              <h2 className="text-jp text-lg font-semibold sm:text-xl">
                {currentPassage.title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRomaji((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/5"
              >
                {showRomaji ? <EyeOff size={12} /> : <Eye size={12} />}
                {showRomaji ? "Sembunyikan romaji" : "Tampilkan romaji"}
              </button>
              <SpeakButton text={currentPassage.bodyKanji} rate={0.9} />
            </div>
          </div>
          <p className="text-jp text-base leading-relaxed text-neutral-100 sm:text-lg">
            {currentPassage.bodyKanji}
          </p>
          {showRomaji && (
            <p className="border-t border-white/5 pt-3 text-sm italic leading-relaxed text-neutral-400">
              {currentPassage.bodyRomaji}
            </p>
          )}
        </section>

        <section className="jp-card space-y-3 rounded-2xl p-4 sm:p-5">
          <p className="text-sm font-medium text-neutral-200">
            {currentQuestion.q}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options.map((opt, i) => {
              const isCorrect = i === currentQuestion.correctIndex;
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
                  className={`min-h-[48px] rounded-xl border px-4 py-3 text-left text-sm transition ${stateClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-neutral-400">
              Jawaban benar: opsi {currentQuestion.correctIndex + 1} —{" "}
              {currentQuestion.options[currentQuestion.correctIndex]}. Tekan{" "}
              <kbd className="rounded border border-white/10 px-1.5">Enter</kbd>{" "}
              untuk lanjut.
            </div>
          )}
        </section>

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
            {answeredCount + 1 < totalQuestions ? "Selanjutnya" : "Selesai"}
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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Hasil Dokkai</h1>
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
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                {r.passageTitle}
              </p>
              <p className="text-sm text-neutral-100">{r.q}</p>
              <p className="mt-1 text-xs text-neutral-400">
                Benar: {r.options[r.correctIndex]}
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
