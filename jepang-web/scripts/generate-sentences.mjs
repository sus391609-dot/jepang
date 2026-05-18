#!/usr/bin/env node
// Generate a large pool of sentence-arrangement items using templates and
// curated vocab pools. Output: src/data/generatedSentences.ts
//
// Run: node scripts/generate-sentences.mjs
//
// The generator picks slots from each template's pool to produce
// grammatically reasonable Japanese sentences. The same vocab pools are
// also used to compute `vocabKanji` per sentence so they participate
// in the "filter by available vocab" logic in the test page.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUT_PATH = join(__dirname, "..", "src", "data", "generatedSentences.ts");

// ---------- VOCAB POOLS ----------
// Each item: [kanji, romaji, arti]. The kanji string also acts as the
// vocab identifier (matches the kanji field in vocab.ts).

/** @type {Array<[string,string,string]>} */
const PERSON = [
  ["私", "watashi", "saya"],
  ["あなた", "anata", "kamu"],
  ["田中さん", "tanaka san", "Tanaka"],
  ["山田さん", "yamada san", "Yamada"],
  ["先生", "sensei", "guru"],
  ["父", "chichi", "ayah"],
  ["母", "haha", "ibu"],
  ["兄", "ani", "kakak laki-laki"],
  ["姉", "ane", "kakak perempuan"],
  ["弟", "otouto", "adik laki-laki"],
  ["妹", "imouto", "adik perempuan"],
  ["友達", "tomodachi", "teman"],
  ["学生", "gakusei", "siswa"],
  ["子供", "kodomo", "anak"],
];

const FOOD = [
  ["パン", "pan", "roti"],
  ["ご飯", "gohan", "nasi"],
  ["寿司", "sushi", "sushi"],
  ["ラーメン", "raamen", "ramen"],
  ["うどん", "udon", "udon"],
  ["カレー", "karee", "kari"],
  ["サラダ", "sarada", "salad"],
  ["りんご", "ringo", "apel"],
  ["バナナ", "banana", "pisang"],
  ["卵", "tamago", "telur"],
  ["肉", "niku", "daging"],
  ["魚", "sakana", "ikan"],
  ["果物", "kudamono", "buah"],
  ["野菜", "yasai", "sayuran"],
  ["お菓子", "okashi", "kue/manisan"],
  ["朝ご飯", "asagohan", "sarapan"],
  ["昼ご飯", "hirugohan", "makan siang"],
  ["晩ご飯", "bangohan", "makan malam"],
];

const DRINK = [
  ["水", "mizu", "air"],
  ["お茶", "ocha", "teh"],
  ["コーヒー", "koohii", "kopi"],
  ["ジュース", "juusu", "jus"],
  ["牛乳", "gyuunyuu", "susu"],
  ["ビール", "biiru", "bir"],
  ["お酒", "osake", "minuman beralkohol"],
  ["ワイン", "wain", "anggur"],
];

const PLACE = [
  ["学校", "gakkou", "sekolah"],
  ["家", "ie", "rumah"],
  ["駅", "eki", "stasiun"],
  ["図書館", "toshokan", "perpustakaan"],
  ["公園", "kouen", "taman"],
  ["病院", "byouin", "rumah sakit"],
  ["銀行", "ginkou", "bank"],
  ["スーパー", "suupaa", "supermarket"],
  ["デパート", "depaato", "department store"],
  ["レストラン", "resutoran", "restoran"],
  ["カフェ", "kafe", "kafe"],
  ["会社", "kaisha", "perusahaan"],
  ["大学", "daigaku", "universitas"],
  ["教室", "kyoushitsu", "ruang kelas"],
  ["駐車場", "chuushajou", "tempat parkir"],
  ["映画館", "eigakan", "bioskop"],
  ["店", "mise", "toko"],
  ["事務所", "jimusho", "kantor"],
  ["空港", "kuukou", "bandara"],
  ["ホテル", "hoteru", "hotel"],
  ["郵便局", "yuubinkyoku", "kantor pos"],
];

