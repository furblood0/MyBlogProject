// src/components/LoginPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';
import { toast } from 'react-toastify';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { colors, spacing } from '../theme';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.registrationSuccess) {
      toast.success(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    await login(email, password);
    toast.success('Giriş başarılı!', {autoClose: 2000});
    setTimeout(() => {
        navigate('/');
    }, 100);
    } catch (error) {
    console.error("LoginPage'de hata yakalandı:", error);
    toast.error(error.message || String(error) || 'Giriş başarısız oldu.');
    } finally {
    setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          padding: spacing.xl,
          borderRadius: 16,
          border: `1px solid ${colors.borderSubtle}`,
          background:
            'radial-gradient(circle at top, rgba(37,99,235,0.15), transparent 55%), #020617',
          boxShadow: '0 22px 55px rgba(15,23,42,0.9)',
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: spacing.sm,
            fontSize: '1.4rem',
          }}
        >
          Tekrar hoş geldin
        </h2>
        <p
          style={{
            margin: 0,
            marginBottom: spacing.xl,
            fontSize: '0.9rem',
            color: colors.textMuted,
          }}
        >
          Hesabına giriş yap ve yazılarını yönetmeye devam et.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            type="email"
            label="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            type="password"
            label="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>

        <p
          style={{
            marginTop: spacing.lg,
            fontSize: '0.85rem',
            color: colors.textMuted,
          }}
        >
          Hesabın yok mu?{' '}
          <Link
            to="/register"
            style={{ color: colors.primary, textDecoration: 'none' }}
          >
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;