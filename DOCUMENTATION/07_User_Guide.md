# CM-PGRP Kerala: Comprehensive User Guide
**Chief Minister's Public Grievance Redressal Portal**
*Operational Walkthrough for Citizens, CMO Administrators & Department Officers*

---

## 1. Citizen Portal User Guide

### 1.1 Public Exploration & Tracking (No Login Required)
- **Home Page (`/`):** View portal announcements, live metrics across Kerala's 14 districts, and featured government departments.
- **Track Status (`/track`):** Any citizen can enter their unique reference number (e.g. `KL-CMO-2026-00101`) to inspect:
  - Current status badge (`Submitted`, `Under Review`, `In Progress`, `Resolved`, `Reopened`).
  - Assigned government department and contact officer.
  - Full milestone timeline with timestamps and officer remarks.
  - Official Action Taken Report (ATR) when work is certified complete.
  - Printable receipt button.

---

### 1.2 Account Registration & Sign-In
1. Navigate to `/register`.
2. Enter your Full Name, Email, 10-digit Mobile Number, Kerala District, and Password.
3. Click **Complete Registration**. You will be logged in immediately.
4. If you already have an account, navigate to `/login` and select the **Citizen** tab. (Or click the **Citizen Demo** quick-fill button).

---

### 1.3 Submitting a Grievance with AI Assistance
1. From the navigation bar or citizen dashboard, click **Submit Grievance**.
2. **Step 1: Location:** Select your Kerala district (e.g. `Kottayam`) and enter your taluk or local body (e.g. `Meenachil`).
3. **Step 2: Grievance Particulars:**
   - Enter a descriptive **Subject** (e.g., *Severe potholes on MC Road near Ettumanoor junction*).
   - Enter the **Detailed Description** explaining the hazard, exact street/location, and impact.
4. **Step 3: Run AI Grievance Assistant:**
   - Click the amber button: **Analyze with AI Grievance Assistant**.
   - Within seconds, the AI Assistant analyzes your text and displays:
     - Recommended Department (e.g., *Public Works Department (PWD)*).
     - Recommended Category (e.g., *Pothole Repair*).
     - Priority Assessment (e.g., *High Priority* due to road hazard factors).
     - Executive Summary for the CMO.
     - Duplicate Detection warning (if an identical issue was recently registered nearby).
   - Click **Apply AI Suggestions** to automatically populate the form fields.
5. **Step 4: Supporting Attachment (Optional):** Click the file drop-zone to attach a photo or document (PDF, JPG, PNG up to 15MB).
6. Click **Submit to Chief Minister Office**.
7. Your unique Reference ID (e.g. `KL-CMO-2026-XXXXX`) is generated instantly on screen.

---

### 1.4 Managing Grievances on the Citizen Dashboard
1. Go to `/citizen/dashboard`.
2. Inspect your summary metric cards: *Total Submitted*, *Under Review*, *In Progress*, and *Resolved*.
3. Click **View Details** on any grievance row to open the complete petition file.

---

### 1.5 Rating Resolution & Reopening Incomplete Grievances
When your grievance status transitions to **Resolved**:
- **Submit Quality Feedback:**
  1. Open the grievance details modal.
  2. Select a 1 to 5-star rating and enter your comments on satisfaction.
  3. Click **Submit Official Rating**.
- **Reopen Grievance (If Problem Persists on Ground):**
  1. In the grievance details modal, click **Not satisfied? Reopen Grievance**.
  2. Enter detailed remarks explaining the deficiency (e.g. *Bitumen patching was incomplete; surface washed away in overnight rain*).
  3. Click **Confirm Reopening of Grievance**.
  4. The status immediately updates to **Reopened** and triggers an automatic escalation flag on the CMO administrative desk.

---

## 2. Chief Minister's Office (CMO) Administrator Guide

### 2.1 Logging In as Administrator
1. Navigate to `/login`.
2. Select the **CMO Admin** tab or click the **CMO Admin (Principal Secy)** quick-fill button.
3. Credentials: `cmo.admin@kerala.gov.in` / `Password@123`.

---

### 2.2 Executive Command & Control Dashboard (`/cmo/dashboard`)
The CMO Console presents executive metrics across state administration:
- **Total Petitions:** Aggregate volume across all 14 districts.
- **Submitted (New):** Petitions awaiting initial CMO screening.
- **In Progress:** Petitions currently undergoing active departmental investigation.
- **Resolved:** Successfully addressed grievances with certified ATRs.
- **Escalated:** Urgent petitions requiring immediate high-level intervention.
- **Overdue / SLA Alerts:** Petitions pending beyond prescribed turnaround timelines.

---

### 2.3 Reviewing, Forwarding & Escalating Grievances
1. Under the **Grievance Master Queue** tab, use the filter bar to isolate records by:
   - Specific District (e.g. *Alappuzha*, *Wayanad*).
   - Priority (*High*, *Medium*, *Low*).
   - Status (*Submitted*, *Under Review*, *In Progress*, *Resolved*, *Reopened*).
   - Escalation flag or search keyword.
2. Click **Review** on any grievance row to open the administrative drawer.
3. **Inspect AI Analysis:** Review the AI-generated executive summary, confidence score, and duplicate alerts.
4. **Assign to Department:**
   - In the *Assign / Forward to Department* section, select the target department (e.g., `PWD`, `KWA`, `KSEB`).
   - Confirm or adjust priority.
   - Enter specific administrative directives in the remarks box.
   - Click **Assign & Forward to Dept**.
5. **Direct Escalation:**
   - Click **Escalate to CMO** to mark the petition with an urgent escalation flag and set an escalation reason.

---

### 2.4 District-Wise & Departmental Analytics
1. Click the **District & Department Analytics** tab.
2. Review the **District-Wise Grievance Distribution** table listing all 14 Kerala districts with their total submissions, resolved counts, pending counts, high-priority issues, and percentage resolution progress bars.
3. Review the **Departmental Resolution Performance** cards displaying real-time resolution rates and pending loads for each state department.

---

## 3. Department Officer Workstation Guide

### 3.1 Officer Sign-In
1. Navigate to `/login`.
2. Select the **Dept Officer** tab (e.g., click **PWD Officer**, **KWA Water**, or **Health DMO** quick-fill button).
3. Click **Sign In to Dashboard**.

---

### 3.2 Managing the Department Queue (`/officer/dashboard`)
1. The officer workstation displays only grievances assigned to that officer's department.
2. Review the queue metrics: *Pending Investigation*, *Work In Progress*, and *Resolved with ATR*.
3. Click **Action / ATR** on any assigned complaint.

---

### 3.3 Acknowledging & Dispatching Field Crews
1. In the *Acknowledge / Update Investigation Status* section, select `In Progress`.
2. Enter field notes (e.g. *Executive Engineer inspected culvert on site; road repair crew dispatched with cold mix bitumen*).
3. Click **Update Progress**. The status immediately synchronizes on the citizen's tracking page and CMO desk.

---

### 3.4 Submitting the Official Action Taken Report (ATR)
1. When on-ground physical remediation is completed:
2. Open the grievance in the officer workstation.
3. In the **Submit Official Action Taken Report (ATR)** section:
   - Provide a comprehensive technical narrative of remedial measures completed.
   - Check the box: **Mark grievance as fully "Resolved" and submit final report to CMO**.
   - Click **Submit Action Taken Report to CMO**.
4. The petition transitions to `Resolved`, timestamps the resolution, and notifies the citizen to provide satisfaction feedback.
