# MyBlog - Full-Stack Blog Application

A modern, full-stack blog application built with React frontend and Node.js backend, featuring user authentication, blog post management, and a responsive design.

## 🌟 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Blog Post Management**: Create, edit, delete, and publish blog posts
- **Draft System**: Save posts as drafts or publish them publicly
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean and intuitive user interface
- **Real-time Updates**: Dynamic content updates without page refresh
- **Search Functionality**: Find posts quickly with search capabilities
- **User Profiles**: Personal dashboard for managing your content

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - User-friendly notifications
- **Font Awesome** - Icon library
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt.js** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

### Database
- **Microsoft SQL Server** - Relational database
- **MSSQL** - Node.js driver for SQL Server

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Microsoft SQL Server** (Local or Azure)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/furblood0/my-blog-project.git
cd my-blog-project
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, frontend, and backend)
npm run install-all
```

### 3. Database Setup

1. **Create Database**: Create a new database named `BlogDB` in your SQL Server instance
2. **Run Schema**: Execute the `database-schema.sql` file in your SQL Server Management Studio or Azure Data Studio

```sql
-- Run the contents of database-schema.sql in your SQL Server
```

### 4. Environment Configuration

#### Backend Configuration
```bash
cd blog-backend
cp env.example .env
```

Edit `blog-backend/.env`:
```env
PORT=5000
DB_SERVER=localhost
DB_DATABASE=BlogDB
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Configuration
```bash
cd project1
cp env.example .env
```

Edit `project1/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=MyBlog
REACT_APP_VERSION=1.0.0
```

### 5. Start the Application

#### Development Mode (Both Frontend and Backend)
```bash
# From the root directory
npm run dev
```

#### Or Start Separately
```bash
# Start Backend
npm run start-backend

# Start Frontend (in a new terminal)
npm run start-frontend
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
my-blog-project/
├── blog-backend/           # Backend API
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   ├── server.js          # Main server file
│   ├── package.json
│   └── env.example        # Environment variables template
├── project1/              # Frontend React app
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   ├── package.json
│   └── env.example        # Environment variables template
├── database-schema.sql    # Database schema
├── package.json           # Root package.json
├── .gitignore
└── README.md
```

## 🔧 Available Scripts

### Root Directory
- `npm run install-all` - Install dependencies for all projects
- `npm run dev` - Start both frontend and backend in development mode
- `npm run start-backend` - Start only the backend server
- `npm run start-frontend` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run test` - Run frontend tests

### Backend Directory
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

### Frontend Directory
- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🔐 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post (authenticated)
- `PUT /api/posts/:id` - Update a post (authenticated)
- `DELETE /api/posts/:id` - Delete a post (authenticated)

### User Profile
- `GET /api/users/:id/profile` - Get user profile and posts (authenticated)

## 🧪 Testing

```bash
# Run frontend tests
cd project1
npm test

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd project1
npm run build
```

The build folder can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

### Backend Deployment
The backend can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS EC2
- Azure App Service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Furkan Fidan**
- GitHub: [@furblood0](https://github.com/furblood0)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community for the robust backend framework
- Microsoft for SQL Server
- All the open-source contributors whose libraries made this project possible

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact me directly.

---

⭐ If you found this project helpful, please give it a star on GitHub!
