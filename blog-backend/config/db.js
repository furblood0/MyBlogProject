// blog-backend/config/db.js

const sql = require('mssql'); // mssql kütüphanesini içeri aktar

// .env dosyasından veritabanı yapılandırma bilgilerini çek
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // 'localhost' veya 'your_server_name'
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Azure SQL Database için true yapın, yerel SQL Server için gerekliyse (örneğin TLS/SSL kullanıyorsanız)
    trustServerCertificate: true // Kendi kendine imzalı sertifika kullanıyorsanız true yapın (yerel geliştirme için yaygın)
  }
};

let pool; // Veritabanı bağlantı havuzunu tutacak değişken

// Veritabanı bağlantısını başlatma fonksiyonu
async function connectDB() {
  try {
    if (pool && pool.connected) {
      console.log('Veritabanı zaten bağlı.');
      return pool; // Zaten bağlıysa mevcut havuzu döndür
    }
    pool = await sql.connect(config); // Yeni bir bağlantı havuzu oluştur
    console.log('MS SQL Server\'a başarıyla bağlanıldı!');
    return pool;
  } catch (err) {
    console.error('MS SQL Server bağlantı hatası:', err);
    process.exit(1); // Bağlantı hatasında uygulamadan çık
  }
}

// Veritabanı bağlantı havuzunu dışa aktar
const getConnection = () => {
  if (!pool || !pool.connected) {
    throw new Error('Veritabanı havuzu bağlı değil. Önce connectDB() çağırılmalı.');
  }
  return pool;
};

module.exports = {
  connectDB,
  getConnection,
  sql // mssql nesnesini de dışa aktar, böylece diğer dosyalarda Request, Input vb. kullanılabilir
};