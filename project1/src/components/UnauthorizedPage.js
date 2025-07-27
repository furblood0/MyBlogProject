import React from 'react';
import { Link } from 'react-router-dom';
import './UnauthorizedPage.css'; // Stil dosyası oluşturabilirsiniz

function UnauthorizedPage() {
  return (
    <div className="unauthorized-container">
      <h2>Erişim Reddedildi</h2>
      <p>Bu sayfaya erişim yetkiniz bulunmamaktadır veya oturumunuz sona ermiştir.</p>
      <Link to="/login" className="unauthorized-login-link">Giriş Yapmak İçin Tıklayın</Link>
      <Link to="/" className="unauthorized-home-link">Ana Sayfaya Dön</Link>
    </div>
  );
}

export default UnauthorizedPage;