const TIME = [
  ["今日", "kyou", "hari ini"],
  ["明日", "ashita", "besok"],
  ["昨日", "kinou", "kemarin"],
  ["毎日", "mainichi", "setiap hari"],
  ["毎朝", "maiasa", "setiap pagi"],
  ["毎晩", "maiban", "setiap malam"],
  ["今週", "konshuu", "minggu ini"],
  ["来週", "raishuu", "minggu depan"],
  ["先週", "senshuu", "minggu lalu"],
  ["今月", "kongetsu", "bulan ini"],
  ["来月", "raigetsu", "bulan depan"],
  ["先月", "sengetsu", "bulan lalu"],
  ["今年", "kotoshi", "tahun ini"],
  ["来年", "rainen", "tahun depan"],
  ["去年", "kyonen", "tahun lalu"],
];

const PERIOD_DAY = [
  ["朝", "asa", "pagi"],
  ["昼", "hiru", "siang"],
  ["夜", "yoru", "malam"],
  ["夕方", "yuugata", "sore"],
];

const VEHICLE = [
  ["車", "kuruma", "mobil"],
  ["バス", "basu", "bus"],
  ["電車", "densha", "kereta"],
  ["飛行機", "hikouki", "pesawat"],
  ["自転車", "jitensha", "sepeda"],
  ["タクシー", "takushii", "taksi"],
  ["地下鉄", "chikatetsu", "kereta bawah tanah"],
  ["船", "fune", "kapal"],
];

const I_ADJ = [
  ["大きい", "ookii", "besar"],
  ["小さい", "chiisai", "kecil"],
  ["新しい", "atarashii", "baru"],
  ["古い", "furui", "lama"],
  ["高い", "takai", "tinggi / mahal"],
  ["安い", "yasui", "murah"],
  ["暑い", "atsui", "panas (cuaca)"],
  ["寒い", "samui", "dingin (cuaca)"],
  ["おいしい", "oishii", "enak"],
  ["楽しい", "tanoshii", "menyenangkan"],
  ["難しい", "muzukashii", "sulit"],
  ["易しい", "yasashii", "mudah"],
  ["面白い", "omoshiroi", "menarik"],
  ["忙しい", "isogashii", "sibuk"],
  ["広い", "hiroi", "luas"],
  ["狭い", "semai", "sempit"],
  ["長い", "nagai", "panjang"],
  ["短い", "mijikai", "pendek"],
];

const NA_ADJ = [
  ["きれい", "kirei", "cantik/bersih"],
  ["静か", "shizuka", "tenang"],
  ["元気", "genki", "sehat/energik"],
  ["親切", "shinsetsu", "ramah/baik hati"],
  ["便利", "benri", "praktis"],
  ["有名", "yuumei", "terkenal"],
  ["大切", "taisetsu", "penting"],
  ["大丈夫", "daijoubu", "tidak apa-apa"],
  ["好き", "suki", "suka"],
  ["上手", "jouzu", "mahir"],
  ["下手", "heta", "kurang mahir"],
];

const FOOD_VERB = [
  ["食べます", "tabemasu", "makan"],
  ["作ります", "tsukurimasu", "membuat"],
  ["買います", "kaimasu", "membeli"],
];

const DRINK_VERB = [
  ["飲みます", "nomimasu", "minum"],
  ["買います", "kaimasu", "membeli"],
];

const READ_VERB = [
  ["読みます", "yomimasu", "membaca"],
  ["買います", "kaimasu", "membeli"],
];

const WATCH_VERB = [
  ["見ます", "mimasu", "melihat"],
];

const HEAR_VERB = [
  ["聞きます", "kikimasu", "mendengar"],
];

const READABLE = [
  ["本", "hon", "buku"],
  ["新聞", "shinbun", "koran"],
  ["雑誌", "zasshi", "majalah"],
  ["手紙", "tegami", "surat"],
];

const WATCHABLE = [
  ["映画", "eiga", "film"],
  ["テレビ", "terebi", "televisi"],
  ["写真", "shashin", "foto"],
];

const HEARABLE = [
  ["音楽", "ongaku", "musik"],
  ["ラジオ", "rajio", "radio"],
];

const STUDY_SUBJECT = [
  ["日本語", "nihongo", "bahasa Jepang"],
  ["英語", "eigo", "bahasa Inggris"],
  ["中国語", "chuugokugo", "bahasa Mandarin"],
  ["韓国語", "kankokugo", "bahasa Korea"],
  ["数学", "suugaku", "matematika"],
  ["歴史", "rekishi", "sejarah"],
  ["科学", "kagaku", "sains"],
  ["音楽", "ongaku", "musik"],
];

