import { useMemo } from "react";
import { VOCAB_SECTIONS } from "../data/vocab";
import { Check } from "lucide-react";

export interface PageSelection {
  // Set of keys: `${sectionId}#${pageIndex}`
  keys: Set<string>;
}

export function pageKey(sectionId: string, pageIndex: number): string {
  return `${sectionId}#${pageIndex}`;
}

export function parsePageKey(key: string): { sectionId: string; pageIndex: number } {
  const [sectionId, pageIndex] = key.split("#");
  return { sectionId, pageIndex: Number(pageIndex) };
}

interface Props {
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  minPages?: number;
}

export default function PageSelector({ selected, onChange, minPages }: Props) {
  const totalSelected = selected.size;

  const toggleAllInSection = (sectionId: string, pageCount: number, allSelected: boolean) => {
    const next = new Set(selected);
    for (let i = 0; i < pageCount; i++) {
      const k = pageKey(sectionId, i);
      if (allSelected) next.delete(k);
      else next.add(k);
    }
    onChange(next);
  };

  const togglePage = (sectionId: string, pageIndex: number) => {
    const k = pageKey(sectionId, pageIndex);
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    onChange(next);
  };

  const selectAll = () => {
    const next = new Set<string>();
    for (const s of VOCAB_SECTIONS) {
      for (let i = 0; i < s.pages.length; i++) next.add(pageKey(s.id, i));
    }
    onChange(next);
  };

  const clearAll = () => onChange(new Set());

  const minNotice = useMemo(() => {
    if (!minPages) return null;
    if (totalSelected < minPages) {
      return (
        <p className="text-sm text-amber-400">
          Minimal pilih {minPages} halaman ({totalSelected}/{minPages}).
        </p>
      );
    }
    return (
      <p className="text-sm text-emerald-400">
        {totalSelected} halaman terpilih.
      </p>
    );
  }, [minPages, totalSelected]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-neutral-400">
          Pilih bagian dan halaman yang ingin diuji:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {minNotice}
          <button
            type="button"
            onClick={selectAll}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/5"
          >
            Pilih semua
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/5"
          >
            Kosongkan
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {VOCAB_SECTIONS.map((section) => {
          const total = section.pages.length;
          const selectedInSection = section.pages.filter((_, i) =>
            selected.has(pageKey(section.id, i))
          ).length;
          const allSelected = selectedInSection === total;
          return (
            <div
              key={section.id}
              className="jp-card rounded-2xl p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-100">
                    <span aria-hidden>{section.emoji}</span>
                    <span>{section.label}</span>
                    <span className="text-xs font-normal text-neutral-500">
                      ({section.totalWords} kata)
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {selectedInSection}/{total} halaman dipilih
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAllInSection(section.id, total, allSelected)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/5"
                >
                  {allSelected ? "Lepaskan semua" : "Pilih semua"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {section.pages.map((p, i) => {
                  const k = pageKey(section.id, i);
                  const isSel = selected.has(k);
                  return (
                    <button
                      type="button"
                      key={k}
                      onClick={() => togglePage(section.id, i)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition ${
                        isSel
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-white/10 bg-transparent text-neutral-400 hover:bg-white/5"
                      }`}
                    >
                      {isSel && <Check size={14} />}
                      <span>Hal. {i + 1}</span>
                      <span className="text-xs text-neutral-500">
                        · {p.items.length} kata
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
