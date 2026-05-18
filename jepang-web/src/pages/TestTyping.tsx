import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import PageSelector, { pageKey } from "../components/PageSelector";
import TestSettings, { type Direction } from "../components/TestSettings";
import Timer from "../components/Timer";
import { sample } from "../lib/shuffle";
import { isAnswerCorrect, wordsFromPages } from "../lib/vocabHelpers";
import { useApp } from "../contexts/AppContext";
import type { FlatVocabItem } from "../data/vocab";
import { VOCAB_SECTIONS } from "../data/vocab";

type Stage = "config" | "running" | "result";

export default function TestTyping() {
  const { addRun, setMemorized } = useApp();
  const [stage, setStage] = useState<Stage>("config");

  const [pages, setPages] = useState<Set<string>>(() => defaultPages());
  const [count, setCount] = useState(10);
  const [timePerQ, setTimePerQ] = useState(20);
  const [direction, setDirection] = useState<Direction>("kanji-to-arti");

  const [questions, setQuestions] = useState<FlatVocabItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<
    { word: FlatVocabItem; correct: boolean; given: string; elapsedMs: number }[]
  >([]);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [runStart, setRunStart] = useState(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const pool = useMemo(() => wordsFromPages(pages), [pages]);
  const maxCount = pool.length;

  useEffect(() => {
    if (count > maxCount && maxCount > 0) setCount(maxCount);
  }, [maxCount, count]);

  useEffect(() => {
    if (stage === "running") inputRef.current?.focus();
  }, [stage, idx]);

  const startTest = () => {
    if (pool.length < 1) return;
    const qs = sample(pool, Math.min(count, pool.length));
    setQuestions(qs);
    setIdx(0);
    setInput("");
    setRevealed(false);
    setResults([]);
    setQuestionStart(Date.now());
    setRunStart(Date.now());
    setStage("running");
  };

  const submit = () => {
    if (revealed || questions.length === 0) return;
    const word = questions[idx];
    const target = direction === "kanji-to-arti" ? word.arti : word.kanji;
    const ok = input.trim().length > 0 && isAnswerCorrect(input, target);
    setRevealed(true);
    setResults((prev) => [
      ...prev,
      {
        word,
        correct: ok,
        given: input,
        elapsedMs: Date.now() - questionStart,
      },
    ]);
    if (ok) setMemorized(word.globalId, true);
  };

  const next = () => {
    if (idx + 1 >= questions.length) finishRun();
    else {
      setIdx((v) => v + 1);
      setInput("");
      setRevealed(false);
      setQuestionStart(Date.now());
    }
  };

  const finishRun = () => {
    const correctCount = results.filter((r) => r.correct).length;
    const avg = results.length > 0
      ? results.reduce((a, r) => a + r.elapsedMs, 0) / results.length
      : 0;
    addRun({
      id: `typing-${Date.now()}`,
      kind: "typing",
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
      <div className="space-y-6">
        <Link
          to="/tes"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Kembali
        </Link>
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Tes Mengetik</h1>
          <p className="mt-2 text-neutral-400">
            Ketik arti atau kanji yang sesuai. Tanpa romaji, hanya kanji ↔ arti.
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
            {maxCount} kata tersedia.
          </div>
          <button
            type="button"
            onClick={startTest}
            disabled={maxCount < 1}
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
          <h1 className="text-3xl font-bold tracking-tight">Tes Mengetik</h1>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard label="Skor" value={`${correct}/${total}`} sub={`${accuracy}% benar`} />
          <SummaryCard label="Akurasi" value={`${accuracy}%`} sub={accuracy >= 80 ? "Mantap!" : "Latihan lagi."} />
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
                  <span className="text-jp text-lg">
                    {direction === "kanji-to-arti" ? r.word.kanji : r.word.arti}
                  </span>
                </div>
                <div className="text-right text-xs text-neutral-400">
                  <div>
                    Benar:{" "}
                    <span className="font-medium text-neutral-100">
                      {direction === "kanji-to-arti" ? r.word.arti : r.word.kanji}
                    </span>
                  </div>
                  {!r.correct && (
                    <div className="text-rose-300/80">
                      Jawabanmu: {r.given || "(kosong)"}
                    </div>
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

  const word = questions[idx];
  const progressPct = (idx / questions.length) * 100;
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
            if (!revealed) submit();
          }}
        />
      </div>

      <div className="jp-card rounded-3xl p-8 text-center">
        <div className="text-xs uppercase tracking-wider text-neutral-500">
          {direction === "kanji-to-arti"
            ? "Ketik arti dari kata berikut"
            : "Ketik kanji dari arti berikut"}
        </div>
        <div className="mt-3 break-words">
          <span
            className={
              direction === "kanji-to-arti"
                ? "text-jp text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
                : "text-xl font-medium leading-snug sm:text-2xl md:text-3xl"
            }
          >
            {direction === "kanji-to-arti" ? word.kanji : word.arti}
          </span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (revealed) next();
          else submit();
        }}
        className="jp-card space-y-3 rounded-2xl p-5"
      >
        <label className="text-xs uppercase tracking-wider text-neutral-500">
          Jawaban kamu
        </label>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={revealed}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={`w-full rounded-xl border bg-neutral-950/60 px-4 py-3 text-lg outline-none transition placeholder:text-neutral-600 ${
            revealed
              ? results[results.length - 1]?.correct
                ? "border-emerald-400/60"
                : "border-rose-400/60"
              : "border-white/10 focus:border-white/30"
          } ${direction === "arti-to-kanji" ? "text-jp" : ""}`}
          placeholder={direction === "kanji-to-arti" ? "tulis arti..." : "tulis kanji..."}
        />

        {revealed && (
          <div className="text-sm">
            {results[results.length - 1]?.correct ? (
              <span className="text-emerald-300">Benar! 🎉</span>
            ) : (
              <span className="text-rose-300">
                Salah. Jawaban benar:{" "}
                <span className="font-semibold">
                  {direction === "kanji-to-arti" ? word.arti : word.kanji}
                </span>
              </span>
            )}
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
          {!revealed ? (
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
            >
              Kirim jawaban
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
            >
              {idx + 1 >= questions.length ? "Lihat hasil" : "Soal berikutnya"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function defaultPages(): Set<string> {
  const s = VOCAB_SECTIONS[0];
  return new Set([pageKey(s.id, 0)]);
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
