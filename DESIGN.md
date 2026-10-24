# DESIGN SPEC — “Dark Editorial Atlas”

Situs portofolio satu halaman, statis, tanpa build step. Estetika **editorial-atlas**: peta
bintang, garis kontur topografi, dan tata letak majalah cetak. Bukan ilustrasi fantasi AI,
bukan glassmorphism, bukan gradient ungu.

Konsep naratif: perjalanan dari Gunungsitoli (Nias) ke Medan menjadi lapisan latar — kontur,
konstelasi, dan orbit. Hero tidak lagi menyebut daerah; ia berbicara tentang belajar membuat
teknologi yang berguna. Nias hadir di bagian Tentang dan kartu fakta sebagai identitas, bukan
sebagai judul. "WAHH" datang dari **komposisi, tipografi, dan detail**, bukan dari efek bertumpuk.

---

## 1. Stack & batasan

- HTML5 + CSS3 + JavaScript vanilla (ES2019+). **Tanpa framework, tanpa npm, tanpa build.**
- Font dari Google Fonts via `<link>`; sediakan fallback `Georgia, serif` / `system-ui`.
- Semua path **relatif** (`./css/style.css`, `assets/...`) supaya jalan di
  `username.github.io/repo/` maupun domain root.
- Tidak ada dependensi CDN JS. Tidak ada library animasi.
- Target: Chrome/Edge/Firefox/Safari versi 2 tahun terakhir.
- Berat total halaman (tanpa font) < 900 KB.

## 2. Design tokens

```css
:root{
  /* warna */
  --ink:        #080D13;   /* latar utama */
  --ink-2:      #0E1720;   /* latar panel */
  --ink-3:      #16242E;   /* garis tebal / hover */
  --parchment:  #EFE7D6;   /* teks utama */
  --parchment-2:#BDB3A0;   /* teks sekunder */
  --brass:      #C9A35B;   /* aksen utama */
  --brass-2:    #E7CE9A;   /* aksen terang */
  --rust:       #A9503A;   /* aksen status / tanda */
  --teal:       #4C7A78;   /* aksen dingin sekunder */
  --line:       rgba(239,231,214,.14);
  --line-strong:rgba(239,231,214,.28);

  /* tipografi */
  --f-display: "Fraunces", Georgia, "Times New Roman", serif;
  --f-body:    "Instrument Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --f-mono:    "JetBrains Mono", ui-monospace, "Cascadia Code", monospace;

  --fs-hero: clamp(2.9rem, 8.2vw, 7.2rem);
  --fs-h2:   clamp(2rem, 4.6vw, 3.9rem);
  --fs-h3:   clamp(1.25rem, 1.7vw, 1.6rem);
  --fs-body: clamp(1rem, 1.05vw, 1.075rem);
  --fs-meta: .72rem;
  --lh-tight: .96;
  --lh-body: 1.68;

  /* ruang */
  --gutter: clamp(1.25rem, 4vw, 4rem);
  --maxw: 1360px;
  --s-1:.5rem; --s-2:1rem; --s-3:1.5rem; --s-4:2.5rem;
  --s-5:4rem;  --s-6:6rem; --s-7:9rem;
  --sec-y: clamp(5rem, 11vw, 10rem);

  /* lain */
  --r-arch: 50% 50% 0 0 / 42% 42% 0 0;
  --ease: cubic-bezier(.22,.61,.36,1);
  --dur: .7s;
}
```

Aturan warna: **tidak boleh ada lebih dari 3 warna aksen** (brass, rust, teal). Brass hanya
untuk garis, label, angka, dan satu tombol utama. Tidak ada teks gradien. Tidak ada `#8b5cf6`,
`#667eea`, atau pasangan ungu-biru.

## 3. Tipografi

- **Fraunces** untuk display: hero H1, H2 section, pull quote (italic), angka besar.
  Pakai `font-variation-settings: "opsz" 144, "SOFT" 0, "WONK" 1;` bila tersedia.
- **Instrument Sans** untuk body, tombol, kartu.
- **JetBrains Mono** untuk label section (`01 — TENTANG`), tag, meta, navigasi, caption.
  Selalu `text-transform: uppercase; letter-spacing:.14em; font-size:var(--fs-meta)`.
