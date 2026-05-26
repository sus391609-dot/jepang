import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { speakJa } from "../lib/tts";
import { useTtsAutoplay } from "../lib/ttsSettings";

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
  const [autoplay] = useTtsAutoplay();
  const firstFlipRef = useRef(true);

  useEffect(() => {
    // Skip pemanggilan pertama supaya tidak otomatis berbunyi saat mount.
    if (firstFlipRef.current) {
      firstFlipRef.current = false;
      return;
    }
    if (autoplay) {
      speakJa(kanji);
    }
  }, [flipped, autoplay, kanji]);

  const toggle = () => setFlipped((v) => !v);

  return (
    <div className="flip-card h-48">
      <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
        {/* Front */}
        <div
          role="button"
          tabIndex={0}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          className={`flip-face jp-card jp-card-hover flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left focus:outline-none focus:ring-1 focus:ring-white/30 ${
            memorized ? "ring-1 ring-emerald-400/40" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            {subcategory ? (
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {subcategory}
              </div>
            ) : (
              <span />
            )}
            <SpeakButton text={kanji} />
          </div>
          <div className="flex items-center justify-center text-center">
            <span className="text-jp text-3xl font-semibold leading-tight">
              {kanji}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Klik untuk lihat arti</span>
            {memorized && <span className="text-emerald-400">Sudah hafal</span>}
          </div>
        </div>
        {/* Back */}
        <div
          className={`flip-face flip-back jp-card flex h-full w-full flex-col justify-between rounded-2xl p-5 ${
            memorized ? "ring-1 ring-emerald-400/40" : ""
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-jp text-xl font-semibold">{kanji}</div>
              <SpeakButton text={kanji} />
            </div>
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
