# 日本語 Learning Hub

Aplikasi web untuk belajar bahasa Jepang dengan ~1,400 kosakata, beberapa jenis
tes, dan game susun kalimat 5 level kesulitan. Dibangun dengan
React + TypeScript + Vite + Tailwind CSS.

## Fitur utama

- **Kartu kosakata (flashcards)**: 11 kategori, maksimum 30 kata per halaman,
  dengan animasi flip dan penanda "sudah hafal".
- **Tes Pilihan Ganda**: pilih halaman, jumlah soal, dan waktu per soal.
  Tanpa romaji — hanya kanji ↔ arti.
- **Tes Mengetik**: ketik arti dari kanji atau sebaliknya. Tanpa romaji.
- **Tes Susun Kalimat**: 5 level kesulitan, mode Arti → Kanji & Arti → Romaji,
  minimal pilih 3 halaman kosakata.
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
    │   ├── data/      # vocab.ts (kosakata) & sentences.ts (kalimat 5 level)
    │   ├── lib/
    │   └── pages/
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
