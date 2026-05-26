// Pure functions to conjugate Japanese verbs (N4-level coverage).
//
// Verbs are stored in `src/data/verbs.ts` with their group (ichidan, godan-*,
// irregular). This module only does string manipulation based on the
// declared group — it does NOT auto-detect ichidan vs godan.

import type { Verb, VerbGroup } from "../data/verbs";

export type ConjugationForm =
  | "masu"
  | "masu-negatif"
  | "masu-lampau"
  | "masu-lampau-negatif"
  | "te"
  | "ta"
  | "nai"
  | "nakatta"
  | "potensial"
  | "pasif"
  | "kausatif"
  | "kausatif-pasif"
  | "perintah"
  | "larangan"
  | "volisional"
  | "kondisional-ba"
  | "kondisional-tara";

export const CONJUGATION_FORMS: ConjugationForm[] = [
  "masu",
  "masu-negatif",
  "masu-lampau",
  "masu-lampau-negatif",
  "te",
  "ta",
  "nai",
  "nakatta",
  "potensial",
  "pasif",
  "kausatif",
  "kausatif-pasif",
  "perintah",
  "larangan",
  "volisional",
  "kondisional-ba",
  "kondisional-tara",
];

export const FORM_LABELS: Record<ConjugationForm, string> = {
  masu: "Bentuk ます (sopan)",
  "masu-negatif": "Bentuk ません (sopan negatif)",
  "masu-lampau": "Bentuk ました (sopan lampau)",
  "masu-lampau-negatif": "Bentuk ませんでした (sopan lampau negatif)",
  te: "Bentuk て",
  ta: "Bentuk た (lampau biasa)",
  nai: "Bentuk ない (negatif biasa)",
  nakatta: "Bentuk なかった (negatif lampau biasa)",
  potensial: "Bentuk potensial (bisa ~)",
  pasif: "Bentuk pasif (di~)",
  kausatif: "Bentuk kausatif (menyuruh / membiarkan ~)",
  "kausatif-pasif": "Bentuk kausatif-pasif (dipaksa ~)",
  perintah: "Bentuk perintah (めいれい)",
  larangan: "Bentuk larangan (jangan ~)",
  volisional: "Bentuk volisional (mari kita ~)",
  "kondisional-ba": "Kondisional ば (kalau ~)",
  "kondisional-tara": "Kondisional たら (jika ~)",
};

export const FORM_SHORT_LABELS: Record<ConjugationForm, string> = {
  masu: "ます",
  "masu-negatif": "ません",
  "masu-lampau": "ました",
  "masu-lampau-negatif": "ませんでした",
  te: "て",
  ta: "た",
  nai: "ない",
  nakatta: "なかった",
  potensial: "potensial",
  pasif: "pasif",
  kausatif: "kausatif",
  "kausatif-pasif": "kausatif-pasif",
  perintah: "perintah",
  larangan: "larangan",
  volisional: "volisional",
  "kondisional-ba": "ば",
  "kondisional-tara": "たら",
};

// Map u-row ending → corresponding a/i/e/o-row char + te/ta suffix.
const GODAN_MAP: Record<
  string,
  { a: string; i: string; e: string; o: string; te: string; ta: string }
> = {
  う: { a: "わ", i: "い", e: "え", o: "お", te: "って", ta: "った" },
  く: { a: "か", i: "き", e: "け", o: "こ", te: "いて", ta: "いた" },
  ぐ: { a: "が", i: "ぎ", e: "げ", o: "ご", te: "いで", ta: "いだ" },
  す: { a: "さ", i: "し", e: "せ", o: "そ", te: "して", ta: "した" },
  つ: { a: "た", i: "ち", e: "て", o: "と", te: "って", ta: "った" },
  ぬ: { a: "な", i: "に", e: "ね", o: "の", te: "んで", ta: "んだ" },
  ぶ: { a: "ば", i: "び", e: "べ", o: "ぼ", te: "んで", ta: "んだ" },
  む: { a: "ま", i: "み", e: "め", o: "も", te: "んで", ta: "んだ" },
  る: { a: "ら", i: "り", e: "れ", o: "ろ", te: "って", ta: "った" },
};

