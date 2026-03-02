const mysql = require("mysql2/promise");

// Production'da SSL gerekebilir (Railway, PlanetScale vb.)
const sslConfig = process.env.DB_SSL === "true" 
  ? { rejectUnauthorized: false } 
  : false;

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "affiliate_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    console.log(`📊 Host: ${process.env.DB_HOST || "localhost"}`);
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
