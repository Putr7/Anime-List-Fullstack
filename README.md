# Dashboard Anime 
**Tugas Perkuliahan: BAB 9 - NestJS Dasar + Struktur MVC**

Aplikasi manajemen katalog anime berbasis arsitektur **MVC (Model-View-Controller)** dengan backend **NestJS** dan frontend **React + Vite**. Aplikasi ini mengelola data anime secara dinamis dengan fitur CRUD (Create, Read, Update, Delete), validasi data menggunakan DTO, penanganan exception, dan integrasi frontend-backend secara real-time.

---

## Daftar Endpoint API (RESTful)

| Method | Endpoint | Deskripsi | HTTP Status |
|:---|:---|:---|:---|
| **GET** | `/anime` | Mengambil seluruh koleksi data anime | `200 OK` |
| **GET** | `/anime/:id` | Mengambil detail 1 anime berdasarkan ID | `200 OK` / `404 Not Found` |
| **POST** | `/anime` | Menambahkan data anime baru | `201 Created` / `400` / `409` |
| **PATCH** | `/anime/:id` | Memperbarui sebagian properti anime | `200 OK` / `404 Not Found` |
| **DELETE** | `/anime/:id` | Menghapus anime berdasarkan ID | `200 OK` / `404 Not Found` |
| **POST** | `/anime/reset` | Memulihkan data sampel awal | `201 Created` |

---

## Pengujian Endpoint & Aplikasi

Berikut adalah dokumentasi hasil pengujian setiap tahapan. Seluruh gambar tersimpan pada folder `docs/screenshots/`:

### A. Backend 

#### 1. GET /anime (Ambil Semua Data)
![GET Anime](docs/screenshots/01-get-anime.png)

#### 2. GET /anime/:id (Detail Anime)
![Detail Anime](docs/screenshots/02-detail-anime.png)

#### 3. GET /anime/:id (Data Tidak Ditemukan)
![Not Found](docs/screenshots/03-not-found.png)

#### 4. POST /anime (Tambah Anime)
![Tambah Anime](docs/screenshots/04-tambah-anime.png)

#### 5. POST /anime (Judul Duplikat)
![Judul Duplikat](docs/screenshots/05-duplikat.png)

#### 6. POST /anime (Validasi Input)
![Validasi Input](docs/screenshots/06-validasi.png)

#### 7. PATCH /anime/:id (Update Anime)
![Update Anime](docs/screenshots/07-update-anime.png)

#### 8. DELETE /anime/:id (Hapus Anime)
![Hapus Anime](docs/screenshots/08-hapus-anime.png)


### B. Tampilan Aplikasi

#### 9. Tampilan Dashboard Utama
![Dashboard Utama](docs/screenshots/09-dashboard.png)

#### 10. Tampilan Form Tambah Anime
![Form Tambah](docs/screenshots/10-form-tambah.png)

#### 11. Tampilan Form Edit Anime
![Form Edit](docs/screenshots/11-form-edit.png)

#### 12. Tampilan Setelah Hapus Anime
![Hasil Hapus](docs/screenshots/12-hasil-hapus.png)
