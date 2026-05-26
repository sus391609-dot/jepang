import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  LayoutGrid,
  RotateCcw,
  Table as TableIcon,
} from "lucide-react";
import FlashCard from "../components/FlashCard";
import SpeakButton from "../components/SpeakButton";
import { useApp } from "../contexts/AppContext";
import { getKaigoModule, getKaigoSection } from "../data/kaigo";
import { loadJSON, saveJSON } from "../lib/storage";
import { shuffle } from "../lib/shuffle";

type ViewMode = "cards" | "table";
const VIEW_KEY = "jepang:kaigo:viewMode";

function kaigoGlobalId(moduleId: string, sectionId: string, pageIndex: number, itemIndex: number) {
  return `kaigo:${moduleId}:${sectionId}-${pageIndex}-${itemIndex}`;
}

export default function KaigoVocab() {
  const { moduleId = "", sectionId = "", pageNum } = useParams<{
    moduleId: string;
    sectionId: string;
    pageNum: string;
  }>();
  const navigate = useNavigate();
  const { memorized, toggleMemorized } = useApp();

  const mod = getKaigoModule(moduleId);
  const section = getKaigoSection(moduleId, sectionId);
  const pageIndex = Math.max(0, (Number(pageNum) || 1) - 1);

  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    loadJSON<ViewMode>(VIEW_KEY, "cards")
  );
  const [showRomaji, setShowRomaji] = useState(true);
  const [showArti, setShowArti] = useState(true);
  const [shuffled, setShuffled] = useState(false);
  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    saveJSON(VIEW_KEY, viewMode);
  }, [viewMode]);

  const page = section?.pages[pageIndex];

  useEffect(() => {
    if (page) {
      setOrder(page.items.map((_, i) => i));
      setShuffled(false);
    }
  }, [page]);

  const items = useMemo(() => {
    if (!page) return [];
    return order.map((i) => ({ ...page.items[i], _i: i }));
  }, [page, order]);

  const memCount = useMemo(() => {
    if (!page) return 0;
    let n = 0;
    for (let i = 0; i < page.items.length; i++) {
      if (memorized[kaigoGlobalId(moduleId, sectionId, pageIndex, i)]) n++;
    }
    return n;
  }, [page, memorized, moduleId, sectionId, pageIndex]);

  if (!mod || !section || !page) {
    return (
      <div className="space-y-4">
        <Link
          to="/kaigo"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Semua modul Kaigo
        </Link>
        <p className="text-neutral-400">Halaman kosakata tidak ditemukan.</p>
      </div>
    );
  }

  const goPage = (next: number) => {
    if (next < 0 || next >= section.pages.length) return;
    navigate(`/kaigo/${mod.id}/${section.id}/${next + 1}`);
  };

  const globalOffset = pageIndex * 30;

  return (
    <div className="space-y-6">
      <Link
        to={`/kaigo/${mod.id}`}
        className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Kategori {mod.label}
      </Link>

      <header className="jp-card flex flex-col gap-3 rounded-2xl p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span aria-hidden>{section.emoji}</span>
            <span>
              {mod.label} · {section.label}
            </span>
            <span>·</span>
            <span>
              Halaman {pageIndex + 1} dari {section.pages.length}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {page.items.length} Kosakata
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Hafal di halaman ini: {memCount}/{page.items.length}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
                viewMode === "cards"
                  ? "bg-white text-neutral-900"
                  : "text-neutral-300 hover:bg-white/5"
              }`}
            >
              <LayoutGrid size={14} /> Kartu
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
                viewMode === "table"
                  ? "bg-white text-neutral-900"
                  : "text-neutral-300 hover:bg-white/5"
              }`}
            >
              <TableIcon size={14} /> Tabel
            </button>
          </div>
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

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => {
            const gid = kaigoGlobalId(mod.id, section.id, pageIndex, it._i);
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
      ) : (
        <div className="jp-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="px-4 py-3 text-center w-12">#</th>
                  <th className="px-4 py-3">Kanji</th>
                  {showRomaji && <th className="px-4 py-3">Romaji</th>}
                  {showArti && <th className="px-4 py-3">Arti</th>}
                  <th className="px-4 py-3 text-center w-28">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((it, rowIdx) => {
                  const gid = kaigoGlobalId(mod.id, section.id, pageIndex, it._i);
                  const isMem = Boolean(memorized[gid]);
                  return (
                    <tr
                      key={gid}
                      className={`transition hover:bg-white/[0.03] ${
                        isMem ? "bg-emerald-500/[0.04]" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-center text-xs text-neutral-500">
                        {globalOffset + rowIdx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <SpeakButton text={it.kanji} />
                          <div className="text-jp text-lg font-semibold text-neutral-100">
                            {it.kanji}
                          </div>
                        </div>
                        {it.subcategory && (
                          <div className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-500">
                            {it.subcategory}
                          </div>
                        )}
                      </td>
                      {showRomaji && (
                        <td className="px-4 py-3 italic text-neutral-300">
                          {it.romaji}
                        </td>
                      )}
                      {showArti && (
                        <td className="px-4 py-3 text-neutral-200">{it.arti}</td>
                      )}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleMemorized(gid)}
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                            isMem
                              ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40"
                              : "border border-white/15 text-neutral-300 hover:bg-white/5"
                          }`}
                        >
                          <Check size={12} />
                          {isMem ? "Hafal" : "Tandai"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              className={`h-8 min-w-8 rounded-md text-xs ${
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
