#!/usr/bin/env node
// Generate src/data/kaigo.ts from a curated list of vocabulary entries
// derived from two source PDFs:
//  - 介護の日本語学習教材 (H29) — 入国後講習 & 実習実施者
//  - 介護技能評価試験対応テキスト (Buku Teks JACSW, 2019)
// Vocab is organized into two modules: Kaigo 1 (Dasar) and Kaigo 2 (Lanjutan).
// Sections are ordered by frequency-of-use: tubuh (body) and organ tubuh come first.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGE_SIZE = 30;

/** @typedef {{ kanji: string; romaji: string; arti: string; subcategory: string }} Item */
/** @typedef {{ id: string; label: string; slug: string; emoji: string; items: Item[] }} Section */
/** @typedef {{ id: string; label: string; description: string; emoji: string; sections: Section[] }} ModuleSpec */

/** @type {ModuleSpec[]} */
const MODULES = [
  {
    id: "kaigo-1",
    label: "Kaigo 1 — Dasar",
    description:
      "Kosakata dasar perawatan lansia. Diurutkan dari yang paling sering dipakai: tubuh & organ.",
    emoji: "🧑‍⚕️",
    sections: [
      {
        id: "k1-tubuh",
        label: "Tubuh (Anggota Badan)",
        slug: "tubuh",
        emoji: "🧍",
        items: [
          { kanji: "頭", romaji: "atama", arti: "kepala" },
          { kanji: "髪の毛", romaji: "kaminoke", arti: "rambut" },
          { kanji: "顔", romaji: "kao", arti: "wajah" },
          { kanji: "額", romaji: "hitai", arti: "dahi" },
          { kanji: "目", romaji: "me", arti: "mata" },
          { kanji: "耳", romaji: "mimi", arti: "telinga" },
          { kanji: "鼻", romaji: "hana", arti: "hidung" },
          { kanji: "口", romaji: "kuchi", arti: "mulut" },
          { kanji: "歯", romaji: "ha", arti: "gigi" },
          { kanji: "唇", romaji: "kuchibiru", arti: "bibir" },
          { kanji: "顎", romaji: "ago", arti: "dagu" },
          { kanji: "頬", romaji: "hoho", arti: "pipi" },
          { kanji: "喉", romaji: "nodo", arti: "tenggorokan" },
          { kanji: "首", romaji: "kubi", arti: "leher" },
          { kanji: "肩", romaji: "kata", arti: "bahu" },
          { kanji: "わきの下", romaji: "wakinoshita", arti: "ketiak" },
          { kanji: "胸", romaji: "mune", arti: "dada" },
          { kanji: "腕", romaji: "ude", arti: "lengan" },
          { kanji: "肘", romaji: "hiji", arti: "siku" },
          { kanji: "手首", romaji: "tekubi", arti: "pergelangan tangan" },
          { kanji: "手", romaji: "te", arti: "tangan" },
          { kanji: "手のひら", romaji: "tenohira", arti: "telapak tangan" },
          { kanji: "手の甲", romaji: "tenokou", arti: "punggung tangan" },
          { kanji: "指", romaji: "yubi", arti: "jari" },
          { kanji: "指先", romaji: "yubisaki", arti: "ujung jari" },
          { kanji: "爪", romaji: "tsume", arti: "kuku" },
          { kanji: "背中", romaji: "senaka", arti: "punggung" },
          { kanji: "腰", romaji: "koshi", arti: "pinggang" },
          { kanji: "腹", romaji: "hara", arti: "perut" },
          { kanji: "へそ", romaji: "heso", arti: "pusar" },
          { kanji: "尻", romaji: "shiri", arti: "pantat" },
          { kanji: "殿部", romaji: "denbu", arti: "pantat (formal)" },
          { kanji: "太もも", romaji: "futomomo", arti: "paha" },
          { kanji: "ふくらはぎ", romaji: "fukurahagi", arti: "betis" },
          { kanji: "膝", romaji: "hiza", arti: "lutut" },
          { kanji: "足", romaji: "ashi", arti: "kaki" },
          { kanji: "足首", romaji: "ashikubi", arti: "pergelangan kaki" },
          { kanji: "足の裏", romaji: "ashinoura", arti: "telapak kaki" },
          { kanji: "足底", romaji: "sokutei", arti: "telapak kaki (formal)" },
          { kanji: "つま先", romaji: "tsumasaki", arti: "ujung jari kaki" },
          { kanji: "踵", romaji: "kakato", arti: "tumit" },
        ],
      },
      {
        id: "k1-kepala",
        label: "Bagian Kepala (Detail)",
        slug: "kepala",
        emoji: "👤",
        items: [
          { kanji: "まゆ毛", romaji: "mayuge", arti: "alis" },
          { kanji: "まつ毛", romaji: "matsuge", arti: "bulu mata" },
          { kanji: "顔色", romaji: "kaoiro", arti: "air muka" },
          { kanji: "額", romaji: "hitai", arti: "dahi" },
          { kanji: "口元", romaji: "kuchimoto", arti: "sekitar mulut" },
          { kanji: "目元", romaji: "memoto", arti: "sekitar mata" },
          { kanji: "頭部", romaji: "toubu", arti: "bagian kepala" },
        ],
      },
      {
        id: "k1-tangan",
        label: "Bagian Tangan (Detail Jari)",
        slug: "tangan",
        emoji: "🖐️",
        items: [
          { kanji: "親指", romaji: "oyayubi", arti: "ibu jari / jempol" },
          { kanji: "人差し指", romaji: "hitosashiyubi", arti: "jari telunjuk" },
          { kanji: "中指", romaji: "nakayubi", arti: "jari tengah" },
          { kanji: "薬指", romaji: "kusuriyubi", arti: "jari manis" },
          { kanji: "小指", romaji: "koyubi", arti: "jari kelingking" },
        ],
      },
      {
        id: "k1-organ-dasar",
        label: "Dalam Tubuh (Organ Dasar)",
        slug: "organ-dasar",
        emoji: "🫀",
        items: [
          { kanji: "筋肉", romaji: "kinniku", arti: "otot" },
          { kanji: "骨", romaji: "hone", arti: "tulang" },
          { kanji: "関節", romaji: "kansetsu", arti: "sendi" },
          { kanji: "心臓", romaji: "shinzou", arti: "jantung" },
          { kanji: "血液", romaji: "ketsueki", arti: "darah" },
          { kanji: "血管", romaji: "kekkan", arti: "pembuluh darah" },
          { kanji: "胃", romaji: "i", arti: "lambung" },
          { kanji: "皮膚", romaji: "hifu", arti: "kulit" },
        ],
      },
      {
        id: "k1-mobilitas",
        label: "Berpindah & Aktivitas Tubuh",
        slug: "mobilitas",
        emoji: "🚶",
        items: [
          { kanji: "移乗", romaji: "ijou", arti: "beralih (pindah duduk)" },
          { kanji: "移動", romaji: "idou", arti: "berpindah" },
          { kanji: "起き上がる", romaji: "okiagaru", arti: "bangkit" },
          { kanji: "立つ", romaji: "tatsu", arti: "berdiri" },
          { kanji: "座る", romaji: "suwaru", arti: "duduk" },
          { kanji: "歩く", romaji: "aruku", arti: "berjalan" },
          { kanji: "寝る", romaji: "neru", arti: "tidur" },
          { kanji: "臥床", romaji: "gashou", arti: "berbaring" },
          { kanji: "離床", romaji: "rishou", arti: "beranjak dari tempat tidur" },
          { kanji: "支える", romaji: "sasaeru", arti: "mendukung" },
          { kanji: "つかまる", romaji: "tsukamaru", arti: "berpegangan" },
          { kanji: "誘導", romaji: "yuudou", arti: "panduan / menuntun" },
          { kanji: "声かけ", romaji: "koekake", arti: "sapaan" },
          { kanji: "練習", romaji: "renshuu", arti: "latihan" },
        ],
      },
      {
        id: "k1-tempat-tidur",
        label: "Tempat Tidur",
        slug: "tempat-tidur",
        emoji: "🛏️",
        items: [
          { kanji: "ベッド", romaji: "beddo", arti: "tempat tidur" },
          { kanji: "枕", romaji: "makura", arti: "bantal" },
          { kanji: "オーバーテーブル", romaji: "oobaa teeburu", arti: "meja makan pasien" },
          { kanji: "毛布", romaji: "moufu", arti: "selimut" },
          { kanji: "シーツ", romaji: "shiitsu", arti: "seprai" },
          { kanji: "床頭台", romaji: "shoutoudai", arti: "meja samping tempat tidur" },
          { kanji: "サイドレール", romaji: "saido reeru", arti: "pagar tempat tidur" },
          { kanji: "ベッド柵", romaji: "beddo saku", arti: "pagar tempat tidur" },
          { kanji: "布団", romaji: "futon", arti: "kasur futon" },
          { kanji: "マットレス", romaji: "mattoresu", arti: "matras" },
        ],
      },
      {
        id: "k1-alat-bantu",
        label: "Alat Bantu Mobilitas",
        slug: "alat-bantu",
        emoji: "🦽",
        items: [
          { kanji: "車椅子", romaji: "kurumaisu", arti: "kursi roda" },
          { kanji: "車いす", romaji: "kurumaisu", arti: "kursi roda" },
          { kanji: "杖", romaji: "tsue", arti: "tongkat" },
          { kanji: "歩行器", romaji: "hokouki", arti: "alat bantu jalan" },
          { kanji: "手すり", romaji: "tesuri", arti: "susuran / pegangan" },
          { kanji: "ブレーキ", romaji: "bureeki", arti: "rem" },
          { kanji: "ストレッチャー", romaji: "sutorettchaa", arti: "brankar" },
          { kanji: "移動用リフト", romaji: "idouyou rifuto", arti: "alat pemindah" },
          { kanji: "スライディングボード", romaji: "suraidingu boodo", arti: "papan penggeser" },
          { kanji: "スライディングシート", romaji: "suraidingu shiito", arti: "kain penggeser" },
        ],
      },
      {
        id: "k1-sapaan",
        label: "Sapaan & Salam",
        slug: "sapaan",
        emoji: "🙇",
        items: [
          { kanji: "おはようございます", romaji: "ohayou gozaimasu", arti: "selamat pagi" },
          { kanji: "こんにちは", romaji: "konnichiwa", arti: "selamat siang" },
          { kanji: "こんばんは", romaji: "konbanwa", arti: "selamat malam" },
          { kanji: "おやすみなさい", romaji: "oyasuminasai", arti: "selamat tidur" },
          { kanji: "ありがとうございます", romaji: "arigatou gozaimasu", arti: "terima kasih" },
          { kanji: "すみません", romaji: "sumimasen", arti: "permisi / maaf" },
          { kanji: "お疲れ様です", romaji: "otsukaresama desu", arti: "terima kasih sudah bekerja" },
          { kanji: "失礼します", romaji: "shitsurei shimasu", arti: "permisi" },
          { kanji: "お大事に", romaji: "odaiji ni", arti: "semoga lekas sembuh" },
          { kanji: "いただきます", romaji: "itadakimasu", arti: "selamat makan" },
          { kanji: "ごちそうさま", romaji: "gochisousama", arti: "terima kasih atas makanannya" },
          { kanji: "お願いします", romaji: "onegai shimasu", arti: "tolong / silakan" },
          { kanji: "はい", romaji: "hai", arti: "ya" },
          { kanji: "いいえ", romaji: "iie", arti: "tidak" },
          { kanji: "大丈夫", romaji: "daijoubu", arti: "tidak apa-apa" },
          { kanji: "わかりました", romaji: "wakarimashita", arti: "mengerti" },
          { kanji: "どうぞ", romaji: "douzo", arti: "silakan" },
          { kanji: "ゆっくり", romaji: "yukkuri", arti: "pelan-pelan" },
        ],
      },
      {
        id: "k1-makanan",
        label: "Makanan (Daftar)",
        slug: "makanan",
        emoji: "🍱",
        items: [
          { kanji: "ご飯", romaji: "gohan", arti: "nasi putih" },
          { kanji: "お茶", romaji: "ocha", arti: "teh hijau" },
          { kanji: "麦茶", romaji: "mugicha", arti: "teh gandum" },
          { kanji: "献立", romaji: "kondate", arti: "daftar makanan" },
          { kanji: "献立表", romaji: "kondatehyou", arti: "tabel daftar makanan" },
          { kanji: "主食", romaji: "shushoku", arti: "makanan pokok" },
          { kanji: "副食", romaji: "fukushoku", arti: "lauk" },
          { kanji: "汁物", romaji: "shirumono", arti: "sup" },
          { kanji: "漬物", romaji: "tsukemono", arti: "acar" },
          { kanji: "煮物", romaji: "nimono", arti: "rebusan" },
          { kanji: "煮付け", romaji: "nitsuke", arti: "rebus berbumbu" },
          { kanji: "焼き魚", romaji: "yakizakana", arti: "ikan bakar" },
          { kanji: "揚げ物", romaji: "agemono", arti: "gorengan" },
          { kanji: "炒め物", romaji: "itamemono", arti: "tumis" },
          { kanji: "豆腐", romaji: "toufu", arti: "tahu" },
          { kanji: "丼", romaji: "donburi", arti: "nasi mangkuk" },
          { kanji: "カレーライス", romaji: "kareeraisu", arti: "nasi kari" },
          { kanji: "メニュー", romaji: "menyuu", arti: "menu" },
          { kanji: "ヨーグルト", romaji: "yooguruto", arti: "yoghurt" },
          { kanji: "牛乳", romaji: "gyuunyuu", arti: "susu sapi" },
          { kanji: "パン", romaji: "pan", arti: "roti" },
          { kanji: "水", romaji: "mizu", arti: "air" },
        ],
      },
      {
        id: "k1-makan",
        label: "Aktivitas Makan",
        slug: "makan",
        emoji: "🍚",
        items: [
          { kanji: "食事", romaji: "shokuji", arti: "makan / makanan (kegiatan)" },
          { kanji: "食品", romaji: "shokuhin", arti: "makanan" },
          { kanji: "食堂", romaji: "shokudou", arti: "ruang makan" },
          { kanji: "エプロン", romaji: "epuron", arti: "celemek" },
          { kanji: "嚥下", romaji: "enge", arti: "deglutisi (menelan)" },
          { kanji: "誤嚥", romaji: "goen", arti: "aspirasi (salah menelan)" },
          { kanji: "水分補給", romaji: "suibun hokyuu", arti: "asupan cairan" },
          { kanji: "咳込む", romaji: "sekikomu", arti: "batuk-batuk" },
          { kanji: "とろみ", romaji: "toromi", arti: "kekentalan" },
          { kanji: "飲み込み", romaji: "nomikomi", arti: "menelan" },
          { kanji: "むせる", romaji: "museru", arti: "tersedak" },
          { kanji: "量", romaji: "ryou", arti: "jumlah" },
          { kanji: "はし", romaji: "hashi", arti: "sumpit" },
          { kanji: "スプーン", romaji: "supuun", arti: "sendok" },
          { kanji: "茶碗", romaji: "chawan", arti: "mangkuk nasi" },
          { kanji: "コップ", romaji: "koppu", arti: "gelas" },
        ],
      },
      {
        id: "k1-ekskresi",
        label: "Ekskresi (Buang Air)",
        slug: "ekskresi",
        emoji: "🚽",
        items: [
          { kanji: "排泄", romaji: "haisetsu", arti: "ekskresi" },
          { kanji: "尿", romaji: "nyou", arti: "urine" },
          { kanji: "尿意", romaji: "nyoui", arti: "keinginan berkemih" },
          { kanji: "便", romaji: "ben", arti: "feses" },
          { kanji: "便意", romaji: "beni", arti: "keinginan defekasi" },
          { kanji: "便座", romaji: "benza", arti: "toilet duduk" },
          { kanji: "トイレ", romaji: "toire", arti: "toilet" },
          { kanji: "ポータブルトイレ", romaji: "pootaburu toire", arti: "toilet portabel" },
          { kanji: "おむつ", romaji: "omutsu", arti: "popok" },
          { kanji: "失禁", romaji: "shikkin", arti: "inkontinensia" },
          { kanji: "陰部", romaji: "inbu", arti: "area genital" },
          { kanji: "浣腸", romaji: "kanchou", arti: "enema" },
          { kanji: "着替える", romaji: "kigaeru", arti: "berganti pakaian" },
          { kanji: "下げる", romaji: "sageru", arti: "menurunkan" },
          { kanji: "羞恥心", romaji: "shuuchishin", arti: "rasa malu" },
          { kanji: "使い捨て手袋", romaji: "tsukaisute tebukuro", arti: "sarung tangan sekali pakai" },
          { kanji: "パジャマ", romaji: "pajama", arti: "piyama" },
          { kanji: "呼び出しボタン", romaji: "yobidashi botan", arti: "tombol panggil" },
        ],
      },
      {
        id: "k1-berpakaian",
        label: "Berpakaian",
        slug: "berpakaian",
        emoji: "👕",
        items: [
          { kanji: "衣類", romaji: "irui", arti: "pakaian" },
          { kanji: "衣服", romaji: "ifuku", arti: "pakaian" },
          { kanji: "上着", romaji: "uwagi", arti: "baju atasan" },
          { kanji: "下着", romaji: "shitagi", arti: "pakaian dalam" },
          { kanji: "着替え", romaji: "kigae", arti: "berganti pakaian" },
          { kanji: "更衣", romaji: "koui", arti: "berganti pakaian (formal)" },
          { kanji: "パンツ", romaji: "pantsu", arti: "celana dalam" },
          { kanji: "ズボン", romaji: "zubon", arti: "celana" },
          { kanji: "スカート", romaji: "sukaato", arti: "rok" },
          { kanji: "シャツ", romaji: "shatsu", arti: "kemeja" },
          { kanji: "セーター", romaji: "seetaa", arti: "sweater" },
          { kanji: "靴下", romaji: "kutsushita", arti: "kaus kaki" },
          { kanji: "靴", romaji: "kutsu", arti: "sepatu" },
          { kanji: "洋服", romaji: "youfuku", arti: "pakaian (Barat)" },
          { kanji: "着る", romaji: "kiru", arti: "memakai (atas)" },
          { kanji: "脱ぐ", romaji: "nugu", arti: "melepas" },
          { kanji: "はく", romaji: "haku", arti: "memakai (bawah/kaki)" },
          { kanji: "起床", romaji: "kishou", arti: "bangun tidur" },
          { kanji: "みじたく", romaji: "mijitaku", arti: "merapikan diri" },
        ],
      },
      {
        id: "k1-mandi",
        label: "Mandi & Kebersihan Tubuh",
        slug: "mandi",
        emoji: "🛁",
        items: [
          { kanji: "入浴", romaji: "nyuuyoku", arti: "mandi" },
          { kanji: "お風呂", romaji: "ofuro", arti: "ofuro / bak mandi (umum)" },
          { kanji: "浴室", romaji: "yokushitsu", arti: "kamar mandi" },
          { kanji: "浴槽", romaji: "yokusou", arti: "bak mandi" },
          { kanji: "脱衣室", romaji: "datsuishitsu", arti: "ruang ganti pakaian" },
          { kanji: "シャンプー", romaji: "shanpuu", arti: "sampo" },
          { kanji: "リンス", romaji: "rinsu", arti: "kondisioner" },
          { kanji: "せっけん", romaji: "sekken", arti: "sabun" },
          { kanji: "タオル", romaji: "taoru", arti: "handuk" },
          { kanji: "温度", romaji: "ondo", arti: "suhu" },
          { kanji: "湯", romaji: "yu", arti: "air panas" },
          { kanji: "清拭", romaji: "seishiki", arti: "mandi seka" },
          { kanji: "清潔保持", romaji: "seiketsu hoji", arti: "menjaga kebersihan tubuh" },
          { kanji: "洗髪", romaji: "senpatsu", arti: "keramas" },
          { kanji: "洗面", romaji: "senmen", arti: "cuci muka" },
          { kanji: "洗面器", romaji: "senmenki", arti: "baskom" },
          { kanji: "拭く", romaji: "fuku", arti: "menyeka / mengelap" },
          { kanji: "消毒", romaji: "shoudoku", arti: "disinfeksi" },
          { kanji: "消毒液", romaji: "shoudokueki", arti: "larutan antiseptik" },
        ],
      },
      {
        id: "k1-grooming",
        label: "Merapikan Diri",
        slug: "grooming",
        emoji: "🪥",
        items: [
          { kanji: "歯磨き", romaji: "hamigaki", arti: "menyikat gigi / pasta gigi" },
          { kanji: "歯ブラシ", romaji: "haburashi", arti: "sikat gigi" },
          { kanji: "うがい", romaji: "ugai", arti: "berkumur" },
          { kanji: "口腔ケア", romaji: "koukuu kea", arti: "perawatan rongga mulut" },
          { kanji: "入れ歯", romaji: "ireba", arti: "gigi tiruan" },
          { kanji: "義歯", romaji: "gishi", arti: "gigi palsu" },
          { kanji: "歯医者", romaji: "haisha", arti: "dokter gigi" },
          { kanji: "くし", romaji: "kushi", arti: "sisir" },
          { kanji: "ひげ剃り", romaji: "higesori", arti: "pisau cukur" },
          { kanji: "鏡", romaji: "kagami", arti: "cermin" },
          { kanji: "診察", romaji: "shinsatsu", arti: "pemeriksaan medis" },
          { kanji: "診る", romaji: "miru", arti: "memeriksa (medis)" },
          { kanji: "左側", romaji: "hidarigawa", arti: "sisi kiri" },
          { kanji: "右側", romaji: "migigawa", arti: "sisi kanan" },
          { kanji: "夜中", romaji: "yonaka", arti: "tengah malam" },
        ],
      },
    ],
  },
  {
    id: "kaigo-2",
    label: "Kaigo 2 — Lanjutan",
    description:
      "Kosakata kaigo lanjutan untuk kerja di fasilitas. Diurut dari yang paling sering dipakai.",
    emoji: "🏥",
    sections: [
      {
        id: "k2-organ-dalam",
        label: "Organ Dalam Tubuh (Lengkap)",
        slug: "organ-dalam",
        emoji: "🧠",
        items: [
          { kanji: "脳", romaji: "nou", arti: "otak" },
          { kanji: "気管", romaji: "kikan", arti: "trakea" },
          { kanji: "気管支", romaji: "kikanshi", arti: "bronkus" },
          { kanji: "食道", romaji: "shokudou", arti: "kerongkongan / esofagus" },
          { kanji: "肺", romaji: "hai", arti: "paru-paru" },
          { kanji: "肝臓", romaji: "kanzou", arti: "hati" },
          { kanji: "腎臓", romaji: "jinzou", arti: "ginjal" },
          { kanji: "小腸", romaji: "shouchou", arti: "usus kecil" },
          { kanji: "大腸", romaji: "daichou", arti: "usus besar" },
          { kanji: "膀胱", romaji: "boukou", arti: "kandung kemih" },
          { kanji: "直腸", romaji: "chokuchou", arti: "rektum" },
          { kanji: "肛門", romaji: "koumon", arti: "anus" },
          { kanji: "心臓", romaji: "shinzou", arti: "jantung" },
          { kanji: "血管", romaji: "kekkan", arti: "pembuluh darah" },
          { kanji: "血液", romaji: "ketsueki", arti: "darah" },
          { kanji: "神経", romaji: "shinkei", arti: "saraf" },
        ],
      },
      {
        id: "k2-posisi-tubuh",
        label: "Posisi Tubuh (体位)",
        slug: "posisi-tubuh",
        emoji: "🛌",
        items: [
          { kanji: "体位", romaji: "taii", arti: "posisi tubuh" },
          { kanji: "姿勢", romaji: "shisei", arti: "postur" },
          { kanji: "体位変換", romaji: "taii henkan", arti: "mengubah posisi" },
          { kanji: "仰臥位", romaji: "gyougai", arti: "posisi supinasi (telentang)" },
          { kanji: "側臥位", romaji: "sokugai", arti: "posisi lateral (miring)" },
          { kanji: "腹臥位", romaji: "fukugai", arti: "posisi pronasi (tengkurap)" },
          { kanji: "端座位", romaji: "tanzai", arti: "duduk tegak lurus di tepi" },
          { kanji: "立位", romaji: "ritsui", arti: "berdiri" },
          { kanji: "椅座位", romaji: "izai", arti: "duduk di kursi" },
          { kanji: "座位", romaji: "zai", arti: "duduk" },
          { kanji: "患側", romaji: "kansoku", arti: "sisi sakit" },
          { kanji: "健側", romaji: "kensoku", arti: "sisi sehat" },
          { kanji: "片麻痺", romaji: "katamahi", arti: "hemiplegia" },
        ],
      },
      {
        id: "k2-kondisi-tubuh",
        label: "Pemeriksaan Kondisi Tubuh",
        slug: "kondisi-tubuh",
        emoji: "🌡️",
        items: [
          { kanji: "体温", romaji: "taion", arti: "suhu tubuh" },
          { kanji: "脈拍", romaji: "myakuhaku", arti: "denyut nadi" },
          { kanji: "呼吸", romaji: "kokyuu", arti: "pernapasan" },
          { kanji: "測定", romaji: "sokutei", arti: "pengukuran" },
          { kanji: "体調", romaji: "taichou", arti: "kondisi fisik" },
          { kanji: "表情", romaji: "hyoujou", arti: "ekspresi wajah" },
          { kanji: "健康", romaji: "kenkou", arti: "kesehatan" },
          { kanji: "バイタルサイン", romaji: "baitaru sain", arti: "tanda-tanda vital" },
          { kanji: "観察", romaji: "kansatsu", arti: "mengamati / observasi" },
          { kanji: "確認", romaji: "kakunin", arti: "memeriksa / memastikan" },
          { kanji: "顔色", romaji: "kaoiro", arti: "air muka" },
          { kanji: "記録", romaji: "kiroku", arti: "catatan" },
          { kanji: "気分", romaji: "kibun", arti: "perasaan / mood" },
          { kanji: "意識", romaji: "ishiki", arti: "kesadaran" },
        ],
      },
      {
        id: "k2-gejala",
        label: "Gejala Penyakit",
        slug: "gejala",
        emoji: "🤒",
        items: [
          { kanji: "症状", romaji: "shoujou", arti: "gejala" },
          { kanji: "痛い", romaji: "itai", arti: "sakit" },
          { kanji: "痛み", romaji: "itami", arti: "rasa sakit" },
          { kanji: "嘔吐", romaji: "outo", arti: "muntah" },
          { kanji: "吐き気", romaji: "hakike", arti: "mual" },
          { kanji: "かゆい", romaji: "kayui", arti: "gatal" },
          { kanji: "かゆみ", romaji: "kayumi", arti: "rasa gatal" },
          { kanji: "苦しい", romaji: "kurushii", arti: "menderita / sesak" },
          { kanji: "下痢", romaji: "geri", arti: "diare" },
          { kanji: "便秘", romaji: "benpi", arti: "konstipasi / sembelit" },
          { kanji: "拘縮", romaji: "koushuku", arti: "kontraktur" },
          { kanji: "骨折", romaji: "kossetsu", arti: "fraktur" },
          { kanji: "褥瘡", romaji: "jokusou", arti: "dekubitus" },
          { kanji: "咳", romaji: "seki", arti: "batuk" },
          { kanji: "痰", romaji: "tan", arti: "dahak" },
          { kanji: "発汗", romaji: "hakkan", arti: "berkeringat" },
          { kanji: "発疹", romaji: "hosshin", arti: "ruam" },
          { kanji: "発熱", romaji: "hatsunetsu", arti: "demam" },
          { kanji: "熱", romaji: "netsu", arti: "demam (panas)" },
          { kanji: "めまい", romaji: "memai", arti: "pusing" },
          { kanji: "やけど", romaji: "yakedo", arti: "luka bakar" },
          { kanji: "転倒", romaji: "tentou", arti: "terjatuh" },
          { kanji: "失禁", romaji: "shikkin", arti: "inkontinensia" },
          { kanji: "出血", romaji: "shukketsu", arti: "perdarahan" },
        ],
      },
      {
        id: "k2-penyakit",
        label: "Penyakit",
        slug: "penyakit",
        emoji: "💊",
        items: [
          { kanji: "風邪", romaji: "kaze", arti: "masuk angin / flu" },
          { kanji: "インフルエンザ", romaji: "infuruenza", arti: "influenza" },
          { kanji: "ノロウイルス", romaji: "noro uirusu", arti: "norovirus" },
          { kanji: "食中毒", romaji: "shokuchuudoku", arti: "keracunan makanan" },
          { kanji: "高血圧症", romaji: "kouketsuatsushou", arti: "hipertensi" },
          { kanji: "認知症", romaji: "ninchishou", arti: "demensia" },
          { kanji: "白内障", romaji: "hakunaishou", arti: "katarak" },
          { kanji: "疥癬", romaji: "kaisen", arti: "skabies" },
          { kanji: "感染症", romaji: "kansenshou", arti: "penyakit menular" },
          { kanji: "脳梗塞", romaji: "noukousoku", arti: "stroke iskemik" },
          { kanji: "糖尿病", romaji: "tounyoubyou", arti: "diabetes" },
          { kanji: "肺炎", romaji: "haien", arti: "pneumonia" },
        ],
      },
      {
        id: "k2-rumah-tangga",
        label: "Pekerjaan Rumah Tangga",
        slug: "rumah-tangga",
        emoji: "🧺",
        items: [
          { kanji: "家事", romaji: "kaji", arti: "pekerjaan rumah" },
          { kanji: "掃除", romaji: "souji", arti: "membersihkan" },
          { kanji: "清掃", romaji: "seisou", arti: "membersihkan (formal)" },
          { kanji: "洗濯", romaji: "sentaku", arti: "mencuci (pakaian)" },
          { kanji: "洗濯物", romaji: "sentakumono", arti: "cucian" },
          { kanji: "おしぼり", romaji: "oshibori", arti: "lap tangan basah" },
          { kanji: "カーテン", romaji: "kaaten", arti: "tirai" },
          { kanji: "換気", romaji: "kanki", arti: "pergantian udara" },
          { kanji: "片付ける", romaji: "katazukeru", arti: "membereskan" },
          { kanji: "乾かす", romaji: "kawakasu", arti: "mengeringkan" },
          { kanji: "乾く", romaji: "kawaku", arti: "mengering" },
          { kanji: "ごみ箱", romaji: "gomibako", arti: "kotak sampah" },
          { kanji: "ごみ", romaji: "gomi", arti: "sampah" },
          { kanji: "たたむ", romaji: "tatamu", arti: "melipat" },
          { kanji: "調理", romaji: "chouri", arti: "memasak" },
          { kanji: "干す", romaji: "hosu", arti: "menjemur" },
          { kanji: "枕", romaji: "makura", arti: "bantal" },
          { kanji: "布団", romaji: "futon", arti: "kasur futon" },
        ],
      },
      {
        id: "k2-fasilitas",
        label: "Kehidupan Fasilitas",
        slug: "fasilitas",
        emoji: "🏢",
        items: [
          { kanji: "利用者", romaji: "riyousha", arti: "pengguna (lansia yang dilayani)" },
          { kanji: "施設", romaji: "shisetsu", arti: "fasilitas" },
          { kanji: "玄関", romaji: "genkan", arti: "area pintu masuk" },
          { kanji: "ホール", romaji: "hooru", arti: "aula" },
          { kanji: "建物", romaji: "tatemono", arti: "bangunan" },
          { kanji: "県", romaji: "ken", arti: "prefektur" },
          { kanji: "ケース", romaji: "keesu", arti: "kasus" },
          { kanji: "行事", romaji: "gyouji", arti: "acara" },
          { kanji: "計画", romaji: "keikaku", arti: "rencana" },
          { kanji: "掲示", romaji: "keiji", arti: "pengumuman" },
          { kanji: "参加", romaji: "sanka", arti: "partisipasi" },
          { kanji: "参加者", romaji: "sankasha", arti: "peserta" },
          { kanji: "禁煙", romaji: "kin'en", arti: "dilarang merokok" },
          { kanji: "禁止", romaji: "kinshi", arti: "larangan" },
          { kanji: "使用", romaji: "shiyou", arti: "menggunakan" },
          { kanji: "状況", romaji: "joukyou", arti: "kondisi / situasi" },
          { kanji: "ショートステイ", romaji: "shooto sutei", arti: "tinggal jangka pendek" },
          { kanji: "自立", romaji: "jiritsu", arti: "kemandirian" },
          { kanji: "スケジュール", romaji: "sukejuuru", arti: "jadwal" },
          { kanji: "送迎車", romaji: "sougeisha", arti: "mobil antar-jemput" },
          { kanji: "タイヤ", romaji: "taiya", arti: "roda" },
          { kanji: "建物", romaji: "tatemono", arti: "bangunan" },
          { kanji: "ミーティング", romaji: "miitingu", arti: "pertemuan" },
          { kanji: "面会", romaji: "menkai", arti: "besuk" },
          { kanji: "まつり", romaji: "matsuri", arti: "festival" },
          { kanji: "アルコール", romaji: "arukouru", arti: "alkohol" },
          { kanji: "服薬", romaji: "fukuyaku", arti: "minum obat" },
          { kanji: "非常ベル", romaji: "hijou beru", arti: "alarm darurat" },
          { kanji: "119番", romaji: "hyaku juu kyuu ban", arti: "panggilan darurat 119" },
        ],
      },
      {
        id: "k2-staf-komunikasi",
        label: "Staf, Shift & Komunikasi",
        slug: "staf-komunikasi",
        emoji: "👥",
        items: [
          { kanji: "介護職", romaji: "kaigoshoku", arti: "staf perawat lansia" },
          { kanji: "介護福祉士", romaji: "kaigo fukushishi", arti: "care worker bersertifikat" },
          { kanji: "看護職", romaji: "kangoshoku", arti: "staf perawat (kesehatan)" },
          { kanji: "看護師", romaji: "kangoshi", arti: "perawat" },
          { kanji: "職員", romaji: "shokuin", arti: "staf" },
          { kanji: "リーダー", romaji: "riidaa", arti: "kepala tim" },
          { kanji: "担当者", romaji: "tantousha", arti: "staf penanggung jawab" },
          { kanji: "調理員", romaji: "chouriin", arti: "juru masak" },
          { kanji: "医者", romaji: "isha", arti: "dokter" },
          { kanji: "日勤", romaji: "nikkin", arti: "shift siang" },
          { kanji: "夜勤", romaji: "yakin", arti: "shift malam" },
          { kanji: "出勤", romaji: "shukkin", arti: "pergi bekerja" },
          { kanji: "退勤", romaji: "taikin", arti: "pulang bekerja" },
          { kanji: "就寝", romaji: "shuushin", arti: "pergi tidur" },
          { kanji: "起床", romaji: "kishou", arti: "bangun tidur" },
          { kanji: "巡視", romaji: "junshi", arti: "patroli" },
          { kanji: "見守り", romaji: "mimamori", arti: "mengawasi" },
          { kanji: "申し送り", romaji: "moushiokuri", arti: "serah-terima" },
          { kanji: "報告", romaji: "houkoku", arti: "laporan" },
          { kanji: "連絡", romaji: "renraku", arti: "menghubungi" },
          { kanji: "相談", romaji: "soudan", arti: "konsultasi" },
          { kanji: "事故", romaji: "jiko", arti: "kecelakaan" },
          { kanji: "入院", romaji: "nyuuin", arti: "dirawat di rumah sakit" },
          { kanji: "退院", romaji: "taiin", arti: "pulang dari rumah sakit" },
          { kanji: "流行", romaji: "ryuukou", arti: "mewabah / epidemik" },
          { kanji: "ナースコール", romaji: "naasu kooru", arti: "alat pemanggil perawat" },
        ],
      },
    ],
  },
];

