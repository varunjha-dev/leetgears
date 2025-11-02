<div align="center">
  <img src="./public/brain-circuit.svg" alt="LeetGears Logo" width="120" height="120">
  
  # LeetGears Backend
  
  ### Enterprise-Grade DSA Platform API
  
  [![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-5.x-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![License](https://img.shields.io/badge/License-AGPL--3.0-red?style=for-the-badge&logo=gnu&logoColor=white)](LICENSE)


  <p align="center">
    <strong>Scalable RESTful API powering LeetGears DSA platform with AI-powered doubt solving, code evaluation, and video solutions</strong>
  </p>

  [Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

LeetGears Backend is a **production-ready Node.js API** that powers a competitive DSA learning platform. Built with modern best practices, it handles user authentication, problem management, real-time code evaluation, AI-powered assistance, and video solution delivery.

### 🎪 Key Highlights

- 🚀 **High Performance**: Redis caching for optimized response times
- 🔒 **Enterprise Security**: JWT-based authentication with token blocklisting
- 🤖 **AI Integration**: Google Gemini AI for intelligent doubt resolution
- ⚡ **Real-time Evaluation**: Judge0 integration for code compilation & testing
- 📹 **Media Management**: Cloudinary CDN for video solutions
- 🏗️ **Scalable Architecture**: Modular MVC pattern with clean separation

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login with bcrypt password hashing
- JWT-based session management with httpOnly cookies
- Role-based access control (User/Admin)
- Redis-powered token blocklisting for logout
- Graceful session invalidation

### 💻 Problem Management
- CRUD operations for coding problems
- Multi-language support (JS, C++, Java)
- Visible & hidden test case management
- Reference solution verification via Judge0
- Difficulty categorization and tagging system

### ⚡ Code Submission & Evaluation
- Real-time code compilation and execution
- Judge0 integration for multi-language support
- Detailed performance metrics (runtime, memory)
- Test case validation and error reporting
- Submission history tracking

### 🤖 AI-Powered Doubt Solving
- Google Gemini 2.5 Flash integration
- Context-aware problem assistance
- Code review and optimization suggestions
- Complexity analysis and hints
- DSA-focused tutoring with safety boundaries

### 📹 Video Solution Management
- Direct-to-Cloudinary upload with signed URLs
- Video metadata storage and retrieval
- Thumbnail generation
- Secure deletion and resource management

---

## 🛠 Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | 22.x | JavaScript runtime environment |
| **Framework** | Express.js | 5.x | Fast, unopinionated web framework |
| **Database** | MongoDB | Latest | NoSQL document database |
| **ODM** | Mongoose | 8.18+ | Elegant MongoDB object modeling |
| **Cache** | Redis | 5.x | In-memory data structure store |
| **Authentication** | JWT + bcrypt | Latest | Secure token-based authentication |
| **AI Integration** | Google Gemini | 2.5 Flash | Generative AI for doubt solving |
| **Code Execution** | Judge0 API | CE | Multi-language code compilation |
| **Media CDN** | Cloudinary | Latest | Cloud-based asset management |
| **Validation** | validator.js | 13.x | String validators & sanitizers |


---

## 🏗 Architecture
    backend/
    ├── src/
    │   ├── config/                  # Configuration modules
    │   │   ├── db.js                # MongoDB connection
    │   │   └── redis.js             # Redis client setup
    │   │
    │   ├── models/                  # Mongoose schemas
    │   │   ├── user.js              # User model
    │   │   ├── problem.js           # Problem model
    │   │   ├── submission.js        # Submission model
    │   │   └── solutionVideo.js     # Video metadata model
    │   │
    │   ├── controllers/             # Business logic
    │   │   ├── userAuthent.js       # Authentication logic
    │   │   ├── userProblem.js       # Problem CRUD operations
    │   │   ├── userSubmission.js    # Code submission handling
    │   │   ├── solveDoubt.js        # AI chat integration
    │   │   └── videoSection.js      # Video upload/management
    │   │
    │   ├── routes/                  # API endpoints
    │   │   ├── userAuth.js          # Auth routes
    │   │   ├── problemCreator.js    # Problem management
    │   │   ├── submit.js            # Code submission
    │   │   ├── aichatting.js        # AI chat
    │   │   └── videoCreator.js      # Video operations
    │   │
    │   ├── middleware/              # Custom middleware
    │   │   ├── userMiddleware.js    # User authentication
    │   │   └── adminMiddleware.js   # Admin authorization
    │   │
    │   ├── utils/                   # Helper functions
    │   │   ├── validator.js         # Input validation
    │   │   └── problemUtility.js    # Judge0 integration
    │   │
    │   └── index.js                 # Application entry point
    │
    ├── .env                         # Environment variables
    ├── package.json                 # Dependencies & scripts
    └── README.md                    # This file
---
### 🔄 Request Flow

                Client Request
                      ↓
               Express Router
                      ↓
           Middleware (Auth/Validation)
                      ↓
            Controller (Business Logic)
                      ↓
           Model/External API (Data Layer)
                      ↓
              Response to Client


---

## 📑 API Documentation

This section provides a high-level overview of the API endpoints. For detailed request/response schemas, please refer to the source code in `src/routes` and `src/controllers`.

### 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Middleware |
|--------|-------------------|---------------------------------------|------------------|
| `POST` | `/register` | Register a new user | None |
| `POST` | `/login` | Authenticate a user | None |
| `POST` | `/logout` | Invalidate user's session | `userMiddleware` |
| `POST` | `/admin/register` | Register a new admin user | `adminMiddleware` |
| `DELETE` | `/deleteProfile` | Delete user's profile | `userMiddleware` |
| `GET` | `/check` | Check user's authentication status | `userMiddleware` |

### 💻 Problem Management Endpoints (`/api/problems`)

| Method | Endpoint | Description | Middleware |
|--------|-------------------------|---------------------------------------------|------------------|
| `POST` | `/create` | Create a new problem | `adminMiddleware` |
| `PUT` | `/update/:id` | Update an existing problem by ID | `adminMiddleware` |
| `DELETE` | `/delete/:id` | Delete a problem by ID | `adminMiddleware` |
| `GET` | `/problemById/:id` | Get a problem by ID | `userMiddleware` |
| `GET` | `/getAllProblem` | Get all problems | `userMiddleware` |
| `GET` | `/ProblemSolvedByUser` | Get problems solved by the authenticated user | `userMiddleware` |
| `GET` | `/submittedProblem/:pid` | Get submission details for a specific problem | `userMiddleware` |

### ⚡ Code Submission & Execution Endpoints (`/api/submit`)

| Method | Endpoint | Description | Middleware |
|--------|-------------------|---------------------------------------------|------------------|
| `POST` | `/submit/:id` | Submit code for evaluation for a problem by ID | `userMiddleware` |
| `POST` | `/run/:id` | Run code without submitting for a problem by ID | `userMiddleware` |

### 🤖 AI Chat Endpoints (`/api/ai`)

| Method | Endpoint | Description | Middleware |
|--------|---------------|-----------------------------------------|------------------|
| `POST` | `/chat` | Get AI-powered doubt assistance | `userMiddleware` |

### 📹 Video Solution Endpoints (`/api/videos`)

| Method | Endpoint | Description | Middleware |
|--------|-----------------------------------|-----------------------------------------------------|------------------|
| `GET` | `/create/:problemId` | Generate a signed URL for video upload | `adminMiddleware` |
| `POST` | `/save` | Save video metadata after successful upload | `adminMiddleware` |
| `DELETE` | `/delete/:problemId` | Delete a video solution by problem ID | `adminMiddleware` |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22.x or higher
- **MongoDB** 8.x or higher
- **Redis** 5.x or higher
- **Judge0 API** subscription
- **Google Gemini API** key
- **Cloudinary** account

### Installation

1. **Clone the repository**

        git clone <repository_url>
        cd leetgears/backend

2. **Install dependencies**

        npm install

3. **Configure environment variables**

        cp .env.example .env

        Edit .env with your credentials

4. **Start MongoDB and Redis**

        MongoDB
        mongod --dbpath /path/to/data

        Redis
        redis-server

5. **Run the application**

        Development mode
        npm run dev

        Production mode
        npm start

---

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

    Server Configuration

    PORT=3000
    NODE_ENV=development
    HOST=0.0.0.0

    Database

    DB_CONNECT_STRING=mongodb://localhost:27017/leetgears

    Or 

    MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/leetgears

    Redis Configuration

    REDIS_HOST=your-redis-host.com
    REDIS_PORT=18896
    REDIS_PASS=your-redis-password

    Authentication

    JWT_SECRET=your-super-secret-jwt-key-min-32-chars
    JWT_EXPIRES_IN=7d

    Cloudinary

    CLOUDINARY_CLOUD_NAME=your-cloud-name
    CLOUDINARY_API_KEY=your-api-key
    CLOUDINARY_API_SECRET=your-api-secret

    Judge0 API

    JUDGE0_KEY=your-judge0-api-key
    JUDGE0_BASE_URL=https://judge0-ce.p.rapidapi.com

    Google Gemini AI

    GOOGLE_GEMINI_API_KEY=your-gemini-api-key

    CORS Origins (comma-separated)

    FRONTEND_URL=http://localhost:5173,https://your-domain.com
---

### 🔑 Obtaining API Keys

| Service | Documentation |
|---------|--------------|
| **MongoDB Atlas** | [Get Started](https://www.mongodb.com/cloud/atlas/register) |
| **Redis Cloud** | [Sign Up](https://redis.com/try-free/) |
| **Judge0** | [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce) |
| **Google Gemini** | [AI Studio](https://ai.google.dev/) |
| **Cloudinary** | [Create Account](https://cloudinary.com/users/register_free) |

---

## 🤝 Contributing

Contributions welcome! Follow these steps:

1. Fork the repo and create a branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m 'feat: add amazing feature'`
3. Push and open a Pull Request

**Found a bug?** Open an [issue](https://github.com/varunjha-dev/leetgears/issues) with reproduction steps.

---

## 📄 License

Licensed under **AGPL-3.0** - you can use, modify, and distribute this code, but **must** disclose source code when running as a network service.

**Why AGPL?** Ensures improvements remain open source, even for SaaS deployments.

For commercial licensing: [varunjha.dev@gmail.com](mailto:varunjha.dev@gmail.com) | [Full License](LICENSE)

---

## 👨‍💻 Author

**Varun Jha** - Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-171515?style=flat-square&logo=github)](https://github.com/varunjha-dev) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/varunjha-dev/) [![Email](https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail)](mailto:varunjha.dev@gmail.com)

---

## 🙏 Acknowledgments

Built with: [Node.js](https://nodejs.org/) • [Express.js](https://expressjs.com/) • [MongoDB](https://www.mongodb.com/) • [Redis](https://redis.io/) • [Google Gemini](https://ai.google.dev/) • [Judge0](https://judge0.com/) • [Cloudinary](https://cloudinary.com/)

---

<div align="center">
  <p><strong>Made with ❤️ for the coding community</strong></p>
  <p><sub>Licensed under AGPL-3.0 | © 2025 LeetGears</sub></p>
  <p>⭐ Star us on GitHub — it motivates us to keep improving!</p>
  <p><a href="# LeetGears Backend">⬆️ Back to Top</a></p>
</div>