- H1: `line-height:var(--lh-tight); letter-spacing:-.025em; font-weight:400;`
  Boleh italic pada **satu** frasa kunci (`belajar` atau `berguna`) untuk kontras.
- Body: max `64ch`, `line-height:1.68`, warna `--parchment-2` untuk paragraf sekunder.
- H2: `font-weight:400`, `letter-spacing:-.02em`, maksimum 2 baris di desktop.

## 4. Grid & ritme section

- Wadah: `max-width:var(--maxw); padding-inline:var(--gutter); margin-inline:auto;`
- Grid 12 kolom, `gap: clamp(1rem,2vw,2rem)`.
- **Wajib asimetris.** Contoh hero: teks kolom 1–6, portrait kolom 8–12 dengan
  `translateY(-4rem)`. Tentang: teks 2–7, kartu fakta 9–12. Jangan semua section center.
- Ritme vertikal berbeda per section (jangan seragam):
  - Hero `min-height:100svh` (desktop) / auto (mobile)
  - Marquee tinggi 4.5rem, full-bleed, tanpa padding samping
  - Tentang `--sec-y` dengan latar `--ink`
  - Perjalanan latar `--ink-2`, garis atas & bawah
  - Proyek full-bleed, horizontal scroll-snap di desktop
  - Keahlian kembali ke grid sempit (`max-width:1080px`, centered secara sengaja)
  - Kreatif dua kolom asimetris 5/7 dengan blok warna besar
  - Kontak `min-height:62svh`, tipografi sangat besar, CTA GitHub + tautan email/Instagram/LinkedIn
- Setiap section kecuali hero punya header: label mono + H2 + garis horizontal tipis
  (`1px solid var(--line)`) yang membentang penuh.

## 5. Spesifikasi komponen

### Navigasi (fixed)
- Kiri: monogram `B.` dalam kotak 44×44 bergaris brass, font display.
- Tengah/kana: link `Tentang · Perjalanan · Proyek · Keahlian · Kontak` (mono, 0.72rem).
- Kanan: tombol kecil `GitHub ↗`.
- Latar transparan → setelah scroll 80px jadi `rgba(8,13,19,.82)` + `backdrop-filter:blur(10px)`
  + border-bottom `1px solid var(--line)`. (Satu-satunya pemakaian blur di situs; boleh.)
- Mobile: hamburger 2 garis → panel fullscreen dengan link besar serif + nomor.
- `aria-expanded`, `aria-controls`, focus trap saat panel terbuka, ESC menutup.

### Tombol
- Primary: latar `--brass`, teks `--ink`, padding `1rem 1.75rem`, `border-radius:2px`
  (bukan pill), label mono uppercase, panah `↗` bergeser 3px saat hover.
- Secondary: transparan, border `1px solid var(--line-strong)`, teks parchment; hover border brass.
- Focus: `outline:2px solid var(--brass-2); outline-offset:3px`.
- **Tidak ada** `scale(1.05)` pada semua tombol.

### Intro & scroll progress
- Overlay intro: latar ink, monogram `B.` brass, garis brass, nama mono. Durasi total ~2.6s;
  overlay memudar pada 1.5s.
- Skip intro saat `prefers-reduced-motion`, `navigator.webdriver`, `?nointro=1`, atau
  `sessionStorage.introSeen`. Jangan pernah menahan konten secara permanen.
- Scroll progress: bar 2px fixed di atas, gradient rust → brass → teal, `scaleX` mengikuti scroll.

### Portrait hero
- Bingkai arch (`--r-arch`) ukuran `clamp(280px, 34vw, 520px)`, border `1px solid var(--line-strong)`.
- Di belakangnya: SVG garis kontur (`assets/contours.svg`) diputar `-12deg`, opacity `.5`,
  plus dua lingkaran orbit `1px dashed` dan radial glow brass/teal.
- Foto `assets/foto-formal.jpg` tetap **berwarna**: `filter: saturate(1.05) contrast(1.02);`
  overlay hanya vignette bawah `linear-gradient(180deg, transparent 58%, rgba(8,13,19,.5))`;
  tidak ada grayscale atau `mix-blend-mode: color`.
- Caption mono di bawah: `Medan · 2026`.
- Di sudut kanan atas bingkai: label kecil `2025 — SEKARANG`.

