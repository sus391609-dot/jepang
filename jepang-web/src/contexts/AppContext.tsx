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

export type TestKind =
  | "mc"
  | "typing"
  | "sentence"
  | "konjugasi"
  | "grammar"
  | "choukai"
  | "dokkai"
  | "jlpt";

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

export interface JLPTSectionResult {
  id: "goi" | "bunpou-dokkai" | "choukai";
  label: string;
  total: number;
  correct: number;
  score: number; // skala 0-60 (3 seksi × 60 = 180)
  durationSec: number;
  autoSubmitted: boolean;
}

export interface JLPTRun {
  id: string;
  startedAt: number;
  finishedAt: number;
  sections: JLPTSectionResult[];
  totalScore: number; // 0-180
  passed: boolean;
  passReason: string;
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
  conjugationRuns: TestRun[];
  grammarRuns: TestRun[];
  choukaiRuns: TestRun[];
  dokkaiRuns: TestRun[];
  jlptRuns: JLPTRun[];
}

interface AppContextValue extends AppState {
  totalWords: number;
  toggleMemorized: (globalId: string) => void;
  setMemorized: (globalId: string, value: boolean) => void;
  isMemorized: (globalId: string) => boolean;
  addRun: (run: TestRun) => void;
  clearHistory: () => void;
  addConjugationRun: (run: TestRun) => void;
  addGrammarRun: (run: TestRun) => void;
  addChoukaiRun: (run: TestRun) => void;
  addDokkaiRun: (run: TestRun) => void;
  addJLPTRun: (run: JLPTRun) => void;
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
  const [conjugationRuns, setConjugationRuns] = useState<TestRun[]>(() =>
    loadJSON<TestRun[]>(STORAGE_KEYS.conjugationRuns, [])
  );
  const [grammarRuns, setGrammarRuns] = useState<TestRun[]>(() =>
    loadJSON<TestRun[]>(STORAGE_KEYS.grammarRuns, [])
  );
  const [choukaiRuns, setChoukaiRuns] = useState<TestRun[]>(() =>
    loadJSON<TestRun[]>("jepang:choukai:runs", [])
  );
  const [dokkaiRuns, setDokkaiRuns] = useState<TestRun[]>(() =>
    loadJSON<TestRun[]>("jepang:dokkai:runs", [])
  );
  const [jlptRuns, setJLPTRuns] = useState<JLPTRun[]>(() =>
    loadJSON<JLPTRun[]>(STORAGE_KEYS.jlptRuns, [])
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
  useEffect(() => {
    saveJSON(STORAGE_KEYS.conjugationRuns, conjugationRuns);
  }, [conjugationRuns]);
  useEffect(() => {
    saveJSON(STORAGE_KEYS.grammarRuns, grammarRuns);
  }, [grammarRuns]);
  useEffect(() => {
    saveJSON("jepang:choukai:runs", choukaiRuns);
  }, [choukaiRuns]);
  useEffect(() => {
    saveJSON("jepang:dokkai:runs", dokkaiRuns);
  }, [dokkaiRuns]);
  useEffect(() => {
    saveJSON(STORAGE_KEYS.jlptRuns, jlptRuns);
  }, [jlptRuns]);

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

  const addConjugationRun = useCallback((run: TestRun) => {
    setConjugationRuns((prev) => [run, ...prev].slice(0, 200));
    setHistory((prev) => [run, ...prev].slice(0, 200));
  }, []);

  const addGrammarRun = useCallback((run: TestRun) => {
    setGrammarRuns((prev) => [run, ...prev].slice(0, 200));
    setHistory((prev) => [run, ...prev].slice(0, 200));
  }, []);

  const addChoukaiRun = useCallback((run: TestRun) => {
    setChoukaiRuns((prev) => [run, ...prev].slice(0, 200));
    setHistory((prev) => [run, ...prev].slice(0, 200));
  }, []);

  const addDokkaiRun = useCallback((run: TestRun) => {
    setDokkaiRuns((prev) => [run, ...prev].slice(0, 200));
    setHistory((prev) => [run, ...prev].slice(0, 200));
  }, []);

  const addJLPTRun = useCallback((run: JLPTRun) => {
    setJLPTRuns((prev) => [run, ...prev].slice(0, 100));
    const totalQuestions = run.sections.reduce((a, s) => a + s.total, 0);
    const totalCorrect = run.sections.reduce((a, s) => a + s.correct, 0);
    const durationSec = Math.max(1, Math.round((run.finishedAt - run.startedAt) / 1000));
    const summary: TestRun = {
      id: run.id,
      kind: "jlpt",
      variant: run.passed ? "LULUS" : "TIDAK LULUS",
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
      total: totalQuestions,
      correct: totalCorrect,
      timePerQuestionSec: Math.round(durationSec / Math.max(1, totalQuestions)),
      avgAnswerMs: Math.round((durationSec * 1000) / Math.max(1, totalQuestions)),
      pages: [`${run.totalScore}/180`],
    };
    setHistory((prev) => [summary, ...prev].slice(0, 200));
  }, []);

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
    setConjugationRuns([]);
    setGrammarRuns([]);
    setChoukaiRuns([]);
    setDokkaiRuns([]);
    setJLPTRuns([]);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      memorized,
      history,
      notes,
      conjugationRuns,
      grammarRuns,
      choukaiRuns,
      dokkaiRuns,
      jlptRuns,
      totalWords: TOTAL_WORDS,
      toggleMemorized,
      setMemorized,
      isMemorized,
      addRun,
      clearHistory,
      addConjugationRun,
      addGrammarRun,
      addChoukaiRun,
      addDokkaiRun,
      addJLPTRun,
      addNote,
      updateNote,
      deleteNote,
      resetAll,
    }),
    [
      memorized,
      history,
      notes,
      conjugationRuns,
      grammarRuns,
      choukaiRuns,
      dokkaiRuns,
      jlptRuns,
      toggleMemorized,
      setMemorized,
      isMemorized,
      addRun,
      clearHistory,
      addConjugationRun,
      addGrammarRun,
      addChoukaiRun,
      addDokkaiRun,
      addJLPTRun,
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
