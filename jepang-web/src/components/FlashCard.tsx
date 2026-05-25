import { useState } from "react";
import { Check } from "lucide-react";

interface Props {
  kanji: string;
  romaji: string;
  arti: string;
  subcategory: string;
  showRomaji: boolean;
  showArti: boolean;
  memorized: boolean;
  onToggleMemorized: () => void;
}

export default function FlashCard({
  kanji,
  romaji,
  arti,
  subcategory,
  showRomaji,
  showArti,
  memorized,
  onToggleMemorized,
}: Props) {
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
