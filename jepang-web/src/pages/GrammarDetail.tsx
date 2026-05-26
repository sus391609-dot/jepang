import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpenCheck } from "lucide-react";
import SpeakButton from "../components/SpeakButton";
import { GRAMMAR_PATTERNS, grammarById } from "../data/grammar";

export default function GrammarDetail() {
  const { id } = useParams<{ id: string }>();
  const pattern = id ? grammarById(id) : undefined;

  if (!pattern) {
    return (
      <div className="space-y-6">
        <Link
          to="/tata-bahasa"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Kembali ke daftar
        </Link>
        <p className="text-neutral-400">Pola tata bahasa tidak ditemukan.</p>
      </div>
    );
  }

  const idx = GRAMMAR_PATTERNS.findIndex((p) => p.id === pattern.id);
  const prev = idx > 0 ? GRAMMAR_PATTERNS[idx - 1] : undefined;
  const next = idx >= 0 && idx < GRAMMAR_PATTERNS.length - 1 ? GRAMMAR_PATTERNS[idx + 1] : undefined;

  return (
    <div className="space-y-8">
      <Link
        to="/tata-bahasa"
        className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Kembali ke daftar
      </Link>

      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
          <BookOpenCheck size={14} /> {pattern.level}
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-jp text-4xl font-bold tracking-tight md:text-5xl">
            {pattern.pattern}
          </h1>
          <SpeakButton text={pattern.pattern.replace(/〜/g, "")} iconSize={18} />
        </div>
        <p className="text-base text-neutral-400">{pattern.romaji}</p>
        <p className="text-lg font-medium text-neutral-200">{pattern.arti}</p>
        <div className="flex flex-wrap gap-1.5">
          {pattern.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-neutral-400"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      <section className="jp-card rounded-2xl p-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Pembentukan
        </h2>
        <p className="text-jp text-base leading-relaxed text-neutral-100">
          {pattern.formation}
        </p>
      </section>

      <section className="jp-card rounded-2xl p-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Penjelasan
        </h2>
        <p className="whitespace-pre-line text-base leading-relaxed text-neutral-200">
          {pattern.explanation}
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Contoh kalimat
        </h2>
        <div className="space-y-3">
          {pattern.examples.map((ex, i) => (
            <article
              key={i}
              className="jp-card flex items-start justify-between gap-3 rounded-2xl p-5"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-jp text-lg leading-relaxed text-neutral-100 break-words">
                  {ex.kanji}
                </p>
                <p className="text-sm text-neutral-400">{ex.romaji}</p>
                <p className="text-sm text-neutral-300">{ex.arti}</p>
              </div>
              <SpeakButton text={ex.kanji} />
            </article>
          ))}
        </div>
      </section>

      <nav className="flex items-center justify-between gap-3 pt-4">
        {prev ? (
          <Link
            to={`/tata-bahasa/${prev.id}`}
            className="jp-card jp-card-hover flex-1 rounded-2xl p-4 text-left"
          >
            <p className="text-xs text-neutral-500">← Sebelumnya</p>
            <p className="text-jp mt-1 truncate text-base font-semibold">
              {prev.pattern}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            to={`/tata-bahasa/${next.id}`}
            className="jp-card jp-card-hover flex-1 rounded-2xl p-4 text-right"
          >
            <p className="text-xs text-neutral-500">Selanjutnya →</p>
            <p className="text-jp mt-1 truncate text-base font-semibold">
              {next.pattern}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </nav>
    </div>
  );
}
