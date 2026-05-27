# Cara Instal Nihongo Hub di HP Android (Offline)

Panduan ini menjelaskan cara meng-install aplikasi **Nihongo Hub** (versi APK)
di HP Android **tanpa Play Store** dan menjalankannya **100% offline** —
tidak perlu hosting, tidak perlu internet setelah ter-install.

---

## TL;DR (singkat)

1. Pindahkan file `nihongo-hub-debug.apk` ke HP (USB, WhatsApp, Drive, dll).
2. Buka File Manager → ketuk file APK.
3. Saat Android minta izin "Install unknown apps", aktifkan untuk aplikasi
   yang dipakai membuka (misal File Manager / Chrome).
4. Tap **Install** → tunggu → tap **Open**.
5. Setelah terbuka sekali, **matikan internet**, buka lagi → semua materi
   tetap bisa dipakai.

---

## 1. Pindahkan APK ke HP

Pilih salah satu cara yang paling gampang buat kamu:

### A. Lewat kabel USB (paling cepat)

1. Sambungkan HP ke laptop pakai kabel USB.
2. Di HP, geser notifikasi → pilih mode **File Transfer** (bukan Charging).
3. Di laptop, buka HP sebagai drive → buka folder **Download**.
4. Copy `nihongo-hub-debug.apk` ke folder tersebut.
5. Cabut kabel.

### B. Lewat WhatsApp / Telegram

1. Kirim file `nihongo-hub-debug.apk` ke nomor / chat sendiri.
2. Buka chat di HP → tap file → tunggu sampai selesai download.

### C. Lewat Google Drive

1. Upload `nihongo-hub-debug.apk` ke Drive.
2. Buka Drive di HP → tap titik tiga di file → **Download**.

### D. Lewat email

1. Kirim file APK sebagai lampiran ke email kamu sendiri.
2. Buka email di HP → tap lampiran → **Download**.

---

## 2. Aktifkan "Install Unknown Apps"

Android tidak akan mengizinkan install APK dari luar Play Store kecuali kamu
aktifkan dulu izin "Pasang aplikasi tidak dikenal" untuk aplikasi yang kamu
pakai membuka file APK-nya.

### Android 10 ke atas (paling umum sekarang)

Pas kamu pertama kali tap file APK, Android otomatis akan munculkan dialog
**"Untuk keamanan, telepon kamu tidak diizinkan memasang aplikasi tidak
dikenal dari sumber ini."**

1. Tap **Pengaturan / Settings** di dialog itu.
2. Akan masuk ke daftar aplikasi yang bisa install APK — toggle **ON** untuk
   aplikasi yang kamu pakai membuka file (misalnya **File Manager**,
   **Chrome**, **WhatsApp**, atau **Drive**).
3. Tekan tombol **Kembali**, lalu lanjutkan instalasi.

### Android 7-9 (lebih lama)

1. Buka **Pengaturan → Keamanan**.
2. Aktifkan opsi **"Sumber tidak dikenal"** atau **"Unknown sources"**.
3. Konfirmasi peringatan.

---

## 3. Install APK

1. Buka **File Manager** (Files, Mi File Manager, Samsung My Files, dst.).
2. Cari file `nihongo-hub-debug.apk` (biasanya di folder **Download**).
3. Tap file → tap **Install / Pasang**.
4. Tunggu beberapa detik sampai muncul tulisan **App installed / Aplikasi
   terpasang**.
5. Tap **Open / Buka**.

> Kalau muncul peringatan **Play Protect** yang bilang "App tidak diverifikasi",
> tap **Install anyway / Tetap install**. Ini wajar untuk APK yang bukan dari
> Play Store. APK ini aman karena dibuild dari source code kamu sendiri.

---

## 4. Pastikan Bisa Offline

Aplikasi ini sudah **otomatis offline** — seluruh data kosakata, tata bahasa,
tes, kaigo, choukai, dokkai, dan simulasi JLPT N4 sudah disertakan langsung
di dalam APK. Tidak ada server yang dipanggil.

Untuk membuktikan:

1. Buka aplikasi **Nihongo Hub** dari home screen.
2. **Matikan WiFi dan Data Seluler** (mode pesawat juga boleh).
3. Coba buka semua menu: Kosakata, Tes, Tata Bahasa, Kaigo.
4. Coba mulai sebuah Tes Pilihan Ganda — semua soal harus muncul normal.

Yang **tidak akan jalan offline** (wajar):
- Pelafalan suara (TTS) butuh engine TTS Android. Pada beberapa HP, engine
  bahasa Jepang perlu di-download dulu via:
  **Pengaturan → Sistem → Bahasa & input → Output text-to-speech → Engine
  default → Install voice data → Pilih bahasa Jepang**.
- Setelah voice data Jepang ter-install, TTS juga jadi offline.

---

## 5. Tips Tambahan

- **Pin ke home screen / launcher**: setelah install, icon "Nihongo Hub"
  akan muncul di drawer aplikasi seperti app biasa. Tahan icon → tarik ke
  home screen.
- **Backup APK**: simpan `nihongo-hub-debug.apk` di Drive / komputer sebagai
  backup. Kalau ganti HP, tinggal install ulang file yang sama.
- **Update**: tiap kali ada versi baru, cukup install ulang APK barunya — data
  belajar (kata yang sudah ditandai "hafal", riwayat tes) tersimpan di
  storage internal aplikasi dan tetap aman selama nama paket (`appId`) tidak
  berubah.
- **Uninstall**: tahan icon → **Uninstall / Copot pemasangan** seperti aplikasi
  biasa.

---

## 6. Alternatif: Install via PWA (tanpa APK)

Selain APK, aplikasi ini juga bisa di-install sebagai **PWA (Progressive Web
App)** kalau kamu mau pakai versi web tapi tetap terasa seperti aplikasi
biasa:

1. Buka URL aplikasi (jika kamu host sendiri / di laptop) di Chrome HP.
2. Tap menu titik tiga di kanan atas Chrome → **Install app / Tambahkan ke
   layar utama**.
3. Icon akan muncul di home screen. Buka sekali dengan internet → setelahnya
   bisa dipakai offline (service worker sudah cache semua aset).

Untuk pemakaian sehari-hari, APK lebih dianjurkan karena:
- Tidak butuh browser sama sekali untuk membuka.
- Tidak akan kehapus kalau cache browser di-clear.
- Bisa di-share file APK-nya ke teman / keluarga.

---

## 7. Troubleshooting

**Q: "Tidak ada aplikasi untuk membuka file ini" saat tap APK.**
A: Install dulu **File Manager** dari Play Store (misal "Files by Google"),
   lalu buka APK lewat sana.

**Q: "There was a problem parsing the package."**
A: File APK rusak / tidak lengkap saat download. Coba download / transfer
   ulang. Pastikan ukuran file ±4.8 MB.

**Q: Aplikasi nge-blank putih saat dibuka.**
A: Tutup paksa dari recent apps, lalu buka lagi. Kalau tetap, uninstall lalu
   install ulang.

**Q: Tombol pelafalan tidak bersuara.**
A: Engine TTS Jepang belum ter-install. Ikuti langkah di bagian "Pastikan
   Bisa Offline" di atas, atau pakai aplikasi tanpa TTS — aplikasi tetap
   berfungsi penuh.

**Q: Bisa di-install di iPhone?**
A: Tidak — APK hanya untuk Android. Untuk iPhone gunakan versi PWA: buka
   URL di Safari → tombol Share → **Add to Home Screen**.
