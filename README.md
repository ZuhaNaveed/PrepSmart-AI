# PrepSmart AI

AI-powered interview preparation platform for students and job seekers. Practice mock interviews, take category-based quizzes, solve coding challenges, and track your readiness score — all in one place.

Built with **Next.js** (frontend) and **Express + MongoDB** (backend), with **Google Gemini 1.5 Flash** for intelligent interview feedback.

---

## Features

- **AI Mock Interviews** — Role- and company-specific sessions with Gemini-powered scoring, strengths/weaknesses analysis, and model answers
- **Interactive Quizzes** — MCQ practice by category with instant results and performance stats
- **Coding Sandbox** — Browse problems, write solutions, and run simulated test cases
- **Readiness Score** — Rolling score updated after completed mock interviews
- **Saved Questions** — Bookmark interview questions for later review
- **Admin Panel** — Add quiz, interview, and coding content (admin role required)
- **User Profiles** — Manage skills, target role, and track progress

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Axios, Lucide Icons |
| Backend | Express 5, Node.js, Mongoose, JWT, bcrypt |
| AI | Google Generative AI (Gemini 1.5 Flash) |
| Database | MongoDB |
| Security | Helmet, CORS, express-rate-limit |
| Caching | Stateless in-memory cache (TTL-based) |

---

## Project Structure

```
PrepSmart-AI/
├── backend/
│   └── src/
│       ├── app.js              # Express app, middleware, routes
│       ├── server.js           # Entry point
│       ├── config/             # Database connection
│       ├── controllers/        # Request handlers
│       ├── middlewares/        # Auth & error handling
│       ├── models/             # Mongoose schemas
│       ├── repositories/       # Data access layer
│       ├── routes/             # API route definitions
│       ├── services/           # Business logic & Gemini AI
│       └── utils/              # JWT, cache, helpers
├── frontend/
│   └── src/
│       ├── app/                # Next.js App Router pages
│       ├── components/         # Shared UI components
│       └── lib/                # Axios API client
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **MongoDB** running locally or a cloud URI (Atlas, etc.)
- **Google Gemini API key** (optional — mock evaluation fallback is used if unset)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd PrepSmart-AI
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/prepsmartdb
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

The API runs at **http://localhost:5000**.

Seed sample data (optional but recommended for interviews and quizzes):

```bash
npm run seed
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:3000**.

The frontend API client is configured to call `http://localhost:5000/api`. Update `frontend/src/lib/axios.js` if your backend URL differs.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Backend server port |
| `MONGO_URI` | No | `mongodb://127.0.0.1:27017/prepsmartdb` | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret for signing JWT tokens |
| `GEMINI_API_KEY` | No | — | Google Gemini API key for AI interview feedback |
| `NODE_ENV` | No | `development` | Set to `production` to hide error stacks |

> **Note:** If MongoDB is unavailable at startup, the backend logs a warning and continues in demo mode with in-memory storage. Data will not persist across restarts in that mode.

---

## API Overview

All protected routes require a `Bearer` token in the `Authorization` header.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create a new account |
| POST | `/login` | No | Login and receive JWT |
| GET | `/profile` | Yes | Get current user profile |
| PUT | `/profile` | Yes | Update name, skills, target role |
| GET | `/users` | Admin | List all users |

### Interview — `/api/interview`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/start` | Yes | Start a mock interview session |
| POST | `/submit` | Yes | Submit an answer and get AI feedback |
| GET | `/history` | Yes | Get past interview sessions |
| GET | `/saved` | Yes | Get saved questions |
| POST | `/saved/toggle` | Yes | Save or unsave a question |

### Quiz — `/api/quiz`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get quizzes (optional `?category=`) |
| GET | `/stats` | Yes | Get quiz performance stats |
| POST | `/submit` | Yes | Submit quiz answers |
| POST | `/add-quiz` | Admin | Add a quiz question |
| POST | `/add-interview-question` | Admin | Add an interview question |
| GET | `/interview-questions` | Yes | List all interview questions |

### Coding — `/api/coding`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List coding problems |
| GET | `/:id` | Yes | Get problem details |
| POST | `/submit` | Yes | Submit code for evaluation |
| POST | `/add-problem` | Admin | Add a coding problem |

---

## Security

The backend applies the following middleware globally:

- **Helmet** — Sets secure HTTP response headers
- **CORS** — Enables cross-origin requests from the frontend
- **Rate limiting** — 100 requests per IP per 15 minutes on all `/api/*` routes

Authentication uses **JWT** (7-day expiry) with **bcrypt**-hashed passwords.

---

## Caching

Read-heavy endpoints use a **stateless in-memory cache** with TTL:

- Quiz lists — cached for 10 minutes per category
- Coding problem lists — cached for 10 minutes

Cache entries are automatically invalidated when admins add new quiz or coding content.

---

## Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login`, `/register` | Authentication |
| `/dashboard` | Overview, stats, and quick actions |
| `/mock-interview` | AI mock interview flow |
| `/quizzes` | Category-based quiz practice |
| `/coding-practice` | Coding problems and sandbox |
| `/profile` | User profile management |
| `/saved-questions` | Bookmarked interview questions |
| `/admin` | Content management (admin only) |
| `/feedback` | Feedback page |

---

## Scripts

### Backend (`backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run seed` | Seed database with sample data |

### Frontend (`frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Architecture

```
┌─────────────┐     JWT + REST      ┌──────────────────────────────────┐
│   Next.js   │ ◄─────────────────► │         Express Backend          │
│  Frontend   │                     │  Routes → Controllers → Services  │
└─────────────┘                     │         ↓              ↓           │
                                    │   Repositories    In-Memory Cache  │
                                    │         ↓                          │
                                    │      MongoDB        Gemini AI      │
                                    └──────────────────────────────────┘
```

The backend follows a layered architecture: **Routes → Controllers → Services → Repositories → Models**, keeping HTTP handling, business logic, and data access separated.

---

## Author

**Zuha Naveed**

---

## License

ISC