const STUDY_VERB = [
  ["勉強します", "benkyou shimasu", "belajar"],
  ["教えます", "oshiemasu", "mengajar"],
  ["習います", "naraimasu", "mempelajari"],
];

// generic objects that can be bought / sold / used
const OBJECT = [
  ["かばん", "kaban", "tas"],
  ["かさ", "kasa", "payung"],
  ["時計", "tokei", "jam"],
  ["靴", "kutsu", "sepatu"],
  ["服", "fuku", "pakaian"],
  ["鞄", "kaban", "tas"],
  ["カメラ", "kamera", "kamera"],
  ["パソコン", "pasokon", "komputer"],
  ["スマホ", "sumaho", "smartphone"],
  ["電話", "denwa", "telepon"],
  ["机", "tsukue", "meja"],
  ["椅子", "isu", "kursi"],
  ["ペン", "pen", "pena"],
  ["鉛筆", "enpitsu", "pensil"],
  ["ノート", "nooto", "buku catatan"],
  ["プレゼント", "purezento", "hadiah"],
  ["お土産", "omiyage", "oleh-oleh"],
];

const MOTION_GO_VERB = [
  ["行きます", "ikimasu", "pergi"],
  ["帰ります", "kaerimasu", "pulang"],
  ["来ます", "kimasu", "datang"],
];

const COMMON_TVERB = [
  ["食べます", "tabemasu", "makan"],
  ["飲みます", "nomimasu", "minum"],
  ["読みます", "yomimasu", "membaca"],
  ["書きます", "kakimasu", "menulis"],
  ["見ます", "mimasu", "melihat"],
  ["聞きます", "kikimasu", "mendengar"],
  ["買います", "kaimasu", "membeli"],
  ["売ります", "urimasu", "menjual"],
  ["作ります", "tsukurimasu", "membuat"],
  ["使います", "tsukaimasu", "menggunakan"],
];

const PRE_QUANTITY = [
  ["少し", "sukoshi", "sedikit"],
  ["たくさん", "takusan", "banyak"],
];

const FEELING_ADV = [
  ["とても", "totemo", "sangat"],
  ["少し", "sukoshi", "sedikit"],
  ["あまり", "amari", "tidak begitu"],
  ["本当に", "hontou ni", "sungguh"],
];

const FREQUENCY = [
  ["いつも", "itsumo", "selalu"],
  ["よく", "yoku", "sering"],
  ["時々", "tokidoki", "kadang-kadang"],
  ["たまに", "tamani", "sesekali"],
];

const CONJ_REASON = [
  ["から", "kara", "karena"],
];

// ---------- HELPERS ----------

function cartesian(...arrays) {
  return arrays.reduce(
    (acc, cur) => acc.flatMap((a) => cur.map((b) => [...a, b])),
    [[]]
  );
}

/**
 * Take a list of arrays, pick all combinations, but cap the number of
 * combinations by limit. Picks deterministically (no random) so output
 * is stable across runs.
 */
function combinationsCapped(arrays, limit) {
  const all = cartesian(...arrays);
  if (all.length <= limit) return all;
  const step = all.length / limit;
  const out = [];
  for (let i = 0; i < limit; i++) {
    out.push(all[Math.floor(i * step)]);
  }
  return out;
}

const sentences = [];
const counters = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

function pushSentence({ level, arti, tokens, romajiTokens, vocabKanji }) {
  counters[level] += 1;
  const id = `G${level}-${String(counters[level]).padStart(4, "0")}`;
  sentences.push({
    id,
    level,
    arti,
    kanji: tokens.join(" "),
    romaji: romajiTokens.join(" "),
    tokens,
    romajiTokens,
    vocabKanji: Array.from(new Set(vocabKanji)),
  });
}

// ---------- LEVEL 1 (2-4 tokens) ----------

// {food} を 食べます
for (const [k, r, a] of FOOD) {
  pushSentence({
    level: 1,
    arti: `Saya makan ${a}.`,
    tokens: [k, "を", "食べます"],
    romajiTokens: [r, "wo", "tabemasu"],
    vocabKanji: [k, "食べます"],
  });
}

