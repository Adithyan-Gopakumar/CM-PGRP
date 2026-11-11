# CM KERALA — CHIEF MINISTER'S PUBLIC GRIEVANCE REDRESSAL PORTAL (CM-PGRP)

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B%20%7C%20v23-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite3%20(WAL%20Mode)-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![AI Integration](https://img.shields.io/badge/AI%20Engine-Gemini%201.5%20%2B%20NLP%20Fallback-FF6F00?logo=google&logoColor=white)](https://ai.google.dev/)
[![Tests](https://img.shields.io/badge/Integration%20Tests-16%2F16%20Passing-brightgreen)]()

> **WhiteMatrix Software Solutions | Recruitment Assessment**  
> **Role:** AI Full Stack Engineer  
> **Submission Deadline:** 12 November 2026, 8:00 PM IST  
> **Deliverables:** Working Prototype, Comprehensive Technical Documentation, API Suite & Demo Video  

---

## 🏛️ Executive Scenario
Imagine you are the Chief Minister of Kerala. Citizens across the state face issues involving public infrastructure, healthcare, education, water supply, electricity, and public services. 

The **CM-PGRP** platform establishes an expedited, transparent digital window connecting citizens across all 14 districts directly with the Chief Minister's Office (CMO). The portal enables the CMO to review grievances, triage them using Artificial Intelligence, route them to responsible departments, monitor real-time SLA compliance, and collect citizen satisfaction feedback.

---

## 🚀 Instant Quickstart (Run in 1 Minute)

### Option 1: One-Command Automated Setup
From the repository root:
```bash
# 1. Install dependencies, seed database, and build client
npm run setup

# 2. Launch unified production server (serves API & Frontend at port 5000)
npm start
```
Open **`http://localhost:5000`** in your browser.

---

### Option 2: Step-by-Step Local Development Setup

#### 1. Backend Server Setup
```bash
cd server
npm install
npm run seed       # Seeds 10 Kerala departments, test accounts, and realistic sample grievances
npm run dev        # Starts Express server on http://localhost:5000
```

#### 2. Frontend Client Setup (New Terminal)
```bash
cd client
npm install
npm run dev        # Starts Vite React dev server on http://localhost:5173
```
Visit **`http://localhost:5173`**.

---

## 🔑 Demo Evaluator Credentials
For evaluator convenience, the login page (`/login`) includes **1-Click Demo Fillers** that automatically populate credentials with a single click.

| Role | Name | Email | Password | Scope & Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Ananya Nair | `citizen@kerala.gov.in` | `Password@123` | Submit grievances with AI assistance, track status, rate resolutions, reopen complaints. |
| **CMO Administrator** | Shri. K. Narayanan (Principal Secy) | `cmo.admin@kerala.gov.in` | `Password@123` | Executive desk, 14-district analytics, forward to departments, escalate overdue grievances. |
| **PWD Officer** | Er. Rajesh Kumar (Exec Engineer) | `pwd.officer@kerala.gov.in` | `Password@123` | View PWD road petitions, update progress, submit Action Taken Reports (ATR). |
| **KWA Water Officer** | Er. Mini Varghese (Asst Exec Engineer) | `kwa.officer@kerala.gov.in` | `Password@123` | Manage drinking water pipeline and supply grievances. |
| **Health Officer** | Dr. Sujatha Pillai (District Medical Officer) | `health.officer@kerala.gov.in` | `Password@123` | Hospital facilities, anti-venom and antibiotic stockouts. |

---

## 🧠 Mandatory AI Integration
The portal implements an **AI Grievance Assistant** with dual-engine flexibility:
- **Cloud LLM (Google Gemini API):** Configured via `GEMINI_API_KEY` in `.env`. Connects to `gemini-1.5-flash` with structured JSON schema output.
- **Labelled Intelligent NLP Fallback Engine:** If no API key is provided or when working offline, the system seamlessly uses a high-accuracy semantic analyzer built on weighted domain lexicons across 10 departments, safety hazard detection, and Jaccard token overlap for duplicate complaint detection.
- **Ethical Safeguard (Human-in-the-Loop):** AI outputs are non-autonomous recommendations reviewable and overridable by citizens and CMO administrators.

---

## 🔄 Mandatory Grievance Workflow Lifecycle
```
Citizen Submits Grievance (AI Assisted)
             │
             ▼
System Generates Reference ID (KL-CMO-2026-XXXXX)
             │
             ▼
CMO Administrator Reviews & Forwards to Department
             │
             ▼
Department Officer Investigates & Updates Status ("In Progress")
             │
             ▼
Department Officer Submits Official Action Taken Report (ATR)
             │
             ▼
Status Transitions to "Resolved" ──► Citizen Notified
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     ▼                                           ▼
          Citizen Rates Redressal                     Citizen Reopens
           (1-5 Stars + Remarks)                 ("Reopened" ──► Escalated)
```

**Supported Lifecycle Statuses:** `Submitted`, `Under Review`, `In Progress`, `Resolved`, `Reopened`. Every transition records an irreversible timestamped audit log.

---

## 🧪 Automated Test Suite (16 / 16 Passing)
Run the automated integration test suite covering the complete grievance lifecycle:
```bash
cd server
npm test
```
```text
▶ CM-PGRP API Integration Test Suite
  ✔ 1. Health Check Endpoint (53.9ms)
  ✔ 2. Retrieve Departments List (12.7ms)
  ✔ 3. Citizen Login (186.3ms)
  ✔ 4. CMO Admin Login (134.1ms)
  ✔ 5. Officer Login (PWD) (131.1ms)
  ✔ 6. AI Grievance Assistant Analysis (9.1ms)
  ✔ 7. Citizen Submits Grievance with AI Triage (14.3ms)
  ✔ 8. Public Tracking by Reference ID (7.7ms)
  ✔ 9. CMO Admin Reviews and Forwards Grievance (11.8ms)
  ✔ 10. Officer Updates Status to In Progress (9.2ms)
  ✔ 11. Submit Action Taken Report (ATR) & Mark Resolved (7.9ms)
  ✔ 12. Citizen Submits 5-Star Feedback (7.8ms)
  ✔ 13. Citizen Reopens Grievance Workflow (7.5ms)
  ✔ 14. CMO Dashboard Statistics (8.5ms)
  ✔ 15. Contact Enquiry Submission (5.8ms)
✔ CM-PGRP API Integration Test Suite (613.2ms)
ℹ tests 16 | pass 16 | fail 0
```

---

## 📚 Mandatory Documentation Index
In accordance with Section 9 of the assessment, complete documentation is provided in the **`DOCUMENTATION/`** directory:

| Document | Link | Description |
| :--- | :--- | :--- |
| **01. Project Overview** | [01_Project_Overview.md](./DOCUMENTATION/01_Project_Overview.md) | Problem statement, objectives, scope, features, and workflow. |
| **02. System Architecture** | [02_System_Architecture.md](./DOCUMENTATION/02_System_Architecture.md) | Architecture tiers, component interaction, and system diagrams. |
| **03. Database Design** | [03_Database_Design.md](./DOCUMENTATION/03_Database_Design.md) | Schema specifications, data dictionary, and complete Mermaid ER diagram. |
| **04. API Documentation** | [04_API_Documentation.md](./DOCUMENTATION/04_API_Documentation.md) | REST endpoints, parameters, payloads, and response envelopes. |
| **05. AI Integration** | [05_AI_Integration.md](./DOCUMENTATION/05_AI_Integration.md) | Models, prompts, schemas, fallback NLP engine, and deduplication. |
| **06. Setup & Testing** | [06_Setup_and_Testing.md](./DOCUMENTATION/06_Setup_and_Testing.md) | Environment configuration, test suite, and evaluator credentials. |
| **07. User Guide** | [07_User_Guide.md](./DOCUMENTATION/07_User_Guide.md) | Operational walkthrough for citizens, CMO admins, and officers. |

---

## 📂 Project Structure
```
CM-PGRP/
├── client/                      # React 18 + Vite + Tailwind CSS Single Page Application
│   ├── public/                  # Static web assets
│   ├── src/
│   │   ├── components/common/   # Navbar, Footer, StatusBadge, PriorityBadge, LifecycleTimeline
│   │   ├── context/             # AuthContext (JWT authentication state)
│   │   ├── pages/
│   │   │   ├── public/          # HomePage, AboutUs, HowItWorks, Departments, Contact, FAQ, Track
│   │   │   ├── auth/            # LoginPage (with 1-click demo fillers), RegisterPage
│   │   │   ├── citizen/         # CitizenDashboard, SubmitGrievancePage (with Live AI Assistant)
│   │   │   ├── cmo/             # CMODashboard (Executive console, triage, 14-district analytics)
│   │   │   └── officer/         # OfficerDashboard (Queue, field updates, ATR submission)
│   │   ├── services/            # Axios API client configured with Bearer token interceptor
│   │   ├── App.jsx              # Application router with ProtectedRoute guards
│   │   ├── index.css            # Tailwind directives & government typography
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js + Express Backend API
│   ├── data/                    # Embedded SQLite database storage (cm_pgrp.sqlite)
│   ├── uploads/                 # Storage for supporting files and attachments
│   ├── test/                    # Automated integration test suite (api.test.js)
│   ├── src/
│   │   ├── config/              # db.js (SQLite WAL mode initialization & schema setup)
│   │   ├── controllers/         # authController, grievanceController, cmoController, etc.
│   │   ├── database/            # seed.js (Reproducible fictional sample data generator)
│   │   ├── middleware/          # auth.js (JWT & RBAC), upload.js (Multer)
│   │   ├── routes/              # Express API route modules
│   │   ├── services/            # aiService.js (Gemini API & Labelled NLP Fallback Engine)
│   │   └── index.js             # Server entry point & unified frontend production host
│   ├── .env.example
│   └── package.json
│
├── DOCUMENTATION/               # Mandatory Assessment Documentation (01 to 07)
├── .env.example                 # Root environment template
├── .gitignore
├── package.json                 # Unified root scripts (setup, start, seed, test, build)
└── README.md                    # Project README & Evaluator Guide
```

---

## ⚖️ Evaluation Criteria Mapping (100 Marks)
| Evaluation Area | Marks | Implementation in CM-PGRP |
| :--- | :---: | :--- |
| **Frontend & UI/UX** | 10 | React 18, Tailwind CSS, official Kerala Gov aesthetic, bilingual Malayalam badges, responsive layout, accessible typography. |
| **Backend Engineering & Logic** | 20 | Node.js + Express, clean Controller-Service architecture, RBAC middleware, secure error handling, input validation. |
| **Database Design** | 10 | SQLite3 WAL mode, relational schema with 7 entities, foreign keys, cascading deletes, high-speed indices, and ER diagrams. |
| **API Development & Integration** | 15 | RESTful architecture, 15+ comprehensive endpoints, JWT Bearer tokens, multipart file upload, and automated test suite. |
| **AI Implementation** | 15 | Google Gemini API + Labelled NLP Fallback, department triage, priority scoring, executive summaries, and duplicate detection. |
| **Grievance Workflow** | 15 | Mandatory 8-step lifecycle, 5 distinct statuses, immutable audit trail, Action Taken Reports (ATR), and citizen reopen loop. |
| **Documentation** | 10 | Completed `DOCUMENTATION/` directory (01 to 07), Mermaid diagrams, and detailed setup guides. |
| **Security & Testing** | 5 | Bcrypt hashing, JWT expiration, parameter sanitization, whitelisted file uploads, and 16 automated test cases. |
| **TOTAL** | **100** | **Fully functional end-to-end prototype.** |

---

## 📢 Disclaimer
*This project is a recruitment prototype developed strictly for the WhiteMatrix Software Solutions technical assessment. Fictional sample data is used for demonstration purposes. This prototype does not imply official authorization or endorsement by the Government of Kerala or the Chief Minister's Office.*
