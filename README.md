# 日本語 Learning Hub

Aplikasi web untuk belajar bahasa Jepang dengan ~1.500 kosakata level N4,
ribuan kalimat untuk Tes Susun Kalimat 5 level, dan beberapa jenis tes.
Dibangun dengan React + TypeScript + Vite + Tailwind CSS.

## Fitur utama

- **Kartu kosakata (flashcards)**: 12 kategori, maksimum 30 kata per halaman,
  dengan animasi flip dan penanda "sudah hafal".
- **Tampilan Tabel**: alternatif tampilan kartu — daftar 30 kosakata per
  halaman dengan kolom Kanji | Romaji | Arti | Status, lengkap dengan
  pencarian dan tandai "Hafal". Pilihan tampilan tersimpan otomatis.
- **Tes Pilihan Ganda**: pilih halaman, jumlah soal, dan waktu per soal.
  Tanpa romaji — hanya kanji ↔ arti.
- **Tes Mengetik**: ketik **arti** dari kanji, atau ketik **romaji** dari arti.
- **Modul Kaigo (Perawatan Lansia)**: dua modul terpisah (Kaigo 1 Dasar &
  Kaigo 2 Lanjutan) berisi ratusan kosakata kaigo yang diurut dari yang paling
  sering dipakai (tubuh, organ tubuh, dst.), lengkap dengan Tes Pilihan Ganda
  dan Tes Mengetik per modul.
- **Modul Tata Bahasa N4**: ~80 pola tata bahasa N4 (mayoritas) + beberapa pola
  N5 inti, dengan penjelasan Bahasa Indonesia, pola pembentukan, dan minimal 3
  contoh kalimat per pola. Termasuk halaman daftar dengan pencarian + filter
  tag/level (`/tata-bahasa`), halaman detail dengan SpeakButton
  (`/tata-bahasa/:id`), dan kuis pilihan ganda 5/10/20 soal
  (`/tata-bahasa/tes`). Distractor diambil dari pola dengan tag mirip.
- **Drill Konjugasi Kata Kerja** (`/konjugasi`): latihan mengetik konjugasi
  untuk 160 kata kerja N4 (ichidan, semua varian godan, dan irregular する/来る)
  dalam 17 bentuk: ます (positif/negatif/lampau/lampau-negatif), て, た, ない,
  なかった, potensial, pasif, kausatif, kausatif-pasif, perintah (めいれい),
  larangan (な-form), volisional (ましょう/よう), serta kondisional ば & たら.
  Mode random (banyak bentuk) atau fokus satu bentuk. Run dicatat ke
  `jepang:konjugasi:runs` agar muncul di halaman Statistik.
- **Tes Susun Kalimat**: 5 level kesulitan dengan ribuan kalimat (kombinasi
  kalimat kurasi + kalimat hasil generator template × pool kosakata), mode
  Arti → Kanji & Arti → Romaji, minimal pilih 3 halaman kosakata.
- **Tes Choukai (Listening)** (`/tes/choukai`): 32 soal kurasi gaya JLPT N4/N5
  (campuran *mondai 1* pertanyaan terbaik, *mondai 2* poin penting, *mondai 3*
  topik utama). Tombol **Putar** memanggil `speakJa(rate: 0.85)`; tiap soal
  boleh diputar maks 2x, dan transcript baru tampil setelah Anda menjawab.
- **Tes Dokkai (Reading)** (`/tes/dokkai`): 13 passage pendek-menengah dengan
  3–4 pertanyaan pilihan ganda. Toggle "Tampilkan romaji" per passage dan
  tombol `SpeakButton` untuk membaca passage.
- **Simulasi JLPT N4 lengkap** (`/tes/simulasi-jlpt-n4`): tiga seksi berurutan
  dengan timer realistis dan auto-submit saat habis — **Goi** (25 menit, 30
  soal: bacaan kanji, pilih kanji, sinonim, pemakaian), **Bunpou + Dokkai**
  (55 menit, 30 grammar + 3 passage), dan **Choukai** (35 menit, 25 soal).
  Tidak boleh kembali ke seksi sebelumnya. Hasil akhir menampilkan skor per
  seksi (skala 0–60), total 0–180, dan estimasi **LULUS** / **TIDAK** dengan
  kriteria JLPT asli (≥90/180 dan ≥19/60 per seksi). Run disimpan di
  `jepang:jlpt:runs` dan muncul di seksi *Simulasi JLPT N4* halaman Statistik
  beserta tren skor.
