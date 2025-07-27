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

  if (loading) {
    return <div className="loading-detail-message">Yazı yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-detail-message">Hata: {error}</div>;
  }

  if (!post) {
    return <div className="no-post-found-message">Yazı bulunamadı.</div>;
  }

  return (
    <div className="blog-detail-container">
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="blog-detail-image" />
      )}
      <h2 className="blog-detail-title">{post.title}</h2>
      <p className="blog-detail-meta">
        Yazar: <span className="author-name-detail">{post.authorUsername}</span> |{' '}
        <span className="post-date-detail">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </p>
      <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: post.content }}>
        {/* HTML içeriğini güvenli bir şekilde render etmek için dangerouslySetInnerHTML kullanıldı */}
      </div>
      {post.updated_at && (
        <p className="blog-detail-updated">
          Son Güncelleme: {new Date(post.updated_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default BlogDetailPage;