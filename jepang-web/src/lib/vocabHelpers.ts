import { ALL_WORDS, FlatVocabItem, getPage } from "../data/vocab";

export function wordsFromPages(pageKeys: Set<string>): FlatVocabItem[] {
  const result: FlatVocabItem[] = [];
  for (const key of pageKeys) {
    const [sectionId, pageIdxStr] = key.split("#");
    const pageIdx = Number(pageIdxStr);
    const page = getPage(sectionId, pageIdx);
    if (!page) continue;
    page.items.forEach((item, itemIndex) => {
      result.push({
        ...item,
        sectionId,
        pageIndex: pageIdx,
        itemIndex,
        globalId: `${sectionId}-${pageIdx}-${itemIndex}`,
      });
    });
  }
  return result;
}

export function distractorsForArti(
  correct: FlatVocabItem,
  pool: FlatVocabItem[],
  count: number
): string[] {
  const taken = new Set<string>([correct.arti]);
  const filtered = pool.filter((w) => w.arti !== correct.arti);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  const out: string[] = [];
  for (const w of shuffled) {
    if (taken.has(w.arti)) continue;
    taken.add(w.arti);
    out.push(w.arti);
    if (out.length >= count) break;
  }
  // Fallback to ALL_WORDS if not enough
  if (out.length < count) {
    const more = ALL_WORDS.filter((w) => !taken.has(w.arti));
    for (const w of more) {
      out.push(w.arti);
      taken.add(w.arti);
      if (out.length >= count) break;
    }
  }
  return out;
}

export function distractorsForKanji(
  correct: FlatVocabItem,
  pool: FlatVocabItem[],
  count: number
): string[] {
  const taken = new Set<string>([correct.kanji]);
  const filtered = pool.filter((w) => w.kanji !== correct.kanji);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  const out: string[] = [];
  for (const w of shuffled) {
    if (taken.has(w.kanji)) continue;
    taken.add(w.kanji);
    out.push(w.kanji);
    if (out.length >= count) break;
  }
  if (out.length < count) {
    const more = ALL_WORDS.filter((w) => !taken.has(w.kanji));
    for (const w of more) {
      out.push(w.kanji);
      taken.add(w.kanji);
      if (out.length >= count) break;
    }
  }
  return out;
}

export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:"'`’]/g, "")
    .replace(/[\u3000\u3001\u3002]/g, "");
}

export function isAnswerCorrect(input: string, target: string): boolean {
  const n1 = normalizeAnswer(input);
  const n2 = normalizeAnswer(target);
  if (n1 === n2) return true;
  // Accept alternates separated by "/"
  const alts = n2.split(/\s*[/,]\s*/);
  if (alts.some((a) => a === n1)) return true;
  return false;
}