- **Pelafalan audio (TTS)**: tombol speaker di kartu kosakata, tabel, dan
  layar tes untuk membacakan kanji dalam bahasa Jepang via Web Speech API
  browser — gratis, native, tanpa dependency tambahan. Opsi *auto-play saat
  flip kartu* dapat diaktifkan dari halaman beranda.
- **Statistik**: jumlah & persentase hafalan, akurasi, kecepatan, tren tes,
  hafalan per kategori, dan riwayat lengkap.
- **Catatan harian**: catat progres dan target belajar per tanggal.
- **Tema gelap** dengan gradient abu-abu dan font putih.

## Struktur repo

```
jepang/
└── jepang-web/        # Aplikasi React (Vite + TypeScript + Tailwind)
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── data/      # vocab.ts (kosakata), sentences.ts (kalimat kurasi),
    │   │              # generatedSentences.ts (kalimat auto-generate),
    │   │              # grammar.ts (80 pola N4), verbs.ts (160 kata kerja N4),
    │   │              # choukai.ts (32 soal listening), dokkai.ts (13 passage)
    │   ├── lib/      # …, conjugate.ts (fungsi murni 17 bentuk konjugasi),
    │   │             # jlptQuestions.ts (builder soal Goi)
    │   └── pages/    # …, Grammar.tsx, GrammarDetail.tsx, GrammarTest.tsx,
    │                 # Conjugation.tsx, Choukai.tsx, Dokkai.tsx, SimulasiJLPT.tsx
    ├── scripts/
    │   ├── generate-sentences.mjs  # generator ribuan kalimat untuk Susun Kalimat
    │   └── add-n4-vocab.mjs        # menambahkan kosakata tambahan N4 ke vocab.ts
    └── ...
```

## Menjalankan secara lokal

```bash
cd jepang-web
npm install
npm run dev      # buka http://localhost:5173
npm run build    # build untuk produksi (output: dist/)
npm run lint
```

## Memasang sebagai aplikasi (PWA)

Aplikasi ini sudah dikemas sebagai **Progressive Web App** sehingga bisa
dipasang seperti aplikasi native di HP & desktop, jalan offline, dan punya
ikon sendiri di home screen / menu aplikasi.

### Android (HP)

1. Buka URL aplikasi di **Chrome** (atau Edge / Samsung Internet).
2. Tunggu beberapa detik. Banner "Pasang aplikasi" akan muncul di bagian
   bawah layar — ketuk **Pasang**.
3. Jika banner tidak muncul: ketuk menu titik tiga di pojok kanan atas →
   **Tambahkan ke layar Utama** / **Install app**.
4. Ikon 日本語 Hub akan muncul di home screen seperti aplikasi biasa. Buka
   dari ikon — aplikasi jalan full-screen tanpa address bar.

### Linux Mint Cinnamon (desktop)

1. Buka URL aplikasi di **Chrome**, **Chromium**, **Brave**, atau **Edge**
   (Firefox saat ini belum mendukung instalasi PWA di Linux).
2. Klik ikon **Install** di sebelah kanan address bar (ikon komputer dengan
   panah), atau buka menu titik tiga → **Cast, save, and share** → **Install
   日本語 Hub…**.
3. Cinnamon akan otomatis membuatkan shortcut di menu aplikasi (kategori
   *Education* / *Other*). Buka dari menu — aplikasi muncul sebagai window
   sendiri, terpisah dari tab browser.
4. Untuk membuat shortcut tambahan di desktop, klik kanan di menu aplikasi
   → *Add to desktop*.

### Fitur offline

- Setelah dipasang (atau dibuka sekali online), semua kosakata, soal,
  passage, dan asset disimpan ke service worker dan tersedia tanpa koneksi.
- Notifikasi **"Siap dipakai offline"** muncul saat cache pertama berhasil.
- Saat ada versi baru yang dideploy, notifikasi **"Versi baru tersedia"**
  akan muncul dengan tombol *Muat ulang* untuk update tanpa kehilangan data.

## Regenerasi data

```bash
# Regenerasi kalimat untuk Tes Susun Kalimat (output: src/data/generatedSentences.ts)
node scripts/generate-sentences.mjs

# Tambah/refresh section "Kosakata Tambahan N4" di src/data/vocab.ts (idempotent)
node scripts/add-n4-vocab.mjs

# Validasi fungsi konjugasi (160 kata kerja × 17 bentuk + ~80 kasus uji manual)
node --experimental-strip-types scripts/test-conjugate.mjs
```

## Cara pakai modul Tata Bahasa & Konjugasi

- **Daftar pola** — buka `/tata-bahasa`. Gunakan kotak cari (mis. ketik
  `keharusan`, `kondisional`, `〜なきゃ`) atau klik tag untuk memfilter.
  Filter level N4 / N5 / semua juga tersedia.
