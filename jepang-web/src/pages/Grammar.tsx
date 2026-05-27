import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpenCheck, Filter, GraduationCap, Search } from "lucide-react";
import { GRAMMAR_PATTERNS, GRAMMAR_TAGS, GRAMMAR_TOTAL } from "../data/grammar";
import type { GrammarLevel, GrammarPattern } from "../data/grammar";

type LevelFilter = "all" | GrammarLevel;

export default function Grammar() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo<GrammarPattern[]>(() => {
    const q = query.trim().toLowerCase();
    return GRAMMAR_PATTERNS.filter((p) => {
      if (level !== "all" && p.level !== level) return false;
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = `${p.pattern} ${p.romaji} ${p.arti} ${p.formation} ${p.explanation} ${p.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, level, activeTag]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
          <BookOpenCheck size={14} /> Tata Bahasa
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tata Bahasa N4</h1>
            <p className="mt-2 text-neutral-400">
              {GRAMMAR_TOTAL} pola tata bahasa untuk JLPT N4 (+ beberapa pola N5 yang sering muncul).
            </p>
          </div>
          <Link
            to="/tata-bahasa/tes"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-200"
          >
            <GraduationCap size={16} /> Tes Tata Bahasa
          </Link>
        </div>
      </header>

      {/* Search + filter */}
      <section className="jp-card grid grid-cols-1 gap-4 rounded-2xl p-5 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
            <Search size={14} /> Cari pola
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="〜なければならない, sambil, kondisional..."
            className="w-full rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-white/30 focus:outline-none"
          />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
            <Filter size={14} /> Level
          </div>
          <div className="flex gap-2">
            {(["all", "N4", "N5"] as LevelFilter[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`flex-1 rounded-lg border px-3 py-1.5 text-sm ${
                  level === lvl
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5"
                }`}
              >
                {lvl === "all" ? "Semua" : lvl}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-neutral-500">
            Tag:
          </span>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-3 py-1 text-xs ${
              activeTag === null
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/10 text-neutral-400 hover:bg-white/5"
            }`}
          >
            Semua
          </button>
          {GRAMMAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full border px-3 py-1 text-xs ${
                activeTag === tag
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/10 text-neutral-400 hover:bg-white/5"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <p className="text-xs text-neutral-500">
          {filtered.length} pola sesuai filter
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <Link
            key={p.id}
            to={`/tata-bahasa/${p.id}`}
            className="jp-card jp-card-hover flex flex-col gap-3 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
                  {p.level}
                </div>
                <h3 className="text-jp mt-1 text-2xl font-bold leading-tight">
                  {p.pattern}
                </h3>
                <p className="text-sm text-neutral-400">{p.romaji}</p>
              </div>
              <ArrowRight size={18} className="text-neutral-500" />
            </div>
            <p className="text-sm font-medium text-neutral-200">{p.arti}</p>
            <p className="line-clamp-2 text-sm text-neutral-400">{p.explanation}</p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-neutral-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-neutral-500">
            Tidak ada pola yang cocok. Coba ubah kata kunci atau filter.
          </p>
        )}
      </section>
    </div>
  );
}
