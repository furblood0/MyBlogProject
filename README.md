# My Personal Blog Application (Full-Stack)

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

This project is a personal full-stack blog application developed as a learning initiative to gain practical experience with modern web development frameworks and technologies. It allows users to register, create, and manage their own blog posts. Users have the flexibility to publish their posts publicly for everyone to see, or keep them private as a personal journal.

The application demonstrates key functionalities of a modern web platform, including secure user authentication, robust content management, and dynamic user interaction. This project was a significant part of my summer internship, showcasing my ability to build a complete web application from concept to execution.

## Features

* **User Authentication:** Secure registration and login functionalities for users.
* **Personalized Dashboards:** Authenticated users can access their own dashboard to manage their posts.
* **Blog Post Creation:** Users can create new blog posts with titles and content.
* **Post Editing & Deletion:** Users have full control to edit or delete their own blog posts.
* **Public/Private Posts:** Option to mark posts as public (visible to all) or private (visible only to the author).
* **View All Public Posts:** Non-authenticated and authenticated users can browse all publicly available blog posts.
* **Search Functionality:** Ability to search for specific blog posts by keywords.
* **Commenting System:** Users can add comments to public blog posts.
* **Responsive Design:** User interface adapts to various screen sizes (desktop, tablet, mobile).

## Technologies Used

This project leverages a modern full-stack architecture with a focus on JavaScript-based technologies.

### Frontend
* **React:** A powerful JavaScript library for building dynamic and interactive user interfaces.
* **React Router DOM:** For handling declarative routing within the single-page application.
* **Axios:** A promise-based HTTP client for making API requests to the backend.
* **React Toastify:** For elegant and user-friendly notification messages.
* **Font Awesome:** For scalable vector icons, enhancing the UI/UX.
* **React Testing Library & Jest:** For unit and integration testing of React components.

### Backend
* **Node.js:** The JavaScript runtime environment.
* **Express.js:** A fast, minimalist web framework for building the RESTful API.
* **Bcrypt.js:** For secure password hashing and comparison.
* **JSON Web Tokens (JWT):** For implementing stateless authentication and authorization.
* **CORS:** Middleware for enabling Cross-Origin Resource Sharing.
* **Dotenv:** For managing environment variables securely.

### Database
* **Microsoft SQL Server:** A robust relational database management system used for storing user data, blog posts, and comments.
    * **mssql:** Node.js driver for connecting to SQL Server.

## System Architecture

The application follows a **Client-Server Architecture**.

* **Client-Side (Frontend):** Developed with React, it provides the interactive user interface and handles user interactions. It communicates with the backend via RESTful API calls.
* **Server-Side (Backend):** Built with Node.js and Express.js, it manages the application's business logic, handles API requests from the frontend, performs data processing, and interacts with the database.
* **Database:** Microsoft SQL Server serves as the persistent storage for all application data, including user accounts, blog post content, and comments.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
* Node.js (LTS version recommended)
* npm (comes with Node.js) or Yarn
* Microsoft SQL Server (or access to an existing instance)
* SQL Server Management Studio (SSMS) or Azure Data Studio for database management (optional but recommended)

### Installation

1.  **Clone the repositories:**
    ```bash
    git clone [https://github.com/your-username/your-blog-frontend.git](https://github.com/your-username/your-blog-frontend.git)
    git clone [https://github.com/your-username/your-blog-backend.git](https://github.com/your-username/your-blog-backend.git)
    ```

2.  **Frontend Setup:**
    ```bash
    cd your-blog-frontend
    npm install # or yarn install
    ```

3.  **Backend Setup:**
    ```bash
    cd ../your-blog-backend
    npm install # or yarn install
    ```

4.  **Database Setup:**
    * Create a new database in your Microsoft SQL Server instance (e.g., `BlogDB`).
    * Create the necessary tables (Users, Posts, Comments) with appropriate columns and relationships.
    * **Example Schema (simplified):**
        ```sql
        CREATE TABLE Users (
            UserId INT PRIMARY KEY IDENTITY(1,1),
            Username NVARCHAR(50) UNIQUE NOT NULL,
            Email NVARCHAR(100) UNIQUE NOT NULL,
            PasswordHash NVARCHAR(255) NOT NULL,
            CreatedAt DATETIME DEFAULT GETDATE()
        );

        CREATE TABLE Posts (
            PostId INT PRIMARY KEY IDENTITY(1,1),
            AuthorId INT FOREIGN KEY REFERENCES Users(UserId),
            Title NVARCHAR(255) NOT NULL,
            Content NVARCHAR(MAX) NOT NULL,
            IsPublic BIT DEFAULT 1, -- 1 for public, 0 for private
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
        );

        CREATE TABLE Comments (
            CommentId INT PRIMARY KEY IDENTITY(1,1),
            PostId INT FOREIGN KEY REFERENCES Posts(PostId),
            AuthorId INT FOREIGN KEY REFERENCES Users(UserId),
            Content NVARCHAR(500) NOT NULL,
            CreatedAt DATETIME DEFAULT GETDATE()
        );
        ```

5.  **Environment Variables (`.env` files):**
    * In the `your-blog-backend` directory, create a `.env` file with the following content:
        ```
        PORT=5000
        DB_SERVER=your_sql_server_name # e.g., localhost or (localdb)\MSSQLLocalDB
        DB_DATABASE=BlogDB
        DB_USER=your_sql_username
        DB_PASSWORD=your_sql_password
        JWT_SECRET=your_super_secret_jwt_key_here # Choose a strong, random string
        ```
    * In the `your-blog-frontend` directory, create a `.env` file with the following content:
        ```
        REACT_APP_API_URL=http://localhost:5000/api
        ```
        *(Adjust `PORT` and `REACT_APP_API_URL` if you use a different port for your backend.)*

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd your-blog-backend
    npm start # or node server.js if your script is named that
    ```
    The backend server should start on the port specified in your `.env` file (default: 5000).

2.  **Start the Frontend Development Server:**
    ```bash
    cd ../your-blog-frontend
    npm start
    ```
    The frontend application will open in your default browser, usually at `http://localhost:3000`.

## Testing

The frontend includes automated unit and integration tests written with **React Testing Library** and **Jest**.

To run the frontend tests:
```bash
cd your-blog-frontend
npm test