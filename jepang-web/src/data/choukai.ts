// Soal Choukai (listening) JLPT N4/N5.
// audioText akan dibacakan oleh Web Speech API (speakJa) di tombol "Putar".
// options ditampilkan sebagai pilihan ganda; arti wajib (B.Indo), kanji opsional.
// Setelah jawab, transcript (audioText) ditampilkan sebagai pembuktian.
//
// Curated minimal 30 soal dengan campuran format JLPT:
// - mondai 1: pertanyaan langsung (apa yang harus dilakukan, mana yang benar, dsb).
// - mondai 2: pokok / informasi penting di percakapan.
// - mondai 3: tema/topik utama percakapan.

export type ChoukaiLevel = "N5" | "N4";
export type ChoukaiMondai = "mondai-1" | "mondai-2" | "mondai-3";

export interface ChoukaiOption {
  kanji?: string;
  arti: string;
}

export interface ChoukaiItem {
  id: string;
  audioText: string;
  question: string;
  options: ChoukaiOption[];
  correctIndex: number;
  hint?: string;
  level: ChoukaiLevel;
  mondai: ChoukaiMondai;
}

export const CHOUKAI_ITEMS: ChoukaiItem[] = [
  // === Mondai 1 — pertanyaan tindakan ===
  {
    id: "ch-001",
    audioText: "明日は何時に学校へ行きますか。八時半に行きます。",
    question: "Jam berapa orang itu pergi ke sekolah besok?",
    options: [
      { kanji: "七時", arti: "Jam 7" },
      { kanji: "八時", arti: "Jam 8" },
      { kanji: "八時半", arti: "Jam 8.30" },
      { kanji: "九時", arti: "Jam 9" },
    ],
    correctIndex: 2,
    hint: "Perhatikan jawaban setelah pertanyaan waktu.",
    level: "N5",
    mondai: "mondai-1",
  },
  {
    id: "ch-002",
    audioText: "すみません、駅はどこですか。まっすぐ行って、二つ目の信号を右に曲がってください。",
    question: "Bagaimana cara ke stasiun?",
    options: [
      { arti: "Lurus, lalu belok kiri di lampu kedua." },
      { arti: "Lurus, lalu belok kanan di lampu kedua." },
      { arti: "Belok kanan di lampu pertama." },
      { arti: "Belok kiri di lampu pertama." },
    ],
    correctIndex: 1,
    level: "N5",
    mondai: "mondai-1",
  },
  {
    id: "ch-003",
    audioText: "今日は雨ですから、傘を持って行ってください。",
    question: "Apa yang harus dibawa hari ini?",
    options: [
      { kanji: "傘", arti: "Payung" },
      { kanji: "本", arti: "Buku" },
      { kanji: "鞄", arti: "Tas" },
      { kanji: "帽子", arti: "Topi" },
    ],
    correctIndex: 0,
    level: "N5",
    mondai: "mondai-1",
  },
  {
    id: "ch-004",
    audioText: "田中さん、会議は三時からですよ。会議室は二階の二〇五です。",
    question: "Di mana ruang rapatnya?",
    options: [
      { kanji: "一階 105", arti: "Lantai 1, ruang 105" },
      { kanji: "二階 205", arti: "Lantai 2, ruang 205" },
      { kanji: "二階 250", arti: "Lantai 2, ruang 250" },
      { kanji: "三階 305", arti: "Lantai 3, ruang 305" },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-1",
  },
  {
    id: "ch-005",
    audioText: "ホテルの予約は週末がいいですか、平日がいいですか。週末は高いので、平日にしましょう。",
    question: "Hari apa hotel akan dipesan?",
    options: [
      { arti: "Akhir pekan karena lebih murah." },
      { arti: "Akhir pekan karena lebih nyaman." },
      { arti: "Hari biasa karena lebih murah." },
      { arti: "Hari biasa karena lebih nyaman." },
    ],
    correctIndex: 2,
    level: "N4",
    mondai: "mondai-1",
  },
  {
    id: "ch-006",
    audioText: "お弁当に何を入れましょうか。野菜と魚をお願いします。お肉はいりません。",
    question: "Apa yang akan dimasukkan ke dalam bento?",
    options: [
      { arti: "Sayur dan daging." },
      { arti: "Ikan dan daging." },
      { arti: "Sayur dan ikan." },
      { arti: "Hanya daging." },
    ],
    correctIndex: 2,
    level: "N5",
    mondai: "mondai-1",
  },
  {
    id: "ch-007",
    audioText: "病院は薬局の隣ですか。いいえ、薬局の向かいです。",
    question: "Di mana letak rumah sakit?",
    options: [
      { arti: "Di sebelah apotek." },
      { arti: "Di seberang apotek." },
      { arti: "Di belakang apotek." },
      { arti: "Di dalam apotek." },
    ],
    correctIndex: 1,
    level: "N5",
    mondai: "mondai-1",
  },
  {
    id: "ch-008",
    audioText: "明日の朝、駅で会いましょう。何時にしますか。七時半は早いから、八時にしましょう。",
    question: "Jam berapa mereka akan bertemu?",
    options: [
      { kanji: "七時", arti: "Jam 7" },
      { kanji: "七時半", arti: "Jam 7.30" },
      { kanji: "八時", arti: "Jam 8" },
      { kanji: "八時半", arti: "Jam 8.30" },
    ],
    correctIndex: 2,
    level: "N4",
    mondai: "mondai-1",
  },
  {
    id: "ch-009",
    audioText: "図書館では飲み物を飲んではいけませんが、お水だけは大丈夫です。",
    question: "Mana yang boleh dilakukan di perpustakaan?",
    options: [
      { arti: "Minum kopi." },
      { arti: "Minum air putih." },
      { arti: "Minum teh." },
      { arti: "Tidak boleh minum apa pun." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-1",
  },
  {
    id: "ch-010",
    audioText: "週末はどこへ行きましたか。土曜日は山に登りましたが、日曜日は雨だったので家にいました。",
    question: "Apa yang dilakukan orang itu pada hari Minggu?",
    options: [
      { arti: "Naik gunung." },
      { arti: "Pergi belanja." },
      { arti: "Berada di rumah." },
      { arti: "Pergi ke kantor." },
    ],
    correctIndex: 2,
    level: "N4",
    mondai: "mondai-1",
  },

  // === Mondai 2 — pokok / informasi penting ===
  {
    id: "ch-011",
    audioText: "今度の旅行は北海道へ行きます。飛行機ではなく、新幹線で行く予定です。",
    question: "Mereka akan ke Hokkaido dengan apa?",
    options: [
      { kanji: "飛行機", arti: "Pesawat" },
      { kanji: "新幹線", arti: "Shinkansen" },
      { kanji: "車", arti: "Mobil" },
      { kanji: "船", arti: "Kapal" },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-2",
  },
  {
    id: "ch-012",
    audioText: "新しいレストランの料理は美味しかったですが、値段がちょっと高かったです。",
    question: "Apa pendapat orang itu tentang restoran baru?",
    options: [
      { arti: "Enak dan murah." },
      { arti: "Enak tapi mahal." },
      { arti: "Tidak enak dan mahal." },
      { arti: "Tidak enak tapi murah." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-2",
  },
  {
    id: "ch-013",
    audioText: "今日のテストは難しかったですか。問題はあまり難しくなかったですが、時間が短かったです。",
    question: "Bagaimana pendapatnya tentang tes hari ini?",
    options: [
      { arti: "Soalnya sulit, tapi waktunya cukup." },
      { arti: "Soalnya mudah, tapi waktunya kurang." },
      { arti: "Soalnya dan waktunya keduanya sulit." },
      { arti: "Soalnya dan waktunya keduanya mudah." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-2",
  },
  {
    id: "ch-014",
    audioText: "山田さんは英語を話せますが、フランス語はあまり話せません。",
    question: "Apa kemampuan bahasa Yamada-san?",
    options: [
      { arti: "Bisa Inggris dan Prancis dengan lancar." },
      { arti: "Bisa Inggris, kurang Prancis." },
      { arti: "Bisa Prancis, kurang Inggris." },
      { arti: "Tidak bisa keduanya." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-2",
  },
  {
    id: "ch-015",
    audioText: "明日は試験があるから、今夜は早く寝ます。テレビは見ません。",
    question: "Mengapa orang itu tidur lebih awal malam ini?",
    options: [
      { arti: "Karena lelah bekerja." },
      { arti: "Karena besok ada ujian." },
      { arti: "Karena tidak ada acara TV menarik." },
      { arti: "Karena sedang sakit." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-2",
  },
  {
    id: "ch-016",
    audioText: "私は犬より猫の方が好きです。犬は元気すぎますから。",
    question: "Mengapa orang itu lebih suka kucing?",
    options: [
      { arti: "Karena kucing lebih tenang." },
      { arti: "Karena anjing terlalu aktif." },
      { arti: "Karena anjing terlalu pendiam." },
      { arti: "Karena kucing lebih ramah." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-2",
  },
  {
    id: "ch-017",
    audioText: "鈴木さん、明日のパーティーに来ますか。すみません、仕事がありますから行けません。",
    question: "Apakah Suzuki-san akan datang ke pesta besok?",
    options: [
      { arti: "Ya, akan datang." },
      { arti: "Tidak, karena ada kerjaan." },
      { arti: "Tidak, karena sakit." },
      { arti: "Belum tahu." },
    ],
    correctIndex: 1,
    level: "N5",
    mondai: "mondai-2",
  },
  {
    id: "ch-018",
    audioText: "新しい仕事はどうですか。給料はいいですが、毎日残業があってちょっと大変です。",
    question: "Bagaimana pekerjaan baru orang itu?",
    options: [
      { arti: "Gaji rendah dan capek." },
      { arti: "Gaji bagus tapi sering lembur." },
      { arti: "Gaji bagus dan santai." },
      { arti: "Gaji rendah tapi santai." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-2",
  },
  {
    id: "ch-019",
    audioText: "夏休みに家族と海へ行きたかったですが、母が病気になったので、行きませんでした。",
    question: "Mengapa keluarga tidak jadi ke pantai?",
    options: [
      { arti: "Karena cuaca buruk." },
      { arti: "Karena ibu sakit." },
      { arti: "Karena tidak punya uang." },
      { arti: "Karena ayah sibuk." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-2",
  },
  {
    id: "ch-020",
    audioText: "この本は子供向けに書かれていますが、大人が読んでも面白いと思います。",
    question: "Untuk siapa buku itu ditulis?",
    options: [
      { arti: "Untuk anak-anak, tapi orang dewasa juga bisa menikmati." },
      { arti: "Khusus untuk orang dewasa." },
      { arti: "Hanya untuk anak-anak." },
      { arti: "Untuk pelajar bahasa Jepang." },
    ],
    correctIndex: 0,
    level: "N4",
    mondai: "mondai-2",
  },

  // === Mondai 3 — tema/topik utama ===
  {
    id: "ch-021",
    audioText: "皆さん、今日の会議は新しい商品の紹介です。来月から店で売る予定の新しいお菓子について話します。",
    question: "Apa topik utama rapat hari ini?",
    options: [
      { arti: "Perubahan jam kerja." },
      { arti: "Pengenalan produk baru." },
      { arti: "Penilaian kinerja karyawan." },
      { arti: "Liburan akhir tahun." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-3",
  },
  {
    id: "ch-022",
    audioText: "日本では電車の中で電話をしてはいけません。マナーが悪いと思われますから、メールを送る方がいいです。",
    question: "Apa yang dibicarakan dalam percakapan ini?",
    options: [
      { arti: "Etika menggunakan ponsel di kereta." },
      { arti: "Cara membeli tiket kereta." },
      { arti: "Tarif kereta di Jepang." },
      { arti: "Jadwal kereta antarkota." },
    ],
    correctIndex: 0,
    level: "N4",
    mondai: "mondai-3",
  },
  {
    id: "ch-023",
    audioText: "毎朝、犬と公園を散歩します。運動になりますし、犬も喜びますから、続けています。",
    question: "Apa kebiasaan orang itu setiap pagi?",
    options: [
      { arti: "Lari di gym." },
      { arti: "Jalan-jalan bersama anjing di taman." },
      { arti: "Berenang di kolam renang." },
      { arti: "Bersepeda ke kantor." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-3",
  },
  {
    id: "ch-024",
    audioText: "今年の冬はとても寒かったです。雪も多くて、何度も電車が止まりました。",
    question: "Apa yang sedang dibicarakan?",
    options: [
      { arti: "Musim panas tahun ini." },
      { arti: "Musim dingin tahun ini." },
      { arti: "Rencana liburan musim semi." },
      { arti: "Cuaca musim gugur." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-3",
  },
  {
    id: "ch-025",
    audioText: "私の趣味は写真を撮ることです。週末はカメラを持って色々な所へ行きます。",
    question: "Apa hobi orang itu?",
    options: [
      { arti: "Memasak." },
      { arti: "Memotret." },
      { arti: "Membaca buku." },
      { arti: "Melukis." },
    ],
    correctIndex: 1,
    level: "N5",
    mondai: "mondai-3",
  },
  {
    id: "ch-026",
    audioText: "コンビニで働いている時、色々なお客さんに会います。優しい人もいれば、怒っている人もいます。",
    question: "Apa tema yang dibicarakan?",
    options: [
      { arti: "Pengalaman bekerja di convenience store." },
      { arti: "Cara berbelanja di convenience store." },
      { arti: "Produk laris di convenience store." },
      { arti: "Lokasi convenience store di Jepang." },
    ],
    correctIndex: 0,
    level: "N4",
    mondai: "mondai-3",
  },
  {
    id: "ch-027",
    audioText: "日本語の勉強は難しいですが、毎日少しずつやれば必ず上手になります。諦めないでください。",
    question: "Pesan utama yang disampaikan?",
    options: [
      { arti: "Belajar bahasa Jepang itu mustahil." },
      { arti: "Belajar sedikit setiap hari pasti membuat mahir." },
      { arti: "Belajar harus banyak sekaligus." },
      { arti: "Cukup belajar di kelas saja." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-3",
  },
  {
    id: "ch-028",
    audioText: "去年、初めて日本へ旅行に行きました。京都の古いお寺が一番印象に残っています。",
    question: "Apa yang paling berkesan dari perjalanan ke Jepang?",
    options: [
      { arti: "Makanan di Tokyo." },
      { arti: "Kuil tua di Kyoto." },
      { arti: "Pemandangan Gunung Fuji." },
      { arti: "Belanja di Osaka." },
    ],
    correctIndex: 1,
    level: "N4",
    mondai: "mondai-3",
  },
  {
    id: "ch-029",
    audioText: "健康のために、毎日野菜を食べて、十分な水を飲むようにしています。",
    question: "Apa yang orang itu lakukan untuk kesehatan?",
    options: [
      { arti: "Makan sayur dan minum air cukup setiap hari." },
      { arti: "Olahraga di gym setiap pagi." },
      { arti: "Tidur lebih awal setiap malam." },
      { arti: "Minum vitamin setiap hari." },
    ],
    correctIndex: 0,
    level: "N4",
    mondai: "mondai-3",
  },
  {
    id: "ch-030",
    audioText: "皆さん、明日は早く起きてください。バスは朝六時に出発します。遅れた人は置いていきますから、注意してください。",
    question: "Apa pesan penting yang disampaikan?",
    options: [
      { arti: "Bus berangkat jam 6 pagi, jangan terlambat." },
      { arti: "Besok tidak perlu bangun pagi." },
      { arti: "Bus akan menunggu yang terlambat." },
      { arti: "Bus akan berangkat jam 7 pagi." },
    ],
    correctIndex: 0,
    level: "N4",
    mondai: "mondai-3",
  },
  {
    id: "ch-031",
    audioText: "私は子供の時から音楽が大好きで、今もピアノを習っています。",
    question: "Sejak kapan orang itu menyukai musik?",
    options: [
      { arti: "Sejak kuliah." },
      { arti: "Sejak kecil." },
      { arti: "Sejak masuk kerja." },
      { arti: "Sejak tahun lalu." },
    ],
    correctIndex: 1,
    level: "N5",
    mondai: "mondai-2",
  },
  {
    id: "ch-032",
    audioText: "明日は雨が降るかもしれません。ピクニックは来週に変えましょう。",
    question: "Apa keputusan terkait piknik?",
    options: [
      { arti: "Tetap dilakukan besok." },
      { arti: "Dibatalkan." },
      { arti: "Diundur ke minggu depan." },
      { arti: "Dimajukan hari ini." },
    ],
    correctIndex: 2,
    level: "N4",
    mondai: "mondai-1",
  },
];

export const CHOUKAI_TOTAL = CHOUKAI_ITEMS.length;