// {drink} を 飲みます
for (const [k, r, a] of DRINK) {
  pushSentence({
    level: 1,
    arti: `Saya minum ${a}.`,
    tokens: [k, "を", "飲みます"],
    romajiTokens: [r, "wo", "nomimasu"],
    vocabKanji: [k, "飲みます"],
  });
}

// {readable} を 読みます
for (const [k, r, a] of READABLE) {
  pushSentence({
    level: 1,
    arti: `Saya membaca ${a}.`,
    tokens: [k, "を", "読みます"],
    romajiTokens: [r, "wo", "yomimasu"],
    vocabKanji: [k, "読みます"],
  });
}

// {watchable} を 見ます
for (const [k, r, a] of WATCHABLE) {
  pushSentence({
    level: 1,
    arti: `Saya menonton ${a}.`,
    tokens: [k, "を", "見ます"],
    romajiTokens: [r, "wo", "mimasu"],
    vocabKanji: [k, "見ます"],
  });
}

// {hearable} を 聞きます
for (const [k, r, a] of HEARABLE) {
  pushSentence({
    level: 1,
    arti: `Saya mendengarkan ${a}.`,
    tokens: [k, "を", "聞きます"],
    romajiTokens: [r, "wo", "kikimasu"],
    vocabKanji: [k, "聞きます"],
  });
}

// {object} を 買います
for (const [k, r, a] of OBJECT) {
  pushSentence({
    level: 1,
    arti: `Saya membeli ${a}.`,
    tokens: [k, "を", "買います"],
    romajiTokens: [r, "wo", "kaimasu"],
    vocabKanji: [k, "買います"],
  });
}

// {place} に 行きます
for (const [k, r, a] of PLACE) {
  pushSentence({
    level: 1,
    arti: `Saya pergi ke ${a}.`,
    tokens: [k, "に", "行きます"],
    romajiTokens: [r, "ni", "ikimasu"],
    vocabKanji: [k, "行きます"],
  });
}

// {thing} は {i_adj} です
for (const [k, r, a] of [...OBJECT, ...FOOD, ...PLACE, ...VEHICLE]) {
  for (const [ak, ar, aa] of I_ADJ.slice(0, 6)) {
    pushSentence({
      level: 1,
      arti: `${a.charAt(0).toUpperCase() + a.slice(1)} itu ${aa}.`,
      tokens: [k, "は", ak, "です"],
      romajiTokens: [r, "wa", ar, "desu"],
      vocabKanji: [k, ak],
    });
  }
}

// {thing} は {na_adj} です
for (const [k, r, a] of [...PLACE, ...PERSON.slice(2, 8)]) {
  for (const [ak, ar, aa] of NA_ADJ.slice(0, 5)) {
    pushSentence({
      level: 1,
      arti: `${a.charAt(0).toUpperCase() + a.slice(1)} itu ${aa}.`,
      tokens: [k, "は", ak, "です"],
      romajiTokens: [r, "wa", ar, "desu"],
      vocabKanji: [k, ak],
    });
  }
}

// {time} は {i_adj} です
for (const [k, r, a] of TIME.slice(0, 3)) {
  for (const [ak, ar, aa] of I_ADJ.slice(6, 14)) {
    pushSentence({
      level: 1,
      arti: `${a.charAt(0).toUpperCase() + a.slice(1)} ${aa}.`,
      tokens: [k, "は", ak, "です"],
      romajiTokens: [r, "wa", ar, "desu"],
      vocabKanji: [k, ak],
    });
  }
}

// ---------- LEVEL 2 (4-5 tokens) ----------

// {person} は {food} を 食べます
for (const [pk, pr, pa] of PERSON.slice(0, 10)) {
  for (const [fk, fr, fa] of FOOD.slice(0, 10)) {
    pushSentence({
      level: 2,
      arti: `${pa.charAt(0).toUpperCase() + pa.slice(1)} makan ${fa}.`,
      tokens: [pk, "は", fk, "を", "食べます"],
      romajiTokens: [pr, "wa", fr, "wo", "tabemasu"],
      vocabKanji: [pk, fk, "食べます"],
    });
  }
}

