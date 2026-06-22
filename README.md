# Proyek Layanan Streaming: Spesifikasi API Backend

## 1. Ikhtisar

Selamat datang di proyek Layanan Streaming. Dokumen ini adalah **kontrak API** dan sumber kebenaran tunggal untuk membangun layanan backend Go.

Frontend adalah aplikasi Next.js yang sepenuhnya "headless". Semua data yang ditampilkannya berasal dari panggilan ke endpoint API yang Anda buat. Struktur JSON yang didefinisikan di sini **HARUS** diikuti dengan tepat agar aplikasi frontend dapat berfungsi.

**URL Base API Konfigurasi Frontend:**
Untuk menghubungkan frontend ke backend Go Anda, buat file `client/.env.local` dan tambahkan baris berikut (sesuaikan port jika perlu):
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## 2. Endpoints Halaman Utama (Homepage)

Data untuk halaman utama diambil melalui beberapa endpoint yang berbeda.

### 2.1. Banner Utama

- **Endpoint**: `GET /api/v1/home/banner`
- **Tujuan**: Mengambil item yang akan ditampilkan di carousel banner utama.
- **Struktur Respons**: `Array<Object BannerItem>`
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "banner": {
        "tall": "string (URL gambar latar vertikal, rasio ~9:16)",
        "wide": "string (URL gambar latar horizontal, rasio ~16:9)",
        "name": "string (URL gambar logo/judul transparan)"
      },
      "metaTags": ["string"],
      "genres": ["string"],
      "episodeId": "string",
      "episodeTitle": "string",
      "totalSeasons": "number"
    }
  ]
  ```

### 2.2. Baris Konten (Data Feeds)

- **Endpoint**:
  - `GET /api/v1/home/top-picks`
  - `GET /api/v1/home/newly-updated-series`
  - (Endpoint serupa lainnya akan mengikuti pola yang sama)
- **Tujuan**: Mengambil daftar konten untuk ditampilkan dalam baris horizontal (misalnya, "Pilihan Teratas Untuk Anda").
- **Struktur Respons**: `Array<Object DataFeedItem>`
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "poster": {
        "raw": "string (URL gambar poster vertikal)"
      },
      "metaTags": ["string"],
      "averageRating": "number",
      "totalSeasons": "number",
      "totalEpisodes": "number",
      "episodeId": "string",
      "episodeTitle": "string"
    }
  ]
  ```

---

## 3. Endpoint Halaman Detail

Data untuk halaman detail series dan daftar episodenya.

### 3.1. Detail Series

- **Endpoint**: `GET /api/v1/series/:id`
- **Tujuan**: Mengambil semua informasi tentang satu series tertentu untuk ditampilkan di halaman detailnya.
- **Struktur Respons**: `Object Series`
  ```json
  {
    "title": "string",
    "description": "string",
    "poster": {
      "tall": "string (URL gambar poster vertikal untuk mobile)",
      "wide": "string (URL gambar poster lebar untuk desktop)"
    },
    "genres": ["string"],
    "metaTags": ["string"],
    "averageRating": "number",
    "totalRating": "number",
    "licence": "string",
    "details": {
      "Audio": "string (cth: 'Japanese, English')",
      "Subtitles": "string (cth: 'English, Spanish, ...')",
      "Publisher": "string (cth: 'Kadokawa')"
    },
    "episodeId": "string",
    "episodeTitle": "string",
    "seasons": [
      {
        "id": "string",
        "season": "number",
        "title": "string",
        "totalEpisodes": "number"
      }
    ]
  }
  ```
  **Catatan Penting:**
  - `details`: Ini adalah objek key-value. Key akan ditampilkan sebagai label (mis. "Audio:").
  - `seasons`: Ini adalah daftar musim yang tersedia untuk series tersebut, digunakan untuk navigasi musim.

### 3.2. Daftar Episode per Musim

- **Endpoint**: `GET /api/v1/series/:seriesId/seasons/:seasonId/episodes`
- **Tujuan**: Mengambil daftar episode untuk satu musim tertentu.
- **Struktur Respons**: `Object SeasonEpisodes`
  ```json
  {
    "totalEpisodes": "number",
    "episodes": [
      {
        "id": "string",
        "episode": "number",
        "title": "string",
        "description": "string",
        "thumbnail": "string (URL gambar thumbnail episode)",
        "duration": "number (dalam detik)",
        "releaseDate": "string (format ISO 8601, cth: '2024-01-01T00:00:00Z')",
        "metaTags": ["string"],
        "isWatched": "boolean",
        "progress": "number (dalam detik, menunjukkan seberapa jauh pengguna telah menonton)"
      }
    ]
  }
  ```

---

## 4. Endpoint Halaman Pemutar Video (Akan Didefinisikan)

Spesifikasi untuk `GET /api/v1/episodes/:id` (untuk mengambil data pemutar video) akan ditambahkan di sini. Analisis `client/src/app/(main)/watch/[id]/[title]/page.tsx` akan diperlukan untuk ini. Untuk saat ini, fokus pada implementasi endpoint di atas.
