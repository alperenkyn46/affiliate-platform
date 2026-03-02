-- Railway Database Setup
-- Database: railway (Railway tarafından otomatik oluşturuldu)

-- Ads Table
CREATE TABLE IF NOT EXISTS ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    bonus VARCHAR(255),
    bonus_details VARCHAR(255),
    image VARCHAR(500),
    link VARCHAR(1000) NOT NULL,
    position INT DEFAULT 999,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(2,1) DEFAULT 0,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_position (position),
    INDEX idx_featured (featured)
) ENGINE=InnoDB;

-- Clicks Table
CREATE TABLE IF NOT EXISTS clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    ip VARCHAR(45),
    device VARCHAR(50),
    browser VARCHAR(100),
    country VARCHAR(10),
    referrer VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    INDEX idx_ad_id (ad_id),
    INDEX idx_created_at (created_at),
    INDEX idx_country (country)
) ENGINE=InnoDB;

-- Visitors Table
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(45),
    device VARCHAR(50),
    browser VARCHAR(100),
    country VARCHAR(10),
    page_url VARCHAR(500),
    session_duration INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_device (device),
    INDEX idx_country (country)
) ENGINE=InnoDB;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin', 'super_admin', 'editor') DEFAULT 'admin',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (key_name)
) ENGINE=InnoDB;

-- Daily Stats Table
CREATE TABLE IF NOT EXISTS daily_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_visitors INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    total_clicks INT DEFAULT 0,
    mobile_visitors INT DEFAULT 0,
    desktop_visitors INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (date)
) ENGINE=InnoDB;

-- =============================================
-- SEED DATA
-- =============================================

-- Insert Admin User (password: admin123)
INSERT INTO admin_users (username, password, email, role) VALUES 
('admin', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDuy0Bx8MxeO', 'admin@casinohub.com', 'admin');

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

-- Verify tables created
SHOW TABLES;
SELECT COUNT(*) as ad_count FROM ads;
SELECT COUNT(*) as admin_count FROM admin_users;
