# CasinoHub - Affiliate Landing Page Platform

Modern, conversion odakli, full-stack affiliate reklam ve icerik platformu.

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Veritabani** | MySQL 8 (mysql2) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Guvenlik** | Helmet, CORS, express-rate-limit |
| **Tracking** | geoip-lite, ua-parser-js |
| **E-posta** | Nodemailer (SMTP) |
| **Zamanlanmis Gorevler** | node-cron |

## Hizli Baslangic

### Gereksinimler

- Node.js 18+
- MySQL 8+
- npm 9+

### Kurulum

```bash
# Repo'yu klonla
git clone <repo-url>
cd affiliate-platform

# Tum bagimliliklar (root + frontend + backend)
npm install

# Backend ortam degiskenleri
cp backend/.env.example backend/.env
# .env dosyasini duzenle (DB bilgileri, JWT secret vb.)

# Veritabani olustur
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql

# Gelistirme sunucularini baslat (frontend + backend birlikte)
npm run dev
```

### Ayri Calistirma

```bash
# Sadece frontend (port 3000)
npm run dev:frontend

# Sadece backend (port 5000)
npm run dev:backend
```

### Varsayilan Admin Hesabi

- **Kullanici Adi:** admin
- **Sifre:** admin123
- **Panel:** http://localhost:3000/admin

> Uretimde sifreyi mutlaka degistirin!

## Proje Yapisi

```
affiliate-platform/
├── frontend/                          # Next.js 14 uygulamasi
│   ├── public/
│   │   ├── manifest.json              # PWA manifest
│   │   ├── sw.js                      # Service Worker
│   │   └── icons/                     # PWA ikonlari
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout (SEO metadata, JsonLd)
│   │   │   ├── page.tsx               # Ana sayfa
│   │   │   ├── sitemap.ts             # Dinamik sitemap.xml
│   │   │   ├── robots.ts              # robots.txt
│   │   │   ├── globals.css            # Tema (light/dark CSS variables)
│   │   │   ├── about/                 # Hakkimizda
│   │   │   ├── privacy/               # Gizlilik Politikasi
│   │   │   ├── terms/                 # Kullanim Sartlari
│   │   │   ├── contact/               # Iletisim formu
│   │   │   ├── blog/                  # Blog listesi ve detay
│   │   │   │   └── [slug]/            # Blog yazi detayi
│   │   │   ├── go/[id]/               # Affiliate redirect + tracking
│   │   │   └── admin/
│   │   │       ├── page.tsx           # Dashboard
│   │   │       ├── login/             # Admin giris
│   │   │       ├── ads/               # Reklam yonetimi
│   │   │       ├── blog/              # Blog yonetimi
│   │   │       ├── reviews/           # Yorum moderasyonu
│   │   │       ├── analytics/         # Analitik
│   │   │       ├── affiliates/        # Affiliate yonetimi
│   │   │       ├── api-stats/         # API istatistikleri
│   │   │       ├── backups/           # Yedek yonetimi
│   │   │       └── settings/          # Site ayarlari
│   │   ├── components/
│   │   │   ├── layout/                # Header, Footer, Container
│   │   │   ├── sections/              # Hero, Featured, CasinoList, Trust, HowItWorks, Promotion
│   │   │   ├── features/              # LiveTicker, BonusWheel, ExitPopup
│   │   │   ├── ads/                   # AdCard, AdCardGrid
│   │   │   ├── admin/                 # AdminShell, Sidebar, StatsCard
│   │   │   ├── seo/                   # JsonLd (Organization, WebSite, Breadcrumb)
│   │   │   ├── ui/                    # Button, Badge, Card, ThemeToggle, LanguageSwitcher
│   │   │   └── providers/             # Providers, ThemeProvider, VisitorTracker
│   │   ├── contexts/                  # Auth, Settings, Language
│   │   ├── i18n/                      # tr.json, en.json (ceviri dosyalari)
│   │   ├── lib/                       # api.ts, utils.ts
│   │   ├── data/                      # Mock veriler
│   │   └── types/                     # TypeScript tip tanimlari
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                           # Express.js API
│   ├── src/
│   │   ├── index.js                   # Ana sunucu dosyasi
│   │   ├── config/
│   │   │   └── database.js            # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── adminController.js     # Dashboard, CRUD, analitik, yedekleme
│   │   │   ├── adsController.js       # Public reklam listesi
│   │   │   ├── authController.js      # Login, register, JWT
│   │   │   ├── blogController.js      # Public blog API
│   │   │   └── trackingController.js  # Click redirect, visitor tracking
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # JWT dogrulama
│   │   │   ├── roleMiddleware.js      # Rol bazli yetkilendirme
│   │   │   └── apiLogger.js           # API istek loglama
│   │   ├── routes/
│   │   │   ├── admin.js               # /api/admin/*
│   │   │   ├── ads.js                 # /api/ads
│   │   │   ├── affiliate.js           # /api/affiliate/*
│   │   │   ├── auth.js                # /api/auth/*
│   │   │   ├── blog.js                # /api/blog
│   │   │   ├── contact.js             # /api/contact
│   │   │   ├── reviews.js             # /api/reviews
│   │   │   ├── settings.js            # /api/settings
│   │   │   └── tracking.js            # /api/go/:id, /api/visitors, /api/recent-clicks
│   │   ├── jobs/
│   │   │   ├── dailyStats.js          # Gunluk istatistik agregasyonu (00:05)
│   │   │   ├── emailReports.js        # E-posta raporlari (08:00 gunluk, Pzt haftalik)
│   │   │   ├── adScheduler.js         # Reklam zamanlama (her 5 dk)
│   │   │   └── backup.js              # Otomatik yedekleme (02:00)
│   │   └── services/
│   │       └── emailService.js        # SMTP e-posta gonderimi + HTML sablonlar
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── schema.sql                     # Tum tablo tanimlari (16 tablo)
│   ├── seed.sql                       # Ornek veriler
│   └── README.md                      # Veritabani dokumantasyonu
│
├── docs/
│   └── cloudflare-setup.md            # Cloudflare yapilandirma rehberi
│
└── package.json                       # Root workspace (npm workspaces)
```