// {person} は {drink} を 飲みます
for (const [pk, pr, pa] of PERSON.slice(0, 8)) {
  for (const [dk, dr, da] of DRINK) {
    pushSentence({
      level: 2,
      arti: `${pa.charAt(0).toUpperCase() + pa.slice(1)} minum ${da}.`,
      tokens: [pk, "は", dk, "を", "飲みます"],
      romajiTokens: [pr, "wa", dk === dr ? dr : dr, "wo", "nomimasu"],
      vocabKanji: [pk, dk, "飲みます"],
    });
  }
}

// {time} {tverb} を {verb}
for (const [tk, tr, ta] of TIME.slice(0, 6)) {
  for (const [fk, fr, fa] of FOOD.slice(0, 6)) {
    pushSentence({
      level: 2,
      arti: `${ta.charAt(0).toUpperCase() + ta.slice(1)} saya makan ${fa}.`,
      tokens: [tk, fk, "を", "食べます"],
      romajiTokens: [tr, fr, "wo", "tabemasu"],
      vocabKanji: [tk, fk, "食べます"],
    });
  }
}

// {place} で {object} を 買います
for (const [pk, pr, pa] of PLACE.slice(0, 8)) {
  for (const [ok, or_, oa] of OBJECT.slice(0, 8)) {
    pushSentence({
      level: 2,
      arti: `Saya membeli ${oa} di ${pa}.`,
      tokens: [pk, "で", ok, "を", "買います"],
      romajiTokens: [pr, "de", or_, "wo", "kaimasu"],
      vocabKanji: [pk, ok, "買います"],
    });
  }
}

// {vehicle} で {place} に 行きます
for (const [vk, vr, va] of VEHICLE) {
  for (const [pk, pr, pa] of PLACE.slice(0, 10)) {
    pushSentence({
      level: 2,
      arti: `Saya pergi ke ${pa} naik ${va}.`,
      tokens: [vk, "で", pk, "に", "行きます"],
      romajiTokens: [vr, "de", pr, "ni", "ikimasu"],
      vocabKanji: [vk, pk, "行きます"],
    });
  }
}

// {person} は {place} に 行きます
for (const [pek, per, pea] of PERSON.slice(0, 8)) {
  for (const [pk, pr, pa] of PLACE.slice(0, 8)) {
    pushSentence({
      level: 2,
      arti: `${pea.charAt(0).toUpperCase() + pea.slice(1)} pergi ke ${pa}.`,
      tokens: [pek, "は", pk, "に", "行きます"],
      romajiTokens: [per, "wa", pr, "ni", "ikimasu"],
      vocabKanji: [pek, pk, "行きます"],
    });
  }
}

// {study_subject} を 勉強します
for (const [sk, sr, sa] of STUDY_SUBJECT) {
  for (const [tk, tr, ta] of TIME.slice(0, 4)) {
    pushSentence({
      level: 2,
      arti: `${ta.charAt(0).toUpperCase() + ta.slice(1)} saya belajar ${sa}.`,
      tokens: [tk, sk, "を", "勉強します"],
      romajiTokens: [tr, sr, "wo", "benkyou", "shimasu"],
      vocabKanji: [tk, sk, "勉強します"],
    });
  }
}

// {readable} を {place} で 読みます
for (const [rk, rr, ra] of READABLE) {
  for (const [pk, pr, pa] of PLACE.slice(0, 6)) {
    pushSentence({
      level: 2,
      arti: `Saya membaca ${ra} di ${pa}.`,
      tokens: [pk, "で", rk, "を", "読みます"],
      romajiTokens: [pr, "de", rr, "wo", "yomimasu"],
      vocabKanji: [pk, rk, "読みます"],
    });
  }
}

// ---------- LEVEL 3 (5-7 tokens) ----------

// {time} {person} は {place} で {tverb}
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [pek, per, pea] of PERSON.slice(0, 6)) {
    for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `${ta.charAt(0).toUpperCase() + ta.slice(1)} ${pea} bekerja di ${pla}.`,
        tokens: [tk, pek, "は", plk, "で", "働きます"],
        romajiTokens: [tr, per, "wa", plr, "de", "hatarakimasu"],
        vocabKanji: [tk, pek, plk, "働きます"],
      });
    }
  }
}

