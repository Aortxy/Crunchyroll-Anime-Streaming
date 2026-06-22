# Streaming Service Monorepo

Selamat datang di proyek Layanan Streaming. Proyek ini telah direstrukturisasi menjadi arsitektur monorepo yang modern dan skalabel, memisahkan antara frontend dan backend.

- **`/client`**: Aplikasi Frontend Next.js yang berfungsi sebagai antarmuka pengguna (UI).
- **`/server`**: (DEPRECATED) Kode backend Nest.js yang lama. Direktori ini sekarang usang dan akan digantikan oleh backend Go baru Anda.
- **Backend Go (Tugas Anda)**: Anda akan membuat layanan backend baru menggunakan Go yang berfungsi sebagai API untuk aplikasi Next.js.

---

## Arsitektur Baru: Frontend Terpisah & Backend API

Aplikasi ini sekarang mengikuti pendekatan "headless", di mana frontend (Next.js) sepenuhnya terpisah dari backend. Semua data diperoleh melalui panggilan API ke backend Go.

### Alur Kerja Pengembangan

1.  **Backend (Go)**: Bangun server API Go Anda. Server ini akan berfungsi sebagai perantara (proxy/middleware) yang mengambil data dari API pihak ketiga, mengubahnya sesuai kebutuhan, dan menyediakannya sebagai REST API untuk frontend.
2.  **Frontend (Next.js)**: Jalankan aplikasi Next.js. Aplikasi ini akan memanggil endpoint API Go Anda untuk mengambil dan menampilkan data.

### Konfigurasi Frontend

Untuk menghubungkan frontend ke backend Anda, ikuti langkah-langkah berikut:

1.  Pindah ke direktori `client`:
    ```bash
    cd client
    ```
2.  Buat file `.env.local`:
    ```bash
    touch .env.local
    ```
3.  Tambahkan URL base API Anda ke file tersebut. Jika backend Anda berjalan di `localhost:8080`, maka:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
    ```
4.  Instal dependensi dan jalankan server pengembangan:
    ```bash
    yarn install
    yarn dev
    ```

Aplikasi Next.js sekarang akan berjalan (biasanya di `localhost:3000`) dan siap menerima data dari API Anda.

---

## Spesifikasi API Backend (Kontrak Data)

Backend Go Anda **HARUS** menyediakan endpoint berikut dan mengembalikan data JSON dalam format yang ditentukan agar frontend dapat berfungsi dengan benar.

### Struktur Gambar yang Disederhanakan

Untuk menyederhanakan manajemen aset, setiap entitas (Series, Episode) yang memiliki gambar harus menyediakan dua format URL utama:

- `posterImage`: URL ke gambar poster **vertikal** (rasio ~2:3). Digunakan untuk kartu konten.
- `bannerImage`: URL ke gambar banner **horizontal** (rasio ~16:9). Digunakan sebagai latar belakang header/hero.

Frontend akan menangani penyesuaian tampilan gambar ini.

---

### Endpoints yang Diperlukan

#### 1. Halaman Utama

- **`GET /api/v1/home/banner`**
  - **Tujuan**: Mengisi hero banner di halaman utama.
  - **Struktur Respons**: `Array of BannerItem`
    ```json
    [
      {
        "id": "string", // ID dari series
        "episodeId": "string", // ID dari episode yang akan diputar
        "title": "string", // Judul series
        "bannerImage": "string (URL gambar banner 16:9)",
        "description": "string",
        "genres": ["string", "string"],
        "metaTags": ["string", "string"]
      }
    ]
    ```

- **`GET /api/v1/home/top-picks`** (atau endpoint serupa seperti `/newly-updated`)
  - **Tujuan**: Mengisi baris kartu konten.
  - **Struktur Respons**: `Array of DataFeedItem`
    ```json
    [
      {
        "id": "string", // ID dari series
        "episodeId": "string", // ID dari episode yang akan diputar
        "title": "string", // Judul series
        "posterImage": "string (URL gambar poster 2:3)",
        "averageRating": "number",
        "episodeTitle": "string" // Judul episode terkait
      }
    ]
    ```

#### 2. Detail Series & Episode

- **`GET /api/v1/series/:id`**
  - **Tujuan**: Menampilkan halaman detail sebuah series, menyediakan semua data yang dilingkari di gambar Anda.
  - **Struktur Respons**: `Object Series`
    ```json
    {
      "title": "string",
      "bannerImage": "string (URL banner 16:9)",
      "description": "string",
      "genres": ["Action", "Fantasy", "Shonen"],
      "metaTags": ["Sub | Dub", "HD"],
      "startWatching": {
        "episodeId": "string",
        "seasonNumber": 1,
        "episodeNumber": 1
      },
      "userStatus": {
        "isInWatchlist": "boolean",
        "progress": {
          "totalEpisodesInSeries": "number",
          "watchedEpisodesInSeries": "number"
        }
      },
      "averageRating": "number",
      "details": { "releaseYear": "string", "status": "string" },
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

- **`GET /api/v1/series/:seriesId/seasons/:seasonId/episodes`**
  - **Tujuan**: Mengambil daftar semua episode untuk musim tertentu.
  - **Struktur Respons**: `Array of EpisodeItem`
    ```json
    [
      {
        "id": "string",
        "title": "string",
        "episode": "number",
        "thumbnail": "string (URL gambar thumbnail)",
        "duration": "number"
      }
    ]
    ```

- **`GET /api/v1/episodes/:id`**
  - **Tujuan**: Mengambil data untuk halaman pemutar video.
  - **Struktur Respons**: `Object Episode`
    ```json
    {
      "title": "string",
      "thumbnail": "string (URL gambar thumbnail episode)",
      "duration": "number",
      "description": "string",
      "media": {
        "hls": { "main": "string (URL ke master.m3u8)" }
      },
      "series": {
        "id": "string",
        "title": "string"
      },
      "prevEpisode": { "id": "string", "title": "string", "season": "number" } | null,
      "nextEpisode": { "id": "string", "title": "string", "season": "number" } | null
    }
    ```

#### 3. Data Tambahan

- **`GET /api/v1/genres`**
- **`GET /api/v1/meta-tags`**
  - **Tujuan**: Mengisi filter dan menampilkan tag.
  - **Struktur Respons**: `Array of Objects`
    ```json
    [
      { "id": "string", "title": "string" }
    ]
    ```

Dengan mengikuti panduan ini, Anda dapat membangun backend Go yang akan terintegrasi dengan mulus dengan frontend Next.js yang sudah ada.
