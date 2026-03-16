// src/components/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';
import { toast } from 'react-toastify';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { colors, spacing } from '../theme';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor!');
      setLoading(false);
      return;
    }

    try {
      await register(username, email, password);
      toast.success('Kayıt başarılı!', {autoClose: 2000});
      setTimeout(() => {
        navigate('/login');
      }, 100);
    } catch (error) {
      console.error("RegisterPage'de hata yakalandı:", error);
      toast.error(error.message || String(error) || 'Kayıt başarısız oldu.');
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
          maxWidth: 460,
          padding: spacing.xl,
          borderRadius: 16,
          border: `1px solid ${colors.borderSubtle}`,
          background:
            'radial-gradient(circle at top, rgba(45,212,191,0.12), transparent 55%), #020617',
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
          Yeni hesabını oluştur
        </h2>
        <p
          style={{
            margin: 0,
            marginBottom: spacing.xl,
            fontSize: '0.9rem',
            color: colors.textMuted,
          }}
        >
          Blog yazılarını yayınlamak için birkaç alanı doldurman yeterli.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            id="username"
            label="Kullanıcı adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <Input
            id="confirmPassword"
            type="password"
            label="Şifreyi onayla"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </Button>
        </form>

        <p
          style={{
            marginTop: spacing.lg,
            fontSize: '0.85rem',
            color: colors.textMuted,
          }}
        >
          Zaten hesabın var mı?{' '}
          <Link
            to="/login"
            style={{ color: colors.primary, textDecoration: 'none' }}
          >
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;