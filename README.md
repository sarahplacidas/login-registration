# Auth Demo — Login & Registration

A simple full-stack authentication application built with **React**, **Node.js/Express**, and **PostgreSQL**.

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, React Router v6, Vite   |
| Backend  | Node.js, Express.js               |
| Database | PostgreSQL                        |
| Auth     | express-session + bcryptjs        |

---

## Features

- ✅ User Registration with name, email, and password
- ✅ User Login / Logout
- ✅ Session persists after page refresh
- ✅ Password strength indicator (Weak / Medium / Strong)
- ✅ Duplicate email detection
- ✅ Field-level and server-side validation
- ✅ Protected dashboard route

---

## Project Structure

```
Login-Registration/
├── backend/
│   ├── db/
│   │   └── schema.sql          # PostgreSQL schema
│   ├── src/
│   │   ├── config/db.js        # Database pool
│   │   ├── routes/auth.js      # Auth API routes
│   │   └── server.js           # Express app entry
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── PasswordStrengthIndicator.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Setup Instructions

### 1. PostgreSQL Database

1. Create a database named `auth_demo`:
   ```sql
   CREATE DATABASE auth_demo;
   ```
2. Run the schema:
   ```bash
   psql -U postgres -d auth_demo -f backend/db/schema.sql
   ```

### 2. Backend

```bash
cd backend

# Copy and configure environment variables
cp .env.example .env
# Edit .env — set DB_PASSWORD and SESSION_SECRET

npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/api/auth/register`        | Register new user              |
| POST   | `/api/auth/login`           | Login with email + password    |
| POST   | `/api/auth/logout`          | Destroy session                |
| GET    | `/api/auth/me`              | Get current session user       |
| POST   | `/api/auth/password-strength` | Check password strength      |
| GET    | `/api/health`               | Health check                   |

---

## QA Test Scenarios

| Scenario              | Expected Result                             |
|-----------------------|---------------------------------------------|
| Valid registration    | User created, redirected to dashboard       |
| Duplicate email       | 409 error: "Email is already registered."   |
| Weak password         | 400 error with strength feedback            |
| Password mismatch     | Client-side error, no API call              |
| Wrong login           | 401 error: "Invalid email or password."     |
| Session after refresh | User stays logged in, dashboard accessible  |
| Logout                | Session destroyed, redirected to login      |