- **Detail pola** — klik salah satu kartu untuk membuka `/tata-bahasa/:id`.
  Halaman ini menampilkan pola, romaji, arti, pembentukan, penjelasan B.Indo,
  dan minimal 3 contoh kalimat dengan tombol pelafalan (SpeakButton).
- **Kuis pilihan ganda** — buka `/tata-bahasa/tes`. Pilih jumlah soal
  (5/10/20). Anda akan diberikan sebuah kalimat contoh dan diminta memilih
  pola tata bahasa yang dipakai dari 4 opsi. Distractor diprioritaskan dari
  pola yang memiliki tag mirip dengan jawaban benar.
- **Drill konjugasi** — buka `/konjugasi`. Pilih mode *Random* (semua bentuk
  yang dipilih dipakai bergantian) atau *Fokus 1 bentuk* (mis. khusus latihan
  bentuk て). Ketik konjugasinya, tekan Enter untuk memeriksa. Validasi
  menggunakan `conjugate()` di `src/lib/conjugate.ts` dan mendukung banyak
  jawaban yang sama-sama benar (mis. perintah `食べろ` / `食べよ`). Kasus
  irregular seperti `行く → 行って` ditangani secara khusus.

## Cara pakai modul Choukai, Dokkai & Simulasi JLPT N4

- **Choukai** — buka `/tes/choukai`. Pilih jumlah soal (5/10/20/30), klik
  **Mulai tes**. Pada tiap soal klik tombol **Putar** (maks 2x) lalu pilih
  jawaban; transcript tampil setelah Anda menjawab. Run dicatat ke
  `jepang:choukai:runs` dan dimirror ke `jp:history`.
- **Dokkai** — buka `/tes/dokkai`. Pilih jumlah passage (3/5/8/12). Setiap
  passage menampilkan judul, body kanji, tombol toggle **Tampilkan romaji**,
  dan `SpeakButton`. Jawab semua pertanyaan (3–4 per passage). Run dicatat ke
  `jepang:dokkai:runs`.
- **Simulasi JLPT N4** — buka `/tes/simulasi-jlpt-n4`. Halaman intro
  menjelaskan format & kriteria kelulusan. Klik **Mulai simulasi** untuk
  memulai seksi pertama; timer berjalan dan auto-submit saat habis. Tombol
  **Kumpulkan seksi** mengakhiri seksi lebih awal (tetap dihitung). Anda tidak
  bisa kembali ke seksi sebelumnya. Halaman hasil menampilkan skor per seksi
  (skala 0–60), total 0–180, dan **LULUS** atau **TIDAK** sesuai aturan JLPT
  asli. Tersimpan ke `jepang:jlpt:runs`; halaman Statistik akan menampilkan
  daftar percobaan + chart tren.

## Build APK Android (offline)

Aplikasi ini bisa dibungkus jadi APK Android lewat **Capacitor**. APK yang
dihasilkan memuat seluruh web bundle di dalam paketnya, jadi setelah
diinstall **bisa jalan 100% offline** (kosakata, tes, Kaigo, dst.).

### Prasyarat (sekali setup)

- Node.js 18+ dan npm
- Java JDK 21
- Android SDK (`platform-tools`, `platforms;android-35`, `build-tools;35.0.0`)
- Set env: `ANDROID_HOME`, `JAVA_HOME` (Java 21)

### Build APK debug

```bash
cd jepang-web
npm install
npm run apk:debug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

Salin file `app-debug.apk` ke HP Android lalu install (aktifkan
*Install unknown apps* untuk aplikasi yang dipakai mengirim file).

### Build APK release (signed)

```bash
cd jepang-web
npm run apk:release
# Output: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

Lalu sign pakai `apksigner` dengan keystore Anda sendiri.

## Mode Offline / PWA

Aplikasi sudah jadi PWA — bisa di-install langsung dari Chrome di HP via
tombol "Install" yang muncul, atau via menu browser. Service worker
melakukan precache semua aset, jadi setelah dibuka sekali dengan internet,
aplikasi bisa dipakai full offline.

## Fitur Tes PG (Pilihan Ganda)

Tes Pilihan Ganda mendukung 3 arah soal yang dapat dipilih di halaman
konfigurasi:

- **Kanji → Arti**: tampilkan kanji, pilih artinya
- **Arti → Kanji**: tampilkan arti, pilih kanjinya
- **Arti → Romaji**: tampilkan arti, pilih romajinya (cocok untuk
  yang sedang belajar baca/eja kanji)

Ketiga mode tersedia juga di Tes Pilihan Ganda modul **Kaigo**.