## Ozellikler

### Public (Kullaniciya Acik)

| Ozellik | Aciklama |
|---------|----------|
| **Landing Page** | Casino bonuslari, one cikan reklamlar, guven rozetleri |
| **Nasil Calisir** | 4 adimli gorsel aciklama bolumu (`#how-it-works` anchor) |
| **Blog** | Casino incelemeleri, bonus rehberleri, SEO odakli icerikler |
| **Canli Ticker** | Gercek tiklama verilerinden olusan akan bildirimler (30s polling) |
| **Bonus Carki** | Cookie ile gunde 1 kez cevrilebilen etkilesimli cark |
| **Cikis Popup'i** | Mouse sayfayi terk ettiginde tetiklenen dinamik popup |
| **Promosyon Banner** | Admin'den yonetilebilen dinamik kampanya banner'i |
| **Affiliate Redirect** | `/go/:id` uzerinden tiklama kaydi + yonlendirme |
| **Ziyaretci Takibi** | IP, cihaz, tarayici, ulke bilgisi otomatik kayit |
| **Kullanici Yorumlari** | Yildiz rating ve yorum sistemi (moderasyon ile) |
| **Statik Sayfalar** | Gizlilik, Kullanim Sartlari, Hakkimizda, Iletisim |
| **Iletisim Formu** | Backend'e kaydedilen mesaj formu |
| **Dark / Light Tema** | Kullanici tarafli tema degistirme (localStorage) |
| **Coklu Dil (i18n)** | Turkce / Ingilizce dil destegi (genisletilebilir) |
| **PWA** | Service Worker, manifest.json, offline destek |
| **SEO** | sitemap.xml, robots.txt, Open Graph, Twitter Cards, Schema.org JsonLd |

### Admin Paneli (`/admin`)

