# CM-PGRP Kerala: Project Overview & Scope
**Chief Minister's Public Grievance Redressal Portal (CM-PGRP)**
*Government of Kerala Recruitment Prototype*
*Assessment by WhiteMatrix Software Solutions — AI Full Stack Engineer*

---

## 1. Problem Statement
Across the 14 districts of Kerala, citizens frequently face operational, infrastructure, and public utility challenges—ranging from hazardous potholes on state highways (PWD), contaminated or disrupted drinking water supplies (KWA), dangerously sagging live power conductors (KSEB), to critical hospital medicine shortages (Health Department). 

Historically, public grievance petitions suffered from:
1. **Administrative Latency & Silos:** Petitions submitted to local offices frequently stalled without inter-departmental visibility or high-level executive accountability.
2. **Lack of Transparent Tracking:** Citizens had no single unified reference number or chronological milestone timeline to monitor whether field actions were genuinely executed.
3. **Absence of Intelligent Triage:** High-risk public hazards (e.g., electrical sparks near crowded intersections, flood embankment leaks) were processed at the same speed as routine administrative inquiries.
4. **No Citizen-Centric Closure Verification:** Grievances were often closed unilaterally on paper by field staff without citizen satisfaction feedback or the right to reopen incomplete work.

---

## 2. Initiative Objectives
The **Chief Minister's Public Grievance Redressal Portal (CM-PGRP)** addresses these systemic challenges by creating an expedited, digital, and AI-assisted governance bridge between citizens and the Chief Minister's Office (CMO):

- **Direct Executive Oversight:** Empower the Chief Minister's Office to view, monitor, and escalate petitions submitted across all 14 districts in real time.
- **AI-Assisted Routing & Triage:** Leverage Natural Language Processing (NLP) and LLM models (Google Gemini API with a robust offline fallback) to automatically suggest responsible departments, assign SLA priorities (High, Medium, Low), summarize petitions for executives, and flag duplicate filings.
- **Guaranteed Accountability:** Implement an irreversible, sequential lifecycle history audit trail recording every status change, timestamp, and responsible official.
- **Closing the Loop:** Enable citizens to inspect the official **Action Taken Report (ATR)**, rate the resolution on a 1–5 star scale, or formally **Reopen** incomplete redressals for direct CMO intervention.

---

## 3. Scope & User Roles

### Role 1: Citizen
- Self-registration with Name, Email, Mobile number, Password, and District.
- Multi-step grievance submission with live AI Assistant analysis, district/taluk tagging, and supporting file attachments (PDF, images, documents).
- Instant generation of unique Grievance Reference IDs (e.g., `KL-CMO-2026-00101`).
- Public tracking without login or authenticated dashboard tracking with status filters.
- Citizen feedback rating (1–5 stars) and remarks on resolved grievances.
- Sovereign right to reopen resolved grievances if remedial work on site was deficient.

### Role 2: Chief Minister's Office (CMO) Administrator
- High-level executive dashboard showing total, pending, resolved, overdue, and escalated counts.
- Master filterable grievance queue across 14 Kerala districts and 10 state departments.
- Inspection of citizen details, complaint narratives, attachments, and AI triage summaries.
- Assignment and forwarding of grievances to specific government departments with administrative instructions and priority tags.
- Direct administrative remarks, SLA escalation flag, and status overrides.
- District-wise and department-wise resolution analytics with visual charts and tables.
- Public contact enquiries manager.

### Role 3: Department Officer (Nodal Officers for PWD, KWA, KSEB, Health, etc.)
- Department-scoped queue displaying only grievances assigned to that officer's department.
- Field inspection acknowledgement and status transition (`Under Review` → `In Progress`).
- Entry and upload of official **Action Taken Reports (ATR)** detailing on-ground remedial work.
- Submission of resolution certifications back to the CMO and citizen.

---

## 4. Key Functional Features Matrix

| Module | Feature | Description |
| :--- | :--- | :--- |
| **Public Website** | Home Page | Portal intro, live metrics, 5-step lifecycle guide, featured departments, and quick search. |
| | About Us | Purpose, vision, mission, and Chief Minister's policy statement. |
| | How It Works | End-to-end 8-stage lifecycle walkthrough and mandated SLA turnaround matrix. |
| | Departments | Directory of 10 Kerala Government departments with ministers, nodal officers, and contact info. |
| | Contact Us | Public enquiry form with database persistence and Secretariat address. |
| | FAQ | Accordion addressing SLAs, reference numbers, AI triage, and reopening guidelines. |
| | Track Grievance | Public search by Reference ID (`KL-CMO-2026-XXXXX`) displaying status, department, and timeline. |
| **Citizen Module** | Authentication | JWT-based registration and secure login. |
| | Submit Grievance | Smart form with AI Assistant recommendation, category selection, and attachment upload. |
| | Citizen Dashboard | Metric cards (Total, Pending, In Progress, Resolved) and grievance history table. |
| | Feedback & Reopen | 5-star rating submission or formal complaint reopening. |
| **CMO Module** | Executive KPIs | Real-time counters of total, pending, resolved, overdue, and escalated petitions. |
| | Queue Management | Multi-parameter filtering by district, category, priority, status, department, and flags. |
| | Forward & Escalate | Route petitions to departments, attach administrative directions, and flag escalations. |
| | Analytics | District-wise distribution table and department resolution performance breakdown. |
| **Officer Module** | Department Queue | Scoped workstation for PWD, KWA, KSEB, Health, etc. |
| | Status & Remarks | Transition status to `In Progress` and log site inspection updates. |
| | Action Taken Report | Formal ATR documenting physical execution on ground. |
| **AI Engine** | AI Grievance Assistant | Department suggestion, category matching, urgency scoring, executive summary, and duplicate detection. |

---

## 5. Mandatory Grievance Workflow Lifecycle
```
Citizen Submits Grievance
       │
       ▼
System Generates Reference ID (KL-CMO-2026-XXXXX)
       │
       ▼
AI Engine Analyzes & Recommends Dept/Priority
       │
       ▼
CMO Admin Reviews & Forwards to Department
       │
       ▼
Department Officer Investigates & Updates Status ("In Progress")
       │
       ▼
Department Completes Work & Submits Action Taken Report (ATR)
       │
       ▼
Status Marked "Resolved" ──► Citizen Receives Update & Verifies
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
    Citizen Submits Feedback                 Citizen Unsatisfied:
      (1-5 Stars + Remarks)                 Reopens Grievance ("Reopened")
               │                                       │
               ▼                                       ▼
       Lifecycle Completed                   Auto-Escalated to CMO
```

---

## 6. Disclaimer
*This application is an engineering prototype developed exclusively for the WhiteMatrix Software Solutions AI Full Stack Engineer recruitment assessment. All citizen petitions, departmental rosters, and credentials are fictional demonstrations.*
