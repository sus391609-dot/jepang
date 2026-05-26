// Web Speech API helpers untuk pelafalan bahasa Jepang.
// Tidak memerlukan dependency tambahan — pakai SpeechSynthesisUtterance bawaan browser.

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
  onError?: (event: SpeechSynthesisErrorEvent) => void;
}

let voicesCache: SpeechSynthesisVoice[] | null = null;
let voicesLoadedListenerAttached = false;

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

export function isTTSSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    typeof window.speechSynthesis !== "undefined" &&
    typeof window.SpeechSynthesisUtterance !== "undefined"
  );
}

function loadVoices(): SpeechSynthesisVoice[] {
  const synth = getSynth();
  if (!synth) return [];
  const list = synth.getVoices();
  if (list && list.length > 0) {
    voicesCache = list;
  }
  return voicesCache ?? list ?? [];
}

function ensureVoicesListener() {
  if (voicesLoadedListenerAttached) return;
  const synth = getSynth();
  if (!synth) return;
  // Cache voices ketika browser sudah selesai memuatnya.
  if ("onvoiceschanged" in synth) {
    synth.addEventListener?.("voiceschanged", () => {
      voicesCache = synth.getVoices();
    });
  }
  voicesLoadedListenerAttached = true;
}

function pickJapaneseVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (voices.length === 0) return null;
  const exact = voices.find((v) => v.lang === "ja-JP");
  if (exact) return exact;
  const startsWithJa = voices.find((v) =>
    v.lang?.toLowerCase().startsWith("ja")
  );
  return startsWithJa ?? null;
}

export function isSpeaking(): boolean {
  const synth = getSynth();
  return Boolean(synth?.speaking);
}

export function cancelSpeak(): void {
  const synth = getSynth();
  if (!synth) return;
  synth.cancel();
}

export function speakJa(text: string, opts: SpeakOptions = {}): void {
  if (!isTTSSupported()) return;
  const trimmed = text?.trim();
  if (!trimmed) return;
  const synth = getSynth();
  if (!synth) return;
  ensureVoicesListener();

  // Selalu batalkan utterance sebelumnya supaya tidak menumpuk.
  synth.cancel();

  const utter = new SpeechSynthesisUtterance(trimmed);
  utter.lang = "ja-JP";
  utter.rate = opts.rate ?? 0.95;
  utter.pitch = opts.pitch ?? 1;
  const voice = pickJapaneseVoice();
  if (voice) utter.voice = voice;
  if (opts.onEnd) utter.onend = () => opts.onEnd?.();
  if (opts.onError) utter.onerror = (e) => opts.onError?.(e);

  synth.speak(utter);
}
