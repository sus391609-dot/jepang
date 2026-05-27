// Helper untuk membangun pool soal Goi (kosakata) dari data vocab N4.
// 4 format ala JLPT: pilih bacaan kanji, pilih kanji untuk romaji, sinonim
// sederhana, dan pemakaian sederhana.

import { VOCAB_SECTIONS, type VocabItem } from "../data/vocab";
import { shuffle } from "./shuffle";

export type GoiVariant = "reading" | "kanji" | "synonym" | "usage";

export interface GoiQuestion {
  id: string;
  variant: GoiVariant;
  prompt: string;
  subPrompt?: string;
  options: string[];
  correctIndex: number;
  source: VocabItem;
}

const VALID_KANJI_RE = /[\u4E00-\u9FFF]/;

function isHiraganaOnly(s: string): boolean {
  return /^[\u3040-\u309F\u30A0-\u30FFー、。 ]+$/.test(s);
}

function hasKanji(s: string): boolean {
  return VALID_KANJI_RE.test(s);
}

// Filter pool kosakata yang cocok untuk soal Goi:
// - kanji (japanese) tidak kosong
// - arti tidak kosong dan tidak terlalu panjang
function buildPool(): VocabItem[] {
  const pool: VocabItem[] = [];
  const seen = new Set<string>();
  for (const sec of VOCAB_SECTIONS) {
    for (const page of sec.pages) {
      for (const it of page.items) {
        if (!it.kanji || !it.arti || !it.romaji) continue;
        if (it.arti.length > 60) continue;
        if (seen.has(it.kanji)) continue;
        seen.add(it.kanji);
        pool.push(it);
      }
    }
  }
  return pool;
}

const POOL = buildPool();

function pickDistractors(
  correct: VocabItem,
  pool: VocabItem[],
  field: "arti" | "romaji" | "kanji",
  n = 3
): string[] {
  const out: string[] = [];
  const taken = new Set<string>([correct[field]]);
  const shuffled = shuffle(pool);
  for (const it of shuffled) {
    const v = it[field];
    if (!v || taken.has(v)) continue;
    out.push(v);
    taken.add(v);
    if (out.length >= n) break;
  }
  return out;
}

function makeReadingQ(item: VocabItem): GoiQuestion | null {
  // Bacaan kanji: prompt kanji, opsi 4 romaji.
  if (!hasKanji(item.kanji)) return null;
  const distractors = pickDistractors(item, POOL, "romaji", 3);
  if (distractors.length < 3) return null;
  const options = shuffle([item.romaji, ...distractors]);
  return {
    id: `goi-r-${item.kanji}`,
    variant: "reading",
    prompt: "Pilih bacaan (romaji) yang benar:",
    subPrompt: item.kanji,
    options,
    correctIndex: options.indexOf(item.romaji),
    source: item,
  };
}

function makeKanjiQ(item: VocabItem): GoiQuestion | null {
  if (!hasKanji(item.kanji)) return null;
  const distractors: string[] = [];
  const taken = new Set<string>([item.kanji]);
  const shuffled = shuffle(POOL);
  for (const it of shuffled) {
    if (!hasKanji(it.kanji) || taken.has(it.kanji)) continue;
    distractors.push(it.kanji);
    taken.add(it.kanji);
    if (distractors.length >= 3) break;
  }
  if (distractors.length < 3) return null;
  const options = shuffle([item.kanji, ...distractors]);
  return {
    id: `goi-k-${item.kanji}`,
    variant: "kanji",
    prompt: "Pilih kanji yang sesuai untuk bacaan ini:",
    subPrompt: item.romaji,
    options,
    correctIndex: options.indexOf(item.kanji),
    source: item,
  };
}

function makeSynonymQ(item: VocabItem): GoiQuestion | null {
  // Pilih arti (B.Indo) yang paling tepat untuk kata Jepang.
  const distractors = pickDistractors(item, POOL, "arti", 3);
  if (distractors.length < 3) return null;
  const options = shuffle([item.arti, ...distractors]);
  return {
    id: `goi-s-${item.kanji}`,
    variant: "synonym",
    prompt: "Pilih arti yang paling tepat:",
    subPrompt: `${item.kanji}${isHiraganaOnly(item.kanji) ? "" : ` (${item.romaji})`}`,
    options,
    correctIndex: options.indexOf(item.arti),
    source: item,
  };
}

function makeUsageQ(item: VocabItem): GoiQuestion | null {
  // Pilih kata Jepang yang paling tepat untuk arti yang diberikan.
  const distractors: string[] = [];
  const taken = new Set<string>([item.kanji]);
  const shuffled = shuffle(POOL);
  for (const it of shuffled) {
    if (taken.has(it.kanji)) continue;
    distractors.push(it.kanji);
    taken.add(it.kanji);
    if (distractors.length >= 3) break;
  }
  if (distractors.length < 3) return null;
  const options = shuffle([item.kanji, ...distractors]);
  return {
    id: `goi-u-${item.kanji}`,
    variant: "usage",
    prompt: "Pilih kata Jepang yang paling tepat:",
    subPrompt: `Arti: ${item.arti}`,
    options,
    correctIndex: options.indexOf(item.kanji),
    source: item,
  };
}

const MAKERS: Record<
  GoiVariant,
  (item: VocabItem) => GoiQuestion | null
> = {
  reading: makeReadingQ,
  kanji: makeKanjiQ,
  synonym: makeSynonymQ,
  usage: makeUsageQ,
};

const VARIANTS: GoiVariant[] = ["reading", "kanji", "synonym", "usage"];

/**
 * Bangun n soal Goi dari pool vocab. Mencampur 4 format JLPT secara round-robin.
 */
export function buildGoiQuestions(n: number): GoiQuestion[] {
  const out: GoiQuestion[] = [];
  const items = shuffle(POOL);
  let vi = 0;
  let attempts = 0;
  while (out.length < n && attempts < items.length * 2) {
    attempts++;
    const item = items[vi % items.length];
    vi++;
    const variant = VARIANTS[out.length % VARIANTS.length];
    const q = MAKERS[variant](item);
    if (q) out.push(q);
  }
  return out;
}

export const GOI_POOL_SIZE = POOL.length;
