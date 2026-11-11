# CM-PGRP Kerala: Setup, Deployment & Testing Guide
**Chief Minister's Public Grievance Redressal Portal**
*Installation, Configuration, Automated Testing & Evaluator Credentials*

---

## 1. System Requirements & Prerequisites
- **Node.js:** v18.0.0 or higher (Tested and fully compatible on Node v20.x, v22.x, and v23.11.0).
- **Package Manager:** `npm` (v9.x or higher) or `pnpm` / `yarn`.
- **Operating System:** Windows, macOS, or Linux (cross-platform compatible).
- **Database Engine:** Embedded SQLite3 via `better-sqlite3` (Zero external database server installation required).

---

## 2. Fast Installation & Setup

### Option A: One-Command Setup (From Repository Root)
```bash
# 1. Install all dependencies, seed realistic sample data, and build client
npm run setup

# 2. Start the unified production server (serves API + React frontend on port 5000)
npm start
```
Visit **`http://localhost:5000`** in your browser.

---

### Option B: Step-by-Step Setup

#### Step 1: Clone the Repository
```bash
git clone <GITHUB_REPOSITORY_URL>
cd CM-PGRP
```

#### Step 2: Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
Default configuration values in `server/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=kerala_cmo_secret_key_2026_super_secure
CORS_ORIGIN=http://localhost:5173
DATABASE_PATH=./data/cm_pgrp.sqlite
UPLOAD_DIR=./uploads

# Optional: Add your Google Gemini API key if available
GEMINI_API_KEY=
```
*(Note: If `GEMINI_API_KEY` is left blank, the portal automatically operates using the built-in labelled intelligent offline NLP fallback engine with zero loss of functionality).*

#### Step 3: Install Backend Dependencies & Seed Database
```bash
cd server
npm install
npm run seed
```

#### Step 4: Install Frontend Dependencies & Run
```bash
cd ../client
npm install
npm run dev
```
The React frontend starts at **`http://localhost:5173`** and proxies API calls to the backend on port 5000.

---

## 3. Demo Credentials for Evaluators

For convenience, the login page (`/login`) includes **1-Click Demo Fillers** that automatically populate these test accounts:

| Role | Name | Email | Password | Scope & Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Ananya Nair | `citizen@kerala.gov.in` | `Password@123` | Submit grievances, view dashboard, rate resolution, reopen complaint. |
| **CMO Administrator** | Shri. K. Narayanan (Principal Secy) | `cmo.admin@kerala.gov.in` | `Password@123` | Master administrative desk, forward to departments, escalate, view 14-district analytics. |
| **PWD Officer** | Er. Rajesh Kumar (Exec Engineer) | `pwd.officer@kerala.gov.in` | `Password@123` | View PWD road grievances, update progress, submit Action Taken Report (ATR). |
| **KWA Water Officer** | Er. Mini Varghese (Asst Exec Engineer) | `kwa.officer@kerala.gov.in` | `Password@123` | View Kerala Water Authority pipeline grievances, submit ATR. |
| **Health Officer** | Dr. Sujatha Pillai (District Medical Officer) | `health.officer@kerala.gov.in` | `Password@123` | View Hospital & Medical facility petitions. |

---

## 4. Automated Integration Test Suite

The backend includes a comprehensive automated test suite testing the complete grievance lifecycle:

### Running the Tests
```bash
cd server
npm test
```

### Verified Test Cases Matrix (16 / 16 Passing)
| # | Test Scenario | Method / Route | Expected Result |
| :--- | :--- | :--- | :--- |
| 1 | Health Check Endpoint | `GET /api/health` | Returns `200 OK` with portal name and state. |
| 2 | Retrieve Departments List | `GET /api/departments` | Returns `200 OK` with 10+ Kerala departments. |
| 3 | Citizen Login | `POST /api/auth/login` | Authenticates citizen and issues JWT token. |
| 4 | CMO Admin Login | `POST /api/auth/login` | Authenticates administrator with `cmo_admin` role. |
| 5 | Officer Login (PWD) | `POST /api/auth/login` | Authenticates departmental officer with `officer` role. |
| 6 | AI Grievance Assistant Analysis | `POST /api/ai/analyze` | Returns department (`KSEB`), priority (`High`), and summary. |
| 7 | Submit Grievance with AI Triage | `POST /api/grievances` | Creates grievance, generates `KL-CMO-2026-XXXXX` ref ID. |
| 8 | Public Tracking by Reference ID | `GET /api/grievances/track/:ref` | Returns status, department, and timeline history. |
| 9 | CMO Admin Reviews & Forwards | `POST /api/grievances/:id/forward` | Routes grievance to department with admin remarks. |
| 10 | Officer Updates Status to In Progress | `PATCH /api/grievances/:id/status` | Transitions status to `In Progress` with field remarks. |
| 11 | Submit Action Taken Report (ATR) | `POST /api/grievances/:id/atr` | Saves ATR narrative and transitions status to `Resolved`. |
| 12 | Citizen Submits 5-Star Feedback | `POST /api/grievances/:id/feedback` | Records 1–5 star rating and citizen comments. |
| 13 | Citizen Reopens Grievance | `POST /api/grievances/:id/reopen` | Reopens resolved grievance and flags escalation. |
| 14 | CMO Dashboard Statistics | `GET /api/cmo/stats` | Returns KPIs, 14-district distribution, and department rates. |
| 15 | Public Contact Form Submission | `POST /api/contact` | Persists enquiry and returns confirmation ID. |
| 16 | Complete Lifecycle Suite Pass | Integrated Runner | Entire workflow executed in sub-2 seconds. |

---

## 5. Production Build & Deployment

### Building Client for Production
```bash
cd client
npm run build
```
The compiled SPA bundle is output to `client/dist`. The Express server (`server/src/index.js`) automatically detects `client/dist` and serves both the API endpoints and the frontend client simultaneously on a single port.

### Hosting Deployment (Render / Railway / Heroku / Vercel)
1. Set Environment Variables in your hosting dashboard:
   - `NODE_ENV=production`
   - `PORT=5000` (or host-assigned)
   - `JWT_SECRET=<your-secret>`
   - `GEMINI_API_KEY=<optional-gemini-key>`
2. Build Command:
   `npm run setup`
3. Start Command:
   `npm start`
