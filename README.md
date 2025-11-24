# 📋 Schedule - Dokumentasi Aplikasi

## 📖 Deskripsi Proyek

**Schedule** adalah aplikasi manajemen proyek dan jadwal berbasis web yang dikembangkan menggunakan Next.js 15 dengan integrasi Electron untuk versi desktop. Aplikasi ini dirancang untuk mengelola proyek pembuatan website, termasuk tracking progress, manajemen akun, timeline, dan berbagai fitur manajemen lainnya.

## 🛠️ Teknologi yang Digunakan

### Frontend

- **Next.js 15.3.5** - Framework React dengan App Router
- **React 19.0.0** - Library UI
- **TypeScript 5** - Type safety
- **Tailwind CSS 4.1.11** - Styling framework
- **Radix UI** - Komponen UI yang accessible
- **Framer Motion 12.23.0** - Animasi
- **Recharts 3.0.2** - Chart/grafik
- **React Query (TanStack Query) 5.81.5** - State management untuk server state
- **Zod 3.25.76** - Schema validation

### Backend & Database

- **Firebase 11.10.0** - Authentication & Firestore database
- **Firebase Admin 13.4.0** - Server-side Firebase operations

### Desktop Application

- **Electron 38.7.1** - Desktop app framework
- **Electron Builder 25.1.0** - Packaging & distribution

### Utilities

- **ImageKit 6.0.0** - Image hosting & optimization
- **date-fns 4.1.0** - Date manipulation
- **Sonner 2.0.6** - Toast notifications
- **React Hot Toast 2.5.2** - Toast notifications

## 📁 Struktur Proyek

```
schedule/
├── electron/                    # Electron desktop app files
│   ├── main.js                 # Main Electron process (production)
│   ├── dev.js                  # Main Electron process (development)
│   └── preload.js              # Preload script untuk security
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group
│   │   │   └── signin/        # Halaman login
│   │   ├── api/               # API routes
│   │   │   └── auth/          # Authentication endpoints
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── filter/        # Pencarian & filter
│   │   │   ├── management-accounts/  # Manajemen akun
│   │   │   ├── manajemen-proyek/    # Manajemen proyek
│   │   │   ├── proyek/        # CRUD proyek
│   │   │   ├── profile/       # Profile user
│   │   │   └── timeline/      # Timeline & jadwal
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (redirect ke signin)
│   │   └── globals.css        # Global styles
│   ├── base/                  # Base utilities & helpers
│   │   ├── helper/            # Helper components
│   │   ├── meta/              # Metadata configuration
│   │   └── routing/           # Routing providers
│   ├── components/            # React components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── sidebar/           # Sidebar navigation
│   │   └── ui/                # Reusable UI components (shadcn/ui)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility modules
│   │   ├── context/           # React Context providers
│   │   ├── firebase/          # Firebase configuration
│   │   └── imagekit/          # ImageKit integration
│   └── middleware.ts          # Next.js middleware untuk auth
├── public/                    # Static assets
├── dist/                      # Build output (Electron)
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js configuration
├── electron-builder.json      # Electron builder config
└── README.md                  # Dokumentasi ini
```

## 🎯 Fitur Utama

### 1. **Authentication & Authorization**

- Login dengan email & password (Firebase Auth)
- Session management dengan HTTP-only cookies
- Protected routes dengan middleware
- Auto-redirect untuk authenticated/unauthenticated users

### 2. **Dashboard**

- Statistik ringkas (Total Order, Order Selesai, Order Proses, dll)
- Grafik order bulanan
- Progress tracking untuk target bulanan
- Tabel order terbaru
- Real-time updates dengan Firestore

### 3. **Manajemen Proyek**

- **Status Proyek**: Draft, Published, Archived
- **Progress Tracking**: Pending, Progress, Revisi, Selesai
- **Kategori Proyek**: Kategorisasi proyek
- **Framework**: Daftar framework yang digunakan
- **Deposit Management**: Tracking deposit & pembayaran
- **Link Management**: Menyimpan link terkait proyek
- **Account Management**: Manajemen akun untuk proyek

### 4. **Manajemen Akun**

- CRUD untuk akun (email, password, provider, type)
- Kategorisasi berdasarkan provider
- Kategorisasi berdasarkan type
- Secure password storage

### 5. **Timeline & Jadwal**

- Visualisasi timeline proyek
- Tracking start date & end date
- Calendar integration

### 6. **Pencarian & Filter**

- Pencarian proyek
- Filter berdasarkan status, progress, kategori, dll

### 7. **Profile Management**

- View & edit profile user
- Update display name, photo, dll

### 8. **Desktop Application**

- Electron wrapper untuk desktop
- Auto-update support
- Native desktop experience

## 🔧 Komponen Utama

### 1. **Authentication Context** (`src/utils/context/AuthContext.tsx`)

Context untuk mengelola state authentication global.

**Fungsi Utama:**

