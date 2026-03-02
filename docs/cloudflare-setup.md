# Cloudflare Yapılandırma Rehberi

## DNS Ayarları

1. Cloudflare dashboard'a giriş yapın
2. Domain'inizi ekleyin ve NS kayıtlarını Cloudflare'e yönlendirin
3. A kaydı ekleyin: `@` -> sunucu IP adresi (Proxied)
4. CNAME kaydı ekleyin: `www` -> `@` (Proxied)

## SSL/TLS

- SSL modunu **Full (Strict)** olarak ayarlayın
- Always Use HTTPS'i aktif edin
- Minimum TLS Version: TLS 1.2

## Cache Kuralları

### Page Rules
1. `*domain.com/admin/*` - Cache Level: Bypass
2. `*domain.com/api/*` - Cache Level: Bypass
3. `*domain.com/*` - Cache Level: Standard, Edge TTL: 4 hours

### Cache Settings
- Browser Cache TTL: Respect Existing Headers
- Always Online: On

## Güvenlik

### WAF
- Managed Rules: OWASP Core Ruleset aktif
- Rate Limiting: /api/* için dakikada 100 istek

### Bot Management
- Bot Fight Mode: On (ücretsiz plan)

## Performans

- Auto Minify: JavaScript, CSS, HTML aktif
- Brotli: On
- Early Hints: On
- Rocket Loader: Off (Next.js ile uyumsuz olabilir)

## Ortam Değişkenleri

Backend'de CF header desteği aktif:
- `CF-Connecting-IP`: Gerçek kullanıcı IP'si
- `trust proxy` Express ayarı aktif
