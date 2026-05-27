// Passages Dokkai (reading) JLPT N4/N5.
// Setiap passage berisi 1-3 pertanyaan pilihan ganda 4 opsi.
// bodyKanji adalah teks asli; bodyRomaji adalah pengejaan latin untuk toggle
// (bukan furigana per-kanji, hanya bantuan baca kasar).

export type DokkaiLevel = "N5" | "N4";

export interface DokkaiQuestion {
  q: string;
  options: string[];
  correctIndex: number;
}

export interface DokkaiPassage {
  id: string;
  title: string;
  bodyKanji: string;
  bodyRomaji: string;
  questions: DokkaiQuestion[];
  level: DokkaiLevel;
}

export const DOKKAI_PASSAGES: DokkaiPassage[] = [
  {
    id: "dk-001",
    title: "私の朝",
    level: "N5",
    bodyKanji:
      "私は毎朝六時に起きます。顔を洗ってから、犬と公園を散歩します。家に帰って、朝ご飯を食べます。朝ご飯はいつもパンとコーヒーです。それから、八時に会社へ行きます。会社まで電車で三十分かかります。",
    bodyRomaji:
      "Watashi wa maiasa rokuji ni okimasu. Kao o aratte kara, inu to kōen o sanpo shimasu. Ie ni kaette, asagohan o tabemasu. Asagohan wa itsumo pan to kōhī desu. Sorekara, hachiji ni kaisha e ikimasu. Kaisha made densha de sanjuppun kakarimasu.",
    questions: [
      {
        q: "Pukul berapa orang itu bangun?",
        options: ["Pukul 5", "Pukul 6", "Pukul 7", "Pukul 8"],
        correctIndex: 1,
      },
      {
        q: "Apa yang dimakan untuk sarapan?",
        options: ["Nasi dan ikan", "Roti dan kopi", "Roti dan teh", "Nasi dan kopi"],
        correctIndex: 1,
      },
      {
        q: "Berapa lama dari rumah ke kantor?",
        options: ["10 menit", "20 menit", "30 menit", "60 menit"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "dk-002",
    title: "週末の予定",
    level: "N5",
    bodyKanji:
      "今度の土曜日、友達と映画を見に行きます。映画は午後三時から始まります。映画の後で、近くのレストランで晩ご飯を食べる予定です。日曜日は家で本を読みます。",
    bodyRomaji:
      "Kondo no doyōbi, tomodachi to eiga o mi ni ikimasu. Eiga wa gogo sanji kara hajimarimasu. Eiga no ato de, chikaku no resutoran de bangohan o taberu yotei desu. Nichiyōbi wa ie de hon o yomimasu.",
    questions: [
      {
        q: "Apa yang akan dilakukan hari Sabtu?",
        options: [
          "Membaca buku di rumah",
          "Nonton film bersama teman",
          "Makan malam di rumah",
          "Pergi belanja",
        ],
        correctIndex: 1,
      },
      {
        q: "Apa yang dilakukan setelah film?",
        options: [
          "Pulang ke rumah",
          "Pergi karaoke",
          "Makan malam di restoran dekat",
          "Belanja",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "dk-003",
    title: "新しいクラスメート",
    level: "N4",
    bodyKanji:
      "先月、私たちのクラスに新しい生徒が来ました。名前はマリアさんで、ブラジルから来ました。日本語はあまり上手ではありませんが、毎日一生懸命勉強しています。マリアさんはとても優しくて、すぐに皆と友達になりました。来年、日本の大学に入りたいと言っています。",
    bodyRomaji:
      "Sengetsu, watashitachi no kurasu ni atarashii seito ga kimashita. Namae wa Maria-san de, Burajiru kara kimashita. Nihongo wa amari jōzu de wa arimasen ga, mainichi isshōkenmei benkyō shite imasu. Maria-san wa totemo yasashikute, sugu ni minna to tomodachi ni narimashita. Rainen, Nihon no daigaku ni hairitai to itte imasu.",
    questions: [
      {
        q: "Dari mana Maria berasal?",
        options: ["Brasil", "Argentina", "Spanyol", "Portugal"],
        correctIndex: 0,
      },
      {
        q: "Mengapa Maria mudah berteman?",
        options: [
          "Karena pintar bahasa Jepang",
          "Karena ramah/baik",
          "Karena pandai olahraga",
          "Karena suka memasak",
        ],
        correctIndex: 1,
      },
      {
        q: "Apa rencana Maria tahun depan?",
        options: [
          "Kembali ke Brasil",
          "Bekerja di Jepang",
          "Masuk universitas di Jepang",
          "Pindah kelas",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "dk-004",
    title: "図書館のお知らせ",
    level: "N4",
    bodyKanji:
      "市立図書館では、今月から開館時間が変わります。月曜日から金曜日までは午前九時から午後八時まで、土日は午前十時から午後六時までです。火曜日は休館日でしたが、今月から休館日は水曜日になります。本を借りられるのは一回に五冊までで、二週間借りられます。",
    bodyRomaji:
      "Shiritsu toshokan de wa, kongetsu kara kaikan jikan ga kawarimasu. Getsuyōbi kara kin'yōbi made wa gozen kuji kara gogo hachiji made, donichi wa gozen jūji kara gogo rokuji made desu. Kayōbi wa kyūkanbi deshita ga, kongetsu kara kyūkanbi wa suiyōbi ni narimasu. Hon o karirareru no wa ikkai ni gosatsu made de, nishūkan kariraremasu.",
    questions: [
      {
        q: "Hari apa perpustakaan tutup mulai bulan ini?",
        options: ["Selasa", "Rabu", "Kamis", "Minggu"],
        correctIndex: 1,
      },
      {
        q: "Berapa buku maksimal yang bisa dipinjam sekali?",
        options: ["3 buku", "5 buku", "7 buku", "10 buku"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "dk-005",
    title: "夏祭り",
    level: "N4",
    bodyKanji:
      "私の町では毎年八月に大きい夏祭りがあります。子供から大人まで皆楽しみにしています。祭りの日は、町の通りに屋台がたくさん並びます。たこ焼きや焼きそばなど、美味しい食べ物が買えます。夜になると、花火大会も始まります。去年は雨で花火が中止になりましたが、今年は天気がよくて、とてもきれいでした。",
    bodyRomaji:
      "Watashi no machi de wa maitoshi hachigatsu ni ōkii natsumatsuri ga arimasu. Kodomo kara otona made minna tanoshimi ni shite imasu. Matsuri no hi wa, machi no tōri ni yatai ga takusan narabimasu. Takoyaki ya yakisoba nado, oishii tabemono ga kaemasu. Yoru ni naru to, hanabi taikai mo hajimarimasu. Kyonen wa ame de hanabi ga chūshi ni narimashita ga, kotoshi wa tenki ga yokute, totemo kirei deshita.",
    questions: [
      {
        q: "Kapan festival musim panas diadakan?",
        options: ["Setiap Juni", "Setiap Juli", "Setiap Agustus", "Setiap September"],
        correctIndex: 2,
      },
      {
        q: "Mengapa kembang api tahun lalu dibatalkan?",
        options: [
          "Tidak ada dana",
          "Karena hujan",
          "Karena angin kencang",
          "Karena terlalu banyak orang",
        ],
        correctIndex: 1,
      },
      {
        q: "Bagaimana kembang api tahun ini?",
        options: ["Dibatalkan", "Sangat indah", "Sedikit saja", "Diundur"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "dk-006",
    title: "メール:出張のお知らせ",
    level: "N4",
    bodyKanji:
      "田中さん、お疲れさまです。来週の月曜日から水曜日まで、大阪へ出張に行きます。会議の資料はもう準備しましたので、私の机の上に置いてあります。木曜日に戻ります。何か問題があれば、メールで連絡してください。よろしくお願いします。鈴木",
    bodyRomaji:
      "Tanaka-san, otsukaresama desu. Raishū no getsuyōbi kara suiyōbi made, Ōsaka e shutchō ni ikimasu. Kaigi no shiryō wa mō junbi shimashita node, watashi no tsukue no ue ni oite arimasu. Mokuyōbi ni modorimasu. Nani ka mondai ga areba, mēru de renraku shite kudasai. Yoroshiku onegaishimasu. Suzuki",
    questions: [
      {
        q: "Berapa lama Suzuki dinas ke Osaka?",
        options: ["1 hari", "2 hari", "3 hari", "4 hari"],
        correctIndex: 2,
      },
      {
        q: "Di mana materi rapat diletakkan?",
        options: [
          "Di laci Tanaka",
          "Di atas meja Suzuki",
          "Di ruang rapat",
          "Dikirim via email",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "dk-007",
    title: "日本のコンビニ",
    level: "N4",
    bodyKanji:
      "日本のコンビニはとても便利です。二十四時間開いていて、食べ物や飲み物だけでなく、雑誌や日用品も買えます。最近は、お金を出したり、宅配便を送ったりすることもできます。外国から来た人もコンビニをよく利用します。値段は少し高いですが、いつでも行けるので人気があります。",
    bodyRomaji:
      "Nihon no konbini wa totemo benri desu. Nijūyojikan aite ite, tabemono ya nomimono dake de naku, zasshi ya nichiyōhin mo kaemasu. Saikin wa, okane o dashitari, takuhaibin o okuttari suru koto mo dekimasu. Gaikoku kara kita hito mo konbini o yoku riyō shimasu. Nedan wa sukoshi takai desu ga, itsudemo ikeru node ninki ga arimasu.",
    questions: [
      {
        q: "Apa yang BUKAN bisa dilakukan di convenience store?",
        options: [
          "Membeli minuman",
          "Mengirim paket",
          "Memotong rambut",
          "Mengambil uang",
        ],
        correctIndex: 2,
      },
      {
        q: "Mengapa convenience store populer meskipun mahal?",
        options: [
          "Karena makanannya enak",
          "Karena bisa pergi kapan saja",
          "Karena dekorasinya bagus",
          "Karena pegawainya ramah",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "dk-008",
    title: "電車での出来事",
    level: "N4",
    bodyKanji:
      "昨日、電車の中でおばあさんが立っていました。私は席を譲ろうと思いましたが、隣に座っていた小さい男の子が先に立って、おばあさんに「どうぞ」と言いました。男の子のお母さんはとても嬉しそうでした。私はその男の子がとても優しいと思いました。",
    bodyRomaji:
      "Kinō, densha no naka de obāsan ga tatte imashita. Watashi wa seki o yuzurō to omoimashita ga, tonari ni suwatte ita chiisai otoko no ko ga saki ni tatte, obāsan ni 'dōzo' to iimashita. Otoko no ko no okāsan wa totemo ureshisō deshita. Watashi wa sono otoko no ko ga totemo yasashii to omoimashita.",
    questions: [
      {
        q: "Siapa yang memberikan tempat duduk kepada nenek?",
        options: [
          "Penulis cerita",
          "Anak laki-laki kecil",
          "Ibu si anak",
          "Tidak ada",
        ],
        correctIndex: 1,
      },
      {
        q: "Bagaimana perasaan ibu si anak?",
        options: ["Marah", "Senang", "Sedih", "Bingung"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "dk-009",
    title: "アルバイト",
    level: "N4",
    bodyKanji:
      "私は今、レストランでアルバイトをしています。仕事は週に三回、夕方から夜までです。お客さんに料理を運んだり、注文を聞いたりします。最初は日本語がうまく話せなくて大変でしたが、店長や先輩が親切に教えてくれたので、今は楽しく働けています。来月から時給も少し上がる予定です。",
    bodyRomaji:
      "Watashi wa ima, resutoran de arubaito o shite imasu. Shigoto wa shū ni sankai, yūgata kara yoru made desu. Okyakusan ni ryōri o hakondari, chūmon o kiitari shimasu. Saisho wa nihongo ga umaku hanasenakute taihen deshita ga, tenchō ya senpai ga shinsetsu ni oshiete kureta node, ima wa tanoshiku hatarakete imasu. Raigetsu kara jikyū mo sukoshi agaru yotei desu.",
    questions: [
      {
        q: "Berapa kali dalam seminggu orang itu bekerja?",
        options: ["1 kali", "2 kali", "3 kali", "Setiap hari"],
        correctIndex: 2,
      },
      {
        q: "Mengapa awalnya sulit?",
        options: [
          "Karena bos galak",
          "Karena gajinya kecil",
          "Karena belum bisa bahasa Jepang dengan baik",
          "Karena makanannya susah dibuat",
        ],
        correctIndex: 2,
      },
      {
        q: "Apa yang akan terjadi bulan depan?",
        options: [
          "Berhenti kerja",
          "Pindah restoran",
          "Gaji per jam naik sedikit",
          "Ganti shift",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "dk-010",
    title: "日本の四季",
    level: "N4",
    bodyKanji:
      "日本には春、夏、秋、冬の四つの季節があります。春は桜が咲いてとてもきれいです。夏は暑くて、海やプールで泳ぐ人が多いです。秋は涼しくなって、葉の色が赤や黄色に変わります。冬は寒くて、北の方では雪がたくさん降ります。私は秋が一番好きです。なぜかと言うと、暑くも寒くもなくて、食べ物も美味しいからです。",
    bodyRomaji:
      "Nihon ni wa haru, natsu, aki, fuyu no yottsu no kisetsu ga arimasu. Haru wa sakura ga saite totemo kirei desu. Natsu wa atsukute, umi ya pūru de oyogu hito ga ōi desu. Aki wa suzushiku natte, ha no iro ga aka ya kiiro ni kawarimasu. Fuyu wa samukute, kita no hō de wa yuki ga takusan furimasu. Watashi wa aki ga ichiban suki desu. Naze ka to iu to, atsuku mo samuku mo nakute, tabemono mo oishii kara desu.",
    questions: [
      {
        q: "Musim apa yang paling disukai penulis?",
        options: ["Semi (haru)", "Panas (natsu)", "Gugur (aki)", "Dingin (fuyu)"],
        correctIndex: 2,
      },
      {
        q: "Mengapa penulis menyukai musim itu?",
        options: [
          "Karena ada festival",
          "Karena bisa berenang",
          "Karena tidak panas/dingin dan makanan enak",
          "Karena bisa main salju",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "dk-011",
    title: "引っ越し",
    level: "N4",
    bodyKanji:
      "先週、新しい部屋に引っ越しました。前の部屋より少し狭いですが、駅から近くて便利です。歩いて五分で駅に着きます。近くにスーパーやコンビニもあるので、買い物にも困りません。ただ、隣の部屋の人が夜遅くまでテレビを大きい音で見るので、少しうるさいです。今度、お願いしに行こうと思っています。",
    bodyRomaji:
      "Senshū, atarashii heya ni hikkoshimashita. Mae no heya yori sukoshi semai desu ga, eki kara chikakute benri desu. Aruite gofun de eki ni tsukimasu. Chikaku ni sūpā ya konbini mo aru node, kaimono ni mo komarimasen. Tada, tonari no heya no hito ga yoru osoku made terebi o ōkii oto de miru node, sukoshi urusai desu. Kondo, onegai shi ni ikō to omotte imasu.",
    questions: [
      {
        q: "Bagaimana ukuran kamar baru dibanding kamar lama?",
        options: [
          "Lebih luas",
          "Sedikit lebih sempit",
          "Sama saja",
          "Jauh lebih luas",
        ],
        correctIndex: 1,
      },
      {
        q: "Apa kekurangan kamar baru?",
        options: [
          "Jauh dari stasiun",
          "Tidak ada supermarket",
          "Tetangga berisik di malam hari",
          "Sewa mahal",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "dk-012",
    title: "プレゼント",
    level: "N4",
    bodyKanji:
      "明日は母の誕生日です。何をあげようか、ずっと考えていました。母は花が好きですが、毎年花をあげているので、今年は違う物を贈りたいと思いました。妹と相談して、母が前から欲しがっていた本を買うことに決めました。きっと喜んでくれると思います。",
    bodyRomaji:
      "Ashita wa haha no tanjōbi desu. Nani o ageyō ka, zutto kangaete imashita. Haha wa hana ga suki desu ga, maitoshi hana o agete iru node, kotoshi wa chigau mono o okuritai to omoimashita. Imōto to sōdan shite, haha ga mae kara hoshigatte ita hon o kau koto ni kimemashita. Kitto yorokonde kureru to omoimasu.",
    questions: [
      {
        q: "Apa yang biasanya dihadiahkan kepada ibu setiap tahun?",
        options: ["Buku", "Bunga", "Kue", "Pakaian"],
        correctIndex: 1,
      },
      {
        q: "Apa hadiah tahun ini?",
        options: ["Bunga", "Kue", "Buku", "Tas"],
        correctIndex: 2,
      },
      {
        q: "Mengapa berunding dengan adik?",
        options: [
          "Karena tidak punya uang",
          "Untuk menentukan hadiah",
          "Karena ibu meminta",
          "Karena adik yang akan beli",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "dk-013",
    title: "趣味と仕事",
    level: "N4",
    bodyKanji:
      "私の趣味は料理です。週末はいつも新しいレシピを試します。最初はうまく作れませんでしたが、何度も練習して、今は家族や友達に「美味しい」と言われるようになりました。将来、自分の小さなレストランを開きたいと思っています。そのために、今は普通の会社で働きながら、料理教室にも通っています。",
    bodyRomaji:
      "Watashi no shumi wa ryōri desu. Shūmatsu wa itsumo atarashii reshipi o tameshimasu. Saisho wa umaku tsukuremasen deshita ga, nando mo renshū shite, ima wa kazoku ya tomodachi ni 'oishii' to iwareru yō ni narimashita. Shōrai, jibun no chiisa na resutoran o hirakitai to omotte imasu. Sono tame ni, ima wa futsū no kaisha de hatarakinagara, ryōri kyōshitsu ni mo kayotte imasu.",
    questions: [
      {
        q: "Apa hobi penulis?",
        options: ["Membaca", "Fotografi", "Memasak", "Berkebun"],
        correctIndex: 2,
      },
      {
        q: "Apa impian penulis?",
        options: [
          "Menjadi koki bintang",
          "Membuka restoran kecil sendiri",
          "Menjadi guru masak",
          "Menulis buku resep",
        ],
        correctIndex: 1,
      },
      {
        q: "Apa yang dilakukan penulis sekarang?",
        options: [
          "Hanya belajar memasak penuh waktu",
          "Bekerja di restoran",
          "Bekerja kantor sambil ikut kelas masak",
          "Sudah membuka restoran",
        ],
        correctIndex: 2,
      },
    ],
  },
];

export const DOKKAI_TOTAL = DOKKAI_PASSAGES.length;
export const DOKKAI_QUESTION_TOTAL = DOKKAI_PASSAGES.reduce(
  (acc, p) => acc + p.questions.length,
  0
);
