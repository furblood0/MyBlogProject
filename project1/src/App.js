import React from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import HomePage from './components/HomePage';
import BlogDetailPage from './components/BlogDetailPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import CreatePostPage from './components/CreatePostPage';
import ProfilePage from './components/ProfilePage';
import NotFoundPage from './components/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage'; // Bu satırı yorum satırı yapın veya silin, çünkü dosya yok

function App() {
    const { currentUser, logout, loading } = useAuth();
    const navigate = useNavigate();

    // Auth context yüklenirken beklemeyi sağlamak için
    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    const handleLogout = () => {
        logout();
        navigate('/login'); // Çıkış yapınca giriş sayfasına yönlendir
    };

    return (
        <div className="App">
            <header className="App-header-nav">
                <h1>
                    <Link to="/" className="app-title-link">MyBlog</Link>
                </h1>
                <nav>
                    <Link to="/">Ana Sayfa</Link>
                    {!currentUser ? (
                        <>
                            {' '} | <Link to="/login">Giriş</Link> | <Link to="/register">Kayıt Ol</Link>
                        </>
                    ) : (
                        <>
                            {' '} | <Link to="/create-post">Yazı Oluştur</Link> |{' '}
                            <Link to="/profile">Profilim</Link> |{' '}
                            <button onClick={handleLogout} className="logout-button">Çıkış Yap</button>
                        </>
                    )}
                </nav>
            </header>

            <main className="App-main-content">
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } />

                    <Route path="/posts/:id" element={
                        <ProtectedRoute>
                            <BlogDetailPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/create-post" element={
                        <ProtectedRoute>
                            <CreatePostPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit-post/:postId" element={
                        <ProtectedRoute>
                            <CreatePostPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />

                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>

            <footer className="App-footer">
                <p>&copy; 2025 MyBlog</p>
            </footer>
        </div>
    );
}

export default App;