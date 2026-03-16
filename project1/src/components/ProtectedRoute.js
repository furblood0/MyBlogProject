// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from './ui/Card';
import { spacing } from '../theme';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // AuthContext henüz yükleniyorsa, bir yüklenme göstergesi döndür
  if (loading) {
    return (
      <div style={{ paddingTop: spacing.xl }}>
        <Card>Yükleniyor...</Card>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa Login sayfasına yönlendir
  if (!currentUser) {
    return <Navigate to="/login" replace />; // 'replace' mevcut geçmişi değiştirir
  }

  // Kullanıcı giriş yaptıysa, çocuk bileşenleri render et
  return children;
}

export default ProtectedRoute;