// {person} は {time} {food} を 食べます
for (const [pek, per, pea] of PERSON.slice(0, 6)) {
  for (const [tk, tr, ta] of TIME.slice(0, 4)) {
    for (const [fk, fr, fa] of FOOD.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `${pea.charAt(0).toUpperCase() + pea.slice(1)} makan ${fa} ${ta}.`,
        tokens: [pek, "は", tk, fk, "を", "食べます"],
        romajiTokens: [per, "wa", tr, fr, "wo", "tabemasu"],
        vocabKanji: [pek, tk, fk, "食べます"],
      });
    }
  }
}

// {place} で {drink} を 飲みます
for (const [plk, plr, pla] of PLACE.slice(0, 8)) {
  for (const [dk, dr, da] of DRINK.slice(0, 6)) {
    for (const [pek, per, pea] of PERSON.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `${pea.charAt(0).toUpperCase() + pea.slice(1)} minum ${da} di ${pla}.`,
        tokens: [pek, "は", plk, "で", dk, "を", "飲みます"],
        romajiTokens: [per, "wa", plr, "de", dr, "wo", "nomimasu"],
        vocabKanji: [pek, plk, dk, "飲みます"],
      });
    }
  }
}

// {time} {vehicle} で {place} に 行きます
for (const [tk, tr, ta] of TIME.slice(0, 6)) {
  for (const [vk, vr, va] of VEHICLE.slice(0, 5)) {
    for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `${ta.charAt(0).toUpperCase() + ta.slice(1)} saya naik ${va} ke ${pla}.`,
        tokens: [tk, vk, "で", plk, "に", "行きます"],
        romajiTokens: [tr, vr, "de", plr, "ni", "ikimasu"],
        vocabKanji: [tk, vk, plk, "行きます"],
      });
    }
  }
}

// {feeling_adv} {i_adj} {noun} を 買います
for (const [adv_k, adv_r, adv_a] of FEELING_ADV) {
  for (const [adj_k, adj_r, adj_a] of I_ADJ.slice(0, 8)) {
    for (const [ok, or_, oa] of OBJECT.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `Saya membeli ${oa} yang ${adv_a} ${adj_a}.`,
        tokens: [adv_k, adj_k, ok, "を", "買います"],
        romajiTokens: [adv_r, adj_r, or_, "wo", "kaimasu"],
        vocabKanji: [adv_k, adj_k, ok, "買います"],
      });
    }
  }
}

// {time} {study_subject} を {study_verb}
for (const [tk, tr, ta] of TIME.slice(0, 5)) {
  for (const [sk, sr, sa] of STUDY_SUBJECT) {
    for (const [vk, vr, va] of STUDY_VERB) {
      pushSentence({
        level: 3,
        arti: `${ta.charAt(0).toUpperCase() + ta.slice(1)} saya ${va} ${sa}.`,
        tokens: [tk, sk, "を", vk],
        romajiTokens: [tr, sr, "wo", vr],
        vocabKanji: [tk, sk, vk],
      });
    }
  }
}

// ---------- LEVEL 4 (7-9 tokens) ----------

// {frequency} {time} {person} は {place} で {food} を 食べます
for (const [fk, fr, fa] of FREQUENCY) {
  for (const [tk, tr, ta] of TIME.slice(0, 4)) {
    for (const [pek, per, pea] of PERSON.slice(0, 4)) {
      for (const [plk, plr, pla] of PLACE.slice(0, 3)) {
        pushSentence({
          level: 4,
          arti: `${fa.charAt(0).toUpperCase() + fa.slice(1)} ${ta} ${pea} makan di ${pla}.`,
          tokens: [fk, tk, pek, "は", plk, "で", "食べます"],
          romajiTokens: [fr, tr, per, "wa", plr, "de", "tabemasu"],
          vocabKanji: [fk, tk, pek, plk, "食べます"],
        });
      }
    }
  }
}

