import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  cancelSpeak,
  isSpeaking,
  isTTSSupported,
  speakJa,
} from "../lib/tts";

interface Props {
  text: string;
  /** Hentikan propagasi event klik. Default: true supaya tidak memicu parent (mis. flip kartu). */
  stopPropagation?: boolean;
  /** Class tambahan untuk ukuran/posisi. */
  className?: string;
  /** Ukuran ikon dalam px. */
  iconSize?: number;
  /** Label aksesibilitas. */
  ariaLabel?: string;
  /** Title HTML. */
  title?: string;
  rate?: number;
  pitch?: number;
}

export default function SpeakButton({
  text,
  stopPropagation = true,
  className = "",
  iconSize = 14,
  ariaLabel,
  title,
  rate,
  pitch,
}: Props) {
  const [supported, setSupported] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    setSupported(isTTSSupported());
  }, []);

  // Poll status synthesis selagi sedang bicara — speechSynthesis tidak menyediakan
  // event "ended" yang konsisten antar browser.
  useEffect(() => {
    if (!speaking) return;
    pollRef.current = window.setInterval(() => {
      if (!isSpeaking()) {
        setSpeaking(false);
      }
    }, 250);
    return () => {
      if (pollRef.current !== null) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [speaking]);

  // Pastikan utterance dibatalkan ketika komponen unmount.
  useEffect(() => {
    return () => {
      if (speaking) cancelSpeak();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (!supported) return;
      if (speaking || isSpeaking()) {
        cancelSpeak();
        setSpeaking(false);
        return;
      }
      speakJa(text, {
        rate,
        pitch,
        onEnd: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
      setSpeaking(true);
    },
    [speaking, supported, stopPropagation, text, rate, pitch]
  );

  if (!supported) return null;
  if (!text?.trim()) return null;

  const label =
    ariaLabel ??
    (speaking ? "Hentikan pelafalan" : "Putar pelafalan bahasa Jepang");

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={(e) => {
        // Cegah parent (mis. <div role="button">) ikut bereaksi ke Space/Enter.
        if (stopPropagation && (e.key === " " || e.key === "Enter")) {
          e.stopPropagation();
        }
      }}
      aria-label={label}
      title={title ?? label}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-neutral-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/40 ${
        speaking ? "text-emerald-300 ring-1 ring-emerald-400/40" : ""
      } ${className}`}
    >
      {speaking ? <VolumeX size={iconSize} /> : <Volume2 size={iconSize} />}
    </button>
  );
}
