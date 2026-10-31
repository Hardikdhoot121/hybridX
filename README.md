<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Cache-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Auth-JWT%20%2B%20OAuth-orange?style=for-the-badge" alt="Auth" />
</p>

<h1 align="center">HybridX — EdTech Exam Prep & Analytics Engine</h1>

<p align="center">
  A production-grade full-stack exam preparation platform for JEE aspirants, featuring 10,000+ chapter-wise PYQs with dynamic LaTeX rendering, in-memory caching for sub-5ms auth verification, role-based access control, and real-time performance analytics.
</p>

<p align="center">
  <a href="https://hybrideducationhub.in"><strong>🔗 Live Demo → hybrideducationhub.in</strong></a>
</p>

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [System Design Decisions](#system-design-decisions)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Caching Architecture](#caching-architecture)
- [Authentication Flow](#authentication-flow)
- [Frontend Architecture](#frontend-architecture)
- [Deployment Architecture](#deployment-architecture)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                        │
│                     hybrideducationhub.in (Vercel)                  │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │  Login   │  │Dashboard │  │  PYQ     │  │  Admin Dashboard   │  │
│  │  Signup  │  │Analytics │  │  Engine  │  │  Attendance Mgmt   │  │
│  │  OAuth   │  │  Goals   │  │  KaTeX   │  │  Student Monitor   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬───────────┘  │
│       │              │             │                  │              │
│       └──────────────┴─────────────┴──────────────────┘              │
│                              │                                       │
│                    Authorization: Bearer <JWT>                       │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTPS
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    API SERVER (Node.js + Express)                     │
│                  hybridx-uhj9.onrender.com (Render)                  │
│                                                                      │
│  ┌─────────┐  ┌───────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │ Helmet  │  │ CORS (Origin  │  │Compression │  │  Passport    │  │
│  │   CSP   │  │  Whitelist)   │  │   gzip     │  │  Google SSO  │  │
│  └────┬────┘  └───────┬───────┘  └─────┬──────┘  └──────┬───────┘  │
│       └───────────────┴────────────────┴─────────────────┘           │
│                              │                                       │
│  ┌───────────────────────────▼───────────────────────────────────┐   │
│  │                     AUTH MIDDLEWARE                            │   │
│  │  JWT Verify → Redis Cache Check → MongoDB Fallback → next()   │   │
│  └───────────────────────────┬───────────────────────────────────┘   │
│                              │                                       │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌─────────────────┐    │
│  │  Auth    │  │  User    │  │ Practice  │  │   Admin         │    │
│  │ Routes   │  │ Routes   │  │  Routes   │  │   Routes        │    │
│  ├──────────┤  ├──────────┤  ├───────────┤  ├─────────────────┤    │
│  │Analytics │  │Attendance│  │  Health   │  │Role Middleware  │    │
│  │ Routes   │  │ Routes   │  │  Check    │  │authorize(admin) │    │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └────────┬────────┘    │
│       └──────────────┴─────────────┴──────────────────┘              │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                                  ▼
┌──────────────────────┐            ┌──────────────────────┐
│   MongoDB Atlas       │            │   Redis Cloud         │
│                       │            │                       │
│  Collections:         │            │  Keys:                │
│  ├─ users             │            │  ├─ user:<id>         │
│  ├─ practiceAttempts   │            │  │   TTL: 3600s       │
│  ├─ weeklyGoals        │  ◄─────── │  ├─ goal:weekly:<id>  │
│  └─ attendances        │  fallback │  │   TTL: 86400s      │
│                       │            │  └─ (Cache-Aside)     │
│  Indexes:             │            │                       │
│  ├─ users.email       │            │  Retry: Exp. Backoff  │
│  ├─ attendance        │            │  Max: 5 attempts      │
│  │  {date, classLevel}│            │  Fallback: MongoDB    │
│  └─ weeklyGoals       │            │                       │
│    {userId, weekStart}│            └──────────────────────┘
└──────────────────────┘
```

---

## System Design Decisions

### Caching Strategy — Cache-Aside (Lazy Loading)

**Problem:** Every authenticated API request required a MongoDB round-trip (`User.findById`) for token verification. At 50+ concurrent users, this translates to 50+ DB reads/second solely for auth.

**Solution:** Implemented Cache-Aside pattern with Redis Cloud (`ioredis`):

| Metric | Before (MongoDB Only) | After (Redis Cache-Aside) |
|---|---|---|
| Auth verification latency | ~180ms | **< 5ms** |
| DB reads per authenticated request | 1 | **0** (cache hit) |
| Redundant DB operations | 100% | **Reduced by ~75%** |

**Why Cache-Aside over Write-Through?**

| Strategy | Tradeoff | Why Not |
|---|---|---|
| **Cache-Aside** ✅ | Only hot data cached; stale until TTL | Perfect for read-heavy auth lookups |
| Write-Through | Cache always fresh; double-write latency | Unnecessary for semi-static profile data |
| Write-Behind | Fastest writes; risk of data loss | Unacceptable for user data integrity |

**Selective Caching:** Weekly analytics are intentionally **not cached** — they are write-sensitive (every question attempt changes the count), so a live MongoDB indexed query ensures real-time accuracy.

### Attendance Schema — Per-Day-Per-Class vs Per-User Array

**Option A (Rejected):** Store attendance as a growing array in each User document.
- Unbounded growth: 250+ entries/year per student → document bloat
- Risk of hitting MongoDB's 16MB document limit at scale

**Option B (Chosen):** One document per `{date, classLevel}` with a `studentRecords` array bounded by class size (~50):
- ~1,250 documents/year across 5 class levels × 250 working days
- ~2.5MB/year total storage — scales cleanly for years
- Compound unique index prevents duplicate entries

### Stateless JWT — Horizontal Scalability vs Instant Revocation

Chose stateless JWT (`jsonwebtoken`) over server-side sessions:
- **Advantage:** No session store dependency; any server instance can verify tokens independently
- **Tradeoff:** Cannot instantly revoke access (token valid until expiry)
- **Mitigation:** Short TTL (24h) + Redis cache invalidation on profile mutations

### Zero-Downtime Redis Fallback

Redis client is configured with exponential backoff retries (capped at 5 attempts). If Redis is unreachable:
- Auth middleware transparently falls back to MongoDB
- No user-facing errors; no service interruption
- Application works identically with or without Redis

```
Redis DOWN → retryStrategy(1) → 300ms wait → retry
           → retryStrategy(2) → 600ms wait → retry
           → retryStrategy(5) → 2000ms wait → STOP
           → All cache operations silently skip
           → MongoDB serves all requests
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite 7, React Router 7 | SPA with code-splitting |
| **Styling** | Tailwind CSS 4 | Utility-first responsive UI |
| **Math Rendering** | KaTeX | Dynamic LaTeX formula rendering for JEE questions |
| **Animations** | Framer Motion | Micro-interactions and page transitions |
| **Backend** | Node.js, Express 5 | RESTful API server |
| **Database** | MongoDB Atlas (Mongoose 9) | Primary data store |
| **Cache** | Redis Cloud (ioredis 6) | In-memory session & goal caching |
| **Auth** | JWT + Passport.js (Google OAuth 2.0) | Dual authentication pipeline |
| **Security** | Helmet, CORS whitelist, bcrypt (10 rounds) | HTTP hardening + password hashing |
| **Performance** | Compression (gzip), React.lazy + Suspense | Response compression + code splitting |
| **Deployment** | Vercel (Frontend), Render (Backend) | Edge CDN + managed Node.js |

---

## Features

### Student Features
| Feature | Description |
|---|---|
| **JEE Mains PYQ Engine** | 10,000+ chapter-wise Past Year Questions (till 2024) across Physics, Chemistry, and Maths |
| **Dual Question Types** | MCQ (multiple choice) and Integer/Numerical answer types with instant evaluation |
| **KaTeX Math Rendering** | Dynamic rendering of complex mathematical formulas using LaTeX syntax |
| **Personal Dashboard** | Profile management, weekly performance metrics, accuracy tracking |
| **Weekly Goal System** | Customizable weekly targets with visual circular progress indicator |
| **Performance Analytics** | Real-time stats: total solved, correct answers, accuracy %, MCQ vs Numerical breakdown |
| **Attendance Calendar** | Monthly calendar view with present/absent color-coded visualization |
| **DPP & Notes** | Daily Practice Problems and study material access |
| **Google SSO** | One-click sign-up/login via Google OAuth 2.0 |

### Admin Features
| Feature | Description |
|---|---|
| **Student Registry** | View all registered students with profile details |
| **Individual Student View** | Deep-dive into any student: attendance %, weekly progress, goal completion |
| **Attendance Management** | Mark attendance by date and class, view statistics |
| **Role-Based Access** | `protect` + `authorize("admin")` middleware chain on all admin endpoints |

---

## API Reference

Base URL: `https://hybridx-uhj9.onrender.com/api`

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | Public | Register new student account |
| `POST` | `/auth/login` | Public | Authenticate and receive JWT |
| `GET` | `/auth/google` | Public | Initiate Google OAuth 2.0 consent flow |
| `GET` | `/auth/google/callback` | Public | Google OAuth callback → JWT issuance |

### User Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users/profile` | `Bearer` | Fetch authenticated user's profile |
| `PUT` | `/users/profile` | `Bearer` | Update profile fields (whitelisted: name, phone, classLevel, batch, targetYear) |
| `PATCH` | `/users/complete-profile` | `Bearer` | Complete profile for Google OAuth users (phone, classLevel, batch) |

### Practice & Analytics

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/practice/attempt` | `Bearer` | Record a practice question attempt; returns updated weekly stats |
| `GET` | `/analytics/weekly` | `Bearer` | Fetch weekly analytics (totalSolved, correct, accuracy) — live from DB |
| `GET` | `/analytics/weekly-goal` | `Bearer` | Fetch current weekly goal (Redis cached, TTL: 24h) |
| `POST` | `/analytics/weekly-goal` | `Bearer` | Set/update weekly goal target; invalidates Redis cache |

### Attendance

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/attendance/save` | `Admin` | Save attendance for a date + class (upsert) |
| `GET` | `/attendance` | `Admin` | Get attendance sheet for date + class |
| `GET` | `/attendance/stats` | `Admin` | Get attendance statistics (present, absent, %) |
| `GET` | `/attendance/student` | `Bearer` | Get student's own attendance calendar data |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/students` | `Admin` | List all registered students |
| `GET` | `/admin/student/:id` | `Admin` | Detailed student profile (attendance %, weekly progress, goal) |
| `GET` | `/admin/dashboard` | `Admin` | Admin dashboard access verification |

### System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | API health check |
| `GET` | `/ping` | Public | Server liveness probe |

> **Auth Legend:** `Public` = No auth required | `Bearer` = JWT token required | `Admin` = JWT + admin role required

---

## Data Models

### User
```
{
  name:              String (required, trimmed)
  email:             String (required, unique, lowercase)
  password:          String (bcrypt hashed, optional for Google users)
  googleId:          String (null for local auth)
  authProvider:      "local" | "google"
  isProfileComplete: Boolean
  role:              "student" | "admin"
  phone:             String
  classLevel:        "9th" | "10th" | "11th" | "12th" | "Dropper"
  batch:             "Batch 1" | "Batch 2"
  targetYear:        Number
  timestamps:        { createdAt, updatedAt }
}
```

### PracticeAttempt
```
{
  userId:     ObjectId → User (required)
  questionId: String (required)
  subject:    "physics" | "chemistry" | "maths" (required)
  topic:      String (required)
  difficulty: "Easy" | "Medium" | "Hard"
  isCorrect:  Boolean (required)
  solvedAt:   Date (default: now)
  timestamps: { createdAt, updatedAt }
}
```

### WeeklyGoal
```
{
  userId:    ObjectId → User (required)
  weekStart: Date (required)
  target:    Number (required)
  timestamps: { createdAt, updatedAt }
}
Index: { userId, weekStart } — unique compound
```

### Attendance
```
{
  date:           Date (required)
  classLevel:     "9th" | "10th" | "11th" | "12th" | "Dropper"
  studentRecords: [{ studentId: ObjectId → User, isPresent: Boolean }]
  markedBy:       ObjectId → User (admin)
  timestamps:     { createdAt, updatedAt }
}
Index: { date, classLevel } — unique compound
```

---

## Caching Architecture

```
┌───────────────────────────────────────────────────────┐
│                   REQUEST FLOW                        │
│                                                       │
│  Client Request                                       │
│       │                                               │
│       ▼                                               │
│  ┌─────────────────┐                                  │
│  │  JWT Verify      │ ← Signature + Expiry check only │
│  └────────┬────────┘                                  │
│           │                                           │
│           ▼                                           │
│  ┌─────────────────┐     ┌──────────────┐             │
│  │  Redis GET       │────►│  Cache HIT   │──► req.user │
│  │  user:<id>       │     │  < 5ms       │             │
│  └────────┬────────┘     └──────────────┘             │
│           │ MISS                                      │
│           ▼                                           │
│  ┌─────────────────┐     ┌──────────────┐             │
│  │  MongoDB         │────►│  Found       │──► req.user │
│  │  findById()      │     │  + SETEX     │   + cache   │
│  │  .lean()         │     │  TTL: 3600s  │             │
│  └────────┬────────┘     └──────────────┘             │
│           │ NOT FOUND                                 │
│           ▼                                           │
│     401 Unauthorized                                  │
└───────────────────────────────────────────────────────┘

CACHE INVALIDATION TRIGGERS:
  • PUT  /users/profile        → redis.del(user:<id>)
  • PATCH /users/complete-profile → redis.del(user:<id>)
  • POST /analytics/weekly-goal  → redis.del(goal:weekly:<id>:<date>)
```

| Cache Key Pattern | TTL | Invalidation Trigger |
|---|---|---|
| `user:<userId>` | 3600s (1h) | Profile update, profile completion |
| `goal:weekly:<userId>:<dateKey>` | 86400s (24h) | Goal target change |

---

## Authentication Flow

### Local Authentication
```
Signup: Client → POST /auth/signup → bcrypt.hash(password, 10) → User.create() → 201
Login:  Client → POST /auth/login → bcrypt.compare() → jwt.sign({id, role}, secret, {expiresIn: "1d"}) → 200 + token
```

### Google OAuth 2.0
```
Client → GET /auth/google
       → Google Consent Screen
       → GET /auth/google/callback
       → Passport Strategy:
           1. Find by googleId (returning user)
           2. Find by email (link existing local account)
           3. Create new user (isProfileComplete: false)
       → jwt.sign() → Redirect to /auth/success?token=<jwt>
       → Frontend saves to localStorage
       → New user? → Redirect to /complete-profile
```

### Middleware Chain
```
Public Routes:     POST /auth/login, POST /auth/signup, GET /auth/google
Protected Routes:  protect(JWT verify → Redis/MongoDB user lookup)
Admin Routes:      protect → authorize("admin") → route handler
```

---

## Frontend Architecture

### Code Splitting Strategy

Critical path pages are eagerly loaded for instant First Contentful Paint:
```javascript
// Eager: Home, Login, Signup, AuthSuccess (< 50KB combined)
import Home from "./pages/home";
import Login from "./pages/login";
```

All feature pages use `React.lazy()` + `Suspense` for on-demand loading:
```javascript
// Lazy: Dashboard, PYQ Engine, Admin Panel, etc. (split into separate chunks)
const Dashboard = lazy(() => import("./pages/dashboard"));
const SingleQuestion = lazy(() => import("./pages/MainsPYQ"));
```

### Route Protection

| Route Type | Guard Component | Check |
|---|---|---|
| Public | None | Open access |
| Protected | `ProtectedRoute` | Token exists + profile complete |
| Admin | `AdminProtectedRoute` | Token exists + JWT payload `role === "admin"` |

---

## Deployment Architecture

```
┌─────────────────┐        ┌──────────────────┐        ┌─────────────────┐
│   Vercel CDN    │        │    Render         │        │  MongoDB Atlas  │
│                 │  HTTPS │                   │        │                 │
│  Static React   │───────►│  Node.js API      │───────►│  M0 Free Tier   │
│  Edge Network   │        │  Express Server   │        │  hybridx DB     │
│                 │        │                   │        │                 │
│  Custom Domain: │        │  Helmet + gzip    │        │  4 Collections  │
│  hybrideducation│        │  CORS Whitelist   │        │  Compound Idx   │
│  hub.in         │        │                   │        │                 │
└─────────────────┘        └────────┬──────────┘        └─────────────────┘
                                    │
                                    │
                           ┌────────▼──────────┐
                           │   Redis Cloud      │
                           │                    │
                           │  Cache-Aside       │
                           │  ioredis client    │
                           │  Exp. backoff      │
                           │  Zero-downtime     │
                           │  fallback          │
                           └────────────────────┘
```

| Service | Provider | Purpose |
|---|---|---|
| Frontend Hosting | Vercel | Edge CDN, automatic HTTPS, SPA rewrites |
| Backend Hosting | Render | Managed Node.js, auto-deploy from Git |
| Database | MongoDB Atlas | Managed cloud database (M0) |
| Cache | Redis Cloud | In-memory key-value cache |
| DNS + Domain | Custom | hybrideducationhub.in |

### Vercel Rewrites Configuration
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://hybridx-uhj9.onrender.com/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
All `/api/*` requests are proxied to the Render backend. All other routes serve the SPA `index.html` for client-side routing.

---

<p align="center">
  Built with precision for production. Designed to scale.
</p>
