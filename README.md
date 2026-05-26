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
    │   │              # grammar.ts (80 pola N4), verbs.ts (160 kata kerja N4)
    │   ├── lib/      # …, conjugate.ts (fungsi murni 17 bentuk konjugasi)
    │   └── pages/    # …, Grammar.tsx, GrammarDetail.tsx, GrammarTest.tsx,
    │                 # Conjugation.tsx
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
