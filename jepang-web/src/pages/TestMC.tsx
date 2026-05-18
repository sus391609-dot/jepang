import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import PageSelector, { pageKey } from "../components/PageSelector";
import TestSettings, { type Direction } from "../components/TestSettings";
import Timer from "../components/Timer";
import { sample, shuffle } from "../lib/shuffle";
import {
  distractorsForArti,
  distractorsForKanji,
  wordsFromPages,
} from "../lib/vocabHelpers";
import { useApp } from "../contexts/AppContext";
import type { FlatVocabItem } from "../data/vocab";
import { VOCAB_SECTIONS } from "../data/vocab";

type Stage = "config" | "running" | "result";

interface Question {
  word: FlatVocabItem;
  options: string[];
  correctIndex: number;
}

export default function TestMC() {
  const { addRun, setMemorized } = useApp();
  const [stage, setStage] = useState<Stage>("config");

  // config
  const [pages, setPages] = useState<Set<string>>(() => defaultPages());
  const [count, setCount] = useState(10);
  const [timePerQ, setTimePerQ] = useState(15);
  const [direction, setDirection] = useState<Direction>("kanji-to-arti");

  // running
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<{
    correct: boolean;
    elapsedMs: number;
    word: FlatVocabItem;
    chosen: string | null;
  }[]>([]);
  const [questionStart, setQuestionStart] = useState<number>(Date.now());
  const [runStart, setRunStart] = useState<number>(Date.now());

  const pool = useMemo(() => wordsFromPages(pages), [pages]);
  const maxCount = pool.length;

  // Reset count if it exceeds pool
  useEffect(() => {
    if (count > maxCount && maxCount > 0) setCount(maxCount);
  }, [maxCount, count]);

  const startTest = () => {
    if (pool.length < 4) return;
    const selectedWords = sample(pool, Math.min(count, pool.length));
    const qs: Question[] = selectedWords.map((w) => {
      if (direction === "kanji-to-arti") {
        const distractors = distractorsForArti(w, pool, 3);
        const opts = shuffle([w.arti, ...distractors]);
        return { word: w, options: opts, correctIndex: opts.indexOf(w.arti) };
      } else {
        const distractors = distractorsForKanji(w, pool, 3);
        const opts = shuffle([w.kanji, ...distractors]);
        return { word: w, options: opts, correctIndex: opts.indexOf(w.kanji) };
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
    if (idx + 1 >= questions.length) {
      finishRun();
    } else {
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
      id: `mc-${Date.now()}`,
      kind: "mc",
      variant: direction,
      startedAt: runStart,
      finishedAt: Date.now(),
      total: questions.length,
      correct: correctCount,
      timePerQuestionSec: timePerQ,
      avgAnswerMs: avg,
      pages: Array.from(pages),
    });
    setStage("result");
  };

  if (stage === "config") {
    return (
      <ConfigView
        pages={pages}
        setPages={setPages}
        count={count}
        setCount={setCount}
        timePerQ={timePerQ}
        setTimePerQ={setTimePerQ}
        direction={direction}
        setDirection={setDirection}
        maxCount={maxCount}
        onStart={startTest}
      />
    );
  }

  if (stage === "result") {
    return (
      <ResultView
        title="Pilihan Ganda"
        results={results}
        timePerQ={timePerQ}
        onRetry={() => setStage("config")}
        revealLabel="Arti benar"
        getReveal={(w) => (direction === "kanji-to-arti" ? w.arti : w.kanji)}
        getPrompt={(w) => (direction === "kanji-to-arti" ? w.kanji : w.arti)}
      />
    );
  }

  // running
  const q = questions[idx];
  const progressPct = ((idx) / questions.length) * 100;
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
          <span>{direction === "kanji-to-arti" ? "Kanji → Arti" : "Arti → Kanji"}</span>
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

      <div className="jp-card rounded-3xl p-8 text-center">
        <div className="text-xs uppercase tracking-wider text-neutral-500">
          {direction === "kanji-to-arti" ? "Apa arti dari kata ini?" : "Apa kanji untuk arti ini?"}
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
              <span className={direction === "arti-to-kanji" ? "text-jp text-xl font-medium" : "text-base"}>
                {opt}
              </span>
              {revealed && isCorrect && <CheckCircle2 size={18} className="text-emerald-400" />}
              {revealed && isChosen && !isCorrect && (
                <XCircle size={18} className="text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

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

function defaultPages(): Set<string> {
  const s = VOCAB_SECTIONS[0];
  return new Set([pageKey(s.id, 0)]);
}

function ConfigView({
  pages,
  setPages,
  count,
  setCount,
  timePerQ,
  setTimePerQ,
  direction,
  setDirection,
  maxCount,
  onStart,
}: {
  pages: Set<string>;
  setPages: (s: Set<string>) => void;
  count: number;
  setCount: (n: number) => void;
  timePerQ: number;
  setTimePerQ: (n: number) => void;
  direction: Direction;
  setDirection: (d: Direction) => void;
  maxCount: number;
  onStart: () => void;
}) {
  const canStart = maxCount >= 4 && pages.size >= 1 && count > 0;
  return (
    <div className="space-y-6">
      <Link
        to="/tes"
        className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Kembali
      </Link>
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Tes Pilihan Ganda</h1>
        <p className="mt-2 text-neutral-400">
          Pilih halaman yang ingin diuji, atur jumlah soal, waktu per soal, dan arah pertanyaan.
        </p>
      </header>

      <TestSettings
        count={count}
        setCount={setCount}
        timePerQ={timePerQ}
        setTimePerQ={setTimePerQ}
        direction={direction}
        setDirection={setDirection}
        maxCount={maxCount}
      />

      <PageSelector selected={pages} onChange={setPages} minPages={1} />

      <div className="jp-card flex flex-col items-center justify-between gap-3 rounded-2xl p-5 md:flex-row">
        <div className="text-sm text-neutral-400">
          {maxCount} kata tersedia. {maxCount < 4 && "Pilih lebih banyak halaman untuk memulai."}
        </div>
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mulai Tes
        </button>
      </div>
    </div>
  );
}

function ResultView({
  title,
  results,
  timePerQ,
  onRetry,
  revealLabel,
  getReveal,
  getPrompt,
}: {
  title: string;
  results: {
    correct: boolean;
    elapsedMs: number;
    word: FlatVocabItem;
    chosen: string | null;
  }[];
  timePerQ: number;
  onRetry: () => void;
  revealLabel: string;
  getReveal: (w: FlatVocabItem) => string;
  getPrompt: (w: FlatVocabItem) => string;
}) {
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
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="Skor" value={`${correct}/${total}`} sub={`${accuracy}% benar`} />
        <SummaryCard
          label="Akurasi"
          value={`${accuracy}%`}
          sub={accuracy >= 80 ? "Bagus!" : "Coba lagi dengan target halaman yang sama."}
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
            <li key={i} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div className="flex items-center gap-3">
                {r.correct ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <XCircle size={16} className="text-rose-400" />
                )}
                <span className="text-neutral-400">#{i + 1}</span>
                <span className="text-jp text-lg">{getPrompt(r.word)}</span>
              </div>
              <div className="text-right text-xs text-neutral-400">
                <div>
                  {revealLabel}:{" "}
                  <span className="font-medium text-neutral-100">{getReveal(r.word)}</span>
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
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5"
        >
          <RefreshCcw size={16} /> Tes lagi
        </button>
      </div>
    </div>
  );
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
