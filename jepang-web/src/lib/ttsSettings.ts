import { useCallback, useEffect, useState } from "react";

export const TTS_AUTOPLAY_KEY = "jepang:settings:ttsAutoplay";
const TTS_AUTOPLAY_EVENT = "jepang:settings:ttsAutoplay:change";

export function getTtsAutoplay(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(TTS_AUTOPLAY_KEY) === "1";
}

export function setTtsAutoplay(value: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TTS_AUTOPLAY_KEY, value ? "1" : "0");
  window.dispatchEvent(
    new CustomEvent<boolean>(TTS_AUTOPLAY_EVENT, { detail: value })
  );
}

export function useTtsAutoplay(): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => getTtsAutoplay());

  useEffect(() => {
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      if (typeof detail === "boolean") setValue(detail);
      else setValue(getTtsAutoplay());
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === TTS_AUTOPLAY_KEY) setValue(getTtsAutoplay());
    };
    window.addEventListener(TTS_AUTOPLAY_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(TTS_AUTOPLAY_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setter = useCallback((v: boolean) => {
    setTtsAutoplay(v);
  }, []);

  return [value, setter];
}
