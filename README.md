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
- **Tes Susun Kalimat**: 5 level kesulitan dengan ribuan kalimat (kombinasi
  kalimat kurasi + kalimat hasil generator template × pool kosakata), mode
  Arti → Kanji & Arti → Romaji, minimal pilih 3 halaman kosakata.
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
    │   │              # generatedSentences.ts (kalimat auto-generate)
    │   ├── lib/
    │   └── pages/
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
```
