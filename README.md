# ServiLog

ServiLog merupakan platform tracking untuk pemeliharaan kendaraan. Platform ini akan mencatat jarak tempuh kendaraan dan memantau umur penggunaan setiap part penting pada kendaraan. ServiLog juga memiliki fitur prediktif yang dikirimkan 7 hari sebelum sebuah komponen mencapai batas umur penggunaan. Dengan adanya fitur ini, ServiLog membantu pengguna mencegah kerusakan mendadak dan biaya perbaikan yang tidak terduga. ServiLog cocok untuk pemilik kendaraan pribadi maupun pengelola armada kendaraan.

Proyek kami sudah di-deploy menggunakan Vercel yang dapat diakses di https://servilog.vercel.app. Backend dapat diakses di https://servilog-backend.vercel.app. 

---

## ServiLog-Backend

### Stack Backend
- **Node.js** + **Express.js**
- **PostgreSQL** (Database)
- **JWT** (Authentication)
- **Helmet & CORS** (Security)
- **Nodemailer** (Email verifikasi)

### Struktur Folder Utama
- `api/` - Entry point backend
- `src/configs/` - Konfigurasi database & environment
- `src/controllers/` - Logic endpoint utama
- `src/middlewares/` - Middleware (auth, logger)
- `src/repositories/` - Query ke database
- `src/routes/` - Routing endpoint
- `src/services/` - Business logic
- `src/utils/` - Utility (response, hash, mail, logger)

### Fitur Utama
- Autentikasi JWT (register, login, verifikasi email, logout)
- CRUD Account, Vehicle, Part, Mileage
- Status otomatis kendaraan & part (normal, due, overdue, replaced)
- Email verifikasi
- Logging request

### Endpoint API (Ringkasan)

#### Auth & Account
- `POST /account/register` — Register akun
- `POST /account/login` — Login
- `POST /account/verify` — Verifikasi email
- `GET /account/:id` — Get detail akun
- `PUT /account/:id` — Update akun
- `DELETE /account/:id` — Hapus akun

#### Vehicle
- `GET /vehicle/account/:accountId` — List kendaraan milik akun
- `GET /vehicle/id/:id` — Detail kendaraan
- `POST /vehicle` — Tambah kendaraan
- `PUT /vehicle/:id` — Edit kendaraan
- `DELETE /vehicle/:id` — Hapus kendaraan

#### Part
- `GET /part/vehicle/:vehicleId` — List part kendaraan
- `POST /part` — Tambah part
- `PUT /part/:id` — Edit part
- `DELETE /part/:id` — Hapus part
- `POST /part/maintain/:id` — Maintain/replace part

#### Mileage
- `GET /mileage/vehicle/:vehicleId` — List mileage kendaraan
- `POST /mileage` — Tambah mileage
- `PUT /mileage/:id` — Edit mileage
- `DELETE /mileage/:id` — Hapus mileage

### Konfigurasi & Menjalankan Backend
1. Buat file `.env` dan isi konfigurasi DB, JWT, email.
2. Install dependencies: `npm install`
3. Jalankan migrasi DB kalo perlu.
4. Start: `npm start`

---

## ServiLog-Frontend

### Stack Frontend
- **React.js** (Vite)
- **Tailwind CSS** (UI Styling)
- **Axios** (HTTP request)
- **React Router** (Routing)

### Struktur Folder Utama
- `src/pages/` — Halaman utama (Dashboard, Vehicle, Profile, Login, Register, Landing, Verify)
- `src/components/` — Komponen UI (Navbar, Modal, dsb)
- `src/contexts/` — Context (Auth, Theme)
- `src/assets/` — Asset gambar/logo

### Fitur Utama
- Register, Login, Logout, Verifikasi Email
- Dashboard kendaraan (filter, sort, search)
- Detail kendaraan, part, mileage
- CRUD kendaraan, part, mileage
- Update & hapus akun
- Dark mode
- Responsive UI

### Konfigurasi & Menjalankan Frontend
1. Buat file `.env` dan isi VITE_BACKEND_URL sesuai backend.
2. Install dependencies: `npm install`
3. Start: `npm run dev`

### Struktur Routing
- `/` — Landing Page
- `/login` — Login
- `/register` — Register
- `/verify` — Verifikasi email
- `/dashboard` — Dashboard kendaraan
- `/vehicle/:id` — Detail kendaraan
- `/profile` — Profile akun

---

## Kotributor (Kelompok 27)

- Darmawan Hanif (2206829175)
- Muhammad Sesarafli Aljjagra (2206828071)
- Nahl Syareza Rahidra (2206830340)
- Salahuddin Zidane Alghifari (22206028200)
- Muhammad Lutfi Setiadi (2206059805)

---

## Special Thanks

- Den (Aslab mantap)
- Zayda (Penyedia HQ)
- Bontot (Penyedia Konsum)