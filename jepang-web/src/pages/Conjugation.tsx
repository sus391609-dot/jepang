import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RefreshCcw, Shuffle, Wand2, XCircle } from "lucide-react";
import SpeakButton from "../components/SpeakButton";
import { sample, shuffle } from "../lib/shuffle";
import { useApp } from "../contexts/AppContext";
import {
  CONJUGATION_FORMS,
  FORM_LABELS,
  FORM_SHORT_LABELS,
  conjugate,
  conjugateAccepted,
  isConjugationCorrect,
  type ConjugationForm,
} from "../lib/conjugate";
import { VERBS } from "../data/verbs";
import type { Verb } from "../data/verbs";

type Stage = "config" | "running" | "result";

interface Question {
  verb: Verb;
  form: ConjugationForm;
}

const COUNT_OPTIONS = [5, 10, 20, 30];

export default function Conjugation() {
  const { addConjugationRun } = useApp();
  const [stage, setStage] = useState<Stage>("config");

  // config
  const [count, setCount] = useState(10);
  const [timePerQ] = useState(20);
  const [mode, setMode] = useState<"random" | "single">("random");
  const [singleForm, setSingleForm] = useState<ConjugationForm>("te");
  const [selectedForms, setSelectedForms] = useState<Set<ConjugationForm>>(
    () => new Set(CONJUGATION_FORMS)
  );

  // running
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<
    { question: Question; correct: boolean; given: string; elapsedMs: number }[]
  >([]);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [runStart, setRunStart] = useState(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const availableForms = useMemo(
    () =>
      mode === "single" ? [singleForm] : Array.from(selectedForms),
    [mode, singleForm, selectedForms]
  );

  const canStart = availableForms.length > 0;

  useEffect(() => {
    if (stage === "running") inputRef.current?.focus();
  }, [stage, idx]);

  const startTest = () => {
    if (!canStart) return;
    const forms = availableForms;
    const verbs = sample(VERBS, Math.min(count, VERBS.length));
    const qs: Question[] = verbs.map((v) => ({
      verb: v,
      form: forms[Math.floor(Math.random() * forms.length)],
    }));
    // For single mode, ensure form is always the same; for random, shuffle the form picks lightly.
    if (mode === "random") {
      // make sure forms cycle through if user picked multiple
      const cycled = qs.map((q, i) => ({
        ...q,
        form: forms[(i + Math.floor(Math.random() * forms.length)) % forms.length],
      }));
      setQuestions(shuffle(cycled));
    } else {
      setQuestions(qs);
    }
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
    const q = questions[idx];
    const ok = input.trim().length > 0 && isConjugationCorrect(q.verb, q.form, input);
    setRevealed(true);
    setResults((prev) => [
      ...prev,
      {
        question: q,
        correct: ok,
        given: input,
        elapsedMs: Date.now() - questionStart,
      },
    ]);
  };

  const next = () => {
    if (idx + 1 >= questions.length) finish();
    else {
      setIdx((v) => v + 1);
      setInput("");
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
    const avg =
      results.length > 0
        ? results.reduce((a, r) => a + r.elapsedMs, 0) / results.length
        : 0;
    addConjugationRun({
      id: `konjugasi-${Date.now()}`,
      kind: "konjugasi",
      variant: mode === "single" ? `single:${singleForm}` : "random",
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

  const toggleForm = (f: ConjugationForm) => {
    setSelectedForms((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  if (stage === "config") {
    return (
      <div className="space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Kembali
        </Link>
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
            <Wand2 size={14} /> Drill Konjugasi
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Konjugasi Kata Kerja</h1>
          <p className="text-neutral-400">
            Ketik konjugasi bentuk yang diminta dari kata kerja yang ditampilkan.
            Untuk huruf Jepang, gunakan IME (mis. Google IME / fcitx-mozc) atau
            tempel langsung kanji/hiragana.
          </p>
        </header>

        <section className="jp-card rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Mode
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode("random")}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${
                  mode === "random"
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5"
                }`}
              >
                <Shuffle size={14} /> Random (banyak bentuk)
              </button>
              <button
                type="button"
                onClick={() => setMode("single")}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${
                  mode === "single"
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5"
                }`}
              >
                Fokus 1 bentuk
              </button>
            </div>
          </div>

          {mode === "single" ? (
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Bentuk fokus
              </h2>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {CONJUGATION_FORMS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSingleForm(f)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${
                      singleForm === f
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/10 text-neutral-300 hover:bg-white/5"
                    }`}
                  >
                    <p className="text-jp font-semibold">
                      {FORM_SHORT_LABELS[f]}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {FORM_LABELS[f]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="mb-2 flex items-center justify-between text-sm font-semibold uppercase tracking-wider text-neutral-400">
                <span>Bentuk yang diuji</span>
                <span className="text-xs normal-case text-neutral-500">
                  {selectedForms.size} dari {CONJUGATION_FORMS.length}
                </span>
              </h2>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {CONJUGATION_FORMS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleForm(f)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${
                      selectedForms.has(f)
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/10 text-neutral-400 hover:bg-white/5"
                    }`}
                  >
                    <p className="text-jp font-semibold">
                      {FORM_SHORT_LABELS[f]}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {FORM_LABELS[f]}
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedForms(new Set(CONJUGATION_FORMS))}
                  className="rounded border border-white/10 px-2 py-1 text-neutral-300 hover:bg-white/5"
                >
                  Pilih semua
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedForms(new Set())}
                  className="rounded border border-white/10 px-2 py-1 text-neutral-300 hover:bg-white/5"
                >
                  Kosongkan
                </button>
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
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
          </div>
        </section>

        <button
          type="button"
          onClick={startTest}
          disabled={!canStart}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
        >
          Mulai drill
        </button>
      </div>
    );
  }

  if (stage === "running") {
    const q = questions[idx];
    const accepted = conjugateAccepted(q.verb, q.form);
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

        <section className="jp-card rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            {FORM_LABELS[q.form]}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-jp text-4xl font-bold leading-tight">
              {q.verb.dict}
            </span>
            <SpeakButton text={q.verb.dict} iconSize={16} />
          </div>
          <p className="mt-1 text-sm text-neutral-400">
            {q.verb.romaji} — {q.verb.arti}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Grup: {q.verb.group}
          </p>

          <div className="mt-5">
            <label className="mb-2 block text-xs uppercase tracking-wider text-neutral-500">
              Jawaban Anda
            </label>
            <input
              ref={inputRef}
              type="text"
              value={input}
              disabled={revealed}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (revealed) next();
                  else submit();
                }
              }}
              placeholder="ketik konjugasinya, lalu Enter..."
              className="text-jp w-full rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-3 text-lg text-neutral-50 placeholder:text-neutral-500 focus:border-white/30 focus:outline-none disabled:opacity-60"
            />
          </div>

          {!revealed && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={submit}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
              >
                Periksa
              </button>
            </div>
          )}

          {revealed && (
            <div className="mt-5">
              {results[results.length - 1]?.correct ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                  <CheckCircle2 size={16} /> Benar! Jawaban Anda{" "}
                  <span className="text-jp font-semibold">{input}</span> diterima.
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  <XCircle size={16} /> Salah. Jawaban Anda:{" "}
                  <span className="text-jp font-semibold">
                    {input || "(kosong)"}
                  </span>
                </div>
              )}
              <p className="mt-3 text-sm text-neutral-300">
                Bentuk yang benar:{" "}
                <span className="text-jp font-semibold text-white">
                  {accepted[0]}
                </span>
                {accepted.length > 1 && (
                  <span className="ml-1 text-neutral-500">
                    (juga diterima: {accepted.slice(1).join(", ")})
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Tekan <kbd className="rounded border border-white/10 px-1.5">Enter</kbd> untuk lanjut.
              </p>
            </div>
          )}
        </section>

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

  const correctCount = results.filter((r) => r.correct).length;
  const pct = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Hasil Drill Konjugasi</h1>
        <p className="mt-2 text-neutral-400">
          {correctCount} dari {results.length} benar &middot; {pct}%
        </p>
      </header>

      <section className="space-y-2">
        {results.map((r, i) => {
          const accepted = conjugate(r.question.verb, r.question.form);
          return (
            <div
              key={i}
              className={`jp-card flex items-start justify-between gap-3 rounded-2xl p-4 ${
                r.correct ? "border-emerald-400/30" : "border-rose-400/30"
              }`}
            >
              <div className="flex-1">
                <p className="text-jp text-base font-semibold">
                  {r.question.verb.dict}{" "}
                  <span className="text-neutral-500">→</span>{" "}
                  {accepted}
                </p>
                <p className="text-xs text-neutral-400">
                  {FORM_SHORT_LABELS[r.question.form]} &middot;{" "}
                  {r.question.verb.romaji}
                </p>
                {!r.correct && (
                  <p className="text-xs text-rose-300">
                    Jawaban Anda: {r.given || "(kosong)"}
                  </p>
                )}
              </div>
              {r.correct ? (
                <CheckCircle2 size={20} className="text-emerald-300" />
              ) : (
                <XCircle size={20} className="text-rose-300" />
              )}
            </div>
          );
        })}
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
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
        >
          Ke beranda
        </Link>
      </div>
    </div>
  );
}
