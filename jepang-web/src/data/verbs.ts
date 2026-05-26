// Daftar kata kerja N4 (~150) untuk drill konjugasi.
// Kategori grup dipakai oleh src/lib/conjugate.ts untuk menentukan pola.

export type VerbGroup =
  | "ichidan"
  | "godan-u"
  | "godan-tsu"
  | "godan-ru"
  | "godan-ku"
  | "godan-gu"
  | "godan-su"
  | "godan-mu"
  | "godan-nu"
  | "godan-bu"
  | "irregular";

export interface Verb {
  dict: string;
  romaji: string;
  arti: string;
  group: VerbGroup;
}

export const VERBS: Verb[] = [
  // Irregular
  { dict: "する", romaji: "suru", arti: "melakukan", group: "irregular" },
  { dict: "来る", romaji: "kuru", arti: "datang", group: "irregular" },

  // Ichidan (一段) — berakhiran iru/eru + る
  { dict: "食べる", romaji: "taberu", arti: "makan", group: "ichidan" },
  { dict: "見る", romaji: "miru", arti: "melihat", group: "ichidan" },
  { dict: "寝る", romaji: "neru", arti: "tidur", group: "ichidan" },
  { dict: "起きる", romaji: "okiru", arti: "bangun (dari tidur)", group: "ichidan" },
  { dict: "出る", romaji: "deru", arti: "keluar", group: "ichidan" },
  { dict: "いる", romaji: "iru", arti: "ada (makhluk hidup)", group: "ichidan" },
  { dict: "教える", romaji: "oshieru", arti: "mengajar / memberitahu", group: "ichidan" },
  { dict: "覚える", romaji: "oboeru", arti: "mengingat / menghafal", group: "ichidan" },
  { dict: "忘れる", romaji: "wasureru", arti: "lupa", group: "ichidan" },
  { dict: "始める", romaji: "hajimeru", arti: "memulai", group: "ichidan" },
  { dict: "閉める", romaji: "shimeru", arti: "menutup", group: "ichidan" },
  { dict: "開ける", romaji: "akeru", arti: "membuka", group: "ichidan" },
  { dict: "つける", romaji: "tsukeru", arti: "menyalakan", group: "ichidan" },
  { dict: "消える", romaji: "kieru", arti: "menghilang / padam", group: "ichidan" },
  { dict: "見せる", romaji: "miseru", arti: "menunjukkan", group: "ichidan" },
  { dict: "決める", romaji: "kimeru", arti: "memutuskan", group: "ichidan" },
  { dict: "考える", romaji: "kangaeru", arti: "berpikir / memikirkan", group: "ichidan" },
  { dict: "答える", romaji: "kotaeru", arti: "menjawab", group: "ichidan" },
  { dict: "受ける", romaji: "ukeru", arti: "menerima / mengikuti", group: "ichidan" },
  { dict: "助ける", romaji: "tasukeru", arti: "menolong", group: "ichidan" },
  { dict: "止める", romaji: "tomeru", arti: "menghentikan", group: "ichidan" },
  { dict: "やめる", romaji: "yameru", arti: "berhenti melakukan", group: "ichidan" },
  { dict: "降りる", romaji: "oriru", arti: "turun (kendaraan)", group: "ichidan" },
  { dict: "借りる", romaji: "kariru", arti: "meminjam", group: "ichidan" },
  { dict: "着る", romaji: "kiru", arti: "memakai pakaian", group: "ichidan" },
  { dict: "浴びる", romaji: "abiru", arti: "mandi (siraman)", group: "ichidan" },
  { dict: "信じる", romaji: "shinjiru", arti: "percaya", group: "ichidan" },
  { dict: "感じる", romaji: "kanjiru", arti: "merasakan", group: "ichidan" },
  { dict: "比べる", romaji: "kuraberu", arti: "membandingkan", group: "ichidan" },
  { dict: "調べる", romaji: "shiraberu", arti: "memeriksa / menyelidiki", group: "ichidan" },
  { dict: "並べる", romaji: "naraberu", arti: "menyusun berjajar", group: "ichidan" },
  { dict: "建てる", romaji: "tateru", arti: "membangun", group: "ichidan" },
  { dict: "捨てる", romaji: "suteru", arti: "membuang", group: "ichidan" },
  { dict: "育てる", romaji: "sodateru", arti: "membesarkan / merawat", group: "ichidan" },
  { dict: "迎える", romaji: "mukaeru", arti: "menjemput / menyambut", group: "ichidan" },
  { dict: "別れる", romaji: "wakareru", arti: "berpisah", group: "ichidan" },
  { dict: "疲れる", romaji: "tsukareru", arti: "lelah", group: "ichidan" },
  { dict: "慣れる", romaji: "nareru", arti: "terbiasa", group: "ichidan" },
  { dict: "晴れる", romaji: "hareru", arti: "cerah (cuaca)", group: "ichidan" },
  { dict: "遅れる", romaji: "okureru", arti: "terlambat", group: "ichidan" },
  { dict: "生まれる", romaji: "umareru", arti: "lahir", group: "ichidan" },
  { dict: "見える", romaji: "mieru", arti: "terlihat / kelihatan", group: "ichidan" },
  { dict: "聞こえる", romaji: "kikoeru", arti: "terdengar", group: "ichidan" },
  { dict: "出かける", romaji: "dekakeru", arti: "keluar / pergi keluar", group: "ichidan" },
  { dict: "間違える", romaji: "machigaeru", arti: "salah / keliru", group: "ichidan" },
  { dict: "落ちる", romaji: "ochiru", arti: "jatuh", group: "ichidan" },
  { dict: "過ぎる", romaji: "sugiru", arti: "melewati / melebihi", group: "ichidan" },
  { dict: "似る", romaji: "niru", arti: "mirip", group: "ichidan" },
  { dict: "勤める", romaji: "tsutomeru", arti: "bekerja di (suatu tempat)", group: "ichidan" },
  { dict: "やせる", romaji: "yaseru", arti: "menjadi kurus", group: "ichidan" },
  { dict: "太る", romaji: "futoru", arti: "menjadi gemuk", group: "godan-ru" },
  { dict: "閉じる", romaji: "tojiru", arti: "menutup (mata/buku)", group: "ichidan" },

  // Godan -u
  { dict: "買う", romaji: "kau", arti: "membeli", group: "godan-u" },
  { dict: "会う", romaji: "au", arti: "bertemu", group: "godan-u" },
  { dict: "言う", romaji: "iu", arti: "mengatakan", group: "godan-u" },
  { dict: "使う", romaji: "tsukau", arti: "memakai", group: "godan-u" },
  { dict: "歌う", romaji: "utau", arti: "menyanyi", group: "godan-u" },
  { dict: "洗う", romaji: "arau", arti: "mencuci", group: "godan-u" },
  { dict: "笑う", romaji: "warau", arti: "tertawa", group: "godan-u" },
  { dict: "習う", romaji: "narau", arti: "belajar (dari guru)", group: "godan-u" },
  { dict: "違う", romaji: "chigau", arti: "berbeda", group: "godan-u" },
  { dict: "迷う", romaji: "mayou", arti: "tersesat / bingung", group: "godan-u" },
  { dict: "払う", romaji: "harau", arti: "membayar", group: "godan-u" },
  { dict: "手伝う", romaji: "tetsudau", arti: "membantu", group: "godan-u" },
  { dict: "思う", romaji: "omou", arti: "berpikir / mengira", group: "godan-u" },

  // Godan -ku
  { dict: "書く", romaji: "kaku", arti: "menulis", group: "godan-ku" },
  { dict: "聞く", romaji: "kiku", arti: "mendengar / bertanya", group: "godan-ku" },
  { dict: "行く", romaji: "iku", arti: "pergi", group: "godan-ku" },
  { dict: "歩く", romaji: "aruku", arti: "berjalan", group: "godan-ku" },
  { dict: "働く", romaji: "hataraku", arti: "bekerja", group: "godan-ku" },
  { dict: "着く", romaji: "tsuku", arti: "tiba", group: "godan-ku" },
  { dict: "開く", romaji: "aku", arti: "terbuka", group: "godan-ku" },
  { dict: "泣く", romaji: "naku", arti: "menangis", group: "godan-ku" },
  { dict: "弾く", romaji: "hiku", arti: "memainkan alat musik (petik/tekan)", group: "godan-ku" },
  { dict: "履く", romaji: "haku", arti: "memakai (alas kaki/celana)", group: "godan-ku" },
  { dict: "置く", romaji: "oku", arti: "meletakkan", group: "godan-ku" },
  { dict: "招く", romaji: "maneku", arti: "mengundang", group: "godan-ku" },
  { dict: "驚く", romaji: "odoroku", arti: "terkejut", group: "godan-ku" },
  { dict: "続く", romaji: "tsuzuku", arti: "berlanjut", group: "godan-ku" },

  // Godan -gu
  { dict: "泳ぐ", romaji: "oyogu", arti: "berenang", group: "godan-gu" },
  { dict: "急ぐ", romaji: "isogu", arti: "buru-buru", group: "godan-gu" },
  { dict: "脱ぐ", romaji: "nugu", arti: "melepas (pakaian)", group: "godan-gu" },
  { dict: "騒ぐ", romaji: "sawagu", arti: "ribut / berisik", group: "godan-gu" },
  { dict: "嗅ぐ", romaji: "kagu", arti: "mencium (bau)", group: "godan-gu" },

  // Godan -su
  { dict: "話す", romaji: "hanasu", arti: "berbicara", group: "godan-su" },
  { dict: "貸す", romaji: "kasu", arti: "meminjamkan", group: "godan-su" },
  { dict: "返す", romaji: "kaesu", arti: "mengembalikan", group: "godan-su" },
  { dict: "押す", romaji: "osu", arti: "mendorong / menekan", group: "godan-su" },
  { dict: "出す", romaji: "dasu", arti: "mengeluarkan", group: "godan-su" },
  { dict: "消す", romaji: "kesu", arti: "memadamkan / menghapus", group: "godan-su" },
  { dict: "直す", romaji: "naosu", arti: "memperbaiki", group: "godan-su" },
  { dict: "探す", romaji: "sagasu", arti: "mencari", group: "godan-su" },
  { dict: "なくす", romaji: "nakusu", arti: "menghilangkan", group: "godan-su" },
  { dict: "落とす", romaji: "otosu", arti: "menjatuhkan", group: "godan-su" },
  { dict: "渡す", romaji: "watasu", arti: "menyerahkan", group: "godan-su" },
  { dict: "起こす", romaji: "okosu", arti: "membangunkan", group: "godan-su" },

  // Godan -tsu
  { dict: "待つ", romaji: "matsu", arti: "menunggu", group: "godan-tsu" },
  { dict: "持つ", romaji: "motsu", arti: "memegang / membawa", group: "godan-tsu" },
  { dict: "立つ", romaji: "tatsu", arti: "berdiri", group: "godan-tsu" },
  { dict: "勝つ", romaji: "katsu", arti: "menang", group: "godan-tsu" },
  { dict: "打つ", romaji: "utsu", arti: "memukul", group: "godan-tsu" },
  { dict: "育つ", romaji: "sodatsu", arti: "tumbuh / dibesarkan", group: "godan-tsu" },

  // Godan -nu
  { dict: "死ぬ", romaji: "shinu", arti: "mati", group: "godan-nu" },

  // Godan -bu
  { dict: "遊ぶ", romaji: "asobu", arti: "bermain", group: "godan-bu" },
  { dict: "呼ぶ", romaji: "yobu", arti: "memanggil", group: "godan-bu" },
  { dict: "飛ぶ", romaji: "tobu", arti: "terbang", group: "godan-bu" },
  { dict: "選ぶ", romaji: "erabu", arti: "memilih", group: "godan-bu" },
  { dict: "運ぶ", romaji: "hakobu", arti: "membawa / mengangkut", group: "godan-bu" },
  { dict: "並ぶ", romaji: "narabu", arti: "berbaris / berjajar", group: "godan-bu" },
  { dict: "喜ぶ", romaji: "yorokobu", arti: "merasa senang", group: "godan-bu" },
  { dict: "学ぶ", romaji: "manabu", arti: "belajar", group: "godan-bu" },

  // Godan -mu
  { dict: "飲む", romaji: "nomu", arti: "minum", group: "godan-mu" },
  { dict: "読む", romaji: "yomu", arti: "membaca", group: "godan-mu" },
  { dict: "休む", romaji: "yasumu", arti: "beristirahat / libur", group: "godan-mu" },
  { dict: "住む", romaji: "sumu", arti: "tinggal", group: "godan-mu" },
  { dict: "進む", romaji: "susumu", arti: "maju", group: "godan-mu" },
  { dict: "頼む", romaji: "tanomu", arti: "minta tolong", group: "godan-mu" },
  { dict: "悲しむ", romaji: "kanashimu", arti: "merasa sedih", group: "godan-mu" },
  { dict: "楽しむ", romaji: "tanoshimu", arti: "menikmati", group: "godan-mu" },
  { dict: "噛む", romaji: "kamu", arti: "menggigit / mengunyah", group: "godan-mu" },
  { dict: "踏む", romaji: "fumu", arti: "menginjak", group: "godan-mu" },
  { dict: "包む", romaji: "tsutsumu", arti: "membungkus", group: "godan-mu" },

  // Godan -ru
  { dict: "ある", romaji: "aru", arti: "ada (benda mati)", group: "godan-ru" },
  { dict: "分かる", romaji: "wakaru", arti: "mengerti", group: "godan-ru" },
  { dict: "帰る", romaji: "kaeru", arti: "pulang", group: "godan-ru" },
  { dict: "走る", romaji: "hashiru", arti: "berlari", group: "godan-ru" },
  { dict: "入る", romaji: "hairu", arti: "masuk", group: "godan-ru" },
  { dict: "知る", romaji: "shiru", arti: "tahu / mengetahui", group: "godan-ru" },
  { dict: "切る", romaji: "kiru", arti: "memotong", group: "godan-ru" },
  { dict: "取る", romaji: "toru", arti: "mengambil", group: "godan-ru" },
  { dict: "撮る", romaji: "toru", arti: "memotret", group: "godan-ru" },
  { dict: "売る", romaji: "uru", arti: "menjual", group: "godan-ru" },
  { dict: "作る", romaji: "tsukuru", arti: "membuat", group: "godan-ru" },
  { dict: "降る", romaji: "furu", arti: "turun (hujan/salju)", group: "godan-ru" },
  { dict: "止まる", romaji: "tomaru", arti: "berhenti", group: "godan-ru" },
  { dict: "始まる", romaji: "hajimaru", arti: "dimulai", group: "godan-ru" },
  { dict: "終わる", romaji: "owaru", arti: "berakhir", group: "godan-ru" },
  { dict: "曲がる", romaji: "magaru", arti: "berbelok", group: "godan-ru" },
  { dict: "渡る", romaji: "wataru", arti: "menyeberang", group: "godan-ru" },
  { dict: "送る", romaji: "okuru", arti: "mengirim / mengantar", group: "godan-ru" },
  { dict: "頑張る", romaji: "ganbaru", arti: "berusaha keras", group: "godan-ru" },
  { dict: "困る", romaji: "komaru", arti: "kerepotan / bingung", group: "godan-ru" },
  { dict: "なる", romaji: "naru", arti: "menjadi", group: "godan-ru" },
  { dict: "乗る", romaji: "noru", arti: "naik (kendaraan)", group: "godan-ru" },
  { dict: "登る", romaji: "noboru", arti: "mendaki", group: "godan-ru" },
  { dict: "怒る", romaji: "okoru", arti: "marah", group: "godan-ru" },
  { dict: "売れる", romaji: "ureru", arti: "laku terjual", group: "ichidan" },
  { dict: "座る", romaji: "suwaru", arti: "duduk", group: "godan-ru" },
  { dict: "通る", romaji: "tooru", arti: "melewati", group: "godan-ru" },
  { dict: "戻る", romaji: "modoru", arti: "kembali", group: "godan-ru" },
  { dict: "残る", romaji: "nokoru", arti: "tersisa", group: "godan-ru" },
  { dict: "光る", romaji: "hikaru", arti: "bersinar", group: "godan-ru" },
  { dict: "回る", romaji: "mawaru", arti: "berputar / berkeliling", group: "godan-ru" },
  { dict: "受かる", romaji: "ukaru", arti: "lulus (ujian)", group: "godan-ru" },
  { dict: "怒鳴る", romaji: "donaru", arti: "membentak", group: "godan-ru" },
  { dict: "守る", romaji: "mamoru", arti: "menjaga / melindungi", group: "godan-ru" },
  { dict: "踊る", romaji: "odoru", arti: "menari", group: "godan-ru" },
  { dict: "祈る", romaji: "inoru", arti: "berdoa", group: "godan-ru" },
];

export const VERB_TOTAL = VERBS.length;

export function verbByDict(dict: string): Verb | undefined {
  return VERBS.find((v) => v.dict === dict);
}
