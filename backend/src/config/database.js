const mysql = require("mysql2/promise");

// Database bağlantı ayarları
function getPoolConfig() {
  // DATABASE_URL veya MYSQL_URL varsa, URL tabanlı bağlantı kullan
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  
  if (dbUrl) {
    console.log("📊 URL tabanlı database bağlantısı kullanılıyor");
    return dbUrl;
  }
  
  // Yoksa ayrı parametrelerle bağlan (local development)
  console.log("📊 Parametre tabanlı database bağlantısı kullanılıyor");
  return {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "affiliate_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

const pool = mysql.createPool(getPoolConfig());

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
    if (dbUrl) {
      console.log("📊 Connected via DATABASE_URL");
    } else {
      console.log(`📊 Host: ${process.env.DB_HOST || "localhost"}`);
    }
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}

async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

module.exports = {
  pool,
  query,
  testConnection,
};
