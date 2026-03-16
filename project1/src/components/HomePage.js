// src/components/HomePage.js (Güncellenmiş Hali)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import postService from '../services/post.service'; // postService'i içeri aktar
import './HomePage.css'; // Stil dosyası
import { Card } from './ui/Card';
import { colors, spacing } from '../theme';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    return (
      <div style={{ paddingTop: spacing.xl }}>
        <Card>
          <div>Yazılar yükleniyor...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: spacing.xl }}>
        <Card
          style={{
            borderColor: colors.danger,
            background: colors.dangerSoft,
          }}
        >
          <div>Hata: {error}</div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: spacing.xl }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: spacing.lg,
        }}
      >
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: spacing.lg,
        }}
      >
        {/* Yeni yazı oluşturma kartı */}
        <Card
          style={{
            padding: 0,
            height: 260,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/create-post')}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'radial-gradient(circle at top, rgba(37,99,235,0.4), transparent 55%)',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: `1px dashed ${colors.borderSubtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
              }}
            >
              +
            </div>
          </div>
          <div
            style={{
              padding: spacing.md,
              borderTop: `1px solid ${colors.borderSubtle}`,
            }}
          >
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              Yeni yazı oluştur
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: colors.textMuted,
              }}
            >
              Fikrini hızlıca taslak olarak kaydet ve hazır olduğunda
              yayınla.
            </div>
          </div>
        </Card>

        {/* Yazı kartları */}
        {posts.map((post) => {
          const displayDate = new Date(
            post.published_at || post.created_at,
          ).toLocaleDateString();
          const teaser =
            post.excerpt ||
            (post.content || '').replace(/\s+/g, ' ').substring(0, 120) +
              (post.content && post.content.length > 120 ? '…' : '');

          return (
            <Card
              key={post.id}
              style={{
                padding: 0,
                height: 260,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {post.image_url && (
                <div
                  style={{
                    height: 130,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={resolveImageUrl(post.image_url)}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  flex: 1,
                  padding: spacing.md,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Link
                  to={`/posts/${post.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: spacing.xs,
                      fontSize: '1rem',
                    }}
                  >
                    {post.title}
                  </h3>
                </Link>
                <p
                  style={{
                    margin: 0,
                    marginBottom: spacing.sm,
                    fontSize: '0.85rem',
                    color: colors.textMuted,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {teaser}
                </p>
                <div
                  style={{
                    marginTop: 'auto',
                    fontSize: '0.8rem',
                    color: colors.textMuted,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>
                    {post.authorUsername && (
                      <>
                        {post.authorUsername}
                        {' · '}
                      </>
                    )}
                    {displayDate}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;