// Map group → expected final hiragana char (used as a quick sanity check).
const GROUP_ENDING: Partial<Record<VerbGroup, string>> = {
  "godan-u": "う",
  "godan-ku": "く",
  "godan-gu": "ぐ",
  "godan-su": "す",
  "godan-tsu": "つ",
  "godan-nu": "ぬ",
  "godan-bu": "ぶ",
  "godan-mu": "む",
  "godan-ru": "る",
  ichidan: "る",
};

function stripLast(s: string): { head: string; last: string } {
  const last = s.slice(-1);
  const head = s.slice(0, -1);
  return { head, last };
}

function godanReplaceLast(verb: Verb, row: "a" | "i" | "e" | "o"): string {
  const { head, last } = stripLast(verb.dict);
  const map = GODAN_MAP[last];
  if (!map) throw new Error(`Bukan kata kerja godan: ${verb.dict}`);
  return head + map[row];
}

function godanTe(verb: Verb): string {
  // Special exception: 行く → 行って
  if (verb.dict === "行く" || verb.dict === "いく") {
    return verb.dict.slice(0, -1) + "って";
  }
  const { head, last } = stripLast(verb.dict);
  const map = GODAN_MAP[last];
  if (!map) throw new Error(`Bukan kata kerja godan: ${verb.dict}`);
  return head + map.te;
}

function godanTa(verb: Verb): string {
  if (verb.dict === "行く" || verb.dict === "いく") {
    return verb.dict.slice(0, -1) + "った";
  }
  const { head, last } = stripLast(verb.dict);
  const map = GODAN_MAP[last];
  if (!map) throw new Error(`Bukan kata kerja godan: ${verb.dict}`);
  return head + map.ta;
}

function ichidanStem(verb: Verb): string {
  // Remove trailing る
  if (!verb.dict.endsWith("る")) {
    throw new Error(`Kata kerja ichidan harus berakhir る: ${verb.dict}`);
  }
  return verb.dict.slice(0, -1);
}

// --- Irregular: する / 来る ----------------------------------------------

const SURU_TABLE: Record<ConjugationForm, string[]> = {
  masu: ["します"],
  "masu-negatif": ["しません"],
  "masu-lampau": ["しました"],
  "masu-lampau-negatif": ["しませんでした"],
  te: ["して"],
  ta: ["した"],
  nai: ["しない"],
  nakatta: ["しなかった"],
  potensial: ["できる"],
  pasif: ["される"],
  kausatif: ["させる"],
  "kausatif-pasif": ["させられる"],
  perintah: ["しろ", "せよ"],
  larangan: ["するな"],
  volisional: ["しよう"],
  "kondisional-ba": ["すれば"],
  "kondisional-tara": ["したら"],
};

const KURU_TABLE: Record<ConjugationForm, string[]> = {
  masu: ["来ます", "きます"],
  "masu-negatif": ["来ません", "きません"],
  "masu-lampau": ["来ました", "きました"],
  "masu-lampau-negatif": ["来ませんでした", "きませんでした"],
  te: ["来て", "きて"],
  ta: ["来た", "きた"],
  nai: ["来ない", "こない"],
  nakatta: ["来なかった", "こなかった"],
  potensial: ["来られる", "こられる"],
  pasif: ["来られる", "こられる"],
  kausatif: ["来させる", "こさせる"],
  "kausatif-pasif": ["来させられる", "こさせられる"],
  perintah: ["来い", "こい"],
  larangan: ["来るな", "くるな"],
  volisional: ["来よう", "こよう"],
  "kondisional-ba": ["来れば", "くれば"],
  "kondisional-tara": ["来たら", "きたら"],
};

// --- Main conjugation ----------------------------------------------------

/**
 * Return the primary (recommended) conjugation for a verb in a given form.
 */
export function conjugate(verb: Verb, form: ConjugationForm): string {
  return conjugateAccepted(verb, form)[0];
}

/**
 * Return all accepted answers for a given verb/form pair.
 * The first entry is the "canonical" / preferred answer (used for display).
 */
