# CM-PGRP Kerala: REST API Documentation
**Chief Minister's Public Grievance Redressal Portal**
*Complete API Specification, Endpoints, Parameters & Payload Examples*

---

## 1. API General Information
- **Base URL:** `http://localhost:5000/api` (or relative `/api` on hosted deployments)
- **Content-Type:** `application/json` (or `multipart/form-data` for file uploads)
- **Authentication Scheme:** `Authorization: Bearer <JWT_TOKEN>`
- **Response Format:** All JSON responses conform to standard envelope: `{ "success": true/false, ... }`

---

## 2. Authentication Endpoints (`/api/auth`)

### 2.1 Citizen Registration
Registers a new citizen account.
- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Access:** Public

**Request Payload:**
```json
{
  "name": "Ananya Nair",
  "email": "ananya@example.com",
  "mobile": "9447123456",
  "password": "Password@123",
  "district": "Thiruvananthapuram"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Citizen registration completed successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 9,
    "name": "Ananya Nair",
    "email": "ananya@example.com",
    "mobile": "9447123456",
    "role": "citizen",
    "district": "Thiruvananthapuram",
    "created_at": "2026-11-12 03:00:00"
  }
}
```

---

### 2.2 User Login (All Roles)
Authenticates citizens, CMO administrators, and department officers.
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Access:** Public

**Request Payload:**
```json
{
  "email": "cmo.admin@kerala.gov.in",
  "password": "Password@123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Shri. K. Narayanan (Principal Secretary to CM)",
    "email": "cmo.admin@kerala.gov.in",
    "mobile": "9847012345",
    "role": "cmo_admin",
    "district": "Thiruvananthapuram",
    "department_id": null
  }
}
```

---

### 2.3 Current Session Profile
Retrieves authenticated user profile.
- **Method:** `GET`
- **Path:** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

---

## 3. AI Grievance Assistant (`/api/ai`)

### 3.1 Live Complaint Analysis
Analyzes complaint text, recommends department and priority, computes confidence, produces an executive summary, and checks for potential duplicate complaints.
- **Method:** `POST`
- **Path:** `/api/ai/analyze`
- **Access:** Public / Optional Auth

**Request Payload:**
```json
{
  "description": "Dangerous live wire sparking near bus stop on MG road during heavy rain. Risk of electrocution.",
  "subject": "Sparking live electric wire",
  "district": "Ernakulam"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "analysis": {
    "source": "Intelligent NLP Engine (Labelled Fallback)",
    "isFallback": true,
    "department": {
      "id": 3,
      "code": "KSEB",
      "name": "Kerala State Electricity Board Ltd."
    },
    "category": "Fallen Electrical Poles / Live Wire",
    "priority": "High",
    "priorityReason": "Urgent keywords detected (2 hazard/safety factors found). Immediate CMO intervention required.",
    "confidence": 0.94,
    "summary": "Dangerous live wire sparking near bus stop on MG road during heavy rain. Risk of electrocution.",
    "duplicateDetection": {
      "isDuplicate": false,
      "similarityScore": 12,
      "matchedRef": null
    },
    "suggestedAction": "Forward immediately to Nodal Officer with 24-hour escalation flag."
  }
}
```

---

## 4. Grievance Management Endpoints (`/api/grievances`)

### 4.1 Submit New Grievance
Submits a public grievance to the CMO with optional supporting attachment.
- **Method:** `POST`
- **Path:** `/api/grievances`
- **Access:** Protected (`citizen`)
- **Content-Type:** `multipart/form-data`

