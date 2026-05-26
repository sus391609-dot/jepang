// Pola tata bahasa N4 (mayoritas) + beberapa N5 dasar yang sering muncul.
// Total: ~80 pola.

export type GrammarLevel = "N5" | "N4";

export interface GrammarExample {
  kanji: string;
  romaji: string;
  arti: string;
}

export interface GrammarPattern {
  id: string;
  pattern: string;
  romaji: string;
  arti: string;
  formation: string;
  explanation: string;
  level: GrammarLevel;
  examples: GrammarExample[];
  tags: string[];
}

export const GRAMMAR_PATTERNS: GrammarPattern[] = [
  {
    id: "nakereba-naranai",
    pattern: "〜なければならない",
    romaji: "~nakereba naranai",
    arti: "harus, wajib",
    formation: "V-ない (hapus い) + ければならない",
    explanation:
      "Menyatakan keharusan / kewajiban yang mengikat (sering soal aturan, tugas, kewajiban sosial). Bentuk sopannya: 〜なければなりません. Variasi lisan: 〜なきゃ(ならない/いけない).",
    level: "N4",
    examples: [
      { kanji: "明日までにレポートを出さなければなりません。", romaji: "ashita made ni repōto o dasanakereba narimasen.", arti: "Saya harus menyerahkan laporan paling lambat besok." },
      { kanji: "薬を飲まなければならない。", romaji: "kusuri o nomanakereba naranai.", arti: "Saya harus minum obat." },
      { kanji: "学生は宿題をしなければならない。", romaji: "gakusei wa shukudai o shinakereba naranai.", arti: "Siswa wajib mengerjakan PR." },
    ],
    tags: ["modal", "keharusan", "nai-form"],
  },
  {
    id: "nakute-mo-ii",
    pattern: "〜なくてもいい",
    romaji: "~nakute mo ii",
    arti: "tidak perlu, boleh tidak",
    formation: "V-ない (hapus い) + くてもいい",
    explanation:
      "Memberi izin atau menyatakan bahwa sesuatu tidak harus dilakukan. Lawan dari 〜なければならない. Bentuk sopannya pakai いいです.",
    level: "N4",
    examples: [
      { kanji: "明日は学校に来なくてもいいです。", romaji: "ashita wa gakkō ni konakute mo ii desu.", arti: "Besok kamu tidak perlu datang ke sekolah." },
      { kanji: "高くなくてもいい。", romaji: "takaku nakute mo ii.", arti: "Tidak perlu mahal." },
      { kanji: "靴を脱がなくてもいいですよ。", romaji: "kutsu o nuganakute mo ii desu yo.", arti: "Anda tidak perlu melepas sepatu." },
    ],
    tags: ["izin", "negatif", "modal"],
  },
  {
    id: "ta-hou-ga-ii",
    pattern: "〜たほうがいい",
    romaji: "~ta hō ga ii",
    arti: "sebaiknya, lebih baik kalau",
    formation: "V-た / V-ない + ほうがいい",
    explanation:
      "Memberi saran atau rekomendasi. Bentuk negatifnya 〜ないほうがいい (sebaiknya jangan).",
    level: "N4",
    examples: [
      { kanji: "早く寝たほうがいいよ。", romaji: "hayaku neta hō ga ii yo.", arti: "Sebaiknya kamu cepat tidur." },
      { kanji: "病院へ行ったほうがいいです。", romaji: "byōin e itta hō ga ii desu.", arti: "Lebih baik pergi ke rumah sakit." },
      { kanji: "そこに座らないほうがいい。", romaji: "soko ni suwaranai hō ga ii.", arti: "Sebaiknya jangan duduk di sana." },
    ],
    tags: ["saran", "rekomendasi"],
  },
  {
    id: "ta-koto-ga-aru",
    pattern: "〜たことがある",
    romaji: "~ta koto ga aru",
    arti: "pernah",
    formation: "V-た + ことがある",
    explanation:
      "Menyatakan pengalaman pernah melakukan sesuatu (sekali atau beberapa kali, biasanya cukup lampau). Untuk kejadian baru saja, gunakan 〜たばかり.",
    level: "N4",
    examples: [
      { kanji: "日本へ行ったことがあります。", romaji: "nihon e itta koto ga arimasu.", arti: "Saya pernah pergi ke Jepang." },
      { kanji: "寿司を食べたことがある。", romaji: "sushi o tabeta koto ga aru.", arti: "Saya pernah makan sushi." },
      { kanji: "彼に会ったことがない。", romaji: "kare ni atta koto ga nai.", arti: "Saya belum pernah bertemu dia." },
    ],
    tags: ["pengalaman", "ta-form"],
  },
  {
    id: "nagara",
    pattern: "〜ながら",
    romaji: "~nagara",
    arti: "sambil",
    formation: "V-ます (hapus ます) + ながら",
    explanation:
      "Menyatakan dua aktivitas yang dilakukan bersamaan oleh subjek yang sama. Aktivitas utama biasanya yang setelah ながら.",
    level: "N4",
    examples: [
      { kanji: "音楽を聞きながら勉強する。", romaji: "ongaku o kikinagara benkyō suru.", arti: "Belajar sambil mendengarkan musik." },
      { kanji: "歩きながらスマホを見ないで。", romaji: "arukinagara sumaho o minaide.", arti: "Jangan lihat HP sambil berjalan." },
      { kanji: "コーヒーを飲みながら話しましょう。", romaji: "kōhī o nominagara hanashimashō.", arti: "Mari mengobrol sambil minum kopi." },
    ],
    tags: ["bersamaan", "v-stem"],
  },
  {
    id: "tsumori",
    pattern: "〜つもり",
    romaji: "~tsumori",
    arti: "berniat / berencana",
    formation: "V-dict / V-ない + つもりだ",
    explanation:
      "Menyatakan niat atau rencana pribadi. Bisa juga digabung dengan kata sifat (mis. 〜ているつもり = merasa bahwa…).",
    level: "N4",
    examples: [
      { kanji: "夏休みに国へ帰るつもりです。", romaji: "natsuyasumi ni kuni e kaeru tsumori desu.", arti: "Saya berencana pulang ke negara asal saat liburan musim panas." },
      { kanji: "今年はタバコをやめるつもりだ。", romaji: "kotoshi wa tabako o yameru tsumori da.", arti: "Tahun ini saya berniat berhenti merokok." },
      { kanji: "明日は行かないつもりです。", romaji: "ashita wa ikanai tsumori desu.", arti: "Saya tidak berencana pergi besok." },
    ],
    tags: ["niat", "rencana", "modal"],
  },
  {
    id: "to-omou",
    pattern: "〜と思う",
    romaji: "~to omou",
    arti: "berpikir bahwa / sepertinya",
    formation: "Kalimat biasa + と思う",
    explanation:
      "Mengungkapkan pendapat atau dugaan. Kalimat di dalam と biasanya bentuk biasa (plain). Untuk niat sesaat, sering pakai 〜ようと思う.",
    level: "N4",
    examples: [
      { kanji: "明日は雨が降ると思います。", romaji: "ashita wa ame ga furu to omoimasu.", arti: "Saya rasa besok akan hujan." },
      { kanji: "彼は来ないと思う。", romaji: "kare wa konai to omou.", arti: "Saya rasa dia tidak datang." },
      { kanji: "この映画は面白いと思います。", romaji: "kono eiga wa omoshiroi to omoimasu.", arti: "Menurut saya film ini menarik." },
    ],
    tags: ["pendapat", "dugaan"],
  },
  {
    id: "ba",
    pattern: "〜ば",
    romaji: "~ba",
    arti: "kalau",
    formation: "V (e-row) + ば / kata sifat-い → ければ / Na/N + なら",
    explanation:
      "Kondisional umum yang menekankan syarat. Banyak dipakai untuk kondisi hipotetis dan ungkapan tetap (mis. 〜ばよかった).",
    level: "N4",
    examples: [
      { kanji: "雨が降れば、試合は中止です。", romaji: "ame ga fureba, shiai wa chūshi desu.", arti: "Kalau hujan, pertandingan akan dibatalkan." },
      { kanji: "安ければ買います。", romaji: "yasukereba kaimasu.", arti: "Kalau murah, saya akan beli." },
      { kanji: "もっと早く起きればよかった。", romaji: "motto hayaku okireba yokatta.", arti: "Coba tadi saya bangun lebih awal." },
    ],
    tags: ["kondisional", "kondisi"],
  },
  {
    id: "tara",
    pattern: "〜たら",
    romaji: "~tara",
    arti: "kalau / setelah",
    formation: "V-た + ら / Adj-い → かったら / Na/N + だったら",
    explanation:
      "Kondisional paling fleksibel; bisa menyatakan kondisi (kalau A, maka B) atau urutan waktu (setelah A, lalu B). Cocok untuk kejadian satu kali.",
    level: "N4",
    examples: [
      { kanji: "宿題が終わったら、遊びに行こう。", romaji: "shukudai ga owattara, asobi ni ikō.", arti: "Setelah PR selesai, ayo pergi main." },
      { kanji: "お金があったら、車を買います。", romaji: "okane ga attara, kuruma o kaimasu.", arti: "Kalau ada uang, saya akan beli mobil." },
      { kanji: "暇だったら、電話してください。", romaji: "hima dattara, denwa shite kudasai.", arti: "Kalau senggang, tolong telepon saya." },
    ],
    tags: ["kondisional", "urutan-waktu"],
  },
  {
    id: "to-kondisional",
    pattern: "〜と",
    romaji: "~to (kondisional)",
    arti: "kalau / setiap kali",
    formation: "V-dict / Adj / N + だ + と …",
    explanation:
      "Kondisional yang menunjukkan hubungan otomatis: kalau A, pasti/selalu B (hukum alam, fakta, kebiasaan). Tidak dipakai untuk perintah/permintaan di klausa kedua.",
    level: "N4",
    examples: [
      { kanji: "春になると、桜が咲く。", romaji: "haru ni naru to, sakura ga saku.", arti: "Begitu masuk musim semi, sakura mekar." },
      { kanji: "このボタンを押すと、お湯が出ます。", romaji: "kono botan o osu to, oyu ga demasu.", arti: "Kalau tombol ini ditekan, air panas keluar." },
      { kanji: "右に曲がると、駅があります。", romaji: "migi ni magaru to, eki ga arimasu.", arti: "Kalau belok kanan, ada stasiun." },
    ],
    tags: ["kondisional", "otomatis"],
  },
  {
    id: "te-mo",
    pattern: "〜ても",
    romaji: "~te mo",
    arti: "meskipun, walaupun",
    formation: "V-て / Adj-くて / N + でも",
    explanation:
      "Menyatakan kondisi konsesif: meskipun A, tetap B. Dipakai juga dalam 〜てもいい (boleh ~).",
    level: "N4",
    examples: [
      { kanji: "雨が降っても、行きます。", romaji: "ame ga futtemo, ikimasu.", arti: "Meskipun hujan, saya tetap pergi." },
      { kanji: "高くても買います。", romaji: "takakutemo kaimasu.", arti: "Meskipun mahal, saya akan beli." },
      { kanji: "日曜日でも働きます。", romaji: "nichiyōbi demo hatarakimasu.", arti: "Hari Minggu pun saya bekerja." },
    ],
    tags: ["konsesif", "te-form"],
  },
  {
    id: "noni",
    pattern: "〜のに",
    romaji: "~noni",
    arti: "padahal / meskipun",
    formation: "Klausa plain + のに (Na/N: な/だった → な/だった のに → な のに)",
    explanation:
      "Menyatakan ketidaksesuaian antara harapan dan kenyataan, sering dengan nuansa kecewa atau heran.",
    level: "N4",
    examples: [
      { kanji: "薬を飲んだのに、まだ熱がある。", romaji: "kusuri o nonda noni, mada netsu ga aru.", arti: "Padahal sudah minum obat, masih demam." },
      { kanji: "高いのに、おいしくない。", romaji: "takai noni, oishikunai.", arti: "Padahal mahal, tidak enak." },
      { kanji: "日曜日なのに、働かなければならない。", romaji: "nichiyōbi na noni, hatarakanakereba naranai.", arti: "Padahal hari Minggu, saya harus bekerja." },
    ],
    tags: ["konsesif", "kecewa"],
  },
  {
    id: "node",
    pattern: "〜ので",
    romaji: "~node",
    arti: "karena",
    formation: "Klausa plain + ので (Na/N: な/だった → な ので)",
    explanation:
      "Menjelaskan alasan secara halus dan netral. Lebih sopan dari から; sering dipakai dalam permintaan atau penjelasan formal.",
    level: "N4",
    examples: [
      { kanji: "頭が痛いので、休みます。", romaji: "atama ga itai node, yasumimasu.", arti: "Karena pusing, saya akan istirahat." },
      { kanji: "雨なので、出かけません。", romaji: "ame na node, dekakemasen.", arti: "Karena hujan, saya tidak keluar." },
      { kanji: "時間がないので、急ぎましょう。", romaji: "jikan ga nai node, isogimashō.", arti: "Karena tidak ada waktu, mari kita cepat." },
    ],
    tags: ["alasan", "sebab"],
  },
  {
    id: "tame-ni",
    pattern: "〜ために",
    romaji: "~tame ni",
    arti: "demi / untuk",
    formation: "V-dict + ために / N + のために",
    explanation:
      "Menyatakan tujuan (untuk ~) atau alasan (demi ~). Untuk tujuan, subjek klausa pertama dan kedua biasanya sama.",
    level: "N4",
    examples: [
      { kanji: "日本で働くために、日本語を勉強しています。", romaji: "nihon de hataraku tame ni, nihongo o benkyō shite imasu.", arti: "Saya belajar bahasa Jepang demi bisa bekerja di Jepang." },
      { kanji: "家族のために働く。", romaji: "kazoku no tame ni hataraku.", arti: "Bekerja demi keluarga." },
      { kanji: "健康のために運動しています。", romaji: "kenkō no tame ni undō shite imasu.", arti: "Saya olahraga demi kesehatan." },
    ],
    tags: ["tujuan", "alasan"],
  },
  {
    id: "yasui",
    pattern: "〜やすい",
    romaji: "~yasui",
    arti: "mudah ~",
    formation: "V-ます (hapus ます) + やすい",
    explanation:
      "Menyatakan bahwa sesuatu mudah / nyaman dilakukan atau terjadi. Bentuk negatif lawanya 〜にくい.",
    level: "N4",
    examples: [
      { kanji: "このペンは書きやすいです。", romaji: "kono pen wa kakiyasui desu.", arti: "Pulpen ini mudah ditulis." },
      { kanji: "この本は読みやすい。", romaji: "kono hon wa yomiyasui.", arti: "Buku ini mudah dibaca." },
      { kanji: "彼は怒りやすい人だ。", romaji: "kare wa okoriyasui hito da.", arti: "Dia adalah orang yang mudah marah." },
    ],
    tags: ["sifat", "kemudahan", "v-stem"],
  },
  {
    id: "nikui",
    pattern: "〜にくい",
    romaji: "~nikui",
    arti: "susah ~",
    formation: "V-ます (hapus ます) + にくい",
    explanation:
      "Lawan dari 〜やすい. Menyatakan sesuatu sulit / tidak nyaman dilakukan atau terjadi.",
    level: "N4",
    examples: [
      { kanji: "この字は読みにくい。", romaji: "kono ji wa yominikui.", arti: "Huruf ini sulit dibaca." },
      { kanji: "あの先生の話は分かりにくい。", romaji: "ano sensei no hanashi wa wakarinikui.", arti: "Penjelasan guru itu sulit dipahami." },
      { kanji: "この靴は歩きにくい。", romaji: "kono kutsu wa arukinikui.", arti: "Sepatu ini susah dipakai jalan." },
    ],
    tags: ["sifat", "kesulitan", "v-stem"],
  },
  {
    id: "sugiru",
    pattern: "〜すぎる",
    romaji: "~sugiru",
    arti: "terlalu ~",
    formation: "V-ます (hapus ます) / Adj-い (hapus い) / Adj-な + すぎる",
    explanation:
      "Menyatakan sesuatu yang berlebihan, biasanya dengan konotasi negatif. Konjugasinya seperti kata kerja ichidan.",
    level: "N4",
    examples: [
      { kanji: "昨日はお酒を飲みすぎた。", romaji: "kinō wa osake o nomisugita.", arti: "Kemarin saya kebanyakan minum sake." },
      { kanji: "この料理は辛すぎる。", romaji: "kono ryōri wa karasugiru.", arti: "Masakan ini terlalu pedas." },
      { kanji: "便利すぎて、やめられない。", romaji: "benri sugite, yamerarenai.", arti: "Terlalu praktis, sampai tidak bisa berhenti." },
    ],
    tags: ["berlebihan", "v-stem"],
  },
  {
    id: "sou-penampakan",
    pattern: "〜そう (penampakan)",
    romaji: "~sō (penampakan)",
    arti: "kelihatannya ~",
    formation: "V-ます (hapus ます) / Adj-い (hapus い) / Adj-な + そう",
    explanation:
      "Menyatakan kesan visual / dugaan dari penampakan. Khusus untuk kata sifat いい menjadi よさそう, ない menjadi なさそう.",
    level: "N4",
    examples: [
      { kanji: "このケーキはおいしそうですね。", romaji: "kono kēki wa oishisō desu ne.", arti: "Kue ini kelihatannya enak ya." },
      { kanji: "雨が降りそうだ。", romaji: "ame ga furisō da.", arti: "Sepertinya akan hujan." },
      { kanji: "彼は元気そうに見える。", romaji: "kare wa genkisō ni mieru.", arti: "Dia terlihat bersemangat." },
    ],
    tags: ["dugaan", "penampakan"],
  },
  {
    id: "sou-dengar",
    pattern: "〜そう (kata orang)",
    romaji: "~sō (hearsay)",
    arti: "katanya ~",
    formation: "Klausa plain + そうだ (N: N + だそうだ)",
    explanation:
      "Menyampaikan informasi yang didapat dari orang lain (kabar/desas-desus). Berbeda dengan 〜そう penampakan: tidak dikonjugasi.",
    level: "N4",
    examples: [
      { kanji: "天気予報によると、明日は晴れるそうだ。", romaji: "tenki yohō ni yoru to, ashita wa hareru sō da.", arti: "Menurut prakiraan cuaca, katanya besok cerah." },
      { kanji: "彼は来ないそうです。", romaji: "kare wa konai sō desu.", arti: "Katanya dia tidak datang." },
      { kanji: "あの店のラーメンはおいしいそうだ。", romaji: "ano mise no rāmen wa oishii sō da.", arti: "Katanya ramen di toko itu enak." },
    ],
    tags: ["dengar", "hearsay"],
  },
  {
    id: "rashii",
    pattern: "〜らしい",
    romaji: "~rashii",
    arti: "sepertinya / khas",
    formation: "V/Adj plain / N + らしい",
    explanation:
      "Bisa berarti (1) dugaan berdasarkan informasi yang didengar, mirip 〜そうだ tapi kurang yakin; (2) khas / sesuai dengan sifat (mis. 男らしい = jantan).",
    level: "N4",
    examples: [
      { kanji: "彼は風邪を引いたらしい。", romaji: "kare wa kaze o hiita rashii.", arti: "Sepertinya dia kena flu." },
      { kanji: "今日は寒くなるらしいですよ。", romaji: "kyō wa samuku naru rashii desu yo.", arti: "Katanya hari ini akan dingin." },
      { kanji: "本当に学生らしい服装だね。", romaji: "hontō ni gakusei-rashii fukusō da ne.", arti: "Pakaian itu benar-benar khas pelajar." },
    ],
    tags: ["dugaan", "khas"],
  },
  {
    id: "mitai",
    pattern: "〜みたい",
    romaji: "~mitai",
    arti: "sepertinya / mirip",
    formation: "V/Adj plain / N + みたい",
    explanation:
      "Versi kasual dari 〜ようだ. Dipakai untuk dugaan berdasarkan pengamatan langsung, atau menyatakan kemiripan.",
    level: "N4",
    examples: [
      { kanji: "雨が降っているみたいだ。", romaji: "ame ga futte iru mitai da.", arti: "Sepertinya sedang hujan." },
      { kanji: "夢みたいな話。", romaji: "yume mitai na hanashi.", arti: "Cerita yang seperti mimpi." },
      { kanji: "彼は子どもみたいに笑った。", romaji: "kare wa kodomo mitai ni waratta.", arti: "Dia tertawa seperti anak kecil." },
    ],
    tags: ["dugaan", "perumpamaan"],
  },
  {
    id: "you-bermaksud",
    pattern: "〜よう (volisional + bermaksud)",
    romaji: "~yō (intention)",
    arti: "bermaksud ~",
    formation: "V-volisional (ようとする / ようと思う)",
    explanation:
      "Memakai bentuk volisional (おう/よう) untuk menyatakan niat (〜ようと思う) atau usaha (〜ようとする = mencoba untuk).",
    level: "N4",
    examples: [
      { kanji: "明日から早く起きようと思います。", romaji: "ashita kara hayaku okiyō to omoimasu.", arti: "Saya berniat mulai besok bangun lebih awal." },
      { kanji: "犬が外へ出ようとしている。", romaji: "inu ga soto e deyō to shite iru.", arti: "Anjing mau keluar (sedang berusaha keluar)." },
      { kanji: "新しいことを始めようとしている。", romaji: "atarashii koto o hajimeyō to shite iru.", arti: "Saya sedang berusaha memulai hal baru." },
    ],
    tags: ["niat", "volisional"],
  },
  {
    id: "te-aru",
    pattern: "〜てある",
    romaji: "~te aru",
    arti: "telah di~ (keadaan)",
    formation: "V-て + ある (V harus transitif)",
    explanation:
      "Menyatakan keadaan hasil dari tindakan yang sudah dilakukan (biasanya disengaja). Berbeda dengan 〜ている yang menekankan aksi yang berlangsung.",
    level: "N4",
    examples: [
      { kanji: "黒板に名前が書いてあります。", romaji: "kokuban ni namae ga kaite arimasu.", arti: "Nama tertulis di papan tulis." },
      { kanji: "ドアが開けてある。", romaji: "doa ga akete aru.", arti: "Pintunya (sengaja) terbuka." },
      { kanji: "もう準備がしてあります。", romaji: "mō junbi ga shite arimasu.", arti: "Persiapan sudah dilakukan." },
    ],
    tags: ["keadaan", "te-form"],
  },
  {
    id: "te-oku",
    pattern: "〜ておく",
    romaji: "~te oku",
    arti: "lakukan dulu / untuk persiapan",
    formation: "V-て + おく (kontraksi: 〜とく)",
    explanation:
      "Melakukan sesuatu sebagai persiapan, atau membiarkan dalam keadaan tertentu. Sering dipendekkan menjadi 〜とく dalam percakapan.",
    level: "N4",
    examples: [
      { kanji: "旅行の前にホテルを予約しておきます。", romaji: "ryokō no mae ni hoteru o yoyaku shite okimasu.", arti: "Sebelum perjalanan, saya akan memesan hotel terlebih dahulu." },
      { kanji: "そのままにしておいて。", romaji: "sono mama ni shite oite.", arti: "Biarkan saja seperti itu." },
      { kanji: "ビールを冷やしておいた。", romaji: "bīru o hiyashite oita.", arti: "Saya sudah mendinginkan bir." },
    ],
    tags: ["persiapan", "te-form"],
  },
  {
    id: "te-shimau",
    pattern: "〜てしまう",
    romaji: "~te shimau",
    arti: "selesai / terlanjur",
    formation: "V-て + しまう (kontraksi: 〜ちゃう/〜じゃう)",
    explanation:
      "Punya dua makna utama: (1) tuntas / selesai sepenuhnya; (2) terjadi tanpa sengaja atau disesali. Kontraksi kasual: 〜ちゃう / 〜じゃう.",
    level: "N4",
    examples: [
      { kanji: "宿題はもうやってしまった。", romaji: "shukudai wa mō yatte shimatta.", arti: "PR sudah saya kerjakan habis." },
      { kanji: "電車に傘を忘れてしまった。", romaji: "densha ni kasa o wasurete shimatta.", arti: "Saya sampai ketinggalan payung di kereta." },
      { kanji: "彼の秘密を言っちゃった。", romaji: "kare no himitsu o icchatta.", arti: "Saya keceplosan membocorkan rahasianya." },
    ],
    tags: ["selesai", "terlanjur", "te-form"],
  },
  {
    id: "te-miru",
    pattern: "〜てみる",
    romaji: "~te miru",
    arti: "coba ~",
    formation: "V-て + みる",
    explanation:
      "Mencoba melakukan sesuatu untuk melihat hasilnya. 〜てみたい = ingin mencoba.",
    level: "N4",
    examples: [
      { kanji: "この服を着てみてください。", romaji: "kono fuku o kite mite kudasai.", arti: "Coba kenakan baju ini." },
      { kanji: "新しいレストランへ行ってみよう。", romaji: "atarashii resutoran e itte miyō.", arti: "Ayo coba pergi ke restoran baru." },
      { kanji: "日本へ行ってみたい。", romaji: "nihon e itte mitai.", arti: "Saya ingin coba pergi ke Jepang." },
    ],
    tags: ["coba", "te-form"],
  },
  {
    id: "bakari",
    pattern: "〜ばかり",
    romaji: "~bakari",
    arti: "hanya / cuma / kebanyakan",
    formation: "N / V-て + ばかり",
    explanation:
      "Menyatakan bahwa hanya atau kebanyakan sesuatu (sering dengan nuansa keluhan). Bedakan dengan 〜たばかり (baru saja).",
    level: "N4",
    examples: [
      { kanji: "彼はゲームばかりしている。", romaji: "kare wa gēmu bakari shite iru.", arti: "Dia kerjanya main game terus." },
      { kanji: "肉ばかり食べないで、野菜も食べなさい。", romaji: "niku bakari tabenaide, yasai mo tabenasai.", arti: "Jangan cuma makan daging, makanlah sayur juga." },
      { kanji: "泣いてばかりいないで。", romaji: "naite bakari inaide.", arti: "Jangan menangis saja." },
    ],
    tags: ["pembatas", "keluhan"],
  },
  {
    id: "ta-bakari",
    pattern: "〜たばかり",
    romaji: "~ta bakari",
    arti: "baru saja ~",
    formation: "V-た + ばかり",
    explanation:
      "Menyatakan suatu tindakan baru saja terjadi (rentang waktu subjektif).",
    level: "N4",
    examples: [
      { kanji: "今、起きたばかりです。", romaji: "ima, okita bakari desu.", arti: "Saya baru saja bangun." },
      { kanji: "彼は日本に来たばかりだ。", romaji: "kare wa nihon ni kita bakari da.", arti: "Dia baru saja datang ke Jepang." },
      { kanji: "食べたばかりだから、お腹がいっぱい。", romaji: "tabeta bakari da kara, onaka ga ippai.", arti: "Karena baru saja makan, perut kenyang." },
    ],
    tags: ["baru-saja", "ta-form"],
  },
  {
    id: "dake",
    pattern: "〜だけ",
    romaji: "~dake",
    arti: "hanya",
    formation: "N / V-dict + だけ",
    explanation:
      "Pembatasan jumlah / cakupan. Bisa ditempel ke kata benda, kata kerja, atau kata sifat.",
    level: "N4",
    examples: [
      { kanji: "水だけください。", romaji: "mizu dake kudasai.", arti: "Air putih saja, tolong." },
      { kanji: "一回だけやってみる。", romaji: "ikkai dake yatte miru.", arti: "Saya coba sekali saja." },
      { kanji: "見るだけでいい。", romaji: "miru dake de ii.", arti: "Cukup lihat saja." },
    ],
    tags: ["pembatas"],
  },
  {
    id: "shika-nai",
    pattern: "〜しか〜ない",
    romaji: "~shika ~nai",
    arti: "hanya (penegasan)",
    formation: "N + しか + V-negatif",
    explanation:
      "Pembatasan dengan nuansa 'tidak ada yang lain selain ~'. Selalu pasangkan dengan kata kerja negatif.",
    level: "N4",
    examples: [
      { kanji: "100円しかありません。", romaji: "hyaku-en shika arimasen.", arti: "Saya cuma punya 100 yen." },
      { kanji: "彼しか知らない。", romaji: "kare shika shiranai.", arti: "Hanya dia yang tahu." },
      { kanji: "一度しか会ったことがない。", romaji: "ichido shika atta koto ga nai.", arti: "Saya cuma pernah bertemu sekali." },
    ],
    tags: ["pembatas", "negatif"],
  },
  {
    id: "baai",
    pattern: "〜場合",
    romaji: "~baai",
    arti: "dalam kasus ~",
    formation: "V plain / Adj / N + の + 場合",
    explanation:
      "Menyatakan situasi atau kondisi tertentu. Sering muncul di petunjuk, peraturan, dan dokumen formal.",
    level: "N4",
    examples: [
      { kanji: "雨の場合は、試合は中止です。", romaji: "ame no baai wa, shiai wa chūshi desu.", arti: "Dalam kasus hujan, pertandingan dibatalkan." },
      { kanji: "遅れる場合は、連絡してください。", romaji: "okureru baai wa, renraku shite kudasai.", arti: "Kalau terlambat, mohon hubungi kami." },
      { kanji: "分からない場合は、聞いてください。", romaji: "wakaranai baai wa, kiite kudasai.", arti: "Kalau tidak mengerti, silakan bertanya." },
    ],
    tags: ["situasi", "formal"],
  },
  {
    id: "uchi-ni",
    pattern: "〜うちに",
    romaji: "~uchi ni",
    arti: "selagi / sebelum berubah",
    formation: "V-dict / V-ない / Adj-い / Adj-な + な / N + の + うちに",
    explanation:
      "Menyatakan agar tindakan dilakukan selama kondisi tertentu masih berlaku. Berbeda tipis dengan 〜間に: うちに lebih menekankan 'selagi kondisi belum berubah'.",
    level: "N4",
    examples: [
      { kanji: "若いうちに、たくさん経験しなさい。", romaji: "wakai uchi ni, takusan keiken shinasai.", arti: "Selagi muda, banyaklah berpengalaman." },
      { kanji: "暗くならないうちに帰ろう。", romaji: "kuraku naranai uchi ni kaerō.", arti: "Ayo pulang sebelum hari menjadi gelap." },
      { kanji: "コーヒーが熱いうちに飲んでください。", romaji: "kōhī ga atsui uchi ni nonde kudasai.", arti: "Silakan minum kopinya selagi panas." },
    ],
    tags: ["waktu", "perubahan"],
  },
  {
    id: "aida-ni",
    pattern: "〜間に",
    romaji: "~aida ni",
    arti: "selama / sementara",
    formation: "V-て いる / N + の + 間に",
    explanation:
      "Menyatakan suatu tindakan dilakukan dalam rentang waktu tertentu. Tanpa に (〜間) berarti sepanjang periode tersebut.",
    level: "N4",
    examples: [
      { kanji: "母が寝ている間に、料理を作った。", romaji: "haha ga nete iru aida ni, ryōri o tsukutta.", arti: "Saya memasak selagi ibu tidur." },
      { kanji: "夏休みの間に、たくさん本を読んだ。", romaji: "natsuyasumi no aida ni, takusan hon o yonda.", arti: "Selama liburan musim panas, saya banyak membaca buku." },
      { kanji: "私が出かけている間に、誰か来た。", romaji: "watashi ga dekakete iru aida ni, dareka kita.", arti: "Selama saya keluar, ada seseorang datang." },
    ],
    tags: ["waktu", "rentang"],
  },
  {
    id: "o-ni-naru",
    pattern: "お〜になる",
    romaji: "o-... ni naru",
    arti: "honorifik (sopan ke atas)",
    formation: "お + V-ます (hapus ます) + になる",
    explanation:
      "Bentuk honorifik (尊敬語) untuk meninggikan subjek (atasan/tamu). Tidak dipakai untuk diri sendiri.",
    level: "N4",
    examples: [
      { kanji: "先生はもうお帰りになりました。", romaji: "sensei wa mō okaeri ni narimashita.", arti: "Pak guru sudah pulang." },
      { kanji: "社長がお呼びになっています。", romaji: "shachō ga oyobi ni natte imasu.", arti: "Direktur memanggil Anda." },
      { kanji: "何時にお着きになりますか。", romaji: "nanji ni otsuki ni narimasu ka.", arti: "Anda tiba pukul berapa?" },
    ],
    tags: ["keigo", "honorifik"],
  },
  {
    id: "o-suru",
    pattern: "お〜する",
    romaji: "o-... suru",
    arti: "humble (sopan ke bawah / diri)",
    formation: "お + V-ます (hapus ます) + する",
    explanation:
      "Bentuk humble (謙譲語) untuk merendahkan diri ketika beraksi terhadap atasan/tamu. Lawan dari お〜になる.",
    level: "N4",
    examples: [
      { kanji: "私が荷物をお持ちします。", romaji: "watashi ga nimotsu o omochi shimasu.", arti: "Saya akan membawakan barangnya." },
      { kanji: "ご案内します。", romaji: "go-annai shimasu.", arti: "Saya akan memandu Anda." },
      { kanji: "後でお電話します。", romaji: "ato de odenwa shimasu.", arti: "Saya akan menelepon Anda nanti." },
    ],
    tags: ["keigo", "humble"],
  },
  {
    id: "te-itadaku",
    pattern: "〜ていただく",
    romaji: "~te itadaku",
    arti: "mendapat kebaikan (humble)",
    formation: "V-て + いただく",
    explanation:
      "Bentuk humble dari 〜てもらう (mendapat tindakan dari orang lain). Sering juga dalam pola permintaan sopan: 〜ていただけませんか.",
    level: "N4",
    examples: [
      { kanji: "先生に教えていただきました。", romaji: "sensei ni oshiete itadakimashita.", arti: "Saya diajari oleh guru (saya yang menerima bantuan)." },
      { kanji: "もう一度説明していただけませんか。", romaji: "mō ichido setsumei shite itadakemasen ka.", arti: "Bisakah Anda menjelaskan sekali lagi?" },
      { kanji: "写真を撮っていただきたいんですが。", romaji: "shashin o totte itadakitai n desu ga.", arti: "Boleh minta tolong difotokan?" },
    ],
    tags: ["keigo", "humble", "te-form"],
  },
  {
    id: "te-kureru",
    pattern: "〜てくれる",
    romaji: "~te kureru",
    arti: "(seseorang) melakukan untuk saya",
    formation: "V-て + くれる (sopan: くださる)",
    explanation:
      "Menyatakan bahwa orang lain melakukan sesuatu yang menguntungkan saya / orang dekat saya.",
    level: "N4",
    examples: [
      { kanji: "兄が宿題を手伝ってくれた。", romaji: "ani ga shukudai o tetsudatte kureta.", arti: "Kakak laki-laki saya membantu PR saya." },
      { kanji: "友達が駅まで送ってくれた。", romaji: "tomodachi ga eki made okutte kureta.", arti: "Teman mengantarkan saya sampai stasiun." },
      { kanji: "先生が日本語を教えてくださいました。", romaji: "sensei ga nihongo o oshiete kudasaimashita.", arti: "Pak guru telah mengajari saya bahasa Jepang." },
    ],
    tags: ["jasa", "te-form"],
  },
  {
    id: "te-ageru",
    pattern: "〜てあげる",
    romaji: "~te ageru",
    arti: "melakukan untuk (orang lain)",
    formation: "V-て + あげる (humble: さしあげる)",
    explanation:
      "Menyatakan bahwa saya / orang dekat saya melakukan sesuatu untuk orang lain. Hati-hati pemakaian ke atasan — terkesan memaksa.",
    level: "N4",
    examples: [
      { kanji: "弟に本を読んであげた。", romaji: "otōto ni hon o yonde ageta.", arti: "Saya membacakan buku untuk adik laki-laki." },
      { kanji: "友達に日本料理を作ってあげる。", romaji: "tomodachi ni nihon ryōri o tsukutte ageru.", arti: "Saya akan membuatkan masakan Jepang untuk teman." },
      { kanji: "おばあさんを駅まで案内してあげました。", romaji: "obāsan o eki made annai shite agemashita.", arti: "Saya memandu nenek itu sampai stasiun." },
    ],
    tags: ["jasa", "te-form"],
  },
  {
    id: "te-morau",
    pattern: "〜てもらう",
    romaji: "~te morau",
    arti: "minta seseorang melakukan",
    formation: "V-て + もらう (humble: いただく)",
    explanation:
      "Pelaku permintaan adalah subjek; orang lain melakukan tindakan untuk subjek. Sangat sering muncul dalam bahasa sehari-hari.",
    level: "N4",
    examples: [
      { kanji: "友達に日本語を直してもらった。", romaji: "tomodachi ni nihongo o naoshite moratta.", arti: "Saya minta teman membenarkan bahasa Jepang saya." },
      { kanji: "兄に車で送ってもらいました。", romaji: "ani ni kuruma de okutte moraimashita.", arti: "Saya diantar oleh kakak dengan mobil." },
      { kanji: "もう少し待ってもらえますか。", romaji: "mō sukoshi matte moraemasu ka.", arti: "Bisa minta tolong tunggu sebentar lagi?" },
    ],
    tags: ["jasa", "te-form"],
  },
  {
    id: "passive",
    pattern: "〜(ら)れる (受身)",
    romaji: "~(r)areru (pasif)",
    arti: "di~",
    formation: "Ichidan: stem + られる / Godan: a-row + れる / する→される / 来る→来られる",
    explanation:
      "Bentuk pasif. Selain untuk pasif murni, juga sering dipakai dalam 'pasif menderita' (mengeluh terhadap kerugian).",
    level: "N4",
    examples: [
      { kanji: "犬に手をかまれた。", romaji: "inu ni te o kamareta.", arti: "Tangan saya digigit anjing." },
      { kanji: "先生にほめられました。", romaji: "sensei ni homeraremashita.", arti: "Saya dipuji oleh guru." },
      { kanji: "雨に降られて、ぬれた。", romaji: "ame ni furarete, nureta.", arti: "Kehujanan, jadi basah (pasif menderita)." },
    ],
    tags: ["pasif", "konjugasi"],
  },
  {
    id: "causative",
    pattern: "〜(さ)せる (使役)",
    romaji: "~(s)aseru (kausatif)",
    arti: "menyuruh / membiarkan",
    formation: "Ichidan: stem + させる / Godan: a-row + せる / する→させる / 来る→来させる",
    explanation:
      "Menyatakan bahwa subjek menyuruh, mengizinkan, atau membiarkan orang lain melakukan suatu tindakan.",
    level: "N4",
    examples: [
      { kanji: "母は弟に部屋を掃除させた。", romaji: "haha wa otōto ni heya o sōji saseta.", arti: "Ibu menyuruh adik membersihkan kamar." },
      { kanji: "子供にもっと野菜を食べさせなさい。", romaji: "kodomo ni motto yasai o tabesasenasai.", arti: "Suruh anak-anak makan sayur lebih banyak." },
      { kanji: "ちょっと考えさせてください。", romaji: "chotto kangaesasete kudasai.", arti: "Tolong izinkan saya berpikir sebentar." },
    ],
    tags: ["kausatif", "konjugasi"],
  },
  {
    id: "causative-passive",
    pattern: "〜(さ)せられる (使役受身)",
    romaji: "~(s)aserareru (kausatif-pasif)",
    arti: "dipaksa ~",
    formation: "Kausatif + られる / godan boleh dipendek menjadi a-row + される",
    explanation:
      "Mengungkapkan bahwa subjek dipaksa / disuruh melakukan sesuatu (terhadap kemauan). Untuk godan -su, hanya bentuk panjang yang dipakai.",
    level: "N4",
    examples: [
      { kanji: "子供のときに、毎日ピアノを習わされた。", romaji: "kodomo no toki ni, mainichi piano o narawasareta.", arti: "Saat kecil, saya dipaksa belajar piano setiap hari." },
      { kanji: "先生に長い文章を読まされた。", romaji: "sensei ni nagai bunshō o yomasareta.", arti: "Saya disuruh guru membaca paragraf panjang." },
      { kanji: "嫌いな食べ物を食べさせられた。", romaji: "kirai na tabemono o tabesaserareta.", arti: "Saya dipaksa makan makanan yang tidak saya suka." },
    ],
    tags: ["kausatif-pasif", "konjugasi"],
  },
  {
    id: "te-iru",
    pattern: "〜ている",
    romaji: "~te iru",
    arti: "sedang ~ / dalam keadaan ~",
    formation: "V-て + いる (kontraksi: 〜てる)",
    explanation:
      "Punya tiga makna utama: (1) aksi yang sedang berlangsung, (2) keadaan hasil dari kejadian, (3) kebiasaan.",
    level: "N5",
    examples: [
      { kanji: "今、本を読んでいます。", romaji: "ima, hon o yonde imasu.", arti: "Sekarang saya sedang membaca buku." },
      { kanji: "彼は東京に住んでいる。", romaji: "kare wa Tōkyō ni sunde iru.", arti: "Dia tinggal di Tokyo." },
      { kanji: "毎朝ジョギングをしています。", romaji: "maiasa jogingu o shite imasu.", arti: "Setiap pagi saya jogging." },
    ],
    tags: ["progresif", "kebiasaan", "te-form"],
  },
  {
    id: "kara-alasan",
    pattern: "〜から",
    romaji: "~kara",
    arti: "karena",
    formation: "Klausa plain + から",
    explanation:
      "Menyatakan alasan / sebab secara umum. Lebih langsung dibandingkan 〜ので.",
    level: "N5",
    examples: [
      { kanji: "雨が降っているから、傘を持って行きます。", romaji: "ame ga futte iru kara, kasa o motte ikimasu.", arti: "Karena hujan, saya akan bawa payung." },
      { kanji: "忙しいから、行けない。", romaji: "isogashii kara, ikenai.", arti: "Karena sibuk, tidak bisa pergi." },
      { kanji: "好きだから、毎日食べる。", romaji: "suki da kara, mainichi taberu.", arti: "Karena suka, saya makan setiap hari." },
    ],
    tags: ["alasan", "sebab"],
  },
  {
    id: "made",
    pattern: "〜まで",
    romaji: "~made",
    arti: "sampai (titik waktu/tempat)",
    formation: "N / V-dict + まで",
    explanation:
      "Menyatakan batas akhir (waktu atau tempat). Berbeda dengan までに yang menyatakan tenggat.",
    level: "N5",
    examples: [
      { kanji: "5時まで働きます。", romaji: "goji made hatarakimasu.", arti: "Saya bekerja sampai jam 5." },
      { kanji: "駅まで歩いた。", romaji: "eki made aruita.", arti: "Saya berjalan sampai stasiun." },
      { kanji: "夜遅くまで勉強した。", romaji: "yoru osoku made benkyō shita.", arti: "Saya belajar sampai malam." },
    ],
    tags: ["waktu", "tempat"],
  },
  {
    id: "made-ni",
    pattern: "〜までに",
    romaji: "~made ni",
    arti: "paling lambat / sebelum",
    formation: "N (waktu) / V-dict + までに",
    explanation:
      "Menyatakan tenggat: paling lambat pada waktu X, harus selesai. Berbeda dengan 〜まで (rentang).",
    level: "N4",
    examples: [
      { kanji: "金曜日までにレポートを出してください。", romaji: "kin'yōbi made ni repōto o dashite kudasai.", arti: "Mohon serahkan laporan paling lambat Jumat." },
      { kanji: "10時までに帰ります。", romaji: "jūji made ni kaerimasu.", arti: "Saya akan pulang sebelum jam 10." },
      { kanji: "出発するまでに、準備を終わらせよう。", romaji: "shuppatsu suru made ni, junbi o owaraseyō.", arti: "Sebelum berangkat, ayo selesaikan persiapan." },
    ],
    tags: ["tenggat", "waktu"],
  },
  {
    id: "keredomo",
    pattern: "〜けれども / 〜けど",
    romaji: "~keredomo / ~kedo",
    arti: "tetapi",
    formation: "Klausa plain + けれども / けど",
    explanation:
      "Konjungsi kontras. けれども lebih sopan, けど lebih kasual. Juga dipakai untuk melembutkan permintaan.",
    level: "N4",
    examples: [
      { kanji: "高いけれども、買いたい。", romaji: "takai keredomo, kaitai.", arti: "Mahal, tapi saya ingin beli." },
      { kanji: "やってみたけど、難しかった。", romaji: "yatte mita kedo, muzukashikatta.", arti: "Saya coba, tapi sulit." },
      { kanji: "すみませんけど、ちょっと聞いてもいいですか。", romaji: "sumimasen kedo, chotto kiite mo ii desu ka.", arti: "Maaf, boleh tanya sebentar?" },
    ],
    tags: ["kontras", "konjungsi"],
  },
  {
    id: "ga-konjungsi",
    pattern: "〜が (kontras / pembuka)",
    romaji: "~ga (kontras)",
    arti: "tetapi",
    formation: "Klausa + が, klausa",
    explanation:
      "Selain partikel subjek, が dipakai sebagai konjungsi untuk kontras lembut, mirip 〜けど tapi lebih netral / sopan.",
    level: "N4",
    examples: [
      { kanji: "日本語は難しいですが、面白いです。", romaji: "nihongo wa muzukashii desu ga, omoshiroi desu.", arti: "Bahasa Jepang sulit, tetapi menarik." },
      { kanji: "電話しましたが、出ませんでした。", romaji: "denwa shimashita ga, demasen deshita.", arti: "Saya menelepon, tetapi tidak diangkat." },
      { kanji: "すみませんが、これをください。", romaji: "sumimasen ga, kore o kudasai.", arti: "Maaf, tolong yang ini." },
    ],
    tags: ["kontras", "konjungsi"],
  },
  {
    id: "kata",
    pattern: "〜方 (cara)",
    romaji: "~kata (cara)",
    arti: "cara ~",
    formation: "V-ます (hapus ます) + 方",
    explanation:
      "Menominalkan cara melakukan sesuatu. Sering dipakai dengan kata kerja yang melibatkan keterampilan.",
    level: "N4",
    examples: [
      { kanji: "漢字の書き方を教えてください。", romaji: "kanji no kakikata o oshiete kudasai.", arti: "Tolong ajari saya cara menulis kanji." },
      { kanji: "この料理の作り方は簡単です。", romaji: "kono ryōri no tsukurikata wa kantan desu.", arti: "Cara membuat masakan ini mudah." },
      { kanji: "電車の乗り方が分かりません。", romaji: "densha no norikata ga wakarimasen.", arti: "Saya tidak tahu cara naik kereta." },
    ],
    tags: ["nominalisasi", "v-stem"],
  },
  {
    id: "to-iu",
    pattern: "〜という",
    romaji: "~to iu",
    arti: "yang disebut / bernama",
    formation: "N + という + N",
    explanation:
      "Menjelaskan nama / sebutan suatu objek atau orang. Juga dipakai untuk mendefinisikan istilah baru.",
    level: "N4",
    examples: [
      { kanji: "「鬼滅の刃」というアニメを見ましたか。", romaji: "“Kimetsu no Yaiba” to iu anime o mimashita ka.", arti: "Apakah kamu menonton anime yang berjudul Kimetsu no Yaiba?" },
      { kanji: "田中という人を知っていますか。", romaji: "Tanaka to iu hito o shitte imasu ka.", arti: "Apakah kamu kenal orang bernama Tanaka?" },
      { kanji: "「お疲れ様」という言葉の意味は何ですか。", romaji: "“otsukaresama” to iu kotoba no imi wa nan desu ka.", arti: "Apa arti kata otsukaresama?" },
    ],
    tags: ["nama", "definisi"],
  },
  {
    id: "tokoro",
    pattern: "〜ところ",
    romaji: "~tokoro",
    arti: "tempat / sedang akan",
    formation: "V-dict / V-て いる / V-た + ところ",
    explanation:
      "Selain berarti 'tempat', dipakai dengan kata kerja untuk menyatakan tahap waktu: V-dict ところ (akan), V-ている ところ (sedang), V-た ところ (baru saja).",
    level: "N4",
    examples: [
      { kanji: "今から出かけるところです。", romaji: "ima kara dekakeru tokoro desu.", arti: "Saya akan keluar sekarang." },
      { kanji: "今、ご飯を食べているところだ。", romaji: "ima, gohan o tabete iru tokoro da.", arti: "Saya sedang makan sekarang." },
      { kanji: "ちょうど駅に着いたところです。", romaji: "chōdo eki ni tsuita tokoro desu.", arti: "Saya baru saja sampai di stasiun." },
    ],
    tags: ["waktu", "tahap"],
  },
  {
    id: "mama",
    pattern: "〜まま",
    romaji: "~mama",
    arti: "tetap dalam keadaan ~",
    formation: "V-た / V-ない / Adj-い / Adj-な + な / N + の + まま",
    explanation:
      "Menyatakan suatu keadaan dibiarkan tidak berubah saat tindakan lain dilakukan.",
    level: "N4",
    examples: [
      { kanji: "テレビをつけたまま寝てしまった。", romaji: "terebi o tsuketa mama nete shimatta.", arti: "Saya tertidur dalam keadaan TV menyala." },
      { kanji: "靴を履いたまま家に入らないでください。", romaji: "kutsu o haita mama ie ni hairanaide kudasai.", arti: "Jangan masuk rumah dengan sepatu masih dipakai." },
      { kanji: "そのままで結構です。", romaji: "sono mama de kekkō desu.", arti: "Biarkan apa adanya saja." },
    ],
    tags: ["keadaan", "tanpa-perubahan"],
  },
  {
    id: "tori-ni",
    pattern: "〜とおりに",
    romaji: "~tōri ni",
    arti: "sesuai dengan",
    formation: "V-dict / V-た + とおりに / N + のとおりに",
    explanation:
      "Menyatakan sesuatu dilakukan persis seperti contoh / instruksi yang diberikan. Bisa juga dalam bentuk 〜どおり (tanpa partikel).",
    level: "N4",
    examples: [
      { kanji: "先生が言ったとおりにやってください。", romaji: "sensei ga itta tōri ni yatte kudasai.", arti: "Lakukan persis seperti yang dikatakan guru." },
      { kanji: "予想どおり、彼が勝った。", romaji: "yosō dōri, kare ga katta.", arti: "Seperti dugaan, dia yang menang." },
      { kanji: "説明書のとおりに組み立てる。", romaji: "setsumeisho no tōri ni kumitateru.", arti: "Merakit sesuai buku petunjuk." },
    ],
    tags: ["sesuai", "instruksi"],
  },
  {
    id: "tari-tari",
    pattern: "〜たり〜たりする",
    romaji: "~tari ~tari suru",
    arti: "kadang ~ kadang ~",
    formation: "V-た + り + V-た + り + する",
    explanation:
      "Menyebutkan dua atau lebih aktivitas sebagai contoh (tidak menyebutkan semua), atau aktivitas bergantian.",
    level: "N4",
    examples: [
      { kanji: "休みの日は、本を読んだり、映画を見たりします。", romaji: "yasumi no hi wa, hon o yondari, eiga o mitari shimasu.", arti: "Di hari libur, saya kadang membaca buku, kadang menonton film." },
      { kanji: "雨が降ったり、止んだりしている。", romaji: "ame ga futtari, yandari shite iru.", arti: "Hujannya turun terus berhenti, bolak-balik." },
      { kanji: "歌を歌ったり、踊ったりした。", romaji: "uta o utattari, odottari shita.", arti: "Saya bernyanyi dan menari (di antara aktivitas lain)." },
    ],
    tags: ["aktivitas", "ta-form"],
  },
  {
    id: "darou",
    pattern: "〜だろう / 〜でしょう",
    romaji: "~darō / ~deshō",
    arti: "barangkali / kan?",
    formation: "Klausa plain + だろう / でしょう",
    explanation:
      "Menyatakan dugaan / perkiraan. でしょう bentuk sopan; sering dipakai untuk konfirmasi (\"kan?\") dengan intonasi naik.",
    level: "N4",
    examples: [
      { kanji: "明日は雨が降るだろう。", romaji: "ashita wa ame ga furu darō.", arti: "Mungkin besok hujan." },
      { kanji: "彼は学生でしょう？", romaji: "kare wa gakusei deshō?", arti: "Dia mahasiswa, kan?" },
      { kanji: "あの店は高いでしょうね。", romaji: "ano mise wa takai deshō ne.", arti: "Toko itu pasti mahal, ya." },
    ],
    tags: ["dugaan", "konfirmasi"],
  },
  {
    id: "kamoshirenai",
    pattern: "〜かもしれない",
    romaji: "~kamoshirenai",
    arti: "mungkin (saja)",
    formation: "Klausa plain + かもしれない / かもしれません",
    explanation:
      "Menyatakan dugaan dengan tingkat kepercayaan rendah / sekedar kemungkinan. Lebih lemah daripada 〜だろう.",
    level: "N4",
    examples: [
      { kanji: "明日は雪が降るかもしれません。", romaji: "ashita wa yuki ga furu kamoshiremasen.", arti: "Mungkin saja besok turun salju." },
      { kanji: "彼は来ないかもしれない。", romaji: "kare wa konai kamoshirenai.", arti: "Bisa jadi dia tidak datang." },
      { kanji: "間違っているかもしれない。", romaji: "machigatte iru kamoshirenai.", arti: "Mungkin saya salah." },
    ],
    tags: ["kemungkinan", "dugaan"],
  },
  {
    id: "hazu",
    pattern: "〜はず",
    romaji: "~hazu",
    arti: "seharusnya / pasti",
    formation: "V/Adj plain / N + の + はず",
    explanation:
      "Menyatakan kepercayaan kuat berdasarkan alasan/logika ('seharusnya begitu'). Bentuk negatif: 〜はずがない (tidak mungkin).",
    level: "N4",
    examples: [
      { kanji: "彼はもう着いているはずだ。", romaji: "kare wa mō tsuite iru hazu da.", arti: "Dia seharusnya sudah sampai." },
      { kanji: "そんなはずがない。", romaji: "sonna hazu ga nai.", arti: "Tidak mungkin begitu." },
      { kanji: "今日は休みのはずです。", romaji: "kyō wa yasumi no hazu desu.", arti: "Hari ini seharusnya libur." },
    ],
    tags: ["kepastian", "logika"],
  },
  {
    id: "koto-ga-dekiru",
    pattern: "〜ことができる",
    romaji: "~koto ga dekiru",
    arti: "bisa / mampu",
    formation: "V-dict + ことができる",
    explanation:
      "Versi formal dari bentuk potensial. Cocok untuk kalimat tertulis atau ungkapan kemampuan secara umum.",
    level: "N5",
    examples: [
      { kanji: "日本語で電話することができます。", romaji: "nihongo de denwa suru koto ga dekimasu.", arti: "Saya bisa menelepon dalam bahasa Jepang." },
      { kanji: "ここで写真を撮ることができません。", romaji: "koko de shashin o toru koto ga dekimasen.", arti: "Tidak boleh memotret di sini." },
      { kanji: "彼は車を運転することができる。", romaji: "kare wa kuruma o unten suru koto ga dekiru.", arti: "Dia bisa mengemudi mobil." },
    ],
    tags: ["potensial", "kemampuan"],
  },
  {
    id: "koto-ni-suru",
    pattern: "〜ことにする",
    romaji: "~koto ni suru",
    arti: "memutuskan untuk ~",
    formation: "V-dict / V-ない + ことにする",
    explanation:
      "Mengungkapkan keputusan yang diambil sendiri. Berbeda dengan 〜ことになる yang menyatakan keputusan tidak sepenuhnya pribadi.",
    level: "N4",
    examples: [
      { kanji: "毎日30分歩くことにした。", romaji: "mainichi sanjuppun aruku koto ni shita.", arti: "Saya memutuskan jalan kaki 30 menit setiap hari." },
      { kanji: "甘いものを食べないことにする。", romaji: "amai mono o tabenai koto ni suru.", arti: "Saya memutuskan tidak makan yang manis-manis." },
      { kanji: "来年留学することにしました。", romaji: "rainen ryūgaku suru koto ni shimashita.", arti: "Saya memutuskan akan studi ke luar negeri tahun depan." },
    ],
    tags: ["keputusan", "v-dict"],
  },
  {
    id: "koto-ni-naru",
    pattern: "〜ことになる",
    romaji: "~koto ni naru",
    arti: "telah diputuskan ~",
    formation: "V-dict / V-ない + ことになる",
    explanation:
      "Keputusan yang ditentukan oleh orang lain atau hasil situasi (bukan diri sendiri). Sering dipakai dalam pengumuman resmi.",
    level: "N4",
    examples: [
      { kanji: "来月、東京に転勤することになりました。", romaji: "raigetsu, Tōkyō ni tenkin suru koto ni narimashita.", arti: "Bulan depan saya akan dipindahkan ke Tokyo." },
      { kanji: "会議は来週に延期することになった。", romaji: "kaigi wa raishū ni enki suru koto ni natta.", arti: "Rapat diputuskan ditunda ke minggu depan." },
      { kanji: "結婚することになりました。", romaji: "kekkon suru koto ni narimashita.", arti: "Sudah ditetapkan saya akan menikah." },
    ],
    tags: ["keputusan", "pasif", "v-dict"],
  },
  {
    id: "you-ni-suru",
    pattern: "〜ようにする",
    romaji: "~yō ni suru",
    arti: "berusaha agar ~",
    formation: "V-dict / V-ない + ようにする",
    explanation:
      "Menyatakan usaha berkala / niat agar suatu kondisi tercapai (bukan satu kali pengalaman).",
    level: "N4",
    examples: [
      { kanji: "毎日漢字を覚えるようにしています。", romaji: "mainichi kanji o oboeru yō ni shite imasu.", arti: "Saya berusaha menghafal kanji setiap hari." },
      { kanji: "甘いものを食べないようにする。", romaji: "amai mono o tabenai yō ni suru.", arti: "Saya akan berusaha tidak makan yang manis-manis." },
      { kanji: "もっと早く起きるようにしよう。", romaji: "motto hayaku okiru yō ni shiyō.", arti: "Ayo usahakan bangun lebih awal." },
    ],
    tags: ["usaha", "kebiasaan"],
  },
  {
    id: "you-ni-naru",
    pattern: "〜ようになる",
    romaji: "~yō ni naru",
    arti: "menjadi bisa / berubah jadi ~",
    formation: "V-dict (potensial) / V-ない + ようになる",
    explanation:
      "Menggambarkan perubahan kemampuan atau kebiasaan dari tidak bisa → bisa, atau tidak melakukan → mulai melakukan.",
    level: "N4",
    examples: [
      { kanji: "日本語が話せるようになった。", romaji: "nihongo ga hanaseru yō ni natta.", arti: "Saya jadi bisa berbahasa Jepang." },
      { kanji: "前は嫌いだったが、納豆を食べるようになった。", romaji: "mae wa kirai datta ga, nattō o taberu yō ni natta.", arti: "Dulu saya benci, tapi sekarang jadi makan nattō." },
      { kanji: "夜遅くまで起きていないようになった。", romaji: "yoru osoku made okite inai yō ni natta.", arti: "Saya jadi tidak begadang sampai malam lagi." },
    ],
    tags: ["perubahan", "kemampuan"],
  },
  {
    id: "nai-de",
    pattern: "〜ないで",
    romaji: "~naide",
    arti: "tanpa ~",
    formation: "V-ない + で",
    explanation:
      "Menyatakan tindakan yang dilakukan tanpa melakukan tindakan lain. Bisa juga sebagai permintaan negatif (jangan ~).",
    level: "N4",
    examples: [
      { kanji: "朝ご飯を食べないで学校へ行った。", romaji: "asagohan o tabenai de gakkō e itta.", arti: "Saya pergi ke sekolah tanpa sarapan." },
      { kanji: "心配しないでください。", romaji: "shinpai shinaide kudasai.", arti: "Mohon jangan khawatir." },
      { kanji: "寝ないで勉強する。", romaji: "nenaide benkyō suru.", arti: "Belajar tanpa tidur." },
    ],
    tags: ["negatif", "te-form"],
  },
  {
    id: "nakute",
    pattern: "〜なくて",
    romaji: "~nakute",
    arti: "tidak ~ dan / karena tidak ~",
    formation: "V-ない (hapus い) + くて / Adj-くなくて",
    explanation:
      "Bentuk て negatif untuk menghubungkan klausa, sering bermakna sebab. Bedakan dengan 〜ないで yang lebih menyatakan keadaan.",
    level: "N4",
    examples: [
      { kanji: "宿題が終わらなくて、困っている。", romaji: "shukudai ga owaranakute, komatte iru.", arti: "PR tidak selesai-selesai, saya jadi bingung." },
      { kanji: "天気が良くなくて、出かけなかった。", romaji: "tenki ga yokunakute, dekakenakatta.", arti: "Cuaca tidak bagus, jadinya saya tidak keluar." },
      { kanji: "お金がなくて、買えなかった。", romaji: "okane ga nakute, kaenakatta.", arti: "Karena tidak ada uang, saya tidak bisa beli." },
    ],
    tags: ["sebab", "negatif"],
  },
  {
    id: "zu-ni",
    pattern: "〜ずに",
    romaji: "~zu ni",
    arti: "tanpa ~ (formal)",
    formation: "V-ない (hapus ない) + ず + に / する → せずに",
    explanation:
      "Sinonim formal / tertulis dari 〜ないで. Sering muncul dalam bahasa kantor / berita / novel.",
    level: "N4",
    examples: [
      { kanji: "朝ご飯を食べずに出かけた。", romaji: "asagohan o tabezu ni dekaketa.", arti: "Saya keluar tanpa sarapan." },
      { kanji: "辞書を使わずに、読んでみる。", romaji: "jisho o tsukawazu ni, yonde miru.", arti: "Coba baca tanpa pakai kamus." },
      { kanji: "何も言わずに帰った。", romaji: "nani mo iwazu ni kaetta.", arti: "Pulang tanpa mengatakan apa-apa." },
    ],
    tags: ["negatif", "formal"],
  },
  {
    id: "koto",
    pattern: "〜こと (nominalizer)",
    romaji: "~koto",
    arti: "hal / fakta ~",
    formation: "V-dict / Adj + こと",
    explanation:
      "Mengubah klausa menjadi kata benda. Dipakai dengan kata kerja yang menyatakan ide abstrak (mis. 好きだ, 趣味).",
    level: "N5",
    examples: [
      { kanji: "本を読むことが好きです。", romaji: "hon o yomu koto ga suki desu.", arti: "Saya suka membaca buku." },
      { kanji: "毎日運動することは大切だ。", romaji: "mainichi undō suru koto wa taisetsu da.", arti: "Berolahraga setiap hari itu penting." },
      { kanji: "彼が来ることを知らなかった。", romaji: "kare ga kuru koto o shiranakatta.", arti: "Saya tidak tahu fakta bahwa dia datang." },
    ],
    tags: ["nominalisasi"],
  },
  {
    id: "no-nominalizer",
    pattern: "〜の (nominalizer)",
    romaji: "~no",
    arti: "hal ~ (langsung diamati)",
    formation: "V-dict / Adj + の",
    explanation:
      "Nominalizer yang lebih konkret (langsung dirasakan). Sering dipakai dengan kata kerja persepsi (見る, 聞く).",
    level: "N4",
    examples: [
      { kanji: "彼が泣いているのを見た。", romaji: "kare ga naite iru no o mita.", arti: "Saya melihat dia (sedang) menangis." },
      { kanji: "歌うのが好きだ。", romaji: "utau no ga suki da.", arti: "Saya suka menyanyi." },
      { kanji: "誰かが来たのが聞こえた。", romaji: "dareka ga kita no ga kikoeta.", arti: "Saya mendengar seseorang datang." },
    ],
    tags: ["nominalisasi"],
  },
  {
    id: "no-desu",
    pattern: "〜のだ / 〜のです / 〜んです",
    romaji: "~noda / ~no desu / ~n desu",
    arti: "(memberi penjelasan)",
    formation: "Klausa plain + のだ / のです / んです",
    explanation:
      "Pola penjelasan: menyampaikan alasan, latar belakang, atau penegasan. Sangat umum dalam percakapan sebagai 〜んです.",
    level: "N4",
    examples: [
      { kanji: "どうして遅れたんですか。", romaji: "dōshite okureta n desu ka.", arti: "Kenapa kamu terlambat?" },
      { kanji: "頭が痛いんです。", romaji: "atama ga itai n desu.", arti: "Soalnya kepala saya sakit." },
      { kanji: "明日は行かないのだ。", romaji: "ashita wa ikanai no da.", arti: "Saya tidak akan pergi besok (penegasan)." },
    ],
    tags: ["penjelasan", "percakapan"],
  },
  {
    id: "te-mo-ii",
    pattern: "〜てもいい",
    romaji: "~te mo ii",
    arti: "boleh ~",
    formation: "V-て + もいい / Adj-くてもいい / N + でもいい",
    explanation:
      "Memberi izin atau menyatakan bahwa sesuatu dapat diterima. Lawan dari 〜てはいけない.",
    level: "N5",
    examples: [
      { kanji: "ここに座ってもいいですか。", romaji: "koko ni suwatte mo ii desu ka.", arti: "Boleh saya duduk di sini?" },
      { kanji: "辞書を使ってもいい。", romaji: "jisho o tsukatte mo ii.", arti: "Boleh pakai kamus." },
      { kanji: "簡単な日本語でもいいです。", romaji: "kantan na nihongo demo ii desu.", arti: "Bahasa Jepang sederhana pun boleh." },
    ],
    tags: ["izin", "te-form"],
  },
  {
    id: "te-wa-ikenai",
    pattern: "〜てはいけない",
    romaji: "~te wa ikenai",
    arti: "tidak boleh ~",
    formation: "V-て + は + いけない (kontraksi: 〜ちゃいけない)",
    explanation:
      "Larangan / pelanggaran aturan. 〜ちゃいけない / 〜ちゃダメ adalah versi kasualnya.",
    level: "N4",
    examples: [
      { kanji: "ここでタバコを吸ってはいけません。", romaji: "koko de tabako o sutte wa ikemasen.", arti: "Tidak boleh merokok di sini." },
      { kanji: "嘘をついちゃダメだよ。", romaji: "uso o tsuicha dame da yo.", arti: "Tidak boleh bohong." },
      { kanji: "授業中は寝てはいけない。", romaji: "jugyō chū wa nete wa ikenai.", arti: "Tidak boleh tidur saat pelajaran." },
    ],
    tags: ["larangan", "te-form"],
  },
  {
    id: "nakucha",
    pattern: "〜なくちゃ / 〜なきゃ",
    romaji: "~nakucha / ~nakya",
    arti: "harus (kasual)",
    formation: "V-ない (hapus い) → くちゃ / きゃ (singkatan kasual)",
    explanation:
      "Kontraksi kasual dari 〜なくてはいけない / 〜なければならない. Sering tanpa いけない (digantung di akhir).",
    level: "N4",
    examples: [
      { kanji: "もう行かなきゃ。", romaji: "mō ikanakya.", arti: "Aku harus pergi sekarang." },
      { kanji: "宿題をしなくちゃ。", romaji: "shukudai o shinakucha.", arti: "Aku harus mengerjakan PR." },
      { kanji: "早く寝なきゃダメだよ。", romaji: "hayaku nenakya dame da yo.", arti: "Kamu harus cepat tidur, lho." },
    ],
    tags: ["modal", "keharusan", "kasual"],
  },
  {
    id: "te-kara",
    pattern: "〜てから",
    romaji: "~te kara",
    arti: "setelah ~",
    formation: "V-て + から",
    explanation:
      "Menyatakan urutan: setelah A baru B. Subjek dua klausa boleh berbeda.",
    level: "N5",
    examples: [
      { kanji: "ご飯を食べてから、出かけます。", romaji: "gohan o tabete kara, dekakemasu.", arti: "Setelah makan, saya akan keluar." },
      { kanji: "宿題が終わってから、遊びましょう。", romaji: "shukudai ga owatte kara, asobimashō.", arti: "Setelah PR selesai, ayo main." },
      { kanji: "日本に来てから、もう3年です。", romaji: "Nihon ni kite kara, mō san-nen desu.", arti: "Sudah 3 tahun sejak saya datang ke Jepang." },
    ],
    tags: ["urutan", "te-form"],
  },
  {
    id: "mae-ni",
    pattern: "〜前に",
    romaji: "~mae ni",
    arti: "sebelum ~",
    formation: "V-dict / N + の + 前に",
    explanation:
      "Menyatakan suatu tindakan dilakukan sebelum tindakan/waktu lain. Kata kerja dalam bentuk dict.",
    level: "N5",
    examples: [
      { kanji: "寝る前に、歯を磨きます。", romaji: "neru mae ni, ha o migakimasu.", arti: "Sebelum tidur, saya menyikat gigi." },
      { kanji: "食事の前に手を洗おう。", romaji: "shokuji no mae ni te o araō.", arti: "Sebelum makan, ayo cuci tangan." },
      { kanji: "3年前に日本に来ました。", romaji: "san-nen mae ni nihon ni kimashita.", arti: "Saya datang ke Jepang 3 tahun yang lalu." },
    ],
    tags: ["urutan", "waktu"],
  },
  {
    id: "ato-de",
    pattern: "〜後で",
    romaji: "~ato de",
    arti: "setelah ~",
    formation: "V-た / N + の + 後で",
    explanation:
      "Sinonim 〜てから, tetapi memakai bentuk た. Sering dipakai untuk kalimat tertulis.",
    level: "N5",
    examples: [
      { kanji: "授業が終わった後で、図書館へ行きます。", romaji: "jugyō ga owatta ato de, toshokan e ikimasu.", arti: "Setelah kelas selesai, saya pergi ke perpustakaan." },
      { kanji: "食事の後で、デザートを食べる。", romaji: "shokuji no ato de, dezāto o taberu.", arti: "Setelah makan, kami makan pencuci mulut." },
      { kanji: "見た後で、感想を教えて。", romaji: "mita ato de, kansō o oshiete.", arti: "Setelah menonton, ceritakan kesanmu." },
    ],
    tags: ["urutan", "waktu"],
  },
  {
    id: "houga",
    pattern: "〜ほうが (perbandingan)",
    romaji: "~hō ga",
    arti: "lebih ~ daripada",
    formation: "A + より + B + のほうが + Adj",
    explanation:
      "Pola perbandingan dasar. Bisa dipertukarkan dengan 〜より meskipun fokusnya berbeda.",
    level: "N5",
    examples: [
      { kanji: "東京のほうが大阪より大きいです。", romaji: "Tōkyō no hō ga Ōsaka yori ōkii desu.", arti: "Tokyo lebih besar daripada Osaka." },
      { kanji: "今日のほうが昨日より暑い。", romaji: "kyō no hō ga kinō yori atsui.", arti: "Hari ini lebih panas daripada kemarin." },
      { kanji: "歩くほうが速い。", romaji: "aruku hō ga hayai.", arti: "Lebih cepat kalau jalan kaki." },
    ],
    tags: ["perbandingan"],
  },
  {
    id: "yori",
    pattern: "〜より",
    romaji: "~yori",
    arti: "daripada",
    formation: "A は B + より + Adj",
    explanation:
      "Menyatakan dasar perbandingan ('daripada'). Sering dipasangkan dengan 〜のほうが.",
    level: "N5",
    examples: [
      { kanji: "電車はバスより速い。", romaji: "densha wa basu yori hayai.", arti: "Kereta lebih cepat daripada bus." },
      { kanji: "今年は去年より忙しい。", romaji: "kotoshi wa kyonen yori isogashii.", arti: "Tahun ini lebih sibuk daripada tahun lalu." },
      { kanji: "思ったより簡単でした。", romaji: "omotta yori kantan deshita.", arti: "Lebih mudah daripada yang saya kira." },
    ],
    tags: ["perbandingan"],
  },
  {
    id: "ichiban",
    pattern: "〜が一番〜",
    romaji: "~ga ichiban ~",
    arti: "paling ~",
    formation: "X が 一番 + Adj / V",
    explanation:
      "Menyatakan superlative (paling). 一番 berarti 'nomor satu'.",
    level: "N5",
    examples: [
      { kanji: "果物の中で、りんごが一番好きです。", romaji: "kudamono no naka de, ringo ga ichiban suki desu.", arti: "Di antara buah-buahan, saya paling suka apel." },
      { kanji: "クラスで彼が一番背が高い。", romaji: "kurasu de kare ga ichiban se ga takai.", arti: "Di kelas, dia yang paling tinggi." },
      { kanji: "この道が一番近いです。", romaji: "kono michi ga ichiban chikai desu.", arti: "Jalan ini yang paling dekat." },
    ],
    tags: ["superlative"],
  },
  {
    id: "naru",
    pattern: "〜になる / 〜くなる",
    romaji: "~ni naru / ~ku naru",
    arti: "menjadi ~",
    formation: "N + に + なる / Adj-い (hapus い) + くなる / Adj-な + に + なる",
    explanation:
      "Menyatakan perubahan keadaan. Pasangan transitif: 〜にする (membuat menjadi ~).",
    level: "N5",
    examples: [
      { kanji: "寒くなりましたね。", romaji: "samuku narimashita ne.", arti: "Sudah jadi dingin ya." },
      { kanji: "医者になりたい。", romaji: "isha ni naritai.", arti: "Saya ingin menjadi dokter." },
      { kanji: "部屋がきれいになった。", romaji: "heya ga kirei ni natta.", arti: "Kamar jadi bersih." },
    ],
    tags: ["perubahan"],
  },
  {
    id: "ni-suru",
    pattern: "〜にする (memilih)",
    romaji: "~ni suru (memilih)",
    arti: "memilih / memutuskan (yang ini)",
    formation: "N + にする",
    explanation:
      "Menyatakan pilihan, sering di restoran/toko. Berbeda makna dengan 〜ことにする (memutuskan tindakan).",
    level: "N4",
    examples: [
      { kanji: "私はコーヒーにします。", romaji: "watashi wa kōhī ni shimasu.", arti: "Saya pesan kopi." },
      { kanji: "色は赤にしよう。", romaji: "iro wa aka ni shiyō.", arti: "Warnanya pilih merah saja." },
      { kanji: "サイズはMにします。", romaji: "saizu wa M ni shimasu.", arti: "Ukurannya saya pilih M." },
    ],
    tags: ["pilihan"],
  },
  {
    id: "you-ni-iu",
    pattern: "〜ように言う",
    romaji: "~yō ni iu",
    arti: "menyuruh / meminta agar ~",
    formation: "V-dict / V-ない + ように言う / 頼む / 伝える",
    explanation:
      "Pola untuk menyampaikan permintaan tidak langsung. Kata kerja akhir bisa 言う, 頼む, 伝える, 注意する, dll.",
    level: "N4",
    examples: [
      { kanji: "母に早く帰るように言われた。", romaji: "haha ni hayaku kaeru yō ni iwareta.", arti: "Ibu menyuruh saya cepat pulang." },
      { kanji: "彼に手伝うように頼んだ。", romaji: "kare ni tetsudau yō ni tanonda.", arti: "Saya meminta dia membantu." },
      { kanji: "遅れないように伝えてください。", romaji: "okurenai yō ni tsutaete kudasai.", arti: "Tolong sampaikan agar jangan terlambat." },
    ],
    tags: ["permintaan", "tidak-langsung"],
  },
  {
    id: "noni-tujuan",
    pattern: "〜のに (tujuan)",
    romaji: "~no ni (tujuan)",
    arti: "untuk ~",
    formation: "V-dict + のに + adj/kata sifat manfaat",
    explanation:
      "Berbeda dengan のに kontras: のに setelah V-dict + adj benda berarti 'untuk tujuan' (mis. 〜のに便利だ).",
    level: "N4",
    examples: [
      { kanji: "この道具は野菜を切るのに便利だ。", romaji: "kono dōgu wa yasai o kiru no ni benri da.", arti: "Alat ini berguna untuk memotong sayuran." },
      { kanji: "辞書は読むのに必要です。", romaji: "jisho wa yomu no ni hitsuyō desu.", arti: "Kamus dibutuhkan untuk membaca." },
      { kanji: "東京まで車で行くのに3時間かかる。", romaji: "Tōkyō made kuruma de iku no ni san-jikan kakaru.", arti: "Untuk ke Tokyo naik mobil butuh 3 jam." },
    ],
    tags: ["tujuan", "manfaat"],
  },
  {
    id: "douyatte",
    pattern: "〜どうやって / 〜どう",
    romaji: "~dō yatte / ~dō",
    arti: "bagaimana cara ~",
    formation: "どう + V / どうやって + V",
    explanation:
      "Pertanyaan mengenai cara. どうやって lebih spesifik (cara konkret), どう lebih umum (perasaan/kesan).",
    level: "N4",
    examples: [
      { kanji: "駅までどうやって行きますか。", romaji: "eki made dō yatte ikimasu ka.", arti: "Bagaimana cara ke stasiun?" },
      { kanji: "日本はどうでしたか。", romaji: "Nihon wa dō deshita ka.", arti: "Bagaimana (kesan) tentang Jepang?" },
      { kanji: "この漢字はどうやって読みますか。", romaji: "kono kanji wa dō yatte yomimasu ka.", arti: "Bagaimana cara membaca kanji ini?" },
    ],
    tags: ["pertanyaan", "cara"],
  },
  {
    id: "tabi-ni",
    pattern: "〜たびに",
    romaji: "~tabi ni",
    arti: "setiap kali ~",
    formation: "V-dict / N + の + たびに",
    explanation:
      "Menyatakan suatu kejadian terjadi setiap kali aksi/kejadian referensi muncul. Bersifat berulang.",
    level: "N4",
    examples: [
      { kanji: "この曲を聞くたびに、故郷を思い出す。", romaji: "kono kyoku o kiku tabi ni, kokyō o omoidasu.", arti: "Setiap kali mendengar lagu ini, saya teringat kampung halaman." },
      { kanji: "彼に会うたびに、笑顔になる。", romaji: "kare ni au tabi ni, egao ni naru.", arti: "Setiap kali bertemu dia, saya jadi tersenyum." },
      { kanji: "旅行のたびに新しい発見がある。", romaji: "ryokō no tabi ni atarashii hakken ga aru.", arti: "Setiap perjalanan selalu ada penemuan baru." },
    ],
    tags: ["frekuensi", "berulang"],
  },
];

export const GRAMMAR_TOTAL = GRAMMAR_PATTERNS.length;

export const GRAMMAR_TAGS = Array.from(
  new Set(GRAMMAR_PATTERNS.flatMap((p) => p.tags))
).sort();

export function grammarById(id: string): GrammarPattern | undefined {
  return GRAMMAR_PATTERNS.find((p) => p.id === id);
}
