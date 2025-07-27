// src/components/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // Opsiyonel: Stil dosyası

function NotFoundPage() {
  return (
    <div className="not-found-page-container">
      <h1>404</h1>
      <h2>Sayfa Bulunamadı!</h2>
      <p>Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <Link to="/" className="not-found-home-link">Ana Sayfaya Geri Dön</Link>
    </div>
  );
}

export default NotFoundPage;