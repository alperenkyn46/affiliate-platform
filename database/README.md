# Database Kurulumu

## Gereksinimler

- MySQL 8.0 veya üzeri

## Kurulum Adımları

### 1. MySQL'e Bağlan

```bash
mysql -u root -p
```

### 2. Schema'yı Oluştur

```bash
mysql -u root -p < schema.sql
```

### 3. Seed Data'yı Ekle

```bash
mysql -u root -p < seed.sql
```

## Tablolar

### ads
Reklam bilgilerini tutar.
- `id` - Benzersiz ID
- `title` - Reklam başlığı
- `description` - Açıklama
- `bonus` - Bonus metni
- `link` - Affiliate linki
- `position` - Sıralama pozisyonu
- `status` - active/inactive/pending
- `featured` - Öne çıkan mı?

### clicks
Tıklama verilerini tutar.
- `ad_id` - Tıklanan reklam
- `ip` - Kullanıcı IP'si
- `device` - mobile/desktop
- `country` - Ülke kodu

### visitors
Ziyaretçi verilerini tutar.
- `ip` - Kullanıcı IP'si
- `device` - mobile/desktop
- `page_url` - Ziyaret edilen sayfa

### admin_users
Admin kullanıcıları.
- `username` - Kullanıcı adı
- `password` - Hashlenmiş şifre
- `email` - E-posta

## Varsayılan Admin

- **Kullanıcı Adı:** admin
- **Şifre:** admin123

⚠️ Üretimde şifreyi mutlaka değiştirin!
