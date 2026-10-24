# Portofolio Profesional — Billiam Agsa Tatema Hia

Situs portofolio statis satu halaman untuk Billiam Agsa Tatema Hia, mahasiswa Ilmu Komputer Universitas Sumatera Utara (USU) angkatan 2025.

## Struktur File

```
Portofolio-profesional/
├─ index.html          # Halaman utama (7 section + footer)
├─ 404.html            # Halaman error 404
├─ .nojekyll           # File kosong untuk GitHub Pages
├─ README.md           # File ini
├─ CONTENT.md          # Sumber kebenaran seluruh teks dan fakta
├─ DESIGN.md           # Spesifikasi desain, token, komponen, motion, a11y
├─ css/
│  └─ style.css        # Stylesheet lengkap (design tokens + semua komponen)
├─ js/
│  └─ main.js          # Vanilla JS (tanpa module, jalan di file://)
└─ assets/
   ├─ foto-formal.jpg       # 1122×1600, foto formal latar merah (hero)
   ├─ foto-casual.jpg       # 1122×1600, selfie casual (section kreatif)
   ├─ grain.svg             # Overlay grain global
   ├─ contours.svg          # Garis kontur topografi
   ├─ constellation.svg     # Node + garis konstelasi
   ├─ arch-lines.svg        # Lengkung konsentris
   ├─ project-snake.svg     # Ilustrasi SNAKE.EXE
   ├─ project-calculator.svg# Ilustrasi KALKULATOR
   ├─ project-minesweeper.svg# Ilustrasi MINESWEEPER
   ├─ favicon.svg           # Monogram B dalam arch
   ├─ og-image.png          # 1200×630, raster untuk og:image / twitter:image
   ├─ og-image.svg          # Sumber vektor kartu Open Graph
   └─ star-separator.svg    # Bintang 4 titik untuk marquee
```

## Cara Menjalankan Secara Lokal

Cukup buka `index.html` langsung di browser (double-click atau drag ke tab browser). Tidak perlu server lokal, tidak perlu `npm install`, tidak ada build step.

> **Catatan:** Semua path menggunakan path relatif (`./css/style.css`, `./assets/...`) sehingga situs berfungsi baik di `file://`, `http://localhost`, maupun `https://username.github.io/repo/`.

## Deploy ke GitHub Pages

1. **Push ke repository GitHub** (misal: `anomaly-develop/portofolio-profesional`)
2. Buka **Settings → Pages**
3. **Source**: pilih `Deploy from a branch`
4. **Branch**: `main` (atau branch default Anda), folder `/ (root)`
5. Klik **Save**
6. Tunggu 1–2 menit, lalu buka `https://anomaly-develop.github.io/portofolio-profesional/`

> **Catatan OG:** `og:url`, `og:image`, dan `twitter:image` memakai URL absolut ke `https://anomaly-develop.github.io/portofolio-profesional/`. Jika nama repo berbeda, sesuaikan ketiganya di `<head>` `index.html`.

File `.nojekyll` sudah disertakan agar GitHub Pages tidak memproses folder `_` dan tidak menjalankan Jekyll.

## Kontak & Sosial

Email, Instagram, dan LinkedIn sudah terpasang di section **KONTAK** dan footer:

- Email: `billiamhia@gmail.com`
- Instagram: `https://www.instagram.com/bil.liam_/`
- LinkedIn: `https://www.linkedin.com/in/billiam-agsa-tatema-hia-a08867329`

Jika salah satu tautan berubah, edit `CONTENT.md` bagian **Identitas** lalu perbarui
`index.html` (section kontak, footer, dan JSON-LD). Nomor telepon tetap tidak dicantumkan.

## Semua Konten Ada di `CONTENT.md`

File `CONTENT.md` adalah **sumber kebenaran tunggal** untuk:
- Identitas (nama, asal, kampus, GitHub, Instagram, LinkedIn, email, IPK)
- Semua teks hero, tentang, perjalanan, proyek, keahlian, kreatif, kontak, footer, 404
- Larangan keras (apa yang TIDAK BOLEH ditambahkan)

Jika ingin mengubah teks, edit `CONTENT.md` lalu perbarui `index.html` sesuai. Jangan mengarang fakta, angka, IPK, email, nomor HP, atau URL repositori spesifik yang tidak tercantum di `CONTENT.md`.

## Teknologi

- **HTML5** semantik, `lang="id"`
- **CSS3** dengan custom properties (design tokens), clamp(), grid, scroll-snap
- **Vanilla JavaScript (ES2019+)** — tanpa framework, tanpa module, tanpa CDN
- **Google Fonts**: Fraunces (display), Instrument Sans (body), JetBrains Mono (mono)
- **SVG** untuk semua ilustrasi dekoratif (10 file, < 12 KB masing-masing)

## Fitur Utama

- Navigasi fixed dengan scroll state & mobile menu (focus trap + ESC)
- Hero asimetris: teks kiri, portrait arch-frame kanan dengan foto berwarna, glow, dan orbit
- Marquee CSS-driven dengan outlined/solid alternating + SVG star separator
- Timeline perjalanan dengan sticky year column + 9 entri + status tag jujur
- Project carousel: horizontal scroll-snap desktop, stack mobile, progress bar
- Skills: 3 blok bertumpuk (bukan 3 kartu seragam) dengan daftar 2 kolom
- Creative: kolase 3 panel miring dengan foto casual + blok warna + tipografi
- Contact: headline display italic oversized + CTA GitHub + tautan email/Instagram/LinkedIn
- Intro overlay, scroll progress bar, star field, orbit portrait, grain overlay, cursor dot (pointer:fine only), reduced-motion guards
- SEO: meta, OG/Twitter, JSON-LD Person (dengan email), favicon, theme-color
- Aksesibilitas: skip link, ARIA, focus-visible, heading hierarchy, kontras ≥ 4.5:1

## Lisensi

Kode dan aset ini untuk penggunaan pribadi Billiam Agsa Tatema Hia. Tidak untuk didistribusikan ulang sebagai template.