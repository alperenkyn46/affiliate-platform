# Deployment Rehberi

Bu proje 3 servis kullanılarak deploy edilir:
- **Database**: Railway MySQL
- **Backend**: Railway (Node.js)
- **Frontend**: Vercel (Next.js)

## Ön Gereksinimler

- [Railway](https://railway.app) hesabı
- [Vercel](https://vercel.com) hesabı
- GitHub hesabı (önerilen)

---

## 1. Database (Railway MySQL)

Railway'de zaten MySQL instance'ınız var. Bağlantı bilgileri:

```
DB_URL=mysql://root:ctpIaOZzBpNOoLkAYrJonBUQgZRkWlHd@mainline.proxy.rlwy.net:22787/railway
```

### Tabloları Oluşturma

Railway MySQL'e bağlanıp `database/schema.sql` dosyasını çalıştırın:

**Option A: Railway CLI**
```bash
railway connect mysql
# Sonra SQL dosyasını çalıştırın
```

**Option B: MySQL Workbench veya DBeaver**
1. Yeni bağlantı oluşturun
2. Host: `mainline.proxy.rlwy.net`
3. Port: `22787`
4. User: `root`
5. Password: `ctpIaOZzBpNOoLkAYrJonBUQgZRkWlHd`
6. Database: `railway`
7. `database/schema.sql` dosyasını çalıştırın

---

## 2. Backend (Railway)

### Adım 1: GitHub'a Push

Eğer repo GitHub'da değilse:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Adım 2: Railway'de Yeni Servis Oluştur

1. [Railway Dashboard](https://railway.app/dashboard) açın
2. **New Project** > **Deploy from GitHub Repo**
3. GitHub reponuzu seçin
4. **Root Directory**: `backend` olarak ayarlayın

### Adım 3: Environment Variables

Railway Dashboard'da Variables sekmesine gidin ve ekleyin:

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=${{MySQL.DATABASE_URL}}
JWT_SECRET=güçlü_bir_secret_key_buraya_yazın_min_32_karakter
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
```

> **Not**: `${{MySQL.DATABASE_URL}}` Railway'in referans değişkenidir. MySQL servisini aynı projede tutuyorsanız otomatik bağlanır.

### Adım 4: Domain Ayarlama

1. **Settings** > **Domains** 
2. **Generate Domain** tıklayın
3. Örnek: `affiliate-backend-production.up.railway.app`

Backend URL'inizi not edin: `https://YOUR-BACKEND.up.railway.app`

---

## 3. Frontend (Vercel)

### Adım 1: Vercel'e Import

1. [Vercel Dashboard](https://vercel.com/dashboard) açın
2. **Add New** > **Project**
3. GitHub reponuzu import edin
4. **Root Directory**: `frontend` olarak ayarlayın
5. Framework: **Next.js** seçili olmalı

### Adım 2: Environment Variables

Build ayarlarında şu değişkenleri ekleyin:

```env
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://YOUR-SITE.vercel.app
```

### Adım 3: Deploy

**Deploy** butonuna tıklayın. Vercel otomatik olarak:
- Dependencies yükler
- Build çalıştırır
- CDN'e deploy eder

---

## 4. Son Adımlar

### CORS Ayarı

Backend deploy olduktan sonra, Railway'de `FRONTEND_URL` değişkenini güncelleyin:
```
FRONTEND_URL=https://your-actual-vercel-domain.vercel.app
```

### Test

1. Frontend'i tarayıcıda açın
2. Network sekmesinden API çağrılarını kontrol edin
3. `/api/health` endpoint'i 200 OK dönmeli

---

## Hızlı Kontrol Listesi

- [ ] Database tabloları oluşturuldu
- [ ] Backend Railway'e deploy edildi
- [ ] Backend environment variables ayarlandı
- [ ] Backend domain oluşturuldu
- [ ] Frontend Vercel'e deploy edildi
- [ ] Frontend `NEXT_PUBLIC_API_URL` backend'i gösteriyor
- [ ] CORS ayarları yapıldı
- [ ] Health check çalışıyor

---

## Sorun Giderme

### "Database connection failed"
- `DATABASE_URL` doğru mu kontrol edin
- Railway MySQL servisi çalışıyor mu?

### CORS Hatası
- Backend'de `FRONTEND_URL` Vercel domain'ini içeriyor mu?
- Vercel preview URL'leri için `.vercel.app` otomatik izinli

### Build Hatası
- `package.json` dosyasını kontrol edin
- Dependencies tam mı?
- Root directory doğru ayarlanmış mı?

---

## Alternatif: Tek Platform (Railway)

Hem frontend hem backend'i Railway'de barındırabilirsiniz:

1. Aynı projede iki servis oluşturun
2. Her biri için farklı root directory ayarlayın
3. Frontend için `next start` kullanın (SSR desteği)

> **Not**: Vercel, Next.js için edge caching ve CDN sağladığı için frontend performansı genelde daha iyi olur.
