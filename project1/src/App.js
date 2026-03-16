import React from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import HomePage from './components/HomePage';
import BlogDetailPage from './components/BlogDetailPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import CreatePostPage from './components/CreatePostPage';
import ProfilePage from './components/ProfilePage';
import NotFoundPage from './components/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';
import { colors, spacing } from './theme';

function App() {
    const { currentUser, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Auth context yüklenirken beklemeyi sağlamak için
    if (loading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: colors.background,
                    color: colors.textPrimary,
                }}
            >
                Yükleniyor...
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/login'); // Çıkış yapınca giriş sayfasına yönlendir
    };

    const isAuthPage =
        location.pathname.startsWith('/login') ||
        location.pathname.startsWith('/register');

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: colors.background,
                color: colors.textPrimary,
            }}
        >
            <header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    borderBottom: `1px solid ${colors.borderSubtle}`,
                    background: '#020617',
                    backdropFilter: 'blur(16px)',
                }}
            >
                <div
                    style={{
                        maxWidth: '1120px',
                        margin: '0 auto',
                        padding: `${spacing.md} ${spacing.xl}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: spacing.lg,
                    }}
                >
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.sm,
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.03em',
                                }}
                            >
                                MyBlog
                            </div>
                        </div>
                    </Link>

                    <nav
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.lg,
                            fontSize: '0.9rem',
                        }}
                    >
                        {currentUser ? (
                            <>
                                <Link
                                    to="/profile"
                                    style={{
                                        fontSize: '0.85rem',
                                        color: colors.textMuted,
                                    }}
                                >
                                    Profilim
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        border: 'none',
                                        background:
                                            'linear-gradient(to right, #ef4444, #b91c1c)',
                                        color: colors.textPrimary,
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        borderRadius: 9999,
                                        padding: '6px 12px',
                                        boxShadow:
                                            '0 10px 30px rgba(15,23,42,0.8)',
                                    }}
                                >
                                    Çıkış Yap
                                </button>
                            </>
                        ) : !isAuthPage ? (
                            <Link
                                to="/login"
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 9999,
                                    border: `1px solid ${colors.borderSubtle}`,
                                    backgroundColor: 'rgba(15,23,42,0.8)',
                                    fontSize: '0.85rem',
                                }}
                            >
                                Giriş Yap
                            </Link>
                        ) : null}
                    </nav>
                </div>
            </header>

            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    padding: `${spacing.xl} ${spacing.xl} 40px`,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '1120px',
                    }}
                >
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/posts/:id"
                            element={
                                <ProtectedRoute>
                                    <BlogDetailPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        <Route
                            path="/create-post"
                            element={
                                <ProtectedRoute>
                                    <CreatePostPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/edit-post/:postId"
                            element={
                                <ProtectedRoute>
                                    <CreatePostPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </main>

            <footer
                style={{
                    borderTop: `1px solid ${colors.borderSubtle}`,
                    padding: `${spacing.md} ${spacing.xl}`,
                    fontSize: '0.8rem',
                    color: colors.textMuted,
                    textAlign: 'center',
                }}
            >
                <span>&copy; 2025 MyBlog</span>
            </footer>
        </div>
    );
}

export default App;