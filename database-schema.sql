-- MyBlog Database Schema
-- Microsoft SQL Server

-- Create Database (if not exists)
-- CREATE DATABASE BlogDB;
-- GO

-- Use Database
USE BlogDB;
GO

-- Users Table
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) UNIQUE NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
GO

-- Posts Table
CREATE TABLE Posts (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    excerpt NVARCHAR(500) NULL,
    image_url NVARCHAR(MAX) NULL,
    published BIT DEFAULT 0, -- 0 = draft, 1 = published
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
GO

-- Comments Table (for future use)
CREATE TABLE Comments (
    id INT PRIMARY KEY IDENTITY(1,1),
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content NVARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
GO

-- Indexes for better performance
CREATE INDEX IX_Posts_UserID ON Posts(user_id);
CREATE INDEX IX_Posts_Published ON Posts(published);
CREATE INDEX IX_Posts_CreatedAt ON Posts(created_at);
CREATE INDEX IX_Comments_PostID ON Comments(post_id);
CREATE INDEX IX_Comments_UserID ON Comments(user_id);
GO

-- Sample data (optional)
-- INSERT INTO Users (username, email, password_hash) VALUES 
-- ('admin', 'admin@example.com', '$2a$10$hashedpasswordhere');

-- INSERT INTO Posts (user_id, title, content, excerpt, published) VALUES 
-- (1, 'Welcome to MyBlog', 'This is the first blog post...', 'Welcome message', 1);
GO 