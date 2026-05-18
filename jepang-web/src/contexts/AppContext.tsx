import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadJSON, saveJSON, STORAGE_KEYS } from "../lib/storage";
import { TOTAL_WORDS } from "../data/vocab";

export type TestKind = "mc" | "typing" | "sentence";

export interface TestRun {
  id: string;
  kind: TestKind;
  variant: string;
  startedAt: number;
  finishedAt: number;
  total: number;
  correct: number;
  timePerQuestionSec: number;
  avgAnswerMs: number;
  pages: string[];
  level?: number;
}

export interface NoteEntry {
  id: string;
  date: string; // ISO YYYY-MM-DD
  createdAt: number;
  title: string;
  body: string;
}

export interface AppState {
  memorized: Record<string, true>;
  history: TestRun[];
  notes: NoteEntry[];
}

interface AppContextValue extends AppState {
  totalWords: number;
  toggleMemorized: (globalId: string) => void;
  setMemorized: (globalId: string, value: boolean) => void;
  isMemorized: (globalId: string) => boolean;
  addRun: (run: TestRun) => void;
  clearHistory: () => void;
  addNote: (n: Omit<NoteEntry, "id" | "createdAt">) => void;
  updateNote: (id: string, patch: Partial<NoteEntry>) => void;
  deleteNote: (id: string) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [memorized, setMemorizedState] = useState<Record<string, true>>(() =>
    loadJSON<Record<string, true>>(STORAGE_KEYS.memorized, {})
  );
  const [history, setHistory] = useState<TestRun[]>(() =>
    loadJSON<TestRun[]>(STORAGE_KEYS.history, [])
  );
  const [notes, setNotes] = useState<NoteEntry[]>(() =>
    loadJSON<NoteEntry[]>(STORAGE_KEYS.notes, [])
  );

  useEffect(() => {
    saveJSON(STORAGE_KEYS.memorized, memorized);
  }, [memorized]);
  useEffect(() => {
    saveJSON(STORAGE_KEYS.history, history);
  }, [history]);
  useEffect(() => {
    saveJSON(STORAGE_KEYS.notes, notes);
  }, [notes]);

  const toggleMemorized = useCallback((globalId: string) => {
    setMemorizedState((prev) => {
      const next = { ...prev };
      if (next[globalId]) delete next[globalId];
      else next[globalId] = true;
      return next;
    });
  }, []);

  const setMemorized = useCallback((globalId: string, value: boolean) => {
    setMemorizedState((prev) => {
      const next = { ...prev };
      if (value) next[globalId] = true;
      else delete next[globalId];
      return next;
    });
  }, []);

  const isMemorized = useCallback(
    (globalId: string) => Boolean(memorized[globalId]),
    [memorized]
  );

  const addRun = useCallback((run: TestRun) => {
    setHistory((prev) => [run, ...prev].slice(0, 200));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const addNote = useCallback((n: Omit<NoteEntry, "id" | "createdAt">) => {
    setNotes((prev) => [
      {
        ...n,
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const updateNote = useCallback(
    (id: string, patch: Partial<NoteEntry>) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
    },
    []
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const resetAll = useCallback(() => {
    setMemorizedState({});
    setHistory([]);
    setNotes([]);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      memorized,
      history,
      notes,
      totalWords: TOTAL_WORDS,
      toggleMemorized,
      setMemorized,
      isMemorized,
      addRun,
      clearHistory,
      addNote,
      updateNote,
      deleteNote,
      resetAll,
    }),
    [
      memorized,
      history,
      notes,
      toggleMemorized,
      setMemorized,
      isMemorized,
      addRun,
      clearHistory,
      addNote,
      updateNote,
      deleteNote,
      resetAll,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
