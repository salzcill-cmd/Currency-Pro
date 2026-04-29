# Currency Pro - Konverter Mata Uang Ultimate

Aplikasi web konverter mata uang profesional dan kaya fitur yang dibangun dengan sumber daya CDN murni (tanpa instalasi).

## Fitur

### Fitur Utama
- **Kurs Waktu Nyata** - Kurs langsung dari berbagai API gratis
- **160+ Mata Uang** - Dukungan untuk semua mata uang utama dan minor dunia
- **Konversi Instan** - Konversi waktu nyata saat Anda mengetik
- **Grafik Historis** - Grafik interaktif dengan Chart.js
- **Perbandingan Mata Uang** - Bandingkan hingga 3 mata uang secara bersamaan
- **Favorit & Terakhir** - Akses cepat ke mata uang yang sering Anda gunakan

### Fitur Lanjutan
- **Mode Gelap/Terang/Sistem** - Tema indah dengan transisi halus
- **Glassmorphism + Neumorphism Design** - UI modern dan profesional
- **Gradien Animasi** - Efek visual yang memukau
- **Skeleton Loading** - Status loading yang mulus
- **Animasi Confetti** - Perayaan saat mencapai konversi 1 juta
- **Pembuatan Kode QR** - Bagikan hasil konversi via QR
- **Unduh Hasil** - Ekspor konversi sebagai file .txt
- **Salin ke Clipboard** - Satu klik salin ke clipboard

### Fitur Teknis
- **Alpine.js State Management** - Reactive data binding
- **LocalStorage Persistence** - Mengingat semua preferensi Anda
- **PWA Ready** - Dapat diinstal sebagai aplikasi mobile
- **Service Worker** - Dukungan offline dasar
- **Desain Responsif** - Bekerja di mobile, tablet, dan desktop
- **Pintasan Keyboard** - Alt+S (Tukar), Alt+C (Salin), Alt+R (Reset), Alt+D (Mode gelap)
- **Penanganan Error** - Logika retry dengan exponential backoff
- **Lazy Loading** - Gambar bendera dimuat sesuai kebutuhan

## Teknologi yang Digunakan

- **TailwindCSS v3** (CDN) - Styling dengan plugin forms
- **Alpine.js v3** (CDN) - Reactive state management
- **Chart.js v4** (CDN) - Grafik interaktif
- **AOS** (CDN) - Animate on scroll
- **Font Awesome 6** (CDN) - Icons
- **Google Fonts** - Plus Jakarta Sans + DM Mono
- **SweetAlert2** (CDN) - Alert dan toast yang indah
- **Axios** (CDN) - HTTP client
- **QRCode.js** (CDN) - Pembuatan kode QR

## API yang Digunakan

### API Utama
- https://api.exchangerate-api.com/v4/latest/USD (1500 request/hari)

### API Cadangan
- https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json
- https://latest.currency-api.pages.dev/v1/currencies/usd.json

### API Bendera
- https://flagsapi.com/{CODE}/flat/64.png

## Struktur File

```
currency/
├── index.html          # Dasbor + Konverter Utama
├── charts.html         # Analitik & Grafik Historis
├── compare.html        # Bandingkan 3 Mata Uang
├── style.css           # Animasi Kustom & Utilitas
├── manifest.json       # PWA Manifest
├── service-worker.js   # Service Worker untuk offline
├── README.md           # Dokumentasi
└── js/
    ├── main.js         # Logika Inti + Manajemen State
    └── charts.js       # Logika Grafik & Analitik
```

## Cara Menggunakan

1. **Buka langsung di browser** - Cukup buka `index.html` di browser modern apa pun
2. **Tidak perlu instalasi** - Semua sumber daya dimuat via CDN
3. **Deploy ke Vercel/Netlify** - Cukup unggah folder, langsung jadi

## Pintasan Keyboard

| Pintasan | Aksi |
|----------|--------|
| `Alt+S` | Tukar mata uang |
| `Alt+C` | Salin hasil ke clipboard |
| `Alt+R` | Reset form |
| `Alt+D` | Toggle mode gelap |

## Dukungan Browser

- Chrome/Edge (direkomendasikan)
- Firefox
- Safari
- Opera

## Lisensi

MIT License - Gratis digunakan untuk proyek pribadi dan komersial.

## Kredit

Dibuat dengan ❤️ menggunakan API gratis dan sumber daya CDN.
