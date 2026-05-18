import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import { VOCAB_SECTIONS, getSection } from "../data/vocab";
import { useApp } from "../contexts/AppContext";
import { shuffle } from "../lib/shuffle";

export default function Vocab() {
  const { sectionId, pageNum } = useParams();

  // If no sectionId, render the section index
  if (!sectionId) {
    return <SectionIndex />;
  }

  const section = getSection(sectionId);
  if (!section) {
    return (
      <div className="jp-card rounded-2xl p-6 text-neutral-300">
        Bagian tidak ditemukan.{" "}
        <Link to="/kosakata" className="text-white underline-offset-4 hover:underline">
          Kembali
        </Link>
      </div>
    );
  }

  const pageIndex = Math.max(0, Math.min((Number(pageNum) || 1) - 1, section.pages.length - 1));
  return <SectionPage sectionId={sectionId} pageIndex={pageIndex} />;
}

function SectionIndex() {
  const { memorized } = useApp();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Kosakata</h1>
        <p className="text-neutral-400">
          Pilih kategori, lalu pilih halaman. Setiap halaman berisi hingga 30 kosakata.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VOCAB_SECTIONS.map((s) => {
          const memInSec = s.pages.reduce((acc, p, pi) => {
            return (
              acc +
              p.items.filter((_, ii) =>
                memorized[`${s.id}-${pi}-${ii}`]
              ).length
            );
          }, 0);
          const pct = s.totalWords > 0 ? Math.round((memInSec / s.totalWords) * 100) : 0;
          return (
            <Link
              key={s.id}
              to={`/kosakata/${s.id}/1`}
              className="jp-card jp-card-hover rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl">{s.emoji}</div>
                  <h3 className="mt-2 text-base font-semibold text-neutral-100">
                    {s.label}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    {s.totalWords} kata &middot; {s.pages.length} halaman
                  </p>
                </div>
                <ArrowRight size={16} className="text-neutral-500" />
              </div>
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-neutral-500">
                  <span>{memInSec}/{s.totalWords} hafal</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neutral-200 to-neutral-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SectionPage({
  sectionId,
  pageIndex,
}: {
  sectionId: string;
  pageIndex: number;
}) {
  const section = getSection(sectionId)!;
  const page = section.pages[pageIndex];
  const navigate = useNavigate();
  const { memorized, toggleMemorized } = useApp();
  const [showRomaji, setShowRomaji] = useState(true);
  const [showArti, setShowArti] = useState(true);
  const [shuffled, setShuffled] = useState(false);
  const [order, setOrder] = useState<number[]>(() =>
    page.items.map((_, i) => i)
  );

  useEffect(() => {
    setOrder(page.items.map((_, i) => i));
    setShuffled(false);
  }, [page]);

  const items = useMemo(() => order.map((i) => ({ ...page.items[i], _i: i })), [order, page]);

  const memCount = page.items.filter((_, i) =>
    memorized[`${section.id}-${pageIndex}-${i}`]
  ).length;

  const goPage = (next: number) => {
    if (next < 0 || next >= section.pages.length) return;
    navigate(`/kosakata/${section.id}/${next + 1}`);
  };

  return (
    <div className="space-y-6">
      <Link
        to="/kosakata"
        className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Semua kategori
      </Link>

      <header className="jp-card flex flex-col gap-3 rounded-2xl p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span aria-hidden>{section.emoji}</span>
            <span>{section.label}</span>
            <span>·</span>
            <span>Halaman {pageIndex + 1} dari {section.pages.length}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {page.items.length} Kosakata
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Hafal di halaman ini: {memCount}/{page.items.length}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRomaji((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/5"
          >
            {showRomaji ? <Eye size={14} /> : <EyeOff size={14} />} Romaji
          </button>
          <button
            type="button"
            onClick={() => setShowArti((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/5"
          >
            {showArti ? <Eye size={14} /> : <EyeOff size={14} />} Arti
          </button>
          <button
            type="button"
            onClick={() => {
              if (shuffled) {
                setOrder(page.items.map((_, i) => i));
                setShuffled(false);
              } else {
                setOrder(shuffle(page.items.map((_, i) => i)));
                setShuffled(true);
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/5"
          >
            <RotateCcw size={14} /> {shuffled ? "Urutan asal" : "Acak"}
          </button>
        </div>
      </header>

      {/* Flashcards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const gid = `${section.id}-${pageIndex}-${it._i}`;
          const isMem = Boolean(memorized[gid]);
          return (
            <FlashCard
              key={gid}
              kanji={it.kanji}
              romaji={it.romaji}
              arti={it.arti}
              subcategory={it.subcategory}
              showRomaji={showRomaji}
              showArti={showArti}
              memorized={isMem}
              onToggleMemorized={() => toggleMemorized(gid)}
            />
          );
        })}
      </div>

      {/* Pagination */}
      <nav className="jp-card flex items-center justify-between rounded-2xl p-4">
        <button
          type="button"
          onClick={() => goPage(pageIndex - 1)}
          disabled={pageIndex === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Sebelumnya
        </button>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {section.pages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goPage(i)}
              className={`h-8 min-w-[2rem] rounded-md text-xs ${
                i === pageIndex
                  ? "bg-white text-neutral-900"
                  : "border border-white/10 text-neutral-300 hover:bg-white/5"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => goPage(pageIndex + 1)}
          disabled={pageIndex === section.pages.length - 1}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Selanjutnya <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}

function FlashCard({
  kanji,
  romaji,
  arti,
  subcategory,
  showRomaji,
  showArti,
  memorized,
  onToggleMemorized,
}: {
  kanji: string;
  romaji: string;
  arti: string;
  subcategory: string;
  showRomaji: boolean;
  showArti: boolean;
  memorized: boolean;
  onToggleMemorized: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flip-card h-48">
      <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
        {/* Front */}
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className={`flip-face jp-card jp-card-hover flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left ${
            memorized ? "ring-1 ring-emerald-400/40" : ""
          }`}
        >
          {subcategory && (
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">
              {subcategory}
            </div>
          )}
          <div className="flex items-center justify-center text-center">
            <span className="text-jp text-3xl font-semibold leading-tight">
              {kanji}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Klik untuk lihat arti</span>
            {memorized && <span className="text-emerald-400">Sudah hafal</span>}
          </div>
        </button>
        {/* Back */}
        <div
          className={`flip-face flip-back jp-card flex h-full w-full flex-col justify-between rounded-2xl p-5 ${
            memorized ? "ring-1 ring-emerald-400/40" : ""
          }`}
        >
          <div>
            <div className="text-jp text-xl font-semibold">{kanji}</div>
            {showRomaji && (
              <div className="mt-1 text-sm italic text-neutral-400">{romaji}</div>
            )}
            {showArti && (
              <div className="mt-2 text-sm text-neutral-200">{arti}</div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Putar balik
            </button>
            <button
              type="button"
              onClick={onToggleMemorized}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                memorized
                  ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40"
                  : "border border-white/15 text-neutral-200 hover:bg-white/5"
              }`}
            >
              <Check size={14} />
              {memorized ? "Hafal" : "Tandai hafal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
