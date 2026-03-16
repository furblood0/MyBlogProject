// blog-backend/config/db.js

const { Pool } = require('pg');

// .env dosyasından veritabanı yapılandırma bilgilerini çek
// İstersen aşağıdaki env'leri kullanabilirsin:
// DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE
const pool = new Pool({
  host: process.env.DB_HOST || process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function connectDB() {
  try {
    // Basit bir test bağlantısı yapalım
    await pool.query('SELECT 1');
    console.log('PostgreSQL\'e başarıyla bağlanıldı!');
  } catch (err) {
    console.error('PostgreSQL bağlantı hatası:', err);
    process.exit(1);
  }
}

const getPool = () => pool;

const query = (text, params) => pool.query(text, params);

module.exports = {
  connectDB,
  getPool,
  query,
};