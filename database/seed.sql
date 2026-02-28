-- Seed Data for Affiliate Platform
USE affiliate_db;

-- Insert Admin User (password: admin123)
INSERT INTO admin_users (username, password, email) VALUES 
('admin', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDuy0Bx8MxeO', 'admin@casinohub.com');

-- Insert Sample Ads
INSERT INTO ads (title, description, bonus, bonus_details, image, link, position, status, featured, rating, tags) VALUES 
(
    'BetKing Casino',
    'Türkiye''nin en güvenilir casino sitesi',
    '%150 Hoşgeldin Bonusu',
    '500₺''ye kadar',
    '/casinos/betking.png',
    'https://example.com/betking',
    1,
    'active',
    TRUE,
    4.9,
    '["Yeni", "Popüler"]'
),
(
    'RoyalBet',
    'Kraliyet deneyimi yaşayın',
    '%200 İlk Yatırım',
    '1000₺''ye kadar',
    '/casinos/royalbet.png',
    'https://example.com/royalbet',
    2,
    'active',
    TRUE,
    4.8,
    '["VIP"]'
),
(
    'SpinPalace',
    'En yüksek oranlar burada',
    '100 Freespin',
    'Kayıt bonusu',
    '/casinos/spinpalace.png',
    'https://example.com/spinpalace',
    3,
    'active',
    FALSE,
    4.7,
    '["Freespin"]'
),
(
    'LuckySlots',
    'Şansınızı deneyin',
    '%100 Bonus',
    '300₺''ye kadar',
    '/casinos/luckyslots.png',
    'https://example.com/luckyslots',
    4,
    'active',
    FALSE,
    4.6,
    '["Slot"]'
),
(
    'GoldBet',
    'Altın değerinde kazançlar',
    '%250 Hoşgeldin',
    '2500₺''ye kadar',
    '/casinos/goldbet.png',
    'https://example.com/goldbet',
    5,
    'active',
    TRUE,
    4.9,
    '["Premium", "VIP"]'
),
(
    'MegaCasino',
    'Mega ödüller sizi bekliyor',
    '50 Freespin + %100',
    'Kombine bonus',
    '/casinos/megacasino.png',
    'https://example.com/megacasino',
    6,
    'active',
    FALSE,
    4.5,
    '["Freespin"]'
),
(
    'DiamondBet',
    'Elmas gibi parlayan fırsatlar',
    '%175 Yatırım Bonusu',
    '750₺''ye kadar',
    '/casinos/diamondbet.png',
    'https://example.com/diamondbet',
    7,
    'active',
    FALSE,
    4.7,
    '["Yeni"]'
),
(
    'VegasOnline',
    'Vegas deneyimini evine getir',
    '%300 Mega Bonus',
    '3000₺''ye kadar',
    '/casinos/vegasonline.png',
    'https://example.com/vegasonline',
    8,
    'active',
    TRUE,
    4.8,
    '["Mega", "VIP"]'
);

-- Insert Site Settings
INSERT INTO site_settings (key_name, value) VALUES 
('site_name', 'CasinoHub'),
('site_description', 'En İyi Casino Bonusları'),
('primary_color', '#d4af37'),
('secondary_color', '#1a1a1a'),
('footer_text', '© 2024 CasinoHub. Tüm hakları saklıdır.'),
('social_discord', '#'),
('social_telegram', '#'),
('social_twitch', '#'),
('social_kick', '#'),
('social_youtube', '#');

-- Insert Sample Visitors (for testing)
INSERT INTO visitors (ip, device, browser, country, page_url) VALUES 
('192.168.1.1', 'mobile', 'Chrome', 'TR', '/'),
('192.168.1.2', 'desktop', 'Firefox', 'TR', '/'),
('192.168.1.3', 'mobile', 'Safari', 'DE', '/'),
('192.168.1.4', 'desktop', 'Chrome', 'NL', '/'),
('192.168.1.5', 'mobile', 'Chrome', 'TR', '/');

-- Insert Sample Clicks (for testing)
INSERT INTO clicks (ad_id, ip, device, browser, country, referrer) VALUES 
(1, '192.168.1.1', 'mobile', 'Chrome', 'TR', 'https://google.com'),
(1, '192.168.1.2', 'desktop', 'Firefox', 'TR', 'https://google.com'),
(2, '192.168.1.3', 'mobile', 'Safari', 'DE', 'direct'),
(3, '192.168.1.4', 'desktop', 'Chrome', 'NL', 'https://bing.com'),
(5, '192.168.1.5', 'mobile', 'Chrome', 'TR', 'direct');
