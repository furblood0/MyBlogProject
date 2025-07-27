// src/components/HomePage.js (Güncellenmiş Hali)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postService from '../services/post.service'; // postService'i içeri aktar
import './HomePage.css'; // Stil dosyası

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message || 'Yazılar yüklenirken bir hata oluştu.');
        console.error('Yazıları getirme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // [] sayesinde component ilk yüklendiğinde bir kere çalışır

  if (loading) {
    return <div className="loading-message">Yazılar yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">Hata: {error}</div>;
  }

  return (
    <div className="home-page-container">
      <h2>Blog Yazıları</h2>
      {posts.length === 0 ? (
        <p className="no-posts-message">Henüz hiç yayınlanmış yazı yok. İlk yazınızı oluşturmak ister misiniz?</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              {post.image_url && (
                <img src={post.image_url} alt={post.title} className="post-card-image" />
              )}
              <div className="post-card-content">
                <Link to={`/posts/${post.id}`} className="post-card-title">
                  <h3>{post.title}</h3>
                </Link>
                <p className="post-card-excerpt">
                  {post.excerpt || post.content.substring(0, 150) + '...'}
                </p>
                <p className="post-card-meta">
                  Yazar: <span className="author-name">{post.authorUsername}</span>{' '}
                  <span className="post-date">
                    ({new Date(post.created_at).toLocaleDateString()})
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;