// {time} に {person} と {place} へ 行きます
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [pek, per, pea] of PERSON.slice(11, 14)) {
    for (const [plk, plr, pla] of PLACE.slice(0, 5)) {
      pushSentence({
        level: 4,
        arti: `${ta.charAt(0).toUpperCase() + ta.slice(1)} saya pergi ke ${pla} bersama ${pea}.`,
        tokens: [tk, pek, "と", plk, "へ", "行きます"],
        romajiTokens: [tr, per, "to", plr, "e", "ikimasu"],
        vocabKanji: [tk, pek, plk, "行きます"],
      });
    }
  }
}

// {person} は {feeling_adv} {i_adj} {food} を {tverb}
for (const [pek, per, pea] of PERSON.slice(0, 4)) {
  for (const [adv_k, adv_r, adv_a] of FEELING_ADV) {
    for (const [adj_k, adj_r, adj_a] of [["おいしい", "oishii", "enak"], ["新しい", "atarashii", "baru"]]) {
      for (const [fk, fr, fa] of FOOD.slice(0, 5)) {
        pushSentence({
          level: 4,
          arti: `${pea.charAt(0).toUpperCase() + pea.slice(1)} makan ${fa} yang ${adv_a} ${adj_a}.`,
          tokens: [pek, "は", adv_k, adj_k, fk, "を", "食べます"],
          romajiTokens: [per, "wa", adv_r, adj_r, fr, "wo", "tabemasu"],
          vocabKanji: [pek, adv_k, adj_k, fk, "食べます"],
        });
      }
    }
  }
}

// {time} に {vehicle} で {place} まで 行きます
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [vk, vr, va] of VEHICLE.slice(0, 5)) {
    for (const [plk, plr, pla] of PLACE.slice(0, 5)) {
      pushSentence({
        level: 4,
        arti: `${ta.charAt(0).toUpperCase() + ta.slice(1)} saya pergi ke ${pla} dengan ${va}.`,
        tokens: [tk, vk, "で", plk, "まで", "行きます"],
        romajiTokens: [tr, vr, "de", plr, "made", "ikimasu"],
        vocabKanji: [tk, vk, plk, "行きます"],
      });
    }
  }
}

// {person} は {place} で {study_subject} を 勉強します
for (const [pek, per, pea] of PERSON.slice(0, 5)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 5)) {
    for (const [sk, sr, sa] of STUDY_SUBJECT.slice(0, 5)) {
      pushSentence({
        level: 4,
        arti: `${pea.charAt(0).toUpperCase() + pea.slice(1)} belajar ${sa} di ${pla}.`,
        tokens: [pek, "は", plk, "で", sk, "を", "勉強します"],
        romajiTokens: [per, "wa", plr, "de", sr, "wo", "benkyou", "shimasu"],
        vocabKanji: [pek, plk, sk, "勉強します"],
      });
    }
  }
}

// ---------- LEVEL 5 (9+ tokens, complex) ----------

// {place} で {food} を 食べました。{i_adj} でした。
for (const [plk, plr, pla] of PLACE.slice(0, 6)) {
  for (const [fk, fr, fa] of FOOD.slice(0, 6)) {
    for (const [adj_k, adj_r, adj_a] of [["おいしい", "oishii", "enak"]]) {
      pushSentence({
        level: 5,
        arti: `Kemarin saya makan ${fa} di ${pla}, dan rasanya ${adj_a}.`,
        tokens: ["昨日", plk, "で", fk, "を", "食べました", "。", "とても", adj_k, "でした"],
        romajiTokens: ["kinou", plr, "de", fr, "wo", "tabemashita", ".", "totemo", adj_r, "deshita"],
        vocabKanji: ["昨日", plk, fk, "食べます", adj_k],
      });
    }
  }
}

// Karena {reason}, saya tidak {verb}.
for (const [tk, tr, ta] of TIME.slice(0, 3)) {
  for (const [adj_k, adj_r, adj_a] of [["忙しい", "isogashii", "sibuk"], ["寒い", "samui", "dingin"], ["暑い", "atsui", "panas"]]) {
    for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
      pushSentence({
        level: 5,
        arti: `Karena ${ta} ${adj_a}, saya tidak pergi ke ${pla}.`,
        tokens: [tk, "は", adj_k, "から", plk, "に", "行きません", "でした"],
        romajiTokens: [tr, "wa", adj_r, "kara", plr, "ni", "ikimasen", "deshita"],
        vocabKanji: [tk, adj_k, plk, "行きます"],
      });
    }
  }
}

