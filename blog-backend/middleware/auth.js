// blog-backend/middleware/auth.js

require('dotenv').config(); // <-- BU SATIRI EKLE! .env dosyasını yükler.
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Header'dan token'ı al
  const token = req.header('x-auth-token'); // Genellikle token bu header'da gönderilir

  // Token yoksa hata döndür
  if (!token) {
    return res.status(401).json({ message: 'Yetkilendirme reddedildi, token yok.' });
  }

  try {
    // Token'ı doğrula
    // process.env.JWT_SECRET artık doğru değeri içerecektir
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token'dan gelen kullanıcı bilgisini req objesine ekle
    // Not: Token'a 'user' objesini koyuyorsanız bu doğru,
    // aksi halde 'decoded.id' veya başka bir field kullanmanız gerekebilir.
    req.user = decoded.user;
    next(); // Sonraki middleware veya route handler'a geç
  } catch (err) {
    // Token geçersizse hata döndür
    // Hatanın tipine göre daha spesifik mesajlar verebilirsiniz (örn. jwt.TokenExpiredError)
    res.status(401).json({ message: 'Token geçerli değil.' });
  }
}

module.exports = auth;