### Marquee
- `display:flex; width:max-content;` dua salinan identik, animasi `translateX(-50%)` 32s linear infinite.
- Teks display italic, ukuran `clamp(1.6rem,3vw,2.6rem)`, warna transparan dengan
  `-webkit-text-stroke:1px var(--line-strong)` untuk separuh item, solid brass untuk sisanya.
- Pemisah: SVG bintang 4 titik 10px brass.
- `prefers-reduced-motion` → hentikan animasi.

### Kartu fakta (Tentang)
- Bukan kartu rounded + shadow. Panel `--ink-2`, border `1px solid var(--line)`,
  `border-radius:0`, padding 1.5rem. Baris `dl` dengan border-bottom tipis.
- Label mono kiri, nilai kanan (rata kanan).

### Timeline (Perjalanan)
- Dua kolom: kiri kolom tahun **sticky** (`position:sticky; top:6rem`) berisi tahun besar display
  + jumlah entri; kanan daftar entri.
- Entri: `border-top:1px solid var(--line)`, padding blok 2rem, grid
  `[judul | institusi | tag]`. Hover: border-top jadi brass, judul bergeser 6px.
- Tag status: mono 0.65rem, border 1px, warna berbeda per status:
  `SEDANG BERJALAN` brass, `AKTIF` teal, `SELESAI` parchment-2, `HISTORIS` rust,
  `PRESTASI` brass-2, `PENGALAMAN` parchment-2.
- Jangan pakai ikon lingkaran bernomor.

### Proyek
- Desktop: track horizontal `overflow-x:auto; scroll-snap-type:x mandatory;`
  kartu `min-width: min(78vw, 620px); scroll-snap-align:center;` + tombol ‹ › dan progress bar.
- Mobile: stack vertikal penuh.
- Kartu: latar `--ink-2`, border `1px solid var(--line)`, **tanpa shadow**, ilustrasi SVG
  di atas (aspect 4/3, `--ink-3`), isi padding 2rem.
- Susunan isi: nomor mono `01`, judul display, tag teknologi (mono, dipisah `·`),
  deskripsi 2–3 baris, status di footer kartu.
- Proyek keempat (gagasan) diberi border dashed brass + label `MASIH GAGASAN` jelas.
- Hover: ilustrasi `transform: translateY(-4px)` + garis atas brass. Tanpa scale.

### Keahlian
- Tiga blok bertumpuk (bukan 3 kolom kartu). Setiap blok: judul mono huruf besar + garis,
  lalu daftar item dua kolom: nama (serif 1.15rem) dan keterangan (body kecil).
- Tanpa progress bar, tanpa persentase, tanpa ikon teknologi berwarna.

### Kreatif
- Kiri: teks. Kanan: kolase tiga panel miring (`rotate(-2deg / 1deg / -1deg)`) berisi
  potongan foto casual, blok warna rust, dan wordmark `FL Studio` — semuanya
  dirender dengan CSS + SVG, tanpa gambar stok.

### Kontak
- H2 raksasa display italic, 1 baris di desktop.
- Satu CTA besar bergaris bawah tebal brass, hover underline menebal.
- Latar diberi `assets/contours.svg` opacity `.18` + vignette radial.
- Footer tipis di bawahnya.

### Grain overlay (global)
- `body::after` fixed, `background-image:url("./assets/grain.svg")`, `opacity:.06`,
  `pointer-events:none`, `z-index:9999`, `mix-blend-mode:overlay`.
- Matikan di `prefers-reduced-motion`? Tidak perlu; cukup opacity rendah.

### Cursor (opsional, hanya `@media (pointer:fine)`)
- Titik brass 6px + ring 28px yang mengikuti dengan delay (lerp). Membesar saat hover
  elemen `[data-cursor="link"]`. Sembunyikan saat `prefers-reduced-motion`.

## 6. Motion

- Reveal saat masuk viewport: `opacity 0→1`, `translateY(24px→0)`, `duration .8s`, `--ease`,
  `transition-delay` bertingkat 60ms. Implementasi `IntersectionObserver`, `threshold:.15`,
  `unobserve` setelah tampil.
- Parallax hero: ornamen bergerak `translate3d(0, scrollY*0.06, 0)` via `requestAnimationFrame`
  (throttle). **Jangan** parallax pada teks body.
