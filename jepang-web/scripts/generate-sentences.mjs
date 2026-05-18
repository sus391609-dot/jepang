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

// ---------- ADDITIONAL POOLS (expansion) ----------

const COLOR = [
  ["赤", "aka", "merah"],
  ["青", "ao", "biru"],
  ["黄色", "kiiro", "kuning"],
  ["緑", "midori", "hijau"],
  ["白", "shiro", "putih"],
  ["黒", "kuro", "hitam"],
  ["茶色", "chairo", "coklat"],
  ["ピンク", "pinku", "pink"],
  ["紫", "murasaki", "ungu"],
  ["オレンジ", "orenji", "oranye"],
];

const WEATHER = [
  ["晴れ", "hare", "cerah"],
  ["曇り", "kumori", "berawan"],
  ["雨", "ame", "hujan"],
  ["雪", "yuki", "salju"],
  ["風", "kaze", "angin"],
  ["台風", "taifuu", "topan"],
];

const ANIMAL = [
  ["犬", "inu", "anjing"],
  ["猫", "neko", "kucing"],
  ["鳥", "tori", "burung"],
  ["馬", "uma", "kuda"],
  ["牛", "ushi", "sapi"],
  ["豚", "buta", "babi"],
  ["うさぎ", "usagi", "kelinci"],
  ["熊", "kuma", "beruang"],
  ["象", "zou", "gajah"],
  ["パンダ", "panda", "panda"],
];

const BODY_PART = [
  ["頭", "atama", "kepala"],
  ["目", "me", "mata"],
  ["鼻", "hana", "hidung"],
  ["口", "kuchi", "mulut"],
  ["耳", "mimi", "telinga"],
  ["手", "te", "tangan"],
  ["足", "ashi", "kaki"],
  ["お腹", "onaka", "perut"],
  ["背中", "senaka", "punggung"],
  ["歯", "ha", "gigi"],
];

const CLOTHES = [
  ["シャツ", "shatsu", "kemeja"],
  ["ズボン", "zubon", "celana"],
  ["スカート", "sukaato", "rok"],
  ["帽子", "boushi", "topi"],
  ["靴下", "kutsushita", "kaos kaki"],
  ["コート", "kooto", "mantel"],
  ["セーター", "seetaa", "sweter"],
  ["ネクタイ", "nekutai", "dasi"],
  ["着物", "kimono", "kimono"],
  ["浴衣", "yukata", "yukata"],
];

const HOBBY = [
  ["読書", "dokusho", "membaca buku"],
  ["旅行", "ryokou", "jalan-jalan"],
  ["料理", "ryouri", "memasak"],
  ["散歩", "sanpo", "jalan kaki"],
  ["買い物", "kaimono", "belanja"],
  ["釣り", "tsuri", "memancing"],
  ["ゲーム", "geemu", "main game"],
  ["スポーツ", "supootsu", "olahraga"],
];

const SPORT = [
  ["サッカー", "sakkaa", "sepak bola"],
  ["野球", "yakyuu", "bisbol"],
  ["テニス", "tenisu", "tenis"],
  ["バスケットボール", "basukettobooru", "basket"],
  ["水泳", "suiei", "renang"],
  ["卓球", "takkyuu", "tenis meja"],
  ["バドミントン", "badominton", "bulu tangkis"],
];

const COUNTRY = [
  ["日本", "nihon", "Jepang"],
  ["インドネシア", "indoneshia", "Indonesia"],
  ["中国", "chuugoku", "Tiongkok"],
  ["韓国", "kankoku", "Korea"],
  ["アメリカ", "amerika", "Amerika"],
  ["イギリス", "igirisu", "Inggris"],
  ["フランス", "furansu", "Perancis"],
  ["ドイツ", "doitsu", "Jerman"],
  ["タイ", "tai", "Thailand"],
  ["オーストラリア", "oosutoraria", "Australia"],
];

const ROOM = [
  ["部屋", "heya", "kamar"],
  ["台所", "daidokoro", "dapur"],
  ["居間", "ima", "ruang tamu"],
  ["寝室", "shinshitsu", "kamar tidur"],
  ["お風呂", "ofuro", "kamar mandi"],
  ["トイレ", "toire", "toilet"],
  ["玄関", "genkan", "pintu masuk"],
  ["庭", "niwa", "halaman"],
];

const JOB = [
  ["医者", "isha", "dokter"],
  ["看護師", "kangoshi", "perawat"],
  ["警察官", "keisatsukan", "polisi"],
  ["先生", "sensei", "guru"],
  ["弁護士", "bengoshi", "pengacara"],
  ["店員", "tenin", "pegawai toko"],
  ["会社員", "kaishain", "karyawan"],
  ["学生", "gakusei", "pelajar"],
  ["主婦", "shufu", "ibu rumah tangga"],
];

const HOUSEWORK_VERB = [
  ["掃除します", "souji shimasu", "membersihkan"],
  ["洗濯します", "sentaku shimasu", "mencuci"],
  ["料理します", "ryouri shimasu", "memasak"],
];

const SPORT_VERB = [
  ["します", "shimasu", "melakukan"],
];

const NEW_VERBS = [
  ["話します", "hanashimasu", "berbicara"],
  ["書きます", "kakimasu", "menulis"],
  ["走ります", "hashirimasu", "berlari"],
  ["歩きます", "arukimasu", "berjalan"],
  ["泳ぎます", "oyogimasu", "berenang"],
  ["寝ます", "nemasu", "tidur"],
  ["起きます", "okimasu", "bangun"],
  ["遊びます", "asobimasu", "bermain"],
  ["働きます", "hatarakimasu", "bekerja"],
  ["休みます", "yasumimasu", "istirahat"],
];

const MORE_PERSON = [
  ["彼", "kare", "dia (laki-laki)"],
  ["彼女", "kanojo", "dia (perempuan)"],
  ["祖父", "sofu", "kakek"],
  ["祖母", "sobo", "nenek"],
  ["叔父", "oji", "paman"],
  ["叔母", "oba", "bibi"],
  ["同僚", "douryou", "rekan kerja"],
  ["お客さん", "okyakusan", "tamu/pelanggan"],
];

const MORE_PLACE = [
  ["海", "umi", "laut"],
  ["山", "yama", "gunung"],
  ["川", "kawa", "sungai"],
  ["湖", "mizuumi", "danau"],
  ["公園", "kouen", "taman"],
  ["神社", "jinja", "kuil shinto"],
  ["お寺", "otera", "kuil"],
  ["美術館", "bijutsukan", "galeri seni"],
  ["博物館", "hakubutsukan", "museum"],
  ["市場", "ichiba", "pasar"],
];

const MORE_OBJECT = [
  ["お金", "okane", "uang"],
  ["財布", "saifu", "dompet"],
  ["かぎ", "kagi", "kunci"],
  ["眼鏡", "megane", "kacamata"],
  ["手紙", "tegami", "surat"],
  ["切手", "kitte", "perangko"],
  ["地図", "chizu", "peta"],
  ["辞書", "jisho", "kamus"],
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

// ============================================================
//  EXPANSION v2: many more templates over fresh and existing pools
// ============================================================

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- L1 expansion ----------

// これ は {object} です  / それ は ... / あれ は ...
for (const [dk, dr, da] of [["これ", "kore", "ini"], ["それ", "sore", "itu"], ["あれ", "are", "itu (jauh)"]]) {
  for (const [k, r, a] of [...OBJECT, ...MORE_OBJECT]) {
    pushSentence({
      level: 1,
      arti: `${cap(da)} adalah ${a}.`,
      tokens: [dk, "は", k, "です"],
      romajiTokens: [dr, "wa", r, "desu"],
      vocabKanji: [k],
    });
  }
}

// {object} は {color} です
for (const [ok, or_, oa] of OBJECT.slice(0, 10)) {
  for (const [ck, cr, ca] of COLOR) {
    pushSentence({
      level: 1,
      arti: `${cap(oa)} berwarna ${ca}.`,
      tokens: [ok, "は", ck, "です"],
      romajiTokens: [or_, "wa", cr, "desu"],
      vocabKanji: [ok, ck],
    });
  }
}

// {clothes} は {color} です
for (const [ck_, cr_, ca_] of CLOTHES.slice(0, 6)) {
  for (const [colk, colr, cola] of COLOR.slice(0, 6)) {
    pushSentence({
      level: 1,
      arti: `${cap(ca_)} berwarna ${cola}.`,
      tokens: [ck_, "は", colk, "です"],
      romajiTokens: [cr_, "wa", colr, "desu"],
      vocabKanji: [ck_, colk],
    });
  }
}

// 今日 の 天気 は {weather} です
for (const [wk, wr, wa] of WEATHER) {
  pushSentence({
    level: 1,
    arti: `Cuaca hari ini ${wa}.`,
    tokens: ["今日", "の", "天気", "は", wk, "です"],
    romajiTokens: ["kyou", "no", "tenki", "wa", wr, "desu"],
    vocabKanji: ["今日", wk],
  });
}

// {animal} を 見ます
for (const [k, r, a] of ANIMAL) {
  pushSentence({
    level: 1,
    arti: `Saya melihat ${a}.`,
    tokens: [k, "を", "見ます"],
    romajiTokens: [r, "wo", "mimasu"],
    vocabKanji: [k, "見ます"],
  });
}

// {clothes} を 着ます
for (const [k, r, a] of CLOTHES) {
  pushSentence({
    level: 1,
    arti: `Saya memakai ${a}.`,
    tokens: [k, "を", "着ます"],
    romajiTokens: [r, "wo", "kimasu"],
    vocabKanji: [k, "着ます"],
  });
}

// {body_part} が 痛い です
for (const [k, r, a] of BODY_PART) {
  pushSentence({
    level: 1,
    arti: `${cap(a)} saya sakit.`,
    tokens: [k, "が", "痛い", "です"],
    romajiTokens: [r, "ga", "itai", "desu"],
    vocabKanji: [k, "痛い"],
  });
}

// {hobby} が 好き です
for (const [k, r, a] of HOBBY) {
  pushSentence({
    level: 1,
    arti: `Saya suka ${a}.`,
    tokens: [k, "が", "好き", "です"],
    romajiTokens: [r, "ga", "suki", "desu"],
    vocabKanji: [k, "好き"],
  });
}

// {country} に 行きます
for (const [k, r, a] of COUNTRY) {
  pushSentence({
    level: 1,
    arti: `Saya pergi ke ${a}.`,
    tokens: [k, "に", "行きます"],
    romajiTokens: [r, "ni", "ikimasu"],
    vocabKanji: [k, "行きます"],
  });
}

// {room} に います
for (const [k, r, a] of ROOM) {
  pushSentence({
    level: 1,
    arti: `Saya ada di ${a}.`,
    tokens: [k, "に", "います"],
    romajiTokens: [r, "ni", "imasu"],
    vocabKanji: [k, "います"],
  });
}

// {sport} を します
for (const [k, r, a] of SPORT) {
  pushSentence({
    level: 1,
    arti: `Saya bermain ${a}.`,
    tokens: [k, "を", "します"],
    romajiTokens: [r, "wo", "shimasu"],
    vocabKanji: [k, "します"],
  });
}

// 私 は {job} です
for (const [k, r, a] of JOB) {
  pushSentence({
    level: 1,
    arti: `Saya adalah ${a}.`,
    tokens: ["私", "は", k, "です"],
    romajiTokens: ["watashi", "wa", r, "desu"],
    vocabKanji: ["私", k],
  });
}

// {more_place} は きれい です
for (const [k, r, a] of MORE_PLACE) {
  pushSentence({
    level: 1,
    arti: `${cap(a)} itu indah.`,
    tokens: [k, "は", "きれい", "です"],
    romajiTokens: [r, "wa", "kirei", "desu"],
    vocabKanji: [k, "きれい"],
  });
}

// {more_object} を 持っています
for (const [k, r, a] of MORE_OBJECT) {
  pushSentence({
    level: 1,
    arti: `Saya punya ${a}.`,
    tokens: [k, "を", "持っています"],
    romajiTokens: [r, "wo", "motte imasu"],
    vocabKanji: [k, "持ちます"],
  });
}

// {new_verb} sederhana: 私 は {new_verb}
for (const [k, r, a] of NEW_VERBS) {
  pushSentence({
    level: 1,
    arti: `Saya ${a}.`,
    tokens: ["私", "は", k],
    romajiTokens: ["watashi", "wa", r],
    vocabKanji: ["私", k],
  });
}

// {more_person} は 元気 です
for (const [k, r, a] of MORE_PERSON) {
  pushSentence({
    level: 1,
    arti: `${cap(a)} sehat.`,
    tokens: [k, "は", "元気", "です"],
    romajiTokens: [r, "wa", "genki", "desu"],
    vocabKanji: [k, "元気"],
  });
}

// ---------- L2 expansion ----------

// {person} は {color} の {clothes} を 着ます
for (const [pk, pr, pa] of PERSON.slice(0, 6)) {
  for (const [colk, colr, cola] of COLOR.slice(0, 6)) {
    for (const [ck_, cr_, ca_] of CLOTHES.slice(0, 4)) {
      pushSentence({
        level: 2,
        arti: `${cap(pa)} memakai ${ca_} ${cola}.`,
        tokens: [pk, "は", colk, "の", ck_, "を", "着ます"],
        romajiTokens: [pr, "wa", colr, "no", cr_, "wo", "kimasu"],
        vocabKanji: [pk, colk, ck_, "着ます"],
      });
    }
  }
}

// {person} は {country} 人 です
for (const [pk, pr, pa] of PERSON.slice(0, 8)) {
  for (const [ck, cr, ca] of COUNTRY) {
    pushSentence({
      level: 2,
      arti: `${cap(pa)} adalah orang ${ca}.`,
      tokens: [pk, "は", ck, "人", "です"],
      romajiTokens: [pr, "wa", cr, "jin", "desu"],
      vocabKanji: [pk, ck],
    });
  }
}

// {person} は {hobby} が 好き です
for (const [pk, pr, pa] of PERSON.slice(0, 10)) {
  for (const [hk, hr, ha] of HOBBY) {
    pushSentence({
      level: 2,
      arti: `${cap(pa)} suka ${ha}.`,
      tokens: [pk, "は", hk, "が", "好き", "です"],
      romajiTokens: [pr, "wa", hr, "ga", "suki", "desu"],
      vocabKanji: [pk, hk, "好き"],
    });
  }
}

// {time} {weather} です
for (const [tk, tr, ta] of TIME.slice(0, 8)) {
  for (const [wk, wr, wa] of WEATHER) {
    pushSentence({
      level: 2,
      arti: `${cap(ta)} cuacanya ${wa}.`,
      tokens: [tk, "は", wk, "です"],
      romajiTokens: [tr, "wa", wr, "desu"],
      vocabKanji: [tk, wk],
    });
  }
}

// {person} は {body_part} が 痛い です
for (const [pk, pr, pa] of PERSON.slice(0, 8)) {
  for (const [bk, br, ba] of BODY_PART.slice(0, 6)) {
    pushSentence({
      level: 2,
      arti: `${cap(pa)} sakit di ${ba}.`,
      tokens: [pk, "は", bk, "が", "痛い", "です"],
      romajiTokens: [pr, "wa", br, "ga", "itai", "desu"],
      vocabKanji: [pk, bk, "痛い"],
    });
  }
}

// {person} は {place} で {sport} を します
for (const [pk, pr, pa] of PERSON.slice(0, 6)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 6)) {
    for (const [sk, sr, sa] of SPORT.slice(0, 4)) {
      pushSentence({
        level: 2,
        arti: `${cap(pa)} bermain ${sa} di ${pla}.`,
        tokens: [pk, "は", plk, "で", sk, "を", "します"],
        romajiTokens: [pr, "wa", plr, "de", sr, "wo", "shimasu"],
        vocabKanji: [pk, plk, sk, "します"],
      });
    }
  }
}

// {person} は {job} です
for (const [pk, pr, pa] of PERSON.slice(0, 10)) {
  for (const [jk, jr, ja] of JOB) {
    pushSentence({
      level: 2,
      arti: `${cap(pa)} adalah ${ja}.`,
      tokens: [pk, "は", jk, "です"],
      romajiTokens: [pr, "wa", jr, "desu"],
      vocabKanji: [pk, jk],
    });
  }
}

// {time} {room} を 掃除します
for (const [tk, tr, ta] of TIME.slice(0, 6)) {
  for (const [rk, rr, ra] of ROOM.slice(0, 5)) {
    pushSentence({
      level: 2,
      arti: `${cap(ta)} saya membersihkan ${ra}.`,
      tokens: [tk, rk, "を", "掃除します"],
      romajiTokens: [tr, rr, "wo", "souji shimasu"],
      vocabKanji: [tk, rk, "掃除します"],
    });
  }
}

// {person} は {animal} を 飼っています
for (const [pk, pr, pa] of PERSON.slice(0, 8)) {
  for (const [ak, ar, aa] of ANIMAL.slice(0, 6)) {
    pushSentence({
      level: 2,
      arti: `${cap(pa)} memelihara ${aa}.`,
      tokens: [pk, "は", ak, "を", "飼っています"],
      romajiTokens: [pr, "wa", ar, "wo", "katte imasu"],
      vocabKanji: [pk, ak],
    });
  }
}

// {more_place} で {hobby} を します
for (const [plk, plr, pla] of MORE_PLACE.slice(0, 6)) {
  for (const [hk, hr, ha] of HOBBY.slice(0, 6)) {
    pushSentence({
      level: 2,
      arti: `Saya ${ha} di ${pla}.`,
      tokens: [plk, "で", hk, "を", "します"],
      romajiTokens: [plr, "de", hr, "wo", "shimasu"],
      vocabKanji: [plk, hk, "します"],
    });
  }
}

// {more_object} は どこ に あります か
for (const [k, r, a] of MORE_OBJECT) {
  pushSentence({
    level: 2,
    arti: `Di mana ${a}?`,
    tokens: [k, "は", "どこ", "に", "あります", "か"],
    romajiTokens: [r, "wa", "doko", "ni", "arimasu", "ka"],
    vocabKanji: [k, "あります"],
  });
}

// {person} は {more_place} へ 行きます
for (const [pk, pr, pa] of PERSON.slice(0, 8)) {
  for (const [plk, plr, pla] of MORE_PLACE.slice(0, 6)) {
    pushSentence({
      level: 2,
      arti: `${cap(pa)} pergi ke ${pla}.`,
      tokens: [pk, "は", plk, "へ", "行きます"],
      romajiTokens: [pr, "wa", plr, "e", "ikimasu"],
      vocabKanji: [pk, plk, "行きます"],
    });
  }
}

// {time} 私 は {new_verb}
for (const [tk, tr, ta] of TIME.slice(0, 6)) {
  for (const [vk, vr, va] of NEW_VERBS) {
    pushSentence({
      level: 2,
      arti: `${cap(ta)} saya ${va}.`,
      tokens: [tk, "私", "は", vk],
      romajiTokens: [tr, "watashi", "wa", vr],
      vocabKanji: [tk, vk],
    });
  }
}

// ---------- L3 expansion ----------

// {time} {person} は {hobby} を します
for (const [tk, tr, ta] of TIME.slice(0, 5)) {
  for (const [pk, pr, pa] of PERSON.slice(0, 5)) {
    for (const [hk, hr, ha] of HOBBY.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `${cap(ta)} ${pa} ${ha}.`,
        tokens: [tk, pk, "は", hk, "を", "します"],
        romajiTokens: [tr, pr, "wa", hr, "wo", "shimasu"],
        vocabKanji: [tk, pk, hk, "します"],
      });
    }
  }
}

// {place} で {person} と {sport} を します
for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
  for (const [pk, pr, pa] of PERSON.slice(11, 14)) {
    for (const [sk, sr, sa] of SPORT.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `Saya bermain ${sa} dengan ${pa} di ${pla}.`,
        tokens: [plk, "で", pk, "と", sk, "を", "します"],
        romajiTokens: [plr, "de", pr, "to", sr, "wo", "shimasu"],
        vocabKanji: [plk, pk, sk, "します"],
      });
    }
  }
}

// {time} {country} に 旅行します
for (const [tk, tr, ta] of TIME.slice(0, 5)) {
  for (const [ck, cr, ca] of COUNTRY.slice(0, 6)) {
    pushSentence({
      level: 3,
      arti: `${cap(ta)} saya akan jalan-jalan ke ${ca}.`,
      tokens: [tk, ck, "に", "旅行", "を", "します"],
      romajiTokens: [tr, cr, "ni", "ryokou", "wo", "shimasu"],
      vocabKanji: [tk, ck, "旅行"],
    });
  }
}

// {person} は {clothes} を 着て {place} へ 行きます
for (const [pk, pr, pa] of PERSON.slice(0, 4)) {
  for (const [ck_, cr_, ca_] of CLOTHES.slice(0, 4)) {
    for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `${cap(pa)} memakai ${ca_} dan pergi ke ${pla}.`,
        tokens: [pk, "は", ck_, "を", "着て", plk, "へ", "行きます"],
        romajiTokens: [pr, "wa", cr_, "wo", "kite", plr, "e", "ikimasu"],
        vocabKanji: [pk, ck_, plk, "着ます", "行きます"],
      });
    }
  }
}

// {feeling_adv} {color} の {object} を 買いました
for (const [adv_k, adv_r, adv_a] of FEELING_ADV) {
  for (const [colk, colr, cola] of COLOR.slice(0, 6)) {
    for (const [ok, or_, oa] of OBJECT.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `Saya membeli ${oa} berwarna ${cola} yang ${adv_a}.`,
        tokens: [adv_k, colk, "の", ok, "を", "買いました"],
        romajiTokens: [adv_r, colr, "no", or_, "wo", "kaimashita"],
        vocabKanji: [colk, ok, "買います"],
      });
    }
  }
}

// {weather} の 日 は {place} で {hobby} を します
for (const [wk, wr, wa] of WEATHER.slice(0, 4)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
    for (const [hk, hr, ha] of HOBBY.slice(0, 3)) {
      pushSentence({
        level: 3,
        arti: `Pada hari ${wa} saya ${ha} di ${pla}.`,
        tokens: [wk, "の", "日", "は", plk, "で", hk, "を", "します"],
        romajiTokens: [wr, "no", "hi", "wa", plr, "de", hr, "wo", "shimasu"],
        vocabKanji: [wk, plk, hk, "します"],
      });
    }
  }
}

// {person} は {room} で {new_verb}
for (const [pk, pr, pa] of PERSON.slice(0, 5)) {
  for (const [rk, rr, ra] of ROOM.slice(0, 4)) {
    for (const [vk, vr, va] of NEW_VERBS.slice(0, 5)) {
      pushSentence({
        level: 3,
        arti: `${cap(pa)} ${va} di ${ra}.`,
        tokens: [pk, "は", rk, "で", vk],
        romajiTokens: [pr, "wa", rr, "de", vr],
        vocabKanji: [pk, rk, vk],
      });
    }
  }
}

// {more_person} は {place} で {tverb}
for (const [pk, pr, pa] of MORE_PERSON.slice(0, 6)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 5)) {
    for (const [vk, vr, va] of COMMON_TVERB.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `${cap(pa)} ${va} di ${pla}.`,
        tokens: [pk, "は", plk, "で", vk],
        romajiTokens: [pr, "wa", plr, "de", vr],
        vocabKanji: [pk, plk, vk],
      });
    }
  }
}

// {time} に {more_place} で {hobby} を 楽しみました
for (const [tk, tr, ta] of TIME.slice(0, 5)) {
  for (const [plk, plr, pla] of MORE_PLACE.slice(0, 4)) {
    for (const [hk, hr, ha] of HOBBY.slice(0, 3)) {
      pushSentence({
        level: 3,
        arti: `${cap(ta)} saya menikmati ${ha} di ${pla}.`,
        tokens: [tk, plk, "で", hk, "を", "楽しみました"],
        romajiTokens: [tr, plr, "de", hr, "wo", "tanoshimimashita"],
        vocabKanji: [tk, plk, hk],
      });
    }
  }
}

// ---------- L4 expansion ----------

// {time} {person} は {place} で {object} を {tverb}
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [pk, pr, pa] of PERSON.slice(0, 4)) {
    for (const [plk, plr, pla] of PLACE.slice(0, 3)) {
      for (const [ok, or_, oa] of OBJECT.slice(0, 3)) {
        pushSentence({
          level: 4,
          arti: `${cap(ta)} ${pa} membeli ${oa} di ${pla}.`,
          tokens: [tk, pk, "は", plk, "で", ok, "を", "買いました"],
          romajiTokens: [tr, pr, "wa", plr, "de", or_, "wo", "kaimashita"],
          vocabKanji: [tk, pk, plk, ok, "買います"],
        });
      }
    }
  }
}

// {person} は {hobby} と {hobby} が 好き です
for (const [pk, pr, pa] of PERSON.slice(0, 5)) {
  for (const [h1k, h1r, h1a] of HOBBY.slice(0, 4)) {
    for (const [h2k, h2r, h2a] of HOBBY.slice(4, 8)) {
      pushSentence({
        level: 4,
        arti: `${cap(pa)} suka ${h1a} dan ${h2a}.`,
        tokens: [pk, "は", h1k, "と", h2k, "が", "好き", "です"],
        romajiTokens: [pr, "wa", h1r, "to", h2r, "ga", "suki", "desu"],
        vocabKanji: [pk, h1k, h2k, "好き"],
      });
    }
  }
}

// {frequency} {time} {more_place} へ {new_verb}
for (const [fk, fr, fa] of FREQUENCY) {
  for (const [tk, tr, ta] of TIME.slice(0, 4)) {
    for (const [plk, plr, pla] of MORE_PLACE.slice(0, 4)) {
      pushSentence({
        level: 4,
        arti: `${cap(fa)} ${ta} saya pergi ke ${pla} dan berjalan-jalan.`,
        tokens: [fk, tk, plk, "へ", "行って", "散歩します"],
        romajiTokens: [fr, tr, plr, "e", "itte", "sanpo shimasu"],
        vocabKanji: [fk, tk, plk, "行きます", "散歩"],
      });
    }
  }
}

// {person} は {time} に {place} で {hobby} を しました
for (const [pk, pr, pa] of PERSON.slice(0, 5)) {
  for (const [tk, tr, ta] of TIME.slice(0, 4)) {
    for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
      pushSentence({
        level: 4,
        arti: `${cap(pa)} ${ta} jalan-jalan di ${pla}.`,
        tokens: [pk, "は", tk, plk, "で", "散歩", "しました"],
        romajiTokens: [pr, "wa", tr, plr, "de", "sanpo", "shimashita"],
        vocabKanji: [pk, tk, plk, "散歩"],
      });
    }
  }
}

// {country} の {food} は {feeling_adv} {i_adj} です
for (const [ck, cr, ca] of COUNTRY.slice(0, 6)) {
  for (const [fk, fr, fa] of FOOD.slice(0, 6)) {
    for (const [adv_k, adv_r, adv_a] of FEELING_ADV.slice(0, 3)) {
      pushSentence({
        level: 4,
        arti: `${fa} dari ${ca} ${adv_a} enak.`,
        tokens: [ck, "の", fk, "は", adv_k, "おいしい", "です"],
        romajiTokens: [cr, "no", fr, "wa", adv_r, "oishii", "desu"],
        vocabKanji: [ck, fk, "おいしい"],
      });
    }
  }
}

// {time} に {person} と {place} で {tverb}
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [pk, pr, pa] of PERSON.slice(11, 14)) {
    for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
      for (const [vk, vr, va] of COMMON_TVERB.slice(0, 3)) {
        pushSentence({
          level: 4,
          arti: `${cap(ta)} saya ${va} bersama ${pa} di ${pla}.`,
          tokens: [tk, pk, "と", plk, "で", vk],
          romajiTokens: [tr, pr, "to", plr, "de", vr],
          vocabKanji: [tk, pk, plk, vk],
        });
      }
    }
  }
}

// {person} は {body_part} が 痛い から 病院 へ 行きます
for (const [pk, pr, pa] of PERSON.slice(0, 6)) {
  for (const [bk, br, ba] of BODY_PART.slice(0, 5)) {
    pushSentence({
      level: 4,
      arti: `Karena ${ba} ${pa} sakit, ${pa} pergi ke rumah sakit.`,
      tokens: [pk, "は", bk, "が", "痛い", "から", "病院", "へ", "行きます"],
      romajiTokens: [pr, "wa", br, "ga", "itai", "kara", "byouin", "e", "ikimasu"],
      vocabKanji: [pk, bk, "痛い", "病院", "行きます"],
    });
  }
}

// {time} {weather} だから 出かけません でした
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [wk, wr, wa] of WEATHER.slice(0, 4)) {
    pushSentence({
      level: 4,
      arti: `Karena ${ta} ${wa}, saya tidak keluar rumah.`,
      tokens: [tk, "は", wk, "だ", "から", "出かけません", "でした"],
      romajiTokens: [tr, "wa", wr, "da", "kara", "dekakemasen", "deshita"],
      vocabKanji: [tk, wk, "出かけます"],
    });
  }
}

// ---------- L5 expansion ----------

// {time} に {country} へ 行く 予定 です
for (const [tk, tr, ta] of TIME.slice(0, 6)) {
  for (const [ck, cr, ca] of COUNTRY.slice(0, 6)) {
    pushSentence({
      level: 5,
      arti: `${cap(ta)} saya berencana pergi ke ${ca}.`,
      tokens: [tk, ck, "へ", "行く", "予定", "です"],
      romajiTokens: [tr, cr, "e", "iku", "yotei", "desu"],
      vocabKanji: [tk, ck, "行きます", "予定"],
    });
  }
}

// {person} は {hobby} を 始めた ばかり です
for (const [pk, pr, pa] of PERSON.slice(0, 6)) {
  for (const [hk, hr, ha] of HOBBY.slice(0, 5)) {
    pushSentence({
      level: 5,
      arti: `${cap(pa)} baru saja mulai ${ha}.`,
      tokens: [pk, "は", hk, "を", "始めた", "ばかり", "です"],
      romajiTokens: [pr, "wa", hr, "wo", "hajimeta", "bakari", "desu"],
      vocabKanji: [pk, hk, "始めます"],
    });
  }
}

// {person} は {place} で {job} として 働いています
for (const [pk, pr, pa] of PERSON.slice(0, 5)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 5)) {
    for (const [jk, jr, ja] of JOB.slice(0, 4)) {
      pushSentence({
        level: 5,
        arti: `${cap(pa)} bekerja sebagai ${ja} di ${pla}.`,
        tokens: [pk, "は", plk, "で", jk, "として", "働いています"],
        romajiTokens: [pr, "wa", plr, "de", jr, "toshite", "hataraite imasu"],
        vocabKanji: [pk, plk, jk, "働きます"],
      });
    }
  }
}

// もし {weather} なら {place} へ 行きません
for (const [wk, wr, wa] of WEATHER.slice(0, 5)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 5)) {
    pushSentence({
      level: 5,
      arti: `Kalau ${wa}, saya tidak pergi ke ${pla}.`,
      tokens: ["もし", wk, "なら", plk, "へ", "行きません"],
      romajiTokens: ["moshi", wr, "nara", plr, "e", "ikimasen"],
      vocabKanji: [wk, plk, "行きます"],
    });
  }
}

// {person} は {country} 語 を 話す こと が できます
for (const [pk, pr, pa] of PERSON.slice(0, 5)) {
  for (const [ck, cr, ca] of COUNTRY.slice(0, 5)) {
    pushSentence({
      level: 5,
      arti: `${cap(pa)} bisa berbicara bahasa ${ca}.`,
      tokens: [pk, "は", ck, "語", "を", "話す", "こと", "が", "できます"],
      romajiTokens: [pr, "wa", cr, "go", "wo", "hanasu", "koto", "ga", "dekimasu"],
      vocabKanji: [pk, ck, "話します", "できます"],
    });
  }
}

// {time} の {meal} の 後 で {hobby} を します
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [mk, mr, ma] of FOOD.slice(15, 18)) {
    for (const [hk, hr, ha] of HOBBY.slice(0, 3)) {
      pushSentence({
        level: 5,
        arti: `Setelah ${ma} ${ta}, saya ${ha}.`,
        tokens: [tk, "の", mk, "の", "後", "で", hk, "を", "します"],
        romajiTokens: [tr, "no", mr, "no", "ato", "de", hr, "wo", "shimasu"],
        vocabKanji: [tk, mk, hk, "します"],
      });
    }
  }
}

// {person} と {place} で {tverb} の は 楽しい です
for (const [pk, pr, pa] of PERSON.slice(11, 14)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
    for (const [vk, vr, va] of COMMON_TVERB.slice(0, 3)) {
      pushSentence({
        level: 5,
        arti: `${cap(va)} dengan ${pa} di ${pla} menyenangkan.`,
        tokens: [pk, "と", plk, "で", vk, "の", "は", "楽しい", "です"],
        romajiTokens: [pr, "to", plr, "de", vr, "no", "wa", "tanoshii", "desu"],
        vocabKanji: [pk, plk, vk, "楽しい"],
      });
    }
  }
}

// ============================================================
//  EXPANSION v3: question forms, negations, more compositions
// ============================================================

// ---------- L1: question/negation/簡単 ----------

// {place} は どこ です か
for (const [k, r, a] of [...PLACE.slice(0, 16), ...MORE_PLACE]) {
  pushSentence({
    level: 1,
    arti: `Di mana ${a}?`,
    tokens: [k, "は", "どこ", "です", "か"],
    romajiTokens: [r, "wa", "doko", "desu", "ka"],
    vocabKanji: [k],
  });
}

// あれ は 何 です か / これ は 何 です か
for (const [dk, dr, da] of [["これ", "kore", "ini"], ["それ", "sore", "itu"], ["あれ", "are", "itu (jauh)"]]) {
  pushSentence({
    level: 1,
    arti: `${cap(da)} apa?`,
    tokens: [dk, "は", "何", "です", "か"],
    romajiTokens: [dr, "wa", "nan", "desu", "ka"],
    vocabKanji: ["何"],
  });
}

// {food} は 好き じゃ ありません
for (const [k, r, a] of FOOD) {
  pushSentence({
    level: 1,
    arti: `Saya tidak suka ${a}.`,
    tokens: [k, "が", "好き", "じゃ", "ありません"],
    romajiTokens: [r, "ga", "suki", "ja", "arimasen"],
    vocabKanji: [k, "好き"],
  });
}

// {drink} を 飲みません
for (const [k, r, a] of DRINK) {
  pushSentence({
    level: 1,
    arti: `Saya tidak minum ${a}.`,
    tokens: [k, "を", "飲みません"],
    romajiTokens: [r, "wo", "nomimasen"],
    vocabKanji: [k, "飲みます"],
  });
}

// {object} を 持っていません
for (const [k, r, a] of OBJECT.slice(0, 12)) {
  pushSentence({
    level: 1,
    arti: `Saya tidak punya ${a}.`,
    tokens: [k, "を", "持っていません"],
    romajiTokens: [r, "wo", "motte imasen"],
    vocabKanji: [k, "持ちます"],
  });
}

// {time} は {weather} でした
for (const [tk, tr, ta] of TIME.slice(0, 6)) {
  for (const [wk, wr, wa] of WEATHER.slice(0, 4)) {
    pushSentence({
      level: 1,
      arti: `${cap(ta)} cuacanya ${wa}.`,
      tokens: [tk, "は", wk, "でした"],
      romajiTokens: [tr, "wa", wr, "deshita"],
      vocabKanji: [tk, wk],
    });
  }
}

// {animal} は {color} です
for (const [ak, ar, aa] of ANIMAL.slice(0, 6)) {
  for (const [ck, cr, ca] of COLOR.slice(0, 5)) {
    pushSentence({
      level: 1,
      arti: `${cap(aa)} berwarna ${ca}.`,
      tokens: [ak, "は", ck, "です"],
      romajiTokens: [ar, "wa", cr, "desu"],
      vocabKanji: [ak, ck],
    });
  }
}

// {time} は 何曜日 です か
for (const [k, r, a] of TIME.slice(0, 6)) {
  pushSentence({
    level: 1,
    arti: `${cap(a)} hari apa?`,
    tokens: [k, "は", "何曜日", "です", "か"],
    romajiTokens: [r, "wa", "nan youbi", "desu", "ka"],
    vocabKanji: [k],
  });
}

// {time} {food} を 食べました
for (const [tk, tr, ta] of TIME.slice(0, 6)) {
  for (const [fk, fr, fa] of FOOD.slice(0, 8)) {
    pushSentence({
      level: 1,
      arti: `${cap(ta)} saya makan ${fa}.`,
      tokens: [tk, fk, "を", "食べました"],
      romajiTokens: [tr, fr, "wo", "tabemashita"],
      vocabKanji: [tk, fk, "食べます"],
    });
  }
}

// ---------- L2: question/negation/中 ----------

// {person} は {country} 人 じゃ ありません
for (const [pk, pr, pa] of PERSON.slice(0, 6)) {
  for (const [ck, cr, ca] of COUNTRY.slice(0, 5)) {
    pushSentence({
      level: 2,
      arti: `${cap(pa)} bukan orang ${ca}.`,
      tokens: [pk, "は", ck, "人", "じゃ", "ありません"],
      romajiTokens: [pr, "wa", cr, "jin", "ja", "arimasen"],
      vocabKanji: [pk, ck],
    });
  }
}

// {time} {place} で 何 を 食べました か
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 6)) {
    pushSentence({
      level: 2,
      arti: `${cap(ta)} kamu makan apa di ${pla}?`,
      tokens: [tk, plk, "で", "何", "を", "食べました", "か"],
      romajiTokens: [tr, plr, "de", "nani", "wo", "tabemashita", "ka"],
      vocabKanji: [tk, plk, "食べます", "何"],
    });
  }
}

// {person} は どこ に 住んでいます か
for (const [pk, pr, pa] of PERSON.slice(2, 10)) {
  pushSentence({
    level: 2,
    arti: `${cap(pa)} tinggal di mana?`,
    tokens: [pk, "は", "どこ", "に", "住んでいます", "か"],
    romajiTokens: [pr, "wa", "doko", "ni", "sunde imasu", "ka"],
    vocabKanji: [pk, "住みます"],
  });
}

// {person} は いつ {place} へ 行きました か
for (const [pk, pr, pa] of PERSON.slice(2, 8)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 6)) {
    pushSentence({
      level: 2,
      arti: `Kapan ${pa} pergi ke ${pla}?`,
      tokens: [pk, "は", "いつ", plk, "へ", "行きました", "か"],
      romajiTokens: [pr, "wa", "itsu", plr, "e", "ikimashita", "ka"],
      vocabKanji: [pk, plk, "行きます"],
    });
  }
}

// {sport} と {sport} と どちら が 好き です か
for (let i = 0; i < Math.min(6, SPORT.length); i++) {
  for (let j = i + 1; j < Math.min(7, SPORT.length); j++) {
    const [s1k, s1r, s1a] = SPORT[i];
    const [s2k, s2r, s2a] = SPORT[j];
    pushSentence({
      level: 2,
      arti: `${cap(s1a)} dan ${s2a}, kamu suka yang mana?`,
      tokens: [s1k, "と", s2k, "と", "どちら", "が", "好き", "です", "か"],
      romajiTokens: [s1r, "to", s2r, "to", "dochira", "ga", "suki", "desu", "ka"],
      vocabKanji: [s1k, s2k, "好き"],
    });
  }
}

// {person} は {hobby} を しません
for (const [pk, pr, pa] of PERSON.slice(0, 6)) {
  for (const [hk, hr, ha] of HOBBY) {
    pushSentence({
      level: 2,
      arti: `${cap(pa)} tidak ${ha}.`,
      tokens: [pk, "は", hk, "を", "しません"],
      romajiTokens: [pr, "wa", hr, "wo", "shimasen"],
      vocabKanji: [pk, hk, "します"],
    });
  }
}

// {more_object} は いくら です か
for (const [k, r, a] of [...MORE_OBJECT, ...OBJECT.slice(0, 6)]) {
  pushSentence({
    level: 2,
    arti: `Berapa harga ${a}?`,
    tokens: [k, "は", "いくら", "です", "か"],
    romajiTokens: [r, "wa", "ikura", "desu", "ka"],
    vocabKanji: [k],
  });
}

// {time} {person} は {new_verb} ました
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [pk, pr, pa] of PERSON.slice(0, 4)) {
    for (const [vk, vr, va] of NEW_VERBS.slice(0, 6)) {
      // convert ます → ました via simple suffix swap
      const past = vk.endsWith("ます") ? vk.slice(0, -2) + "ました" : vk;
      const pastR = vr.endsWith("masu") ? vr.slice(0, -4) + "mashita" : vr;
      pushSentence({
        level: 2,
        arti: `${cap(ta)} ${pa} ${va}.`,
        tokens: [tk, pk, "は", past],
        romajiTokens: [tr, pr, "wa", pastR],
        vocabKanji: [tk, pk, vk],
      });
    }
  }
}

// ---------- L3: nuanced ----------

// {time} {weather} の 中 で {hobby} を しました
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [wk, wr, wa] of WEATHER.slice(0, 4)) {
    for (const [hk, hr, ha] of HOBBY.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `${cap(ta)} saya ${ha} di tengah ${wa}.`,
        tokens: [tk, wk, "の", "中", "で", hk, "を", "しました"],
        romajiTokens: [tr, wr, "no", "naka", "de", hr, "wo", "shimashita"],
        vocabKanji: [tk, wk, hk, "します"],
      });
    }
  }
}

// {place} の そば に {place} が あります
for (const [p1k, p1r, p1a] of PLACE.slice(0, 6)) {
  for (const [p2k, p2r, p2a] of [...PLACE.slice(0, 4), ...MORE_PLACE.slice(0, 3)]) {
    if (p1k === p2k) continue;
    pushSentence({
      level: 3,
      arti: `Di dekat ${p1a} ada ${p2a}.`,
      tokens: [p1k, "の", "そば", "に", p2k, "が", "あります"],
      romajiTokens: [p1r, "no", "soba", "ni", p2r, "ga", "arimasu"],
      vocabKanji: [p1k, p2k, "あります"],
    });
  }
}

// {feeling_adv} {hobby} を する の が 好き です
for (const [adv_k, adv_r, adv_a] of FEELING_ADV) {
  for (const [hk, hr, ha] of HOBBY) {
    pushSentence({
      level: 3,
      arti: `Saya ${adv_a} suka ${ha}.`,
      tokens: [adv_k, hk, "を", "する", "の", "が", "好き", "です"],
      romajiTokens: [adv_r, hr, "wo", "suru", "no", "ga", "suki", "desu"],
      vocabKanji: [hk, "します", "好き"],
    });
  }
}

// {person} は {body_part} を {tverb}
for (const [pk, pr, pa] of PERSON.slice(0, 5)) {
  for (const [bk, br, ba] of BODY_PART.slice(0, 5)) {
    pushSentence({
      level: 3,
      arti: `${cap(pa)} mencuci ${ba}-nya.`,
      tokens: [pk, "は", bk, "を", "洗います"],
      romajiTokens: [pr, "wa", br, "wo", "araimasu"],
      vocabKanji: [pk, bk, "洗います"],
    });
  }
}

// {time} の {time} {hobby} を します
for (const [t1k, t1r, t1a] of TIME.slice(0, 4)) {
  for (const [t2k, t2r, t2a] of PERIOD_DAY) {
    for (const [hk, hr, ha] of HOBBY.slice(0, 4)) {
      pushSentence({
        level: 3,
        arti: `${cap(t2a)} ${t1a} saya ${ha}.`,
        tokens: [t1k, "の", t2k, hk, "を", "します"],
        romajiTokens: [t1r, "no", t2r, hr, "wo", "shimasu"],
        vocabKanji: [t1k, t2k, hk, "します"],
      });
    }
  }
}

// {animal} と {animal} の どちら が 好き です か
for (let i = 0; i < Math.min(6, ANIMAL.length); i++) {
  for (let j = i + 1; j < Math.min(7, ANIMAL.length); j++) {
    const [a1k, a1r, a1a] = ANIMAL[i];
    const [a2k, a2r, a2a] = ANIMAL[j];
    pushSentence({
      level: 3,
      arti: `${cap(a1a)} dan ${a2a}, mana yang lebih kamu suka?`,
      tokens: [a1k, "と", a2k, "と", "どちら", "が", "好き", "です", "か"],
      romajiTokens: [a1r, "to", a2r, "to", "dochira", "ga", "suki", "desu", "ka"],
      vocabKanji: [a1k, a2k, "好き"],
    });
  }
}

// 私 の {more_person} は {place} で 働いています
for (const [pk, pr, pa] of MORE_PERSON.slice(0, 6)) {
  for (const [plk, plr, pla] of [...PLACE.slice(0, 6), ...MORE_PLACE.slice(0, 4)]) {
    pushSentence({
      level: 3,
      arti: `${cap(pa)} saya bekerja di ${pla}.`,
      tokens: ["私", "の", pk, "は", plk, "で", "働いています"],
      romajiTokens: ["watashi", "no", pr, "wa", plr, "de", "hataraite imasu"],
      vocabKanji: [pk, plk, "働きます"],
    });
  }
}

// ---------- L4: connectors + multi-clause ----------

// {time} の {time} {place} で {food} を 食べました
for (const [t1k, t1r, t1a] of TIME.slice(0, 4)) {
  for (const [t2k, t2r, t2a] of PERIOD_DAY) {
    for (const [plk, plr, pla] of PLACE.slice(0, 3)) {
      for (const [fk, fr, fa] of FOOD.slice(15, 18)) {
        pushSentence({
          level: 4,
          arti: `${cap(t2a)} ${t1a} saya makan ${fa} di ${pla}.`,
          tokens: [t1k, "の", t2k, "に", plk, "で", fk, "を", "食べました"],
          romajiTokens: [t1r, "no", t2r, "ni", plr, "de", fr, "wo", "tabemashita"],
          vocabKanji: [t1k, t2k, plk, fk, "食べます"],
        });
      }
    }
  }
}

// {person} は {hobby} が 好き で {hobby} が 嫌い です
for (const [pk, pr, pa] of PERSON.slice(0, 5)) {
  for (const [h1k, h1r, h1a] of HOBBY.slice(0, 4)) {
    for (const [h2k, h2r, h2a] of HOBBY.slice(4, 7)) {
      pushSentence({
        level: 4,
        arti: `${cap(pa)} suka ${h1a} tapi tidak suka ${h2a}.`,
        tokens: [pk, "は", h1k, "が", "好き", "で", h2k, "が", "嫌い", "です"],
        romajiTokens: [pr, "wa", h1r, "ga", "suki", "de", h2r, "ga", "kirai", "desu"],
        vocabKanji: [pk, h1k, h2k, "好き", "嫌い"],
      });
    }
  }
}

// {country} へ 行って {food} を 食べたい です
for (const [ck, cr, ca] of COUNTRY.slice(0, 6)) {
  for (const [fk, fr, fa] of FOOD.slice(0, 6)) {
    pushSentence({
      level: 4,
      arti: `Saya ingin pergi ke ${ca} dan makan ${fa}.`,
      tokens: [ck, "へ", "行って", fk, "を", "食べたい", "です"],
      romajiTokens: [cr, "e", "itte", fr, "wo", "tabetai", "desu"],
      vocabKanji: [ck, fk, "行きます", "食べます"],
    });
  }
}

// {time} {person} は {study_subject} を 勉強する つもり です
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [pk, pr, pa] of PERSON.slice(0, 4)) {
    for (const [sk, sr, sa] of STUDY_SUBJECT.slice(0, 5)) {
      pushSentence({
        level: 4,
        arti: `${cap(ta)} ${pa} berencana belajar ${sa}.`,
        tokens: [tk, pk, "は", sk, "を", "勉強する", "つもり", "です"],
        romajiTokens: [tr, pr, "wa", sr, "wo", "benkyou suru", "tsumori", "desu"],
        vocabKanji: [tk, pk, sk, "勉強します"],
      });
    }
  }
}

// {place} は {feeling_adv} {i_adj} で {feeling_adv} {na_adj} です
for (const [plk, plr, pla] of PLACE.slice(0, 5)) {
  for (const [adv_k, adv_r, adv_a] of FEELING_ADV.slice(0, 2)) {
    for (const [adj_k, adj_r, adj_a] of I_ADJ.slice(0, 4)) {
      for (const [na_k, na_r, na_a] of NA_ADJ.slice(0, 3)) {
        pushSentence({
          level: 4,
          arti: `${cap(pla)} ${adv_a} ${adj_a} dan ${adv_a} ${na_a}.`,
          tokens: [plk, "は", adv_k, adj_k, "て", adv_k, na_k, "です"],
          romajiTokens: [plr, "wa", adv_r, adj_r, "te", adv_r, na_r, "desu"],
          vocabKanji: [plk, adj_k, na_k],
        });
      }
    }
  }
}

// {person} は {room} で {hobby} を しながら {drink} を 飲みます
for (const [pk, pr, pa] of PERSON.slice(0, 4)) {
  for (const [rk, rr, ra] of ROOM.slice(0, 4)) {
    for (const [hk, hr, ha] of HOBBY.slice(0, 3)) {
      for (const [dk, dr, da] of DRINK.slice(0, 3)) {
        pushSentence({
          level: 4,
          arti: `${cap(pa)} ${ha} sambil minum ${da} di ${ra}.`,
          tokens: [pk, "は", rk, "で", hk, "を", "しながら", dk, "を", "飲みます"],
          romajiTokens: [pr, "wa", rr, "de", hr, "wo", "shinagara", dr, "wo", "nomimasu"],
          vocabKanji: [pk, rk, hk, dk, "飲みます"],
        });
      }
    }
  }
}

// ---------- L5: complex multi-clause ----------

// {time} までに {place} に 着かなければ なりません
for (const [tk, tr, ta] of TIME.slice(0, 6)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 6)) {
    pushSentence({
      level: 5,
      arti: `Sebelum ${ta} saya harus tiba di ${pla}.`,
      tokens: [tk, "までに", plk, "に", "着かなければ", "なりません"],
      romajiTokens: [tr, "made ni", plr, "ni", "tsukanakereba", "narimasen"],
      vocabKanji: [tk, plk, "着きます"],
    });
  }
}

// {person} は {country} で {study_subject} を 勉強した こと が あります
for (const [pk, pr, pa] of PERSON.slice(0, 4)) {
  for (const [ck, cr, ca] of COUNTRY.slice(0, 5)) {
    for (const [sk, sr, sa] of STUDY_SUBJECT.slice(0, 4)) {
      pushSentence({
        level: 5,
        arti: `${cap(pa)} pernah belajar ${sa} di ${ca}.`,
        tokens: [pk, "は", ck, "で", sk, "を", "勉強した", "こと", "が", "あります"],
        romajiTokens: [pr, "wa", cr, "de", sr, "wo", "benkyou shita", "koto", "ga", "arimasu"],
        vocabKanji: [pk, ck, sk, "勉強します"],
      });
    }
  }
}

// もし {money} お金 が あれば {place} へ 行きたい です
for (const [plk, plr, pla] of [...PLACE.slice(0, 5), ...MORE_PLACE.slice(0, 5)]) {
  pushSentence({
    level: 5,
    arti: `Kalau saya punya uang, saya ingin pergi ke ${pla}.`,
    tokens: ["もし", "お金", "が", "あれば", plk, "へ", "行きたい", "です"],
    romajiTokens: ["moshi", "okane", "ga", "areba", plr, "e", "ikitai", "desu"],
    vocabKanji: ["お金", plk, "行きます"],
  });
}

// {person} は {place} で {tverb} こと が 多い です
for (const [pk, pr, pa] of PERSON.slice(0, 5)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 5)) {
    for (const [vk, vr, va] of COMMON_TVERB.slice(0, 4)) {
      pushSentence({
        level: 5,
        arti: `${cap(pa)} sering ${va} di ${pla}.`,
        tokens: [pk, "は", plk, "で", vk, "こと", "が", "多い", "です"],
        romajiTokens: [pr, "wa", plr, "de", vr, "koto", "ga", "ooi", "desu"],
        vocabKanji: [pk, plk, vk, "多い"],
      });
    }
  }
}

// {time} に {place} で {sport} を しよう と 思います
for (const [tk, tr, ta] of TIME.slice(0, 4)) {
  for (const [plk, plr, pla] of PLACE.slice(0, 4)) {
    for (const [sk, sr, sa] of SPORT.slice(0, 4)) {
      pushSentence({
        level: 5,
        arti: `${cap(ta)} saya berniat bermain ${sa} di ${pla}.`,
        tokens: [tk, plk, "で", sk, "を", "しよう", "と", "思います"],
        romajiTokens: [tr, plr, "de", sr, "wo", "shiyou", "to", "omoimasu"],
        vocabKanji: [tk, plk, sk, "思います"],
      });
    }
  }
}

// {country} の {food} は {feeling_adv} {i_adj} と 聞きました
for (const [ck, cr, ca] of COUNTRY.slice(0, 5)) {
  for (const [fk, fr, fa] of FOOD.slice(0, 5)) {
    for (const [adv_k, adv_r, adv_a] of FEELING_ADV.slice(0, 2)) {
      pushSentence({
        level: 5,
        arti: `Saya dengar ${fa} dari ${ca} ${adv_a} enak.`,
        tokens: [ck, "の", fk, "は", adv_k, "おいしい", "と", "聞きました"],
        romajiTokens: [cr, "no", fr, "wa", adv_r, "oishii", "to", "kikimashita"],
        vocabKanji: [ck, fk, "おいしい", "聞きます"],
      });
    }
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