export function conjugateAccepted(verb: Verb, form: ConjugationForm): string[] {
  if (verb.group === "irregular") {
    if (verb.dict === "する") return [...SURU_TABLE[form]];
    if (verb.dict === "来る" || verb.dict === "くる")
      return [...KURU_TABLE[form]];
    throw new Error(`Kata kerja irregular tak dikenal: ${verb.dict}`);
  }

  // Light sanity check.
  const expectedEnd = GROUP_ENDING[verb.group];
  if (expectedEnd && !verb.dict.endsWith(expectedEnd)) {
    throw new Error(
      `Kata kerja "${verb.dict}" tidak diakhiri "${expectedEnd}" untuk grup ${verb.group}`
    );
  }

  if (verb.group === "ichidan") {
    return ichidanConjugate(verb, form);
  }
  return godanConjugate(verb, form);
}

function ichidanConjugate(verb: Verb, form: ConjugationForm): string[] {
  const stem = ichidanStem(verb);
  switch (form) {
    case "masu":
      return [stem + "ます"];
    case "masu-negatif":
      return [stem + "ません"];
    case "masu-lampau":
      return [stem + "ました"];
    case "masu-lampau-negatif":
      return [stem + "ませんでした"];
    case "te":
      return [stem + "て"];
    case "ta":
      return [stem + "た"];
    case "nai":
      return [stem + "ない"];
    case "nakatta":
      return [stem + "なかった"];
    case "potensial":
      return [stem + "られる", stem + "れる"]; // 食べられる / 食べれる (ra-nuki, informal but common)
    case "pasif":
      return [stem + "られる"];
    case "kausatif":
      return [stem + "させる"];
    case "kausatif-pasif":
      return [stem + "させられる"];
    case "perintah":
      return [stem + "ろ", stem + "よ"];
    case "larangan":
      return [verb.dict + "な"];
    case "volisional":
      return [stem + "よう", stem + "ましょう"];
    case "kondisional-ba":
      return [stem + "れば"];
    case "kondisional-tara":
      return [stem + "たら"];
  }
}

function godanConjugate(verb: Verb, form: ConjugationForm): string[] {
  switch (form) {
    case "masu":
      return [godanReplaceLast(verb, "i") + "ます"];
    case "masu-negatif":
      return [godanReplaceLast(verb, "i") + "ません"];
    case "masu-lampau":
      return [godanReplaceLast(verb, "i") + "ました"];
    case "masu-lampau-negatif":
      return [godanReplaceLast(verb, "i") + "ませんでした"];
    case "te":
      return [godanTe(verb)];
    case "ta":
      return [godanTa(verb)];
    case "nai":
      return [godanReplaceLast(verb, "a") + "ない"];
    case "nakatta":
      return [godanReplaceLast(verb, "a") + "なかった"];
    case "potensial":
      return [godanReplaceLast(verb, "e") + "る"];
    case "pasif":
      return [godanReplaceLast(verb, "a") + "れる"];
    case "kausatif":
      return [godanReplaceLast(verb, "a") + "せる"];
    case "kausatif-pasif": {
      // Two forms:
      //  Long: a-row + せられる (買う→買わせられる)
      //  Short: a-row + される  (買う→買わされる) — NOT allowed for -su godan
      const long = godanReplaceLast(verb, "a") + "せられる";
      if (verb.group === "godan-su") return [long];
      const short = godanReplaceLast(verb, "a") + "される";
      return [long, short];
    }
    case "perintah":
      return [godanReplaceLast(verb, "e")];
    case "larangan":
      return [verb.dict + "な"];
    case "volisional":
      return [
        godanReplaceLast(verb, "o") + "う",
        godanReplaceLast(verb, "i") + "ましょう",
      ];
    case "kondisional-ba":
      return [godanReplaceLast(verb, "e") + "ば"];
    case "kondisional-tara": {
      // Take ta-form and append ら.
      return [godanTa(verb) + "ら"];
    }
  }
}

// --- Validation helpers --------------------------------------------------

/** Normalize an input string for forgiving comparison. */
function normalize(s: string): string {
  return s.trim().replace(/\s+/g, "").replace(/[。、・]/g, "");
}

/**
 * Check whether the given input matches one of the accepted conjugations.
 */
export function isConjugationCorrect(
  verb: Verb,
  form: ConjugationForm,
  input: string
): boolean {
  const expected = conjugateAccepted(verb, form).map(normalize);
  const got = normalize(input);
  if (!got) return false;
  return expected.includes(got);
}
