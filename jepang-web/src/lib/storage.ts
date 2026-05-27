// Lightweight localStorage helpers with JSON encoding & SSR safety.

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export const STORAGE_KEYS = {
  memorized: "jp:memorized",
  history: "jp:history",
  notes: "jp:notes",
  settings: "jp:settings",
  conjugationRuns: "jepang:konjugasi:runs",
  grammarRuns: "jepang:tatabahasa:runs",
  jlptRuns: "jepang:jlpt:runs",
} as const;