**Form Data Fields:**
- `district` (string, required): Kerala district (e.g. `Kottayam`)
- `taluk` (string, optional): Taluk name (e.g. `Meenachil`)
- `category` (string, required): e.g. `Pothole Repair`
- `subject` (string, required): Brief title
- `description` (string, required): Full description
- `priority` (string): `Low` | `Medium` | `High`
- `department_id` (integer, optional): Pre-selected department ID
- `attachment` (file, optional): PDF, PNG, JPG, DOC file
- `ai_summary` (string, optional): Generated summary
- `ai_priority_recommendation` (string, optional)

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Grievance submitted successfully to the Chief Minister Office.",
  "referenceId": "KL-CMO-2026-84912",
  "grievance": {
    "id": 8,
    "reference_id": "KL-CMO-2026-84912",
    "district": "Kottayam",
    "subject": "Deep potholes on MC Road near Ettumanoor",
    "status": "Submitted",
    "priority": "High"
  }
}
```

---

### 4.2 Public Tracking by Reference ID
Unauthenticated public tracking endpoint.
- **Method:** `GET`
- **Path:** `/api/grievances/track/:referenceId`
- **Access:** Public

**Success Response (200 OK):**
```json
{
  "success": true,
  "grievance": {
    "id": 1,
    "reference_id": "KL-CMO-2026-00101",
    "district": "Kottayam",
    "category": "Pothole Repair",
    "subject": "Severe craters and broken culvert on MC Road near Ettumanoor junction",
    "priority": "High",
    "status": "Submitted",
    "department_name": "Public Works Department (Roads & Bridges)",
    "department_code": "PWD",
    "history": [
      {
        "action": "SUBMITTED",
        "previous_status": null,
        "new_status": "Submitted",
        "remarks": "Grievance submitted online via CM-PGRP Portal with AI assistance.",
        "created_at": "2026-11-10 09:30:00",
        "user_role": "citizen"
      }
    ]
  }
}
```

---

### 4.3 List Grievances (Scoped by Role)
Lists grievances with filtering.
- **Method:** `GET`
- **Path:** `/api/grievances`
- **Access:** Protected (`citizen`, `cmo_admin`, `officer`)
- **Query Parameters:**
  - `status`: `Submitted`, `Under Review`, `In Progress`, `Resolved`, `Reopened`
  - `district`: Filter by Kerala district
  - `category`: Filter by category string
  - `priority`: `Low`, `Medium`, `High`
  - `is_escalated`: `1` or `0`
  - `search`: Keyword across reference ID, subject, or citizen name
  - `limit`: Default `100`

---

### 4.4 Forward Grievance to Department
CMO administrator assigns grievance to department.
- **Method:** `POST`
- **Path:** `/api/grievances/:id/forward`
- **Access:** Protected (`cmo_admin`)

**Request Payload:**
```json
{
  "department_id": 1,
  "remarks": "Expedite repair within 24 hours. Submit ATR to CMO.",
  "priority": "High"
}
```

---

### 4.5 Update Status
Transitions workflow status and logs audit entry.
- **Method:** `PATCH`
- **Path:** `/api/grievances/:id/status`
- **Access:** Protected (`cmo_admin`, `officer`)

**Request Payload:**
```json
{
  "status": "In Progress",
  "remarks": "PWD road crew deployed to site with cold mix bitumen."
}
```

---

### 4.6 Submit Action Taken Report (ATR)
Department officer records physical actions taken on ground.
- **Method:** `POST`
- **Path:** `/api/grievances/:id/atr`
- **Access:** Protected (`officer`)

**Request Payload:**
```json
{
  "action_taken_report": "Bituminous patching over 500m completed. Barricades installed. Verified by Executive Engineer.",
  "mark_resolved": true,
  "remarks": "Site inspection certified complete."
}
```

---

### 4.7 Submit Citizen Feedback
Citizen rates resolution on a 1–5 scale.
- **Method:** `POST`
- **Path:** `/api/grievances/:id/feedback`
- **Access:** Protected (`citizen`)

**Request Payload:**
```json
{
  "rating": 5,
  "comments": "Excellent rapid turnaround by the CMO and PWD road team!"
}
```

---

### 4.8 Reopen Grievance
Citizen reopens an incomplete resolution.
- **Method:** `POST`
- **Path:** `/api/grievances/:id/reopen`
- **Access:** Protected (`citizen`)

**Request Payload:**
```json
{
  "remarks": "Potholes were only filled with loose stones; surface already washing away in rain."
}
```

---

## 5. Department Endpoints (`/api/departments`)

### 5.1 Retrieve All Departments
- **Method:** `GET`
- **Path:** `/api/departments`
- **Access:** Public

---

## 6. CMO Executive Statistics (`/api/cmo/stats`)
- **Method:** `GET`
- **Path:** `/api/cmo/stats`
- **Access:** Protected (`cmo_admin`)
- **Returns:** Summary KPI totals (total, pending, resolved, overdue, escalated), 14-district distribution matrix, and department resolution rates.

---

## 7. Public Contact Form (`/api/contact`)
- **Method:** `POST`
- **Path:** `/api/contact`
- **Access:** Public
- **Request Payload:** `{ "name": "...", "email": "...", "phone": "...", "subject": "...", "message": "..." }`
