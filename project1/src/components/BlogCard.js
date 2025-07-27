// src/components/BlogCard.js
import React from 'react';
import { Link } from 'react-router-dom'; // Link bileşenini içeri aktar
import './BlogCard.css'; // Opsiyonel: BlogCard için CSS dosyası

function BlogCard({ post }) { // post prop'unu alıyoruz
  return (
    <div className="blog-card">
      <img src={post.image} alt={post.title} className="blog-card-image" />
      <div className="blog-card-content">
        <Link to={`/posts/${post.id}`} className="blog-card-title-link">
          <h2>{post.title}</h2>
        </Link>
        <p className="blog-card-author-date">
          Yazar: {post.author} | Tarih: {post.date}
        </p>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <Link to={`/posts/${post.id}`} className="blog-card-read-more">
          Devamını Oku
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;