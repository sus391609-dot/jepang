// Smoke test ringan untuk src/lib/conjugate.ts.
// Jalankan: `node --experimental-strip-types scripts/test-conjugate.mjs`
//
// Memanfaatkan fitur "type stripping" Node ≥ 22.6 sehingga tidak perlu
// dependency tambahan seperti tsx/ts-node.

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const { conjugate, conjugateAccepted, isConjugationCorrect, CONJUGATION_FORMS } =
  await import(join(ROOT, "src/lib/conjugate.ts"));
const { VERBS, verbByDict } = await import(join(ROOT, "src/data/verbs.ts"));

const tests = [
  // 食べる (ichidan)
  ["食べる", "masu", "食べます"],
  ["食べる", "masu-negatif", "食べません"],
  ["食べる", "masu-lampau", "食べました"],
  ["食べる", "masu-lampau-negatif", "食べませんでした"],
  ["食べる", "te", "食べて"],
  ["食べる", "ta", "食べた"],
  ["食べる", "nai", "食べない"],
  ["食べる", "nakatta", "食べなかった"],
  ["食べる", "potensial", "食べられる"],
  ["食べる", "pasif", "食べられる"],
  ["食べる", "kausatif", "食べさせる"],
  ["食べる", "kausatif-pasif", "食べさせられる"],
  ["食べる", "perintah", "食べろ"],
  ["食べる", "larangan", "食べるな"],
  ["食べる", "volisional", "食べよう"],
  ["食べる", "kondisional-ba", "食べれば"],
  ["食べる", "kondisional-tara", "食べたら"],

  // 行く (godan-ku, irregular te/ta)
  ["行く", "masu", "行きます"],
  ["行く", "te", "行って"],
  ["行く", "ta", "行った"],
  ["行く", "nai", "行かない"],
  ["行く", "potensial", "行ける"],
  ["行く", "pasif", "行かれる"],
  ["行く", "kausatif", "行かせる"],
  ["行く", "kausatif-pasif", "行かせられる"],
  ["行く", "perintah", "行け"],
  ["行く", "volisional", "行こう"],
  ["行く", "kondisional-ba", "行けば"],
  ["行く", "kondisional-tara", "行ったら"],

  // 書く (godan-ku normal)
  ["書く", "te", "書いて"],
  ["書く", "ta", "書いた"],

  // 飲む (godan-mu)
  ["飲む", "te", "飲んで"],
  ["飲む", "nai", "飲まない"],
  ["飲む", "potensial", "飲める"],
  ["飲む", "volisional", "飲もう"],

  // 買う (godan-u)
  ["買う", "te", "買って"],
  ["買う", "nai", "買わない"],
  ["買う", "potensial", "買える"],
  ["買う", "kausatif", "買わせる"],

  // 話す (godan-su)
  ["話す", "te", "話して"],
  ["話す", "ta", "話した"],
  ["話す", "kausatif-pasif", "話させられる"],

  // 遊ぶ / 死ぬ / 待つ / 泳ぐ
  ["遊ぶ", "te", "遊んで"],
  ["死ぬ", "te", "死んで"],
  ["待つ", "te", "待って"],
  ["待つ", "volisional", "待とう"],
  ["泳ぐ", "te", "泳いで"],

  // 帰る (godan-ru — looks ichidan tapi sebenarnya godan)
  ["帰る", "te", "帰って"],
  ["帰る", "nai", "帰らない"],

  // する
  ["する", "masu", "します"],
  ["する", "te", "して"],
  ["する", "nai", "しない"],
  ["する", "potensial", "できる"],
  ["する", "pasif", "される"],
  ["する", "kausatif", "させる"],
  ["する", "kausatif-pasif", "させられる"],
  ["する", "perintah", "しろ"],
  ["する", "volisional", "しよう"],
  ["する", "kondisional-ba", "すれば"],
  ["する", "kondisional-tara", "したら"],

  // 来る
  ["来る", "masu", "来ます"],
  ["来る", "te", "来て"],
  ["来る", "nai", "来ない"],
  ["来る", "potensial", "来られる"],
  ["来る", "kausatif", "来させる"],
  ["来る", "perintah", "来い"],
  ["来る", "volisional", "来よう"],
  ["来る", "kondisional-ba", "来れば"],
  ["来る", "kondisional-tara", "来たら"],
];

let pass = 0;
let fail = 0;
for (const [dict, form, expected] of tests) {
  const v = verbByDict(dict);
  if (!v) {
    console.error(`MISSING VERB: ${dict}`);
    fail++;
    continue;
  }
  const got = conjugate(v, form);
  if (got === expected) {
    pass++;
  } else {
    fail++;
    console.error(
      `FAIL ${dict} ${form}: expected "${expected}", got "${got}" (accepted: ${conjugateAccepted(v, form).join(", ")})`
    );
  }
}

// Accept-multi tests
const acceptCases = [
  ["食べる", "perintah", "食べよ", true],
  ["食べる", "potensial", "食べれる", true],
  ["食べる", "volisional", "食べましょう", true],
  ["行く", "kausatif-pasif", "行かされる", true],
  ["話す", "kausatif-pasif", "話さされる", false],
  ["来る", "te", "きて", true],
  ["する", "perintah", "せよ", true],
];

for (const [dict, form, input, expected] of acceptCases) {
  const v = verbByDict(dict);
  const ok = isConjugationCorrect(v, form, input);
  if (ok === expected) {
    pass++;
  } else {
    fail++;
    console.error(
      `FAIL accept ${dict} ${form} "${input}": expected ${expected}, got ${ok} (accepted: ${conjugateAccepted(v, form).join(", ")})`
    );
  }
}

// Bulk: setiap verba × setiap bentuk harus menghasilkan string non-kosong.
let bulkErr = 0;
for (const v of VERBS) {
  for (const f of CONJUGATION_FORMS) {
    try {
      const s = conjugate(v, f);
      if (typeof s !== "string" || s.length === 0) {
        bulkErr++;
        console.error(`BULK empty: ${v.dict} ${f}`);
      }
    } catch (e) {
      bulkErr++;
      console.error(`BULK throw ${v.dict} ${f}: ${e.message}`);
    }
  }
}
if (bulkErr === 0) {
  console.log(
    `bulk: ${VERBS.length} verbs × ${CONJUGATION_FORMS.length} forms = ${VERBS.length * CONJUGATION_FORMS.length} OK`
  );
} else {
  fail += bulkErr;
}

console.log(`\n${pass} pass, ${fail} fail`);
if (fail > 0) process.exit(1);
