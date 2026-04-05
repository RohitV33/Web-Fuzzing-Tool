# VulnScan — Full-Stack Web Fuzzing Tool

> Advanced web security testing platform — React 19 frontend + Node.js/Express backend + MongoDB

![Version](https://img.shields.io/badge/version-2.0.0-22c55e?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-7-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Project Structure

```
vulnscan-fullstack/
├── frontend/                   # React 19 + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Responsive nav with auth state
│   │   │   ├── MatrixRain.jsx      # Animated matrix background
│   │   │   ├── ScrollToTop.jsx     # Scroll-to-top button
│   │   │   └── ProtectedRoute.jsx  # Auth guard for routes
│   │   ├── hooks/
│   │   │   ├── useAuth.jsx         # Auth context + JWT management
│   │   │   ├── useFuzzer.js        # Fuzzer: backend API + simulation fallback
│   │   │   ├── useScrollReveal.js  # Intersection observer reveal
│   │   │   └── useCounter.js       # Animated stat counters
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Public marketing page
│   │   │   ├── AuthPage.jsx        # Login / Register
│   │   │   ├── Dashboard.jsx       # Stats, charts, recent scans
│   │   │   ├── Scanner.jsx         # Live fuzzing UI
│   │   │   ├── Reports.jsx         # Vulnerability reports + export
│   │   │   └── About.jsx           # Project documentation
│   │   ├── data/payloads.js        # Wordlists and payload collections
│   │   ├── utils/api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx                 # Router + AuthProvider
│   │   └── index.css               # Tailwind + all custom cyber styles
│   ├── vite.config.js              # Vite + proxy to :5000
│   └── package.json
│
├── backend/                    # Node.js + Express
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── payloads.js         # Wordlists + vuln payloads
│   ├── models/
│   │   ├── User.js             # User schema (bcrypt, JWT)
│   │   ├── Scan.js             # Scan document with results
│   │   └── Report.js           # Report with findings + severity
│   ├── controllers/
│   │   ├── authController.js   # Register, login, getMe
│   │   ├── scanController.js   # Start scan, poll status, stop
│   │   ├── reportController.js # List, get, export, delete
│   │   ├── statsController.js  # Dashboard aggregation
│   │   └── wordlistController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── errorHandler.js     # Global error handler
│   ├── routes/
│   │   ├── auth.js
│   │   ├── scans.js
│   │   ├── reports.js
│   │   ├── wordlists.js
│   │   └── stats.js
│   ├── services/
│   │   └── fuzzerEngine.js     # Real HTTP fuzzing with axios
│   ├── .env                    # Environment variables
│   └── server.js               # Express app entry point
│
├── package.json                # Root — concurrently dev script
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Install all dependencies
```bash
npm run install:all
```
Or manually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment
Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vulnscan
JWT_SECRET=your_secret_here_change_in_production
CLIENT_URL=http://localhost:5173
```

### 3. Start development (both servers)
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

Or start individually:
```bash
npm run dev:frontend   # React app only
npm run dev:backend    # Node.js API only
```

### 4. Demo mode (no backend needed)
The frontend works standalone with a simulation engine — just open the Scanner without logging in.

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in, get JWT |
| GET  | `/api/auth/me` | Get current user |
| PUT  | `/api/auth/me` | Update profile |

### Scans
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scans` | Start a new scan |
| GET  | `/api/scans` | List user's scans |
| GET  | `/api/scans/:id` | Get scan + results |
| GET  | `/api/scans/:id/status` | Poll scan progress |
| POST | `/api/scans/:id/stop` | Abort running scan |
| DELETE | `/api/scans/:id` | Delete scan |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/reports` | List reports |
| GET  | `/api/reports/:id` | Get full report |
| GET  | `/api/reports/:id/export?format=json\|csv` | Export report |
| DELETE | `/api/reports/:id` | Delete report |

### Stats & Wordlists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/stats/dashboard` | Dashboard aggregation |
| GET  | `/api/wordlists` | List available wordlists |
| GET  | `/api/wordlists/:key` | Get wordlist entries |
| GET  | `/api/health` | Server health check |

---

## How It Works

### Scan Flow
1. Frontend calls `POST /api/scans` with target config
2. Backend saves scan document, responds immediately with `scanId`
3. Fuzzing engine runs **asynchronously** using real HTTP requests via `axios`
4. Frontend polls `GET /api/scans/:id/status` every 2 seconds
5. Results saved incrementally to MongoDB
6. On completion, **report is auto-generated** if vulnerabilities found
7. Frontend fetches full results from `GET /api/scans/:id`

### Vulnerability Detection
The engine detects:
- **SQL Injection** — error-based, union-based, time-based
- **XSS** — reflected XSS via payload echo detection
- **LFI** — passwd file content in response
- **RFI** — remote URL inclusion
- **SSRF** — localhost/metadata endpoint access
- **Command Injection** — OS command output in response
- **Sensitive File Exposure** — .env, .git, .bak accessible
- **Error Disclosure** — stack traces in 500 responses
- **Admin Panel Exposure** — /admin, /dashboard accessible

### Fallback Simulation
If the backend is unavailable (not logged in, or server offline), the frontend falls back to an **offline simulation engine** that generates realistic fake results — ideal for demos and development.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Axios |
| Routing | React Router 7 |
| Backend | Node.js + Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| HTTP Scanning | Axios (server-side) |
| Security | Helmet, CORS, Rate Limiting |

---

## Security Notes

> **For authorized security testing only.**
> Never use this tool against systems you do not have explicit written permission to test.
> The authors are not responsible for any misuse.

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Rate limiting: 100 requests per 15 minutes per IP
- All scan results are user-scoped (no cross-user data access)
- Backend fuzzing uses real HTTP — only target systems you own

---

## Build for Production

```bash
# Build frontend
npm run build

# Start backend in production
cd backend && NODE_ENV=production npm start
```

Serve the `frontend/dist` folder via nginx or any static host, pointing API requests to your Node.js server.

---

## Author
Built by [@RohitV33](https://github.com/RohitV33) · MIT License
