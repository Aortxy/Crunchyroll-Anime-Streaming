# Proyek Layanan Streaming: Spesifikasi API Backend (v2 - Lengkap)

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
- **Tujuan**: Mengambil daftar konten untuk ditampilkan dalam baris horizontal.
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

## 3. Endpoints Halaman Detail

### 3.1. Detail Series

- **Endpoint**: `GET /api/v1/series/:id`
- **Tujuan**: Mengambil semua informasi tentang satu series tertentu.
- **Struktur Respons**: `Object Series`
  ```json
  {
    "title": "string",
    "description": "string",
    "poster": {
      "tall": "string (URL gambar poster vertikal)",
      "wide": "string (URL gambar poster lebar)"
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

## 4. Endpoint Halaman Pemutar Video

### 4.1. Detail Episode & Data Pemutar

- **Endpoint**: `GET /api/v1/episodes/:id`
- **Tujuan**: Mengambil semua data yang diperlukan untuk halaman pemutar video, termasuk URL media dan metadata terkait.
- **Struktur Respons**: `Object EpisodeDetails`
  ```json
  {
    "media": "string (URL ke file video, misal .m3u8 untuk HLS)",
    "duration": "number (dalam detik)",
    "title": "string (judul episode)",
    "description": "string (deskripsi episode)",
    "metaTags": ["string"],
    "releaseDate": "string (format ISO 8601)",
    "likes": "number",
    "dislikes": "number",
    "details": {
      "Audio": "string",
      "Subtitles": "string"
    },
    "series": {
      "id": "string",
      "title": "string",
      "averageRating": "number",
      "totalRating": "number"
    },
    "prevEpisode": {
      "id": "string",
      "title": "string",
      "thumbnail": "string (URL thumbnail)"
    } | null,
    "nextEpisode": {
      "id": "string",
      "title": "string",
      "thumbnail": "string (URL thumbnail)"
    } | null
  }
  ```