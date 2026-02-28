-- Affiliate Platform Database Schema
-- Run this script to create the database and tables

-- Create Database
CREATE DATABASE IF NOT EXISTS affiliate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE affiliate_db;

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

-- Daily Stats Table (for faster analytics)
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