// "Setelah {action1}, saya {action2}."
for (const [tk, tr, ta] of TIME.slice(0, 3)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
    for (const [fk, fr, fa] of FOOD.slice(0, 4)) {
      pushSentence({
        level: 5,
        arti: `${ta.charAt(0).toUpperCase() + ta.slice(1)} saya pergi ke ${pla} dan makan ${fa}.`,
        tokens: [tk, plk, "に", "行って", fk, "を", "食べました"],
        romajiTokens: [tr, plk === plr ? plr : plr, "ni", "itte", fk === fr ? fr : fr, "wo", "tabemashita"],
        vocabKanji: [tk, plk, "行きます", fk, "食べます"],
      });
    }
  }
}

// "Saya pikir {noun} adalah {adj}"
for (const [pek, per, pea] of PERSON.slice(2, 7)) {
  for (const [adj_k, adj_r, adj_a] of [...I_ADJ.slice(0, 6), ...NA_ADJ.slice(0, 4)]) {
    pushSentence({
      level: 5,
      arti: `Saya pikir ${pea} sangat ${adj_a}.`,
      tokens: [pek, "は", "とても", adj_k, "と", "思います"],
      romajiTokens: [per, "wa", "totemo", adj_r, "to", "omoimasu"],
      vocabKanji: [pek, adj_k, "思います"],
    });
  }
}

// Conditional: "Kalau {place}, ada {object}"
for (const [plk, plr, pla] of PLACE.slice(0, 6)) {
  for (const [ok, or_, oa] of OBJECT.slice(0, 5)) {
    pushSentence({
      level: 5,
      arti: `Di ${pla} ada banyak ${oa}.`,
      tokens: [plk, "に", "は", "たくさん", "の", ok, "が", "あります"],
      romajiTokens: [plr, "ni", "wa", "takusan", "no", or_, "ga", "arimasu"],
      vocabKanji: [plk, ok, "あります"],
    });
  }
}

// "Saya selalu {action} sebelum berangkat"
for (const [tk, tr, ta] of TIME.slice(3, 6)) {
  for (const [fk, fr, fa] of FOOD.slice(15, 18)) {
    pushSentence({
      level: 5,
      arti: `${ta.charAt(0).toUpperCase() + ta.slice(1)} saya selalu makan ${fa} sebelum berangkat ke kantor.`,
      tokens: [tk, "いつも", "会社", "に", "行く", "前", "に", fk, "を", "食べます"],
      romajiTokens: [tr, "itsumo", "kaisha", "ni", "iku", "mae", "ni", fr, "wo", "tabemasu"],
      vocabKanji: [tk, "会社", "行きます", fk, "食べます"],
    });
  }
}

// "Walaupun {adj}, saya tetap pergi"
for (const [adj_k, adj_r, adj_a] of I_ADJ.slice(0, 8)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 5)) {
    pushSentence({
      level: 5,
      arti: `Meskipun ${adj_a}, saya tetap pergi ke ${pla}.`,
      tokens: [adj_k, "けれど", plk, "に", "行きました"],
      romajiTokens: [adj_r, "keredo", plr, "ni", "ikimashita"],
      vocabKanji: [adj_k, plk, "行きます"],
    });
  }
}

// ---------- OUTPUT ----------

const header = `// AUTO-GENERATED: do not edit manually.
// Run \`node scripts/generate-sentences.mjs\` to regenerate this file.
// These sentences are produced from curated templates × vocab pools so the
// "Susun Kalimat" test has a large rotation of items.

import type { SentenceItem } from "./sentences";

// The cast below avoids TypeScript inferring an over-narrow union from the
// large literal — that produces a "union too complex to represent" error.
export const GENERATED_SENTENCES: SentenceItem[] = (`;

const json = JSON.stringify(sentences, null, 2);
const fileText = `${header}${json} as unknown as SentenceItem[]);\n`;

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, fileText, "utf8");

const byLevel = sentences.reduce(
  (acc, s) => {
    acc[s.level] = (acc[s.level] || 0) + 1;
    return acc;
  },
  /** @type {Record<number, number>} */ ({})
);

console.log(`Generated ${sentences.length} sentences to ${OUT_PATH}`);
console.log("Per level:", byLevel);