- `login(email, password)` - Login user
- `logout()` - Logout user
- `deleteAccount()` - Hapus akun user
- `forgotPassword(email)` - Reset password dengan OTP
- `hasRole()` - Check role user
- `getDashboardUrl()` - Get URL dashboard

**State:**

- `user` - User account data
- `loading` - Loading state
- `showInactiveModal` - Modal untuk inactive account

### 2. **Firebase Configuration** (`src/utils/firebase/firebase.ts`)

Konfigurasi Firebase untuk client-side.

**Exports:**

- `app` - Firebase app instance
- `db` - Firestore database
- `auth` - Firebase Authentication
- `analytics` - Firebase Analytics (optional)
- `database` - Realtime Database (optional)

### 3. **Middleware** (`src/middleware.ts`)

Next.js middleware untuk route protection.

**Fungsi:**

- Check session cookie
- Redirect authenticated users dari auth pages
- Protect private routes
- Verify session dengan API

**Public Paths:**

- `/signin`
- `/sitemap.xml`
- `/robots.txt`
- `/manifest.json`

### 4. **Dashboard Layout** (`src/app/dashboard/layout.tsx`)

Layout wrapper untuk semua halaman dashboard.

**Fitur:**

- Sidebar navigation
- Header dengan user info
- Mobile responsive
- Collapsible sidebar

### 5. **Sidebar Component** (`src/components/sidebar/Sidebar.tsx`)

Navigation sidebar dengan fitur:

- Collapsible/expandable
- Nested menu items
- Active route highlighting
- Mobile overlay
- Digital clock

**Menu Items:**

- Dashboard
- Proyek (dengan submenu: Proyek, Category, Framework)
- Manajemen Proyek (dengan submenu: Pending, On Progress, Revisi, Selesai)
- Jadwal & Timeline
- Management Accounts (dengan submenu: Home, Type, Provider)
- Pencarian & Filter
- Profile

### 6. **Dashboard Layout Component** (`src/components/dashboard/dashboard/DashboardLayout.tsx`)

Komponen utama dashboard dengan:

- Statistik cards (Total Order, Order Selesai, dll)
- Grafik order bulanan (Line Chart)
- Progress bar untuk target bulanan
- Tabel order terbaru
- Real-time data dari Firestore

### 7. **API Routes**

#### `/api/auth/session` (`src/app/api/auth/session/route.ts`)

**POST** - Create session cookie

- Input: `{ idToken: string }`
- Output: `{ success: boolean }`
- Cookie: `session` (HTTP-only, 5 days expiration)

**GET** - Verify session & get user data

- Output: `{ authenticated: boolean, user: UserAccount }`

**DELETE** - Clear session cookie

- Output: `{ success: boolean }`

#### `/api/auth/logout` (`src/app/api/auth/logout/route.ts`)

**POST** - Logout user

- Clears session cookie

## 📊 Type Definitions

### User Account (`src/types/Auth.ts`)

```typescript
interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  photo_url: string;
  updatedAt: Date;
  createdAt: Date;
  isActive: boolean;
}
```

### Proyek (`src/types/Proyek.d.ts`)

