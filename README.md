# Cuplikin — PWA (GitHub Pages)

Klien **Progressive Web App** untuk Cuplikin edisi Google Apps Script: AI video & podcast clipper dengan mode offline, bisa diinstal ke layar utama Android/iOS/desktop.

Backend (database Google Sheets, file Google Drive, AI Gemini) tetap berjalan di **Apps Script Web App** milik Anda. Repo ini hanya berisi antarmuka statis.

## Isi repo (5 berkas)

| Berkas | Fungsi |
|---|---|
| `index.html` | Aplikasi lengkap (UI + logika klien, satu berkas) |
| `manifest.json` | Manifest PWA (nama, ikon tertanam, warna, shortcut) |
| `sw.js` | Service worker: cache shell aplikasi, font, fallback offline |
| `offline.html` | Halaman cadangan bila perangkat offline sebelum aplikasi pernah dibuka |
| `README.md` | Dokumen ini |

## Deploy dalam 5 menit

1. **Deploy backend dulu** (lihat Panduan PDF Bab 3): di Apps Script → *Deploy → New deployment → Web app* → *Execute as: Me*, *Who has access: Anyone*. Salin URL yang berakhiran `/exec`.
2. Buat repo baru di GitHub (publik atau privat dengan GitHub Pro), unggah 5 berkas ini ke root.
3. Buka `index.html`, cari baris:
   ```js
   var CF_API_URL = '__API_URL__';
   ```
   ganti `__API_URL__` dengan URL `/exec` Anda. *(Opsional — URL juga bisa diisi pada layar login di bagian "Server API".)*
4. *Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / root* → Save.
5. Buka `https://<username>.github.io/<repo>/` → login → instal (Chrome: menu ⋮ → *Instal aplikasi*; iPhone Safari: *Bagikan → Tambah ke Layar Utama*).

## Mode offline

- Shell aplikasi & font di-cache oleh `sw.js`.
- Data yang pernah dibuka (dasbor, media, transkrip, klip, jadwal, analitik, dll.) disimpan di **IndexedDB** dan tetap tampil saat offline (ada label "Offline").
- Edit transkrip, klip, copy, komentar review, metrik, status jadwal & preferensi **diantrekan** lalu otomatis disinkronkan saat online (idempoten — tidak terduplikasi).
- Unggah, AI, render ke Drive & manajemen pengguna membutuhkan koneksi.

## Pembaruan versi

Ganti berkas lalu naikkan `VERSION` di `sw.js` (mis. `cuplikin-v2.0.1`) agar cache lama dibersihkan. Pengguna akan melihat notifikasi "Versi baru tersedia".

## Keamanan

- Tidak ada rahasia di repo ini. API key Gemini, token Fonnte/Telegram & data tersimpan di server Apps Script.
- Komunikasi ke Apps Script memakai `POST` `text/plain` (tanpa preflight CORS) dengan token sesi; kata sandi di-hash PBKDF2 di server.

## Lisensi

Perangkat lunak berlisensi komersial — lihat EULA dari penyedia. Font: Inter, Poppins, Montserrat, Bebas Neue, Oswald, Plus Jakarta Sans (SIL OFL 1.1), Roboto (Apache-2.0) via Google Fonts.