| Ozellik | Aciklama |
|---------|----------|
| **Dashboard** | Toplam ziyaretci, tiklama, aktif reklam, cihaz dagilimi |
| **Reklam Yonetimi** | CRUD, siralama, one cikarma, durum degistirme |
| **Reklam Zamanlama** | Baslangic/bitis tarihi ile otomatik aktif/pasif |
| **Blog Yonetimi** | Yazi olusturma, duzenleme, silme, kategori, taslak/yayin |
| **Yorum Moderasyonu** | Bekleyen yorumlari onaylama/reddetme |
| **Analitik** | Tiklama/ziyaretci grafikleri, ulke/cihaz dagilimi |
| **Gelismis Analitik** | Conversion rate, funnel analizi, reklam bazli ROI |
| **Affiliate Yonetimi** | Partner hesaplari, takip kodlari, komisyon oranlari |
| **API Istatistikleri** | Endpoint bazli istek sayilari, response time, saatlik dagilim |
| **Site Ayarlari** | Tema renkleri, sosyal medya, promosyon/popup yapilandirmasi |
| **Yedek Yonetimi** | Otomatik/manuel veritabani yedekleri, listeleme |
| **Rol Bazli Erisim** | super_admin, admin, editor, viewer yetki seviyeleri |
| **E-posta Bildirimleri** | Gunluk/haftalik rapor, anomali uyarilari (SMTP) |

### Teknik Altyapi

| Ozellik | Aciklama |
|---------|----------|
| **JWT Auth** | Token bazli kimlik dogrulama, rol destegi |
| **Rate Limiting** | Production'da IP bazli istek sinirlamasi |
| **API Loglama** | Tum API istekleri veritabanina loglanir |
| **GeoIP** | Tiklama ve ziyaretci IP'lerinden ulke tespiti |
| **UA Parser** | User-Agent'tan cihaz ve tarayici bilgisi cikarimi |
| **Cloudflare Destegi** | CF-Connecting-IP header, trust proxy, cache headers |
| **Cron Jobs** | daily_stats, e-posta rapor, reklam zamanlama, yedekleme |
| **Mock Data Fallback** | DB baglantisi yoksa mock veriyle calisma |
| **npm Workspaces** | Monorepo yapilanmasi (root, frontend, backend) |

## API Endpointleri

### Public (Auth Gerektirmez)

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| GET | `/api/health` | Saglik kontrolu |
| GET | `/api/ads` | Reklam listesi (`?featured=true`) |
| GET | `/api/ads/:id` | Tek reklam detayi |
| GET | `/api/go/:id` | Affiliate redirect + tiklama kaydi |
| GET | `/api/recent-clicks` | Son 20 tiklama (LiveTicker icin) |
| POST | `/api/visitors` | Ziyaretci kaydi |
| GET | `/api/settings` | Site ayarlari |
| GET | `/api/blog` | Blog yazilari (`?category=`, `?q=`, `?limit=`, `?offset=`) |
| GET | `/api/blog/categories` | Blog kategorileri |
| GET | `/api/blog/:slug` | Blog yazi detayi |
| POST | `/api/contact` | Iletisim formu |
| GET | `/api/reviews/:adId` | Onayli yorumlar |
| POST | `/api/reviews` | Yorum gonderme |

### Auth

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/auth/login` | Admin giris |
| POST | `/api/auth/register` | Admin kayit |
| GET | `/api/auth/me` | Mevcut kullanici (Bearer token) |

### Admin (JWT Gerekli)

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| GET | `/api/admin/dashboard` | Dashboard istatistikleri |
| GET/POST | `/api/admin/ads` | Reklam listesi / olusturma |
| PUT/DELETE | `/api/admin/ads/:id` | Reklam guncelleme / silme |
| PUT | `/api/admin/ads/:id/position` | Sira guncelleme |
| GET/POST | `/api/admin/blog` | Blog yazilari / olusturma |
| PUT/DELETE | `/api/admin/blog/:id` | Blog guncelleme / silme |
| GET | `/api/admin/reviews` | Tum yorumlar |
| PUT | `/api/admin/reviews/:id` | Yorum onaylama/reddetme |
| GET | `/api/admin/analytics` | Tiklama/ziyaretci grafikleri |
| GET | `/api/admin/analytics/clicks` | Reklam bazli tiklama |
| GET | `/api/admin/analytics/visitors` | Ulke/cihaz dagilimi |
| GET | `/api/admin/analytics/conversions` | Conversion rate verileri |
| GET | `/api/admin/analytics/funnel` | Funnel analizi |
| GET/PUT | `/api/admin/settings` | Site ayarlari |
| GET | `/api/admin/api-stats` | API kullanim istatistikleri |
| GET/POST | `/api/admin/backups` | Yedek listesi / manuel yedek |
| GET/POST/PUT/DELETE | `/api/admin/affiliates` | Affiliate CRUD |

### Affiliate

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/affiliate/login` | Affiliate giris |
| GET | `/api/affiliate/dashboard` | Affiliate dashboard |