```typescript
interface Proyek {
  id: string;
  title: string;
  description: string;
  start_date: Timestamp;
  end_date: Timestamp;
  status: "draft" | "published" | "archived";
  progres: "pending" | "progress" | "revisi" | "selesai";
  category: string;
  thumbnail: string;
  framework: string[];
  nama_user: string;
  accounts: accountsList[];
  price: number;
  deposit: depositList[];
  link: Link[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Management Accounts (`src/types/ManagementAccounts.d.ts`)

```typescript
interface ManagementAccounts {
  id: string;
  name: string;
  email: string;
  password: string;
  provider: string;
  type: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
```

## ⚙️ Konfigurasi

### Environment Variables

Buat file `.env.local` dengan variabel berikut:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin (untuk server-side)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key

# Collections
NEXT_PUBLIC_COLLECTIONS_ACCOUNTS=accounts
NEXT_PUBLIC_COLLECTIONS_PROYEK=proyek

# Next.js URL (untuk Electron)
NEXT_PUBLIC_URL=http://localhost:3000

# ImageKit (optional)
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
```

### TypeScript Configuration

File `tsconfig.json` sudah dikonfigurasi dengan:

- Path aliases (`@/*` → `./src/*`)
- Strict mode enabled
- ES2017 target
- Next.js plugin

### Next.js Configuration

File `next.config.ts` mengatur:

- Image optimization dengan ImageKit
- Remote patterns untuk images
- Unoptimized images (untuk Electron)

## 🚀 Cara Menjalankan

### Development (Web)

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Aplikasi akan berjalan di http://localhost:3000
```

### Development (Desktop)

```bash
# Jalankan Next.js dev server + Electron
npm run desktop
# atau
npm run electron-dev
```

### Production Build (Web)

```bash
# Build Next.js
npm run build

# Start production server
npm start
```

### Production Build (Desktop)

```bash
# Build untuk desktop
npm run build:desktop
# atau
npm run electron-build

# Output akan ada di folder dist/
```

### Production Run (Desktop)

```bash
# Build & run desktop app
npm run start:desktop
# atau
npm run prod:desktop
```

## 📱 Scripts yang Tersedia

- `npm run dev` - Development server (web)
- `npm run build` - Build production (web)
- `npm start` - Start production server (web)
- `npm run lint` - Run ESLint
- `npm run electron` - Run Electron saja
- `npm run electron-dev` - Development dengan Electron
- `npm run desktop` - Alias untuk electron-dev
- `npm run build:desktop` - Build desktop app
- `npm run start:desktop` - Build & run desktop
- `npm run prod:desktop` - Production desktop

## 🔐 Authentication Flow

1. User login dengan email & password melalui `AuthContext.login()`
2. Firebase Auth mengautentikasi user
3. Client mendapatkan ID token dari Firebase
4. Client mengirim ID token ke `/api/auth/session` (POST)
5. Server membuat session cookie (HTTP-only, 5 hari)
6. Middleware memverifikasi session cookie pada setiap request
7. Jika valid, user dapat mengakses protected routes
8. Logout menghapus session cookie dan sign out dari Firebase

## 🗄️ Database Structure (Firestore)

### Collections

#### `accounts` (NEXT_PUBLIC_COLLECTIONS_ACCOUNTS)

- Document ID: User UID
- Fields: `uid`, `email`, `displayName`, `role`, `photo_url`, `isActive`, `createdAt`, `updatedAt`

#### `proyek` (NEXT_PUBLIC_COLLECTIONS_PROYEK)

- Document ID: Auto-generated
- Fields: Sesuai interface `Proyek`

#### Management Accounts Collections

- Collection untuk menyimpan akun-akun (email, password, provider, type)
- Collection untuk types
- Collection untuk providers

## 🖥️ Electron Desktop App

### Main Process (`electron/main.js`)

- Membuat BrowserWindow dengan ukuran 1200x800
- Load URL dari `NEXT_PUBLIC_URL`
- Security settings:
  - `nodeIntegration: false`
  - `contextIsolation: true`
  - `webSecurity: true`
- Auto-hide menu bar
- Error handling jika server tidak running

### Development Mode (`electron/dev.js`)

- Sama seperti main.js tapi untuk development
- Load dari localhost:3000

### Preload Script (`electron/preload.js`)

- Script yang dijalankan sebelum halaman dimuat
- Digunakan untuk security & IPC communication

## 🎨 UI Components

Aplikasi menggunakan komponen dari **shadcn/ui** yang dibangun di atas Radix UI:

- **Button** - Tombol dengan berbagai variant
- **Card** - Container untuk konten
- **Table** - Tabel data
- **Dialog** - Modal dialog
- **Input** - Input field
- **Select** - Dropdown select
- **Calendar** - Date picker
- **Progress** - Progress bar
- **Chart** - Grafik dengan Recharts
- **Sidebar** - Navigation sidebar
- Dan banyak lagi...

Semua komponen ada di folder `src/components/ui/`

## 🔄 State Management

- **React Context** - Untuk global state (Auth, Theme, Sidebar)
- **React Query** - Untuk server state & caching
- **Local State** - useState untuk component-level state

## 📦 Build & Distribution

### Electron Builder

Konfigurasi ada di `electron-builder.json`:

- Windows: `.exe` installer
- Auto-update support
- Icon & branding

### Build Output

- Web: `.next/` folder
- Desktop: `dist/` folder dengan:
  - Installer executable
  - Unpacked app folder
  - Update files (latest.yml)

## 🧪 Testing

Saat ini belum ada testing setup. Untuk menambahkan:

- Jest untuk unit tests
- React Testing Library untuk component tests
- Playwright untuk E2E tests

## 📝 Best Practices

1. **Type Safety**: Gunakan TypeScript untuk semua file
2. **Component Structure**: Pisahkan logic dan UI
3. **Error Handling**: Gunakan try-catch dan toast notifications
4. **Loading States**: Tampilkan skeleton/loading saat fetch data
5. **Security**: Jangan expose sensitive data di client-side
6. **Performance**: Gunakan React Query untuk caching
7. **Accessibility**: Gunakan komponen Radix UI yang accessible

## 🐛 Troubleshooting

### Electron tidak bisa connect ke server

- Pastikan Next.js server sudah running
- Check `NEXT_PUBLIC_URL` di environment variables
- Untuk production, pastikan server sudah di-build dan running

### Firebase errors

- Check environment variables
- Pastikan Firebase project sudah dikonfigurasi dengan benar
- Check Firebase console untuk rules & permissions

### Build errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 👥 Kontribusi

Untuk kontribusi, silakan:

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## 📄 License

[Tambahkan license sesuai kebutuhan]

---

**Dibuat dengan ❤️ menggunakan Next.js, React, TypeScript, dan Firebase**
