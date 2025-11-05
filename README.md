# 🚀 Social Media Dashboard

A full-stack social media application built with Node.js, Express, MongoDB, and Docker. Features user authentication, post management, and a responsive frontend interface.

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![Express](https://img.shields.io/badge/Express-5.1.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.2-green)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Docker Deployment](#-docker-deployment)
- [Database Configuration](#-database-configuration)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with password hashing (bcrypt)
- Secure login system with session management
- Protected routes requiring authentication
- Session-based authorization middleware

### 📝 Post Management
- Create, read, update, and delete posts (CRUD)
- View all posts with username association
- Filter posts by username
- View personal posts
- Character limit (500 characters)

### 👥 User Management
- User registration with email validation
- Unique username and email constraints
- List all registered users
- User profile data (username, email, age)

### 🎨 Frontend
- Responsive web interface
- Landing page
- Registration and login forms
- Dashboard with post creation
- Post editing and deletion interface
- Real-time character counter

### 🐳 Docker Support
- Fully containerized application
- Docker Compose orchestration
- Hybrid deployment (local MongoDB or MongoDB Atlas)
- Persistent data volumes
- Health checks for services
- Non-root user for security

---

## 🛠 Tech Stack

### Backend
- **Node.js** (v22.x) - JavaScript runtime
- **Express.js** (v5.1.0) - Web framework
- **MongoDB** (v8.2) - NoSQL database
- **Mongoose** (v8.19.2) - MongoDB ODM

### Authentication & Security
- **bcrypt** (v6.0.0) - Password hashing
- **express-session** (v1.18.2) - Session management
- **jsonwebtoken** (v9.0.2) - JWT tokens
- **dotenv** (v17.2.3) - Environment variables

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **nodemon** (v3.1.10) - Development auto-reload

### Additional Libraries
- **cors** (v2.8.5) - Cross-origin resource sharing
- **multer** (v2.0.2) - File upload handling
- **winston** (v3.18.3) - Logging
- **path-to-regexp** (v8.3.0) - URL pattern matching

---

## 📁 Project Structure

```
Social Media Dashboard 2/
├── app.js                      # Main application file
├── package.json                # Project dependencies
├── Dockerfile                  # Docker image configuration
├── docker-compose.yml          # Docker orchestration
├── .dockerignore              # Docker build exclusions
├── .gitignore                 # Git exclusions
├── .env.local                 # Local MongoDB configuration
├── .env.cloud                 # MongoDB Atlas configuration
├── .env.example               # Environment template
├── LICENCE                    # MIT License
├── README.md                  # This file
│
├── models/
│   └── schemas.js             # Mongoose schemas (User, Post)
│
└── public/                    # Frontend files
    ├── index.html             # Landing page
    ├── register.html          # Registration form
    ├── login.html             # Login form
    ├── dashboard.html         # Main dashboard
    ├── post.html              # Post editing page
    ├── css/
    │   └── styles.css         # Stylesheets
    └── js/
        └── handlers.js        # Frontend JavaScript
```

---

## 📦 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18+ recommended, v22+ for Docker)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for containerized deployment)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/carlos-araujo-aus/Social-Media-Dashboard.git
cd "Social Media Dashboard 2"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create the necessary `.env` files (see [Environment Configuration](#-environment-configuration))

---

## ⚙️ Environment Configuration

### Create `.env.local` (for local MongoDB with Docker)

```env
# MongoDB Local (Docker)
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/socialUsersDB?authSource=admin

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Secret (change in production!)
SESSION_SECRET=your-super-secret-session-key-min-32-chars-for-local-dev
```

### Create `.env.cloud` (for MongoDB Atlas)

```env
# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/socialUsersDB?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Secret (change in production!)
SESSION_SECRET=your-super-secret-session-key-min-32-chars-for-cloud-dev
```

### Create `.env.example` (template for documentation)

```env
# MongoDB Configuration
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/socialUsersDB?authSource=admin

# Server Configuration
PORT=3000
NODE_ENV=production

# Session Secret (CHANGE THIS IN PRODUCTION!)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production-minimum-32-characters
```

### Generate Secure SESSION_SECRET

```bash
# Using OpenSSL
openssl rand -base64 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## 🏃 Running the Application

### Option 1: Local Development (without Docker)

```bash
# 1. Make sure MongoDB is running locally or use Atlas
# 2. Copy environment configuration
cp .env.cloud .env

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

### Option 2: Production Mode (without Docker)

```bash
# 1. Copy environment configuration
cp .env.cloud .env

# 2. Start server
npm start

# 3. Open browser
# http://localhost:3000
```

---

## 🐳 Docker Deployment

### Hybrid Configuration (Local MongoDB or Atlas)

This project supports two MongoDB deployment modes:

#### 🌐 Mode 1: MongoDB Atlas (Cloud)

```bash
# 1. Copy cloud configuration
cp .env.cloud .env

# 2. Update .env with your Atlas credentials
# MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/socialUsersDB

# 3. Start only the app (MongoDB in cloud)
docker-compose up -d

# 4. View logs
docker-compose logs -f app

# 5. Open browser
# http://localhost:3000
```

#### 🐳 Mode 2: MongoDB Local (Docker)

```bash
# 1. Copy local configuration
cp .env.local .env

# 2. Start app + MongoDB (with profile)
docker-compose --profile local up -d

# 3. View logs
docker-compose logs -f

# 4. Wait ~30 seconds for MongoDB to initialize

# 5. Open browser
# http://localhost:3000
```

### Docker Commands Reference

```bash
# Build and start services
docker-compose up -d --build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app
docker-compose logs -f mongodb

# Check service status
docker-compose ps

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Restart a service
docker-compose restart app

# Execute command in container
docker-compose exec app sh
docker-compose exec mongodb mongosh -u admin -p admin123
```

### Connect to Local MongoDB with MongoDB Compass

```
mongodb://admin:admin123@localhost:27017/socialUsersDB?authSource=admin
```

**Note:** Use `localhost` (not `mongodb`) when connecting from outside Docker.

---

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/home` | Health check endpoint |
| POST | `/register` | Register new user |
| POST | `/login` | User login |

### Protected Endpoints (require authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/all-users` | Get all registered users |
| POST | `/post` | Create a new post |
| GET | `/all-posts` | Get all posts with usernames |
| GET | `/postbyusername/:username` | Get posts by specific user |
| GET | `/my-posts` | Get current user's posts |
| PUT | `/updatepost/:postid` | Update a post |
| DELETE | `/deletepost/:postid` | Delete a post |
| GET | `/logout` | Logout current user |

### API Examples

#### Register User

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepass123",
    "age": 25
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

#### Create Post (requires session cookie)

```bash
curl -X POST http://localhost:3000/post \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=YOUR_SESSION_ID" \
  -d '{
    "text": "This is my first post!"
  }'
```

---

## 🗄️ Database Configuration

### MongoDB Schemas

#### User Schema

```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  username: String (required, unique),
  age: Number (required)
}
```

#### Post Schema

```javascript
{
  userId: ObjectId (required, ref: User),
  text: String (required, max: 500 chars),
  createdAt: Date (default: Date.now)
}
```

### Database Connection

The application connects to MongoDB using the `MONGODB_URI` environment variable:

- **Local Docker:** `mongodb://admin:admin123@mongodb:27017/socialUsersDB?authSource=admin`
- **MongoDB Atlas:** `mongodb+srv://user:pass@cluster.mongodb.net/socialUsersDB`

### Data Persistence

When using Docker with local MongoDB:
- Data is persisted in Docker volumes: `mongodb_data` and `mongodb_config`
- Data survives container restarts
- Use `docker-compose down -v` to delete all data

---

## 🔒 Security

### Implemented Security Measures

- ✅ **Password Hashing:** bcrypt with 10 salt rounds
- ✅ **Session Management:** express-session with secure cookies
- ✅ **Environment Variables:** Sensitive data in `.env` files
- ✅ **Non-root Docker User:** Runs as user `nodejs` (UID 1001)
- ✅ **Input Validation:** Server-side validation for all inputs
- ✅ **Error Handling:** Global error middleware
- ✅ **CORS Configuration:** Cross-origin resource sharing
- ✅ **MongoDB Authentication:** Username/password for database

### Security Best Practices

#### For Production:

1. **Change Default Credentials:**
   ```env
   MONGO_INITDB_ROOT_USERNAME=your_secure_username
   MONGO_INITDB_ROOT_PASSWORD=your_secure_password
   ```

2. **Generate Strong SESSION_SECRET:**
   ```bash
   openssl rand -base64 64
   ```

3. **Enable HTTPS:**
   - Use reverse proxy (Nginx, Traefik)
   - Configure SSL certificates

4. **Set Secure Cookie Options:**
   ```javascript
   cookie: {
     secure: true,        // HTTPS only
     httpOnly: true,      // No JavaScript access
     sameSite: 'strict',  // CSRF protection
     maxAge: 3600000      // 1 hour
   }
   ```

5. **MongoDB Atlas IP Whitelist:**
   - Restrict access to specific IPs
   - Don't use `0.0.0.0/0` in production

6. **Rate Limiting:**
   - Implement rate limiting for API endpoints
   - Prevent brute force attacks

---

## 🎨 Frontend Pages

### Available Pages

- **`/index.html`** - Landing page with navigation
- **`/register.html`** - User registration form
- **`/login.html`** - User login form
- **`/dashboard.html`** - Main dashboard with post creation and viewing
- **`/post.html`** - Post editing interface

### Frontend Features

- Responsive design
- Form validation
- Character counter for posts (500 max)
- Real-time feedback
- Session management
- Dynamic content loading

---

## 🧪 Testing

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:3000/home

# Test registration
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456","age":25}'

# Test login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### MongoDB Verification

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# Inside mongosh:
use socialUsersDB
db.users.find().pretty()
db.posts.find().pretty()
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot connect to MongoDB"

**Solution:**
```bash
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

#### 2. "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process or change PORT in .env
PORT=3001
```

#### 3. "MONGODB_URI is not set"

**Solution:**
```bash
# Verify .env file exists
cat .env

# Copy from template
cp .env.local .env
```

#### 4. "Session secret is undefined"

**Solution:**
```bash
# Add SESSION_SECRET to .env
echo "SESSION_SECRET=$(openssl rand -base64 64)" >> .env
```

---

## 📊 Monitoring

### Health Checks

The application includes health checks for both services:

**App Health Check:**
```bash
curl http://localhost:3000/home
```

**MongoDB Health Check (inside Docker):**
```bash
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### View Resource Usage

```bash
docker stats
```

---

## 🚀 Deployment to Production

### Recommended Platforms

- **Heroku** - Easy deployment with MongoDB Atlas
- **AWS EC2** - Full control with Docker
- **DigitalOcean** - Droplets with Docker pre-installed
- **Google Cloud Run** - Serverless containers
- **Azure App Service** - Managed containers

### Production Checklist

- [ ] Change all default passwords
- [ ] Generate secure SESSION_SECRET
- [ ] Use MongoDB Atlas (not local)
- [ ] Enable HTTPS
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Configure backups
- [ ] Set up logging (Winston, Papertrail)
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set NODE_ENV=production
- [ ] Use process manager (PM2)
- [ ] Set up CI/CD pipeline

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use ES6+ syntax
- Follow Express.js best practices
- Add comments for complex logic
- Write meaningful commit messages
- Test your changes before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENCE](LICENCE) file for details.

```
Copyright (c) 2025 Carlos Araujo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👤 Author

**Carlos Araujo**

- GitHub: [@carlos-araujo-aus](https://github.com/carlos-araujo-aus)
- Repository: [Social-Media-Dashboard](https://github.com/carlos-araujo-aus/Social-Media-Dashboard)


---

## 📞 Support

If you have any questions or issues, please:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/carlos-araujo-aus/Social-Media-Dashboard/issues)
3. Create a new issue with detailed information

---

## 🗺️ Roadmap

Future enhancements planned:

- [ ] Add comments to posts
- [ ] Implement likes/reactions
- [ ] Add user profiles with avatars
- [ ] Real-time notifications (WebSockets)
- [ ] Search functionality
- [ ] Pagination for posts
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Admin dashboard
- [ ] Analytics and metrics
- [ ] API rate limiting
- [ ] Automated testing (Jest, Mocha)
- [ ] CI/CD pipeline (GitHub Actions)

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB Atlas Setup Guide](https://www.mongodb.com/docs/atlas/getting-started/)

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ by [Carlos Araujo](https://github.com/carlos-araujo-aus)

</div>