## Veritabani

Toplam **16 tablo:**

| Tablo | Aciklama |
|-------|----------|
| `ads` | Reklamlar (bonus, link, pozisyon, zamanlama, rating) |
| `clicks` | Tiklama kayitlari (IP, cihaz, ulke, referrer) |
| `visitors` | Ziyaretci kayitlari (IP, cihaz, ulke, sayfa) |
| `admin_users` | Admin kullanicilari (rol bazli: super_admin/admin/editor/viewer) |
| `site_settings` | Key-value site ayarlari |
| `daily_stats` | Gunluk agrege istatistikler (cron ile dolduruluyor) |
| `blog_posts` | Blog yazilari (slug, icerik, SEO metadata, goruntulenme) |
| `blog_categories` | Blog kategorileri |
| `contact_messages` | Iletisim formu mesajlari |
| `reviews` | Kullanici yorumlari ve puanlamalar |
| `email_logs` | E-posta gonderim loglar |
| `conversions` | Conversion kayitlari (signup, deposit) |
| `ab_tests` | A/B test tanimlari |
| `api_logs` | API istek loglari (endpoint, method, response time) |
| `affiliates` | Affiliate partner hesaplari |
| `affiliate_clicks` | Affiliate tiklama kayitlari |
| `affiliate_payouts` | Affiliate odeme kayitlari |

## Zamanlanmis Gorevler (Cron Jobs)

| Gorev | Zamanlama | Aciklama |
|-------|-----------|----------|
| daily_stats | Her gece 00:05 | Onceki gunun ziyaretci/tiklama verilerini agrege eder |
| E-posta Gunluk Rapor | Her gun 08:00 | Admin'e gunluk trafik raporu gonderir |
| E-posta Haftalik Rapor | Her Pazartesi 09:00 | Admin'e haftalik ozet raporu gonderir |
| Anomali Kontrolu | Her saat basi | Trafik anomalilerini tespit edip uyari gonderir |
| Reklam Zamanlama | Her 5 dakika | start_date/end_date'e gore reklam durumu gunceller |
| Otomatik Yedekleme | Her gece 02:00 | mysqldump ile veritabani yedegi alir |

## Ortam Degiskenleri

Backend `.env` dosyasi:

```env
# Sunucu
PORT=5000
NODE_ENV=development

# Veritabani
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=affiliate_db

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# E-posta (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
ADMIN_EMAIL=

# Yedekleme
BACKUP_DIR=./backups
BACKUP_RETENTION_DAYS=30
```

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=https://casinohub.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=
```

## Admin Rol Yetki Matrisi

| Islem | super_admin | admin | editor | viewer |
|-------|:-----------:|:-----:|:------:|:------:|
| Dashboard goruntuleme | + | + | + | + |
| Analitik goruntuleme | + | + | + | + |
| Reklam CRUD | + | + | + | - |
| Blog CRUD | + | + | + | - |
| Yorum moderasyonu | + | + | + | - |
| Reklam silme | + | + | - | - |
| Blog silme | + | + | - | - |
| Ayarlar goruntuleme | + | + | - | - |
| Ayarlar duzenleme | + | - | - | - |
| API istatistikleri | + | + | - | - |
| Affiliate yonetimi | + | + | - | - |
| Yedek yonetimi | + | - | - | - |

## Deployment

### Production Build

```bash
# Frontend build
npm run build

# Backend baslat
cd backend && npm start
```

### Cloudflare Yapilandirmasi

Detayli rehber: [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md)

- SSL: Full (Strict)
- `/admin/*` ve `/api/*` icin cache bypass
- WAF: OWASP kurallar aktif
- `CF-Connecting-IP` header destegi backend'de aktif

## Lisans

Bu proje ozel bir projedir. Tum haklari saklidir.
