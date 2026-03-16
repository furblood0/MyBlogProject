-- MyBlog Database Schema - PostgreSQL

-- CREATE DATABASE blogdb;
-- \c blogdb;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts Table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, published, archived
    published_at TIMESTAMPTZ,
    reading_time INTEGER, -- minutes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments Table (for future use)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content VARCHAR(500) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX ix_posts_user_id ON posts(user_id);
CREATE INDEX ix_posts_status_published_at ON posts(status, published_at);
CREATE INDEX ix_posts_created_at ON posts(created_at);
CREATE INDEX ix_comments_post_id ON comments(post_id);
CREATE INDEX ix_comments_user_id ON comments(user_id);

