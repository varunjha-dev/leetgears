<div align="center">
  <img src="./public/brain-circuit.svg" alt="LeetGears Logo" width="120" height="120">
  
  # 🎨 LeetGears Frontend
  
  ### Modern DSA Learning Platform UI
  
  [![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![License](https://img.shields.io/badge/License-AGPL--3.0-red?style=for-the-badge&logo=gnu&logoColor=white)](LICENSE)

  <p align="center">
    <strong>Dynamic and responsive web interface for LeetGears, offering interactive coding challenges, AI assistance, and video solutions.</strong>
  </p>

  [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

LeetGears Frontend is a **modern React application** built with Vite, providing a seamless and interactive user experience for the competitive DSA learning platform. It integrates with the LeetGears Backend to deliver features like problem solving, AI doubt assistance, and video solutions.

### 🎪 Key Highlights

- 🚀 **Blazing Fast**: Powered by Vite for rapid development and optimized performance
- 🎨 **Sleek UI**: Designed with Tailwind CSS and DaisyUI for a modern and responsive interface
- 🧠 **AI Integration**: Seamless interaction with Google Gemini for intelligent doubt resolution
- 💻 **Interactive Editor**: Monaco Editor for a rich, in-browser coding experience
- ⚙️ **Robust State Management**: Redux Toolkit for predictable and scalable state handling
- 🔒 **Secure Authentication**: Integrates with JWT-based backend authentication
- 📱 **Fully Responsive**: Optimized for various devices and screen sizes

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration, login, and logout
- Role-based access control for admin functionalities
- Persisted user sessions

### 💻 Problem Solving & Practice
- Browse and filter a curated list of DSA problems
- Interactive code editor with multi-language support (via backend)
- Real-time code execution and submission with detailed results
- Submission history tracking

### 🤖 AI-Powered Doubt Solving
- Integrated AI chat assistant for problem-specific help
- Code review, optimization suggestions, and complexity analysis hints

### 📹 Video Solutions
- View detailed video explanations for problems
- Responsive video player powered by Vidstack

### 🧑‍💻 Admin Panel
- Create, update, and delete coding problems
- Manage video solutions (upload, delete)

### 🌓 User Experience
- Dark and Light mode toggle for personalized viewing
- Intuitive navigation and responsive design

---

## 🛠 Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | 19.x | Frontend JavaScript library |
| **Build Tool** | Vite | 7.x | Next-generation frontend tooling |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **UI Components** | DaisyUI | 5.x | Tailwind CSS component library |
| **State Management** | Redux Toolkit | 2.x | Official Redux recommended solution |
| **Routing** | React Router | 7.x | Declarative routing for React |
| **API Client** | Axios | 1.x | Promise-based HTTP client |
| **Code Editor** | Monaco Editor | 0.54.x | Browser-based code editor |
| **Video Player** | Vidstack | 1.x | Universal player for web |
| **Icons** | Lucide React | 0.x | Beautifully simple and consistent icons |
| **Form Management** | React Hook Form | 7.x | Performant, flexible and extensible forms |
| **Schema Validation** | Zod | 4.x | TypeScript-first schema declaration and validation |

---

## 🏗 Project Structure

```
frontend/
├── public/                 # Static assets (images, favicon)
├── src/                    # Main application source code
│   ├── assets/             # Images and other static files
│   ├── authSlice.js        # Redux slice for authentication
│   ├── components/         # Reusable UI components
│   │   ├── AdminDelete.jsx
│   │   ├── AdminNavbar.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── AdminProblemListForUpdate.jsx
│   │   ├── AdminUpdate.jsx
│   │   ├── AdminUpload.jsx
│   │   ├── AdminVideo.jsx
│   │   ├── AdminVideoAction.jsx
│   │   ├── ChatAi.jsx        # AI chat interface
│   │   ├── Editorial.jsx     # Problem editorial display
│   │   ├── JsonProblemForm.jsx # Form for problem creation/editing
│   │   ├── ShimmerEffect.jsx
│   │   ├── SubmissionHistory.jsx
│   │   └── ...
│   ├── pages/              # Top-level page components
│   │   ├── Admin.jsx
│   │   ├── Homepage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Premium.jsx
│   │   ├── ProblemPage.jsx   # Main problem solving interface
│   │   ├── Signup.jsx
│   │   └── ...
│   ├── store/              # Redux store configuration
│   │   └── store.js
│   ├── utils/              # Utility functions and configurations
│   │   ├── axiosClient.js  # Axios instance for API calls
│   │   └── constants.js
│   ├── App.css             # Global CSS
│   ├── App.jsx             # Main application component and routing
│   ├── index.css           # Tailwind CSS directives
│   └── main.jsx            # Entry point of the React application
├── .env.example            # Example environment variables
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This documentation file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22.x or higher
- **npm** 9.x or higher

### Installation

1.  **Clone the repository**

        git clone <repository_url>
        cd leetgears/frontend

2.  **Install dependencies**

        npm install

3.  **Configure environment variables**

        cp .env.example .env

    Edit `.env` with your backend API URL.

4.  **Run the application**

        npm run dev

    The application will be accessible at `http://localhost:5173` (default Vite port).

### Building for Production

    npm run build

This will build the application to the `dist` directory for deployment.

---

## 🧩 Components

### Pages

#### **LandingPage** (`src/pages/LandingPage.jsx`)
- Public-facing homepage for unauthenticated users
- Hero section with CTAs
- Feature showcase
- Responsive navigation

#### **Homepage** (`src/pages/Homepage.jsx`)
- Main user dashboard
- Problem list with filtering/search
- User statistics and progress
- Difficulty-based categorization

#### **ProblemPage** (`src/pages/ProblemPage.jsx`)
- Full-featured problem-solving interface
- Monaco code editor with language selection
- Run/Submit functionality
- Tabbed interface: Description, Editorial, Solutions, Submissions, AI Helper
- Real-time test case evaluation
- Resizable panels

#### **Login/Signup** (`src/pages/Login.jsx`, `src/pages/Signup.jsx`)
- Form validation with Zod
- Password strength indicators
- Remember me functionality
- Error handling and feedback

#### **Admin** (`src/pages/Admin.jsx`)
- Admin dashboard with statistics
- Quick access to CRUD operations
- Problem distribution analytics

### Components

#### **ChatAi** (`src/components/ChatAi.jsx`)
- Real-time AI chat interface
- Markdown rendering for code blocks
- Context-aware problem assistance
- Message history management

#### **Editorial** (`src/components/Editorial.jsx`)
- Vidstack video player integration
- YouTube fallback search
- Google search link for articles

#### **SubmissionHistory** (`src/components/SubmissionHistory.jsx`)
- Tabular submission history
- Status badges with icons
- Code viewer modal
- Performance metrics

#### **Admin Components**
- **AdminPanel**: Problem creation form
- **AdminUpdate**: Problem editing interface
- **AdminDelete**: Bulk deletion with search/filter
- **AdminVideo**: Video solution management
- **AdminUpload**: Cloudinary video upload
- **JsonProblemForm**: JSON-based problem editor

#### **ShimmerEffect** (`src/components/ShimmerEffect.jsx`)
- Skeleton loading animation
- Improves perceived performance

---

## 🔧 Environment Variables

Create a `.env` file in the frontend directory with the following:

    # Frontend Server Configuration
    VITE_API_BASE_URL=http://localhost:3000/api
    # Replace with your backend API URL (e.g., https://api.leetgears.com/api)

---

## 📱 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari 12+
- Android Chrome 80+

---

## ♿ Accessibility

- **WCAG 2.1 Level AA** compliant
- **Keyboard Navigation**: Full app navigable without mouse
- **Screen Reader**: ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators
- **Color Contrast**: Minimum 4.5:1 ratio

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repo and create a new branch: `git checkout -b feature/your-feature`
2.  Commit your changes: `git commit -m 'feat: add awesome frontend feature'`
3.  Push to the branch and open a Pull Request.

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

Built with: [React](https://react.dev/) • [Vite](https://vitejs.dev/) • [Tailwind CSS](https://tailwindcss.com/) • [Redux Toolkit](https://redux-toolkit.js.org/) • [Monaco Editor](https://microsoft.github.io/monaco-editor/) • [DaisyUI](https://daisyui.com/)

---

<div align="center">
  <p><strong>Made with ❤️ for the coding community</strong></p>
  <p><sub>Licensed under AGPL-3.0 | © 2025 LeetGears</sub></p>
  <p>⭐ Star us on GitHub — it motivates us to keep improving!</p>
  <p><a href="# LeetGears Frontend">⬆️ Back to Top</a></p>
</div>