- Angka/statistik hero boleh count-up sekali (hanya 4 item, tanpa bounce).
- `@media (prefers-reduced-motion: reduce)`: semua animasi & transisi `none !important`,
  parallax dan cursor dinonaktifkan, marquee berhenti.
- Tidak ada animasi masuk berulang, tidak ada `animation` pada setiap section.

## 7. Aksesibilitas (wajib)

- `lang="id"`, skip link ke `#main`, landmark `header/nav/main/footer`, `aria-current` pada nav.
- Kontras teks ≥ 4.5:1 (`--parchment` di `--ink` ≈ 15:1; `--parchment-2` di `--ink` ≈ 7:1;
  brass di ink ≈ 8:1). Jangan teks brass di atas brass.
- Semua gambar punya `alt` deskriptif; ilustrasi dekoratif `alt=""` + `aria-hidden="true"`.
- Ikon SVG selalu `aria-hidden="true"` + `focusable="false"`.
- Heading hierarkis: satu `h1`, `h2` per section, `h3` untuk item.
- Fokus terlihat di semua elemen interaktif; panel mobile trap fokus.
- Target sentuh ≥ 44px.
- Form tidak ada (tidak ada backend) — jangan bikin form palsu.

## 8. SEO & metadata

- `<title>Billiam Agsa Tatema Hia — Ilmu Komputer USU</title>`
- `meta description`: `Portofolio Billiam Agsa Tatema Hia, mahasiswa Ilmu Komputer Universitas
  Sumatera Utara. Machine learning, data, desain antarmuka, dan pengalaman organisasi.`
- Open Graph + Twitter card, `og:image` → `assets/og-image.png` (1200×630).
- `canonical` dikosongkan/di-comment sampai URL GitHub diketahui.
- Structured data JSON-LD `Person` (name, url GitHub, alumniOf USU, address Medan, email, sameAs Instagram/LinkedIn).

## 9. Aset SVG yang harus ada

| File | Isi |
|---|---|
| `assets/grain.svg` | 200×200 `feTurbulence` grayscale, tileable |
| `assets/contours.svg` | 1400×1000 garis kontur topografi, stroke parchment tipis, transparan |
| `assets/constellation.svg` | 800×800 node + garis konstelasi, brass, stroke 1px |
| `assets/arch-lines.svg` | 700×900 lengkung konsentris (portal), stroke tipis |
| `assets/project-snake.svg` | 800×600 grid piksel + jalur ular abstrak, line art |
| `assets/project-calculator.svg` | 800×600 keypad grid + glyph aritmetika, line art |
| `assets/project-minesweeper.svg` | 800×600 grid petak + bendera/bom terabstraksi |
| `assets/favicon.svg` | monogram `B` di dalam arch, brass di ink |
| `assets/og-image.svg` | 1200×630 komposisi nama + tagline (untuk dirasterisasi jadi PNG) |

Aturan aset: line art 1–1.5px, palet terbatas (parchment, brass, teal, ink), tanpa gradien
warna-warni, tanpa bayangan blur, tanpa gaya "flat illustration" kartun.

## 10. Struktur file

```
Portofolio-profesional/
├─ index.html
├─ 404.html
├─ .nojekyll
├─ README.md
├─ CONTENT.md
├─ DESIGN.md
├─ css/style.css
├─ js/main.js
├─ assets/…(10 file di atas + foto-formal.jpg + foto-casual.jpg)
└─ qa/ (screenshot hasil QA)
```

## 11. Checklist anti-slop (harus PASS sebelum selesai)

1. Tidak ada gradient ungu/biru, tidak ada teks gradien.
2. Tidak ada tiga kartu fitur seragam dengan emoji.
3. Hero asimetris, bukan headline center + 2 tombol.
4. Minimal 2 family font dengan peran berbeda.
5. Copy: nol kata dari daftar larangan CONTENT.md.
6. Tidak ada emoji sebagai ikon di mana pun.
7. Tidak ada `border-radius` besar + shadow lembut di semua elemen (maks radius 2px,
   kecuali arch portrait & elemen dekoratif).
8. Ilustrasi berupa SVG buatan sendiri, bukan gambar stok/AI.
9. Setiap klaim pengalaman punya status yang jujur.
10. Sembunyikan logo/nama: halaman tetap tidak terlihat seperti template AI.
