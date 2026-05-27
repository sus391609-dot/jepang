import { useEffect, useMemo, useRef, useState } from "react";
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
import { sample } from "../lib/shuffle";
import { isAnswerCorrect } from "../lib/vocabHelpers";
import { useApp } from "../contexts/AppContext";
import { getKaigoModule, type FlatKaigoItem } from "../data/kaigo";

type Stage = "config" | "running" | "result";
type TypingDirection = "kanji-to-arti" | "arti-to-romaji";

const TYPING_DIRECTION_LABELS: Record<TypingDirection, string> = {
  "kanji-to-arti": "Kanji → Arti",
  "arti-to-romaji": "Arti → Romaji",
};

const COUNT_OPTIONS = [10, 20, 30, 50];

export default function KaigoTestTyping() {
  const { moduleId = "" } = useParams<{ moduleId: string }>();
  const { addRun, setMemorized } = useApp();
  const mod = getKaigoModule(moduleId);

  const [stage, setStage] = useState<Stage>("config");
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    () => new Set(mod?.sections.map((s) => s.id) ?? [])
  );
  const [count, setCount] = useState(10);
  const [timePerQ, setTimePerQ] = useState(20);
  const [direction, setDirection] = useState<TypingDirection>("kanji-to-arti");

  const [questions, setQuestions] = useState<FlatKaigoItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<
    { word: FlatKaigoItem; correct: boolean; given: string; elapsedMs: number }[]
  >([]);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [runStart, setRunStart] = useState(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (stage === "running") inputRef.current?.focus();
  }, [stage, idx]);

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
        <Link
          to="/kaigo"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Semua modul Kaigo
        </Link>
        <p className="text-neutral-400">Modul Kaigo tidak ditemukan.</p>
      </div>
    );
  }

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
    const target = direction === "kanji-to-arti" ? word.arti : word.romaji;
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
      id: `kaigo-typing-${Date.now()}`,
      kind: "typing",
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
    const canStart = maxCount >= 1 && selectedSections.size >= 1 && count > 0;
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
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tes Mengetik Kaigo</h1>
          <p className="mt-2 text-neutral-400">
            Ketik <span className="font-semibold text-neutral-200">arti</span> dari kanji, atau
            ketik <span className="font-semibold text-neutral-200">romaji</span> dari arti.
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
              {(Object.keys(TYPING_DIRECTION_LABELS) as TypingDirection[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDirection(d)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm ${
                    direction === d
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 text-neutral-300 hover:bg-white/5"
                  }`}
                >
                  {TYPING_DIRECTION_LABELS[d]}
                </button>
              ))}
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
            {maxCount < 1 && "Pilih kategori dulu."}
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
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tes Mengetik Kaigo</h1>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard label="Skor" value={`${correct}/${total}`} sub={`${accuracy}% benar`} />
          <SummaryCard
            label="Akurasi"
            value={`${accuracy}%`}
            sub={accuracy >= 80 ? "Mantap!" : "Latihan lagi."}
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
                      {direction === "kanji-to-arti" ? r.word.arti : r.word.romaji}
                    </span>
                  </div>
                  <div className="text-neutral-500">
                    {direction === "kanji-to-arti" ? "Romaji" : "Kanji"}:{" "}
                    <span
                      className={`font-medium text-neutral-300 ${
                        direction === "kanji-to-arti" ? "" : "text-jp"
                      }`}
                    >
                      {direction === "kanji-to-arti" ? r.word.romaji : r.word.kanji}
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

  // running
  const word = questions[idx];
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
          <span>{TYPING_DIRECTION_LABELS[direction]}</span>
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
            : "Ketik romaji dari arti berikut"}
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
          if (!revealed) submit();
          else next();
        }}
        className="space-y-3"
      >
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
          }`}
          placeholder={direction === "kanji-to-arti" ? "tulis arti..." : "tulis romaji..."}
        />

        {revealed && (
          <div className="space-y-2 text-sm">
            {results[results.length - 1]?.correct ? (
              <span className="text-emerald-300">Benar! 🎉</span>
            ) : (
              <span className="text-rose-300">
                Salah. Jawaban benar:{" "}
                <span className="font-semibold">
                  {direction === "kanji-to-arti" ? word.arti : word.romaji}
                </span>
              </span>
            )}
            <div className="text-xs text-neutral-500">
              Kanji: <span className="text-jp text-neutral-200">{word.kanji}</span> ·{" "}
              Romaji: {word.romaji} · Arti: {word.arti}
            </div>
            <p className="text-xs text-neutral-500">Tekan Enter untuk soal berikutnya.</p>
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
              disabled={!input.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cek
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
      </form>
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