// --- Validation & dedup within section ---
for (const mod of MODULES) {
  for (const sec of mod.sections) {
    const seen = new Set();
    sec.items = sec.items.filter((it) => {
      const key = `${it.kanji}|${it.arti}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    for (const it of sec.items) {
      if (!it.kanji || !it.romaji || !it.arti) {
        throw new Error(`Missing field in ${sec.id}: ${JSON.stringify(it)}`);
      }
    }
  }
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

const outModules = MODULES.map((mod) => {
  const sections = mod.sections.map((sec) => {
    const pages = chunk(sec.items, PAGE_SIZE).map((items, pageIndex) => ({
      pageIndex,
      items: items.map((it) => ({
        kanji: it.kanji,
        romaji: it.romaji,
        arti: it.arti,
        subcategory: sec.label,
      })),
    }));
    return {
      id: sec.id,
      label: sec.label,
      slug: sec.slug,
      emoji: sec.emoji,
      totalWords: sec.items.length,
      pages,
    };
  });
  const totalWords = sections.reduce((acc, s) => acc + s.totalWords, 0);
  return {
    id: mod.id,
    label: mod.label,
    description: mod.description,
    emoji: mod.emoji,
    totalWords,
    sections,
  };
});

const totalAll = outModules.reduce((acc, m) => acc + m.totalWords, 0);

const header = `// Auto-generated. Do not edit manually. See scripts/build-kaigo.mjs.
// Total kaigo words: ${totalAll}
// Sources: H29 介護の日本語学習教材 (Kosei Kosei Jigyodan) + 介護技能評価試験対応テキスト (JACSW 2019).
import type { VocabPage, VocabSection } from "./vocab";

export interface KaigoModule {
  id: string;
  label: string;
  description: string;
  emoji: string;
  totalWords: number;
  sections: VocabSection[];
}

export const KAIGO_MODULES: KaigoModule[] = ${JSON.stringify(outModules, null, 2)};

export const KAIGO_TOTAL_WORDS = ${totalAll};

export function getKaigoModule(id: string): KaigoModule | undefined {
  return KAIGO_MODULES.find((m) => m.id === id);
}

export function getKaigoSection(moduleId: string, sectionId: string): VocabSection | undefined {
  return getKaigoModule(moduleId)?.sections.find((s) => s.id === sectionId);
}

export function getKaigoPage(
  moduleId: string,
  sectionId: string,
  pageIndex: number
): VocabPage | undefined {
  return getKaigoSection(moduleId, sectionId)?.pages[pageIndex];
}

export interface FlatKaigoItem {
  kanji: string;
  romaji: string;
  arti: string;
  subcategory: string;
  moduleId: string;
  sectionId: string;
  pageIndex: number;
  itemIndex: number;
  globalId: string;
}

export const KAIGO_ALL_WORDS: FlatKaigoItem[] = KAIGO_MODULES.flatMap((mod) =>
  mod.sections.flatMap((section) =>
    section.pages.flatMap((page) =>
      page.items.map((item, itemIndex) => ({
        ...item,
        moduleId: mod.id,
        sectionId: section.id,
        pageIndex: page.pageIndex,
        itemIndex,
        globalId: \`\${mod.id}-\${section.id}-\${page.pageIndex}-\${itemIndex}\`,
      }))
    )
  )
);
`;

const dest = path.join(__dirname, "..", "src", "data", "kaigo.ts");
fs.writeFileSync(dest, header);
console.log(`Wrote ${dest} with ${totalAll} kaigo words across ${outModules.length} modules.`);
for (const mod of outModules) {
  console.log(`  ${mod.id}: ${mod.totalWords} words`);
  for (const sec of mod.sections) {
    console.log(`    ${sec.id} (${sec.label}): ${sec.totalWords} words, ${sec.pages.length} page(s)`);
  }
}
