const mysql = require("mysql2/promise");

// Database bağlantı ayarları
function getPoolConfig() {
  // Eğer DATABASE_URL veya DB_URL varsa, URL tabanlı bağlantı kullan
  const dbUrl = process.env.DATABASE_URL || process.env.DB_URL;
  
  if (dbUrl) {
    console.log("📊 URL tabanlı database bağlantısı kullanılıyor");
    return {
      uri: dbUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  }
  
  // Yoksa ayrı parametrelerle bağlan (local development)
  console.log("📊 Parametre tabanlı database bağlantısı kullanılıyor");
  const sslConfig = process.env.DB_SSL === "true" 
    ? { rejectUnauthorized: false } 
    : false;
    
  return {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "affiliate_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: sslConfig,
  };
}

const pool = mysql.createPool(getPoolConfig());

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    const dbUrl = process.env.DATABASE_URL || process.env.DB_URL;
    if (dbUrl) {
      console.log("📊 Using DATABASE_URL connection");
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
