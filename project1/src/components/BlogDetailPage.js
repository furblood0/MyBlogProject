// src/components/BlogDetailPage.js (Güncellenmiş Hali)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // URL'den ID almak için
import postService from '../services/post.service'; // postService'i içeri aktar
import './BlogDetailPage.css'; // Stil dosyası

function BlogDetailPage() {
  const { id } = useParams(); // URL'den blog yazısının ID'sini al
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err.message || 'Yazı yüklenirken bir hata oluştu.');
        console.error('Yazı detayını getirme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]); // id değiştiğinde tekrar çalıştır

  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  if (loading) {
    return <div className="blog-detail-status">Yazı yükleniyor...</div>;
  }

  if (error) {
    return <div className="blog-detail-status blog-detail-status-error">Hata: {error}</div>;
  }

  if (!post) {
    return <div className="blog-detail-status">Yazı bulunamadı.</div>;
  }

  return (
    <article className="blog-detail-container">
      {post.image_url && (
        <div className="blog-detail-hero">
          <img
            src={resolveImageUrl(post.image_url)}
            alt={post.title}
            className="blog-detail-image"
          />
        </div>
      )}
      <header className="blog-detail-header">
        <h1 className="blog-detail-title">{post.title}</h1>
        <p className="blog-detail-meta">
          <span className="author-name-detail">
            {post.authorUsername || 'Bilinmeyen yazar'}
          </span>
          <span className="post-date-detail">
            {new Date(post.published_at || post.created_at).toLocaleDateString()}
          </span>
        </p>
      </header>
      <section className="blog-detail-content">
        {post.content}
      </section>
      {post.updated_at && (
        <footer className="blog-detail-updated">
          Son Güncelleme: {new Date(post.updated_at).toLocaleDateString()}
        </footer>
      )}
    </article>
  );
}

export default BlogDetailPage;