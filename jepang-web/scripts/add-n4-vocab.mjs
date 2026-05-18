#!/usr/bin/env node
// Add a "Kosakata Tambahan N4" section to src/data/vocab.ts containing
// commonly-tested N4 vocab that's not already present.
//
// Run: node scripts/add-n4-vocab.mjs
//
// The script is idempotent: it filters out any kanji that already exist
// elsewhere in vocab.ts so re-running just refreshes the section.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const VOCAB_PATH = join(__dirname, "..", "src", "data", "vocab.ts");

const PAGE_SIZE = 30;

// ---------- Candidate N4 vocabulary ----------
// [kanji, romaji, arti, subcategory]
/** @type {Array<[string,string,string,string]>} */
const CANDIDATES = [
  // ===== Verbs (50) =====
  ["上がる", "agaru", "naik (intransitif)", "N4 - Kata Kerja"],
  ["下がる", "sagaru", "turun (intransitif)", "N4 - Kata Kerja"],
  ["上げる", "ageru", "menaikkan", "N4 - Kata Kerja"],
  ["下げる", "sageru", "menurunkan", "N4 - Kata Kerja"],
  ["集まる", "atsumaru", "berkumpul", "N4 - Kata Kerja"],
  ["集める", "atsumeru", "mengumpulkan", "N4 - Kata Kerja"],
  ["別れる", "wakareru", "berpisah", "N4 - Kata Kerja"],
  ["続く", "tsuzuku", "berlanjut", "N4 - Kata Kerja"],
  ["続ける", "tsuzukeru", "melanjutkan", "N4 - Kata Kerja"],
  ["始まる", "hajimaru", "dimulai (intransitif)", "N4 - Kata Kerja"],
  ["探す", "sagasu", "mencari", "N4 - Kata Kerja"],
  ["見つける", "mitsukeru", "menemukan", "N4 - Kata Kerja"],
  ["見つかる", "mitsukaru", "ditemukan", "N4 - Kata Kerja"],
  ["受ける", "ukeru", "menerima / mengikuti (ujian)", "N4 - Kata Kerja"],
  ["渡す", "watasu", "menyerahkan", "N4 - Kata Kerja"],
  ["落ちる", "ochiru", "jatuh", "N4 - Kata Kerja"],
  ["落とす", "otosu", "menjatuhkan", "N4 - Kata Kerja"],
  ["倒れる", "taoreru", "rubuh / tumbang", "N4 - Kata Kerja"],
  ["起こす", "okosu", "membangunkan / menyebabkan", "N4 - Kata Kerja"],
  ["注意する", "chuui suru", "memperhatikan / berhati-hati", "N4 - Kata Kerja"],
  ["心配する", "shinpai suru", "khawatir", "N4 - Kata Kerja"],
  ["案内する", "annai suru", "memandu / mengantar", "N4 - Kata Kerja"],
  ["紹介する", "shoukai suru", "memperkenalkan", "N4 - Kata Kerja"],
  ["招待する", "shoutai suru", "mengundang", "N4 - Kata Kerja"],
  ["反対する", "hantai suru", "menentang", "N4 - Kata Kerja"],
  ["賛成する", "sansei suru", "setuju", "N4 - Kata Kerja"],
  ["比較する", "hikaku suru", "membandingkan", "N4 - Kata Kerja"],
  ["経験する", "keiken suru", "mengalami", "N4 - Kata Kerja"],
  ["注文する", "chuumon suru", "memesan", "N4 - Kata Kerja"],
  ["出発する", "shuppatsu suru", "berangkat", "N4 - Kata Kerja"],
  ["到着する", "touchaku suru", "tiba", "N4 - Kata Kerja"],
  ["引っ越す", "hikkosu", "pindah rumah", "N4 - Kata Kerja"],
  ["建てる", "tateru", "membangun", "N4 - Kata Kerja"],
  ["寄る", "yoru", "mampir", "N4 - Kata Kerja"],
  ["通る", "tooru", "lewat", "N4 - Kata Kerja"],
  ["通う", "kayou", "pulang pergi (rutin)", "N4 - Kata Kerja"],
  ["戻る", "modoru", "kembali", "N4 - Kata Kerja"],
  ["戻す", "modosu", "mengembalikan", "N4 - Kata Kerja"],
  ["直す", "naosu", "memperbaiki", "N4 - Kata Kerja"],
  ["直る", "naoru", "diperbaiki / sembuh", "N4 - Kata Kerja"],
  ["飾る", "kazaru", "menghias", "N4 - Kata Kerja"],
  ["残る", "nokoru", "tersisa", "N4 - Kata Kerja"],
  ["残す", "nokosu", "menyisakan", "N4 - Kata Kerja"],
  ["増える", "fueru", "bertambah", "N4 - Kata Kerja"],
  ["増やす", "fuyasu", "menambah", "N4 - Kata Kerja"],
  ["減る", "heru", "berkurang", "N4 - Kata Kerja"],
  ["減らす", "herasu", "mengurangi", "N4 - Kata Kerja"],
  ["変える", "kaeru", "mengubah", "N4 - Kata Kerja"],
  ["変わる", "kawaru", "berubah", "N4 - Kata Kerja"],
  ["比べる", "kuraberu", "membandingkan", "N4 - Kata Kerja"],
  ["決める", "kimeru", "memutuskan", "N4 - Kata Kerja"],
  ["決まる", "kimaru", "ditentukan", "N4 - Kata Kerja"],
  ["伝える", "tsutaeru", "menyampaikan", "N4 - Kata Kerja"],
  ["伝わる", "tsutawaru", "tersampaikan", "N4 - Kata Kerja"],
  ["気がつく", "ki ga tsuku", "menyadari", "N4 - Kata Kerja"],
  ["役に立つ", "yaku ni tatsu", "berguna", "N4 - Kata Kerja"],
  ["間に合う", "ma ni au", "tepat waktu", "N4 - Kata Kerja"],
  ["遅れる", "okureru", "terlambat", "N4 - Kata Kerja"],
  ["急ぐ", "isogu", "bergegas", "N4 - Kata Kerja"],
  ["叱る", "shikaru", "memarahi", "N4 - Kata Kerja"],
  ["褒める", "homeru", "memuji", "N4 - Kata Kerja"],

  // ===== Nouns (60) =====
  ["世界", "sekai", "dunia", "N4 - Kata Benda"],
  ["国際", "kokusai", "internasional", "N4 - Kata Benda"],
  ["社会", "shakai", "masyarakat", "N4 - Kata Benda"],
  ["政治", "seiji", "politik", "N4 - Kata Benda"],
  ["経済", "keizai", "ekonomi", "N4 - Kata Benda"],
  ["文化", "bunka", "budaya", "N4 - Kata Benda"],
  ["教育", "kyouiku", "pendidikan", "N4 - Kata Benda"],
  ["科学", "kagaku", "ilmu pengetahuan", "N4 - Kata Benda"],
  ["技術", "gijutsu", "teknik / teknologi", "N4 - Kata Benda"],
  ["情報", "jouhou", "informasi", "N4 - Kata Benda"],
  ["内容", "naiyou", "isi", "N4 - Kata Benda"],
  ["意味", "imi", "arti", "N4 - Kata Benda"],
  ["意見", "iken", "pendapat", "N4 - Kata Benda"],
  ["関係", "kankei", "hubungan", "N4 - Kata Benda"],
  ["原因", "gen'in", "penyebab", "N4 - Kata Benda"],
  ["理由", "riyuu", "alasan", "N4 - Kata Benda"],
  ["結果", "kekka", "hasil", "N4 - Kata Benda"],
  ["目的", "mokuteki", "tujuan", "N4 - Kata Benda"],
  ["目標", "mokuhyou", "target", "N4 - Kata Benda"],
  ["計画", "keikaku", "rencana", "N4 - Kata Benda"],
  ["予定", "yotei", "jadwal", "N4 - Kata Benda"],
  ["予約", "yoyaku", "reservasi", "N4 - Kata Benda"],
  ["約束", "yakusoku", "janji", "N4 - Kata Benda"],
  ["相談", "soudan", "konsultasi", "N4 - Kata Benda"],
  ["説明書", "setsumeisho", "buku panduan", "N4 - Kata Benda"],
  ["机の上", "tsukue no ue", "di atas meja", "N4 - Kata Benda"],
  ["席", "seki", "tempat duduk", "N4 - Kata Benda"],
  ["指輪", "yubiwa", "cincin", "N4 - Kata Benda"],
  ["財布", "saifu", "dompet", "N4 - Kata Benda"],
  ["眼鏡", "megane", "kacamata"  , "N4 - Kata Benda"],
  ["帽子", "boushi", "topi", "N4 - Kata Benda"],
  ["手袋", "tebukuro", "sarung tangan", "N4 - Kata Benda"],
  ["靴下", "kutsushita", "kaos kaki", "N4 - Kata Benda"],
  ["スーツ", "suutsu", "jas", "N4 - Kata Benda"],
  ["ジーンズ", "jiinzu", "celana jeans", "N4 - Kata Benda"],
  ["ハンカチ", "hankachi", "sapu tangan", "N4 - Kata Benda"],
  ["ティッシュ", "tisshu", "tisu", "N4 - Kata Benda"],
  ["タオル", "taoru", "handuk", "N4 - Kata Benda"],
  ["歯ブラシ", "haburashi", "sikat gigi", "N4 - Kata Benda"],
  ["石鹸", "sekken", "sabun", "N4 - Kata Benda"],
  ["薬", "kusuri", "obat", "N4 - Kata Benda"],
  ["熱", "netsu", "demam / panas", "N4 - Kata Benda"],
  ["風邪", "kaze", "flu / pilek", "N4 - Kata Benda"],
  ["怪我", "kega", "luka", "N4 - Kata Benda"],
  ["注射", "chuusha", "suntikan", "N4 - Kata Benda"],
  ["手術", "shujutsu", "operasi (bedah)", "N4 - Kata Benda"],
  ["地震", "jishin", "gempa bumi", "N4 - Kata Benda"],
  ["台風", "taifuu", "topan", "N4 - Kata Benda"],
  ["火事", "kaji", "kebakaran", "N4 - Kata Benda"],
  ["事故", "jiko", "kecelakaan", "N4 - Kata Benda"],
  ["交通", "koutsuu", "lalu lintas", "N4 - Kata Benda"],
  ["道路", "douro", "jalan raya", "N4 - Kata Benda"],
  ["橋", "hashi", "jembatan", "N4 - Kata Benda"],
  ["港", "minato", "pelabuhan", "N4 - Kata Benda"],
  ["島", "shima", "pulau", "N4 - Kata Benda"],
  ["森", "mori", "hutan", "N4 - Kata Benda"],
  ["林", "hayashi", "rimba kecil", "N4 - Kata Benda"],
  ["畑", "hatake", "ladang", "N4 - Kata Benda"],
  ["田んぼ", "tanbo", "sawah", "N4 - Kata Benda"],
  ["景色", "keshiki", "pemandangan", "N4 - Kata Benda"],
  ["様子", "yousu", "keadaan / situasi", "N4 - Kata Benda"],
  ["気分", "kibun", "perasaan", "N4 - Kata Benda"],
  ["気持ち", "kimochi", "perasaan", "N4 - Kata Benda"],
  ["性格", "seikaku", "watak / karakter", "N4 - Kata Benda"],
  ["習慣", "shuukan", "kebiasaan", "N4 - Kata Benda"],
  ["生活", "seikatsu", "kehidupan", "N4 - Kata Benda"],
  ["将来", "shourai", "masa depan", "N4 - Kata Benda"],
  ["最近", "saikin", "akhir-akhir ini", "N4 - Kata Benda"],
  ["最後", "saigo", "terakhir", "N4 - Kata Benda"],
  ["最初", "saisho", "pertama / awal", "N4 - Kata Benda"],
  ["途中", "tochuu", "di tengah jalan", "N4 - Kata Benda"],
  ["途中で", "tochuu de", "saat di tengah jalan", "N4 - Kata Benda"],

  // ===== Adjectives (20) =====
  ["うれしい", "ureshii", "senang / gembira", "N4 - Kata Sifat"],
  ["悲しい", "kanashii", "sedih", "N4 - Kata Sifat"],
  ["恥ずかしい", "hazukashii", "malu", "N4 - Kata Sifat"],
  ["寂しい", "sabishii", "kesepian", "N4 - Kata Sifat"],
  ["懐かしい", "natsukashii", "rindu (akan masa lalu)", "N4 - Kata Sifat"],
  ["怖い", "kowai", "menakutkan", "N4 - Kata Sifat"],
  ["眠い", "nemui", "mengantuk", "N4 - Kata Sifat"],
  ["かゆい", "kayui", "gatal", "N4 - Kata Sifat"],
  ["珍しい", "mezurashii", "langka / jarang", "N4 - Kata Sifat"],
  ["優しい", "yasashii", "lembut / baik hati", "N4 - Kata Sifat"],
  ["厳しい", "kibishii", "keras / tegas", "N4 - Kata Sifat"],
  ["細かい", "komakai", "rinci / detail", "N4 - Kata Sifat"],
  ["深い", "fukai", "dalam", "N4 - Kata Sifat"],
  ["浅い", "asai", "dangkal", "N4 - Kata Sifat"],
  ["柔らかい", "yawarakai", "lembut / empuk", "N4 - Kata Sifat"],
  ["硬い", "katai", "keras", "N4 - Kata Sifat"],
  ["重要", "juuyou", "penting (na-adj)", "N4 - Kata Sifat"],
  ["特別", "tokubetsu", "istimewa (na-adj)", "N4 - Kata Sifat"],
  ["十分", "juubun", "cukup (na-adj)", "N4 - Kata Sifat"],
  ["必要", "hitsuyou", "perlu (na-adj)", "N4 - Kata Sifat"],

  // ===== Adverbs / connectors (20) =====
  ["きっと", "kitto", "pasti", "N4 - Kata Keterangan"],
  ["ぜひ", "zehi", "tolong / dengan tulus", "N4 - Kata Keterangan"],
  ["やはり", "yahari", "ternyata / seperti dugaan", "N4 - Kata Keterangan"],
  ["なるほど", "naruhodo", "saya mengerti", "N4 - Kata Keterangan"],
  ["できるだけ", "dekiru dake", "sebisa mungkin", "N4 - Kata Keterangan"],
  ["なかなか", "nakanaka", "cukup / tidak mudah", "N4 - Kata Keterangan"],
  ["ほとんど", "hotondo", "hampir / kebanyakan", "N4 - Kata Keterangan"],
  ["全然", "zenzen", "sama sekali (tidak)", "N4 - Kata Keterangan"],
  ["決して", "kesshite", "sama sekali (tidak)", "N4 - Kata Keterangan"],
  ["必ず", "kanarazu", "pasti / tentu", "N4 - Kata Keterangan"],
  ["特に", "toku ni", "khususnya", "N4 - Kata Keterangan"],
  ["急に", "kyuu ni", "tiba-tiba", "N4 - Kata Keterangan"],
  ["別に", "betsu ni", "tidak juga", "N4 - Kata Keterangan"],
  ["それに", "soreni", "selain itu", "N4 - Kata Sambung"],
  ["それで", "sorede", "lalu / kemudian", "N4 - Kata Sambung"],
  ["それから", "sorekara", "setelah itu", "N4 - Kata Sambung"],
  ["ところで", "tokorode", "ngomong-ngomong", "N4 - Kata Sambung"],
  ["けれども", "keredomo", "tetapi", "N4 - Kata Sambung"],
  ["ただし", "tadashi", "tetapi / hanya saja", "N4 - Kata Sambung"],
  ["または", "matawa", "atau", "N4 - Kata Sambung"],

  // ===== Extra (50) to ensure we reach 1500 after dedup =====
  ["遠く", "tooku", "tempat yang jauh", "N4 - Kata Benda"],
  ["近く", "chikaku", "tempat yang dekat", "N4 - Kata Benda"],
  ["周り", "mawari", "sekeliling", "N4 - Kata Benda"],
  ["真ん中", "mannaka", "tengah-tengah", "N4 - Kata Benda"],
  ["反対側", "hantai-gawa", "sisi berlawanan", "N4 - Kata Benda"],
  ["表", "omote", "depan / permukaan", "N4 - Kata Benda"],
  ["裏", "ura", "belakang / sisi sebaliknya", "N4 - Kata Benda"],
  ["底", "soko", "dasar", "N4 - Kata Benda"],
  ["端", "hashi", "ujung / tepi", "N4 - Kata Benda"],
  ["列", "retsu", "barisan / antrean", "N4 - Kata Benda"],
  ["都合", "tsugou", "kondisi (waktu/kesempatan)", "N4 - Kata Benda"],
  ["都会", "tokai", "kota besar", "N4 - Kata Benda"],
  ["田舎", "inaka", "kampung / pedesaan", "N4 - Kata Benda"],
  ["地球", "chikyuu", "bumi", "N4 - Kata Benda"],
  ["地理", "chiri", "geografi", "N4 - Kata Benda"],
  ["歴史", "rekishi", "sejarah", "N4 - Kata Benda"],
  ["美術", "bijutsu", "seni rupa", "N4 - Kata Benda"],
  ["音楽家", "ongakuka", "musisi", "N4 - Kata Benda"],
  ["画家", "gaka", "pelukis", "N4 - Kata Benda"],
  ["小説", "shousetsu", "novel", "N4 - Kata Benda"],
  ["漫画", "manga", "komik", "N4 - Kata Benda"],
  ["アニメ", "anime", "anime", "N4 - Kata Benda"],
  ["放送", "housou", "siaran", "N4 - Kata Benda"],
  ["番組", "bangumi", "acara (TV/radio)", "N4 - Kata Benda"],
  ["新聞社", "shinbunsha", "perusahaan koran", "N4 - Kata Benda"],
  ["記者", "kisha", "wartawan", "N4 - Kata Benda"],
  ["記事", "kiji", "artikel berita", "N4 - Kata Benda"],
  ["連絡", "renraku", "kontak / kabar", "N4 - Kata Benda"],
  ["返事", "henji", "balasan / jawaban", "N4 - Kata Benda"],
  ["伝言", "dengon", "pesan titipan", "N4 - Kata Benda"],
  ["挨拶", "aisatsu", "salam / sapaan", "N4 - Kata Benda"],
  ["お辞儀", "ojigi", "membungkuk hormat", "N4 - Kata Benda"],
  ["お土産", "omiyage", "oleh-oleh", "N4 - Kata Benda"],
  ["お祝い", "oiwai", "ucapan selamat", "N4 - Kata Benda"],
  ["お見舞い", "omimai", "menjenguk", "N4 - Kata Benda"],
  ["お礼", "orei", "ucapan terima kasih", "N4 - Kata Benda"],
  ["お詫び", "owabi", "permintaan maaf", "N4 - Kata Benda"],
  ["努力", "doryoku", "usaha keras", "N4 - Kata Benda"],
  ["成功", "seikou", "kesuksesan", "N4 - Kata Benda"],
  ["失敗", "shippai", "kegagalan", "N4 - Kata Benda"],
  ["試験", "shiken", "ujian", "N4 - Kata Benda"],
  ["合格", "goukaku", "lulus (ujian)", "N4 - Kata Benda"],
  ["卒業", "sotsugyou", "kelulusan (sekolah)", "N4 - Kata Benda"],
  ["入学", "nyuugaku", "masuk sekolah", "N4 - Kata Benda"],
  ["就職", "shuushoku", "mendapatkan pekerjaan", "N4 - Kata Benda"],
  ["転職", "tenshoku", "pindah pekerjaan", "N4 - Kata Benda"],
  ["残業", "zangyou", "lembur", "N4 - Kata Benda"],
  ["昼休み", "hiruyasumi", "istirahat siang", "N4 - Kata Benda"],
  ["休憩", "kyuukei", "istirahat (jeda)", "N4 - Kata Benda"],
  ["平日", "heijitsu", "hari kerja", "N4 - Kata Benda"],
  ["関心", "kanshin", "perhatian / minat", "N4 - Kata Benda"],
  ["興味", "kyoumi", "minat", "N4 - Kata Benda"],
  ["期待", "kitai", "harapan / ekspektasi", "N4 - Kata Benda"],
  ["緊張", "kinchou", "tegang / gugup", "N4 - Kata Benda"],
  ["安心", "anshin", "lega / tenang", "N4 - Kata Benda"],
  ["用意", "youi", "persiapan", "N4 - Kata Benda"],
  ["準備", "junbi", "persiapan", "N4 - Kata Benda"],
  ["完成", "kansei", "penyelesaian (selesai sempurna)", "N4 - Kata Benda"],
  ["完了", "kanryou", "rampung", "N4 - Kata Benda"],
  ["開始", "kaishi", "memulai", "N4 - Kata Benda"],
  ["終了", "shuuryou", "selesai", "N4 - Kata Benda"],
  ["出席", "shusseki", "hadir", "N4 - Kata Benda"],
  ["欠席", "kesseki", "tidak hadir", "N4 - Kata Benda"],
  ["参加", "sanka", "ikut serta", "N4 - Kata Benda"],
  ["中止", "chuushi", "dibatalkan", "N4 - Kata Benda"],
  ["開店", "kaiten", "pembukaan toko", "N4 - Kata Benda"],
  ["閉店", "heiten", "penutupan toko", "N4 - Kata Benda"],
  ["営業", "eigyou", "bisnis / operasional", "N4 - Kata Benda"],
  ["製品", "seihin", "produk (manufaktur)", "N4 - Kata Benda"],
  ["価格", "kakaku", "harga", "N4 - Kata Benda"],
  ["道具", "dougu", "alat", "N4 - Kata Benda"],
  ["材料", "zairyou", "bahan", "N4 - Kata Benda"],
  ["包装", "housou", "pembungkusan", "N4 - Kata Benda"],
  ["修理", "shuuri", "memperbaiki / reparasi", "N4 - Kata Benda"],
  ["工事", "kouji", "konstruksi", "N4 - Kata Benda"],
  ["留学", "ryuugaku", "studi di luar negeri", "N4 - Kata Benda"],
  ["帰国", "kikoku", "pulang ke negara asal", "N4 - Kata Benda"],
  ["観光", "kankou", "wisata", "N4 - Kata Benda"],
  ["観光地", "kankouchi", "tempat wisata", "N4 - Kata Benda"],
  ["美容院", "biyouin", "salon kecantikan", "N4 - Kata Benda"],
  ["床屋", "tokoya", "tukang cukur", "N4 - Kata Benda"],
];

// ---------- Read existing vocab.ts ----------

const rawText = readFileSync(VOCAB_PATH, "utf8");

const sectionId = "kosakata-n4-tambahan";

// We strip any previously-added "kosakata-n4-tambahan" section FIRST so that
// re-running the script doesn't consider words from the previous run as
// "existing" duplicates (otherwise the script would converge to ~35 words).
function removeExistingSection(src, id) {
  const marker = `"id": "${id}"`;
  const idx = src.indexOf(marker);
  if (idx === -1) return src;
  // Find the start of the section object: walk back to the previous '{'
  let start = idx;
  while (start > 0 && src[start] !== "{") start--;
  // Walk back further to also remove the preceding ',\n    ' or '    '
  let trimStart = start;
  while (trimStart > 0 && /[\s,]/.test(src[trimStart - 1])) trimStart--;
  // Find the matching closing '}' by counting braces.
  let depth = 0;
  let end = start;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  // Also consume a trailing comma if present
  while (end < src.length && /[\s,]/.test(src[end])) end++;
  return src.slice(0, trimStart) + "\n  " + src.slice(end);
}

const cleanedText = removeExistingSection(rawText, sectionId);

// Find all existing kanji in the cleaned text.
const existing = new Set();
const re = /"kanji":\s*"([^"]+)"/g;
let m;
while ((m = re.exec(cleanedText))) existing.add(m[1]);
console.log(`Existing kanji entries (after removing prior section): ${existing.size}`);

// Filter candidates
const fresh = CANDIDATES.filter(([k]) => !existing.has(k));
console.log(`Fresh candidates (not duplicate): ${fresh.length}`);

// Split into pages of 30
const pages = [];
for (let i = 0; i < fresh.length; i += PAGE_SIZE) {
  pages.push(fresh.slice(i, i + PAGE_SIZE));
}

const sectionPages = pages.map((items, pageIndex) => ({
  pageIndex,
  items: items.map(([kanji, romaji, arti, subcategory]) => ({
    kanji,
    romaji,
    arti,
    subcategory,
  })),
}));

const newSection = {
  id: sectionId,
  label: "Kosakata Tambahan N4",
  slug: "n4-extra",
  emoji: "🎯",
  totalWords: fresh.length,
  pages: sectionPages,
};

// ---------- Update vocab.ts text ----------

let updated = cleanedText;

// Find the closing `] as const;` line for the VOCAB_SECTIONS array.
const CLOSE_TOKEN = "] as const;";
const closeIdx = updated.lastIndexOf(CLOSE_TOKEN);
if (closeIdx === -1) {
  console.error("Could not find `] as const;` in vocab.ts");
  process.exit(1);
}

// Walk back to find the previous `}` (end of last section object)
let insertAt = closeIdx;
while (insertAt > 0 && updated[insertAt] !== "}") insertAt--;
insertAt += 1; // place insertion after `}`

const newSectionText = JSON.stringify(newSection, null, 2)
  .split("\n")
  .map((l, i) => (i === 0 ? l : "  " + l))
  .join("\n");

const inserted = `,\n  ${newSectionText}`;
updated = updated.slice(0, insertAt) + inserted + updated.slice(insertAt);

// Recompute totals
const totalWords = Array.from(updated.matchAll(/"kanji":\s*"/g)).length;

updated = updated.replace(
  /\/\/ Total words: \d+/,
  `// Total words: ${totalWords}`
);
updated = updated.replace(
  /export const TOTAL_WORDS = \d+;/,
  `export const TOTAL_WORDS = ${totalWords};`
);

writeFileSync(VOCAB_PATH, updated, "utf8");
console.log(`Wrote ${VOCAB_PATH}; total words now: ${totalWords}`);
