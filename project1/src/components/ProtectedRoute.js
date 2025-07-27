// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // AuthContext henüz yükleniyorsa, bir yüklenme göstergesi döndür
  if (loading) {
    return <div>Yükleniyor...</div>; // Veya bir spinner component'i
  }

  // Kullanıcı giriş yapmamışsa Login sayfasına yönlendir
  if (!currentUser) {
    return <Navigate to="/login" replace />; // 'replace' mevcut geçmişi değiştirir
  }

  // Kullanıcı giriş yaptıysa, çocuk bileşenleri render et
  return children;
}

export default ProtectedRoute;