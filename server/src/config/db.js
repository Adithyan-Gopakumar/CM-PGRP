const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/cm_pgrp.sqlite');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for high concurrency & foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    -- Departments Table
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      name_ml TEXT NOT NULL,
      description TEXT NOT NULL,
      minister TEXT,
      nodal_officer TEXT,
      email TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Users Table (Citizens, CMO Admins, Department Officers)
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('citizen', 'cmo_admin', 'officer')),
      district TEXT,
      department_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
    );

    -- Grievances Table
    CREATE TABLE IF NOT EXISTS grievances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_id TEXT UNIQUE NOT NULL,
      citizen_id INTEGER NOT NULL,
      department_id INTEGER,
      district TEXT NOT NULL,
      taluk TEXT,
      category TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT DEFAULT 'Medium' CHECK(priority IN ('Low', 'Medium', 'High')),
      status TEXT DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Under Review', 'In Progress', 'Resolved', 'Reopened')),
      is_escalated INTEGER DEFAULT 0,
      escalation_reason TEXT,
      ai_suggested_dept_id INTEGER,
      ai_suggested_category TEXT,
      ai_priority_recommendation TEXT,
      ai_confidence REAL DEFAULT 0.0,
      ai_summary TEXT,
      ai_duplicate_flag INTEGER DEFAULT 0,
      ai_duplicate_ref TEXT,
      action_taken_report TEXT,
      resolution_notes TEXT,
      resolved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
      FOREIGN KEY (ai_suggested_dept_id) REFERENCES departments(id) ON DELETE SET NULL
    );

    -- Grievance Lifecycle History & Audit Trail
    CREATE TABLE IF NOT EXISTS grievance_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grievance_id INTEGER NOT NULL,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      user_role TEXT NOT NULL,
      action TEXT NOT NULL,
      previous_status TEXT,
      new_status TEXT,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Attachments Table
    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grievance_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      uploaded_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
      FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Citizen Feedback Table
    CREATE TABLE IF NOT EXISTS citizen_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grievance_id INTEGER UNIQUE NOT NULL,
      citizen_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
      FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Public Contact Enquiries Table
    CREATE TABLE IF NOT EXISTS contact_enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'New' CHECK(status IN ('New', 'Read', 'Replied')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for high-performance lookup
    CREATE INDEX IF NOT EXISTS idx_grievances_ref ON grievances(reference_id);
    CREATE INDEX IF NOT EXISTS idx_grievances_citizen ON grievances(citizen_id);
    CREATE INDEX IF NOT EXISTS idx_grievances_dept ON grievances(department_id);
    CREATE INDEX IF NOT EXISTS idx_grievances_status ON grievances(status);
    CREATE INDEX IF NOT EXISTS idx_grievances_district ON grievances(district);
    CREATE INDEX IF NOT EXISTS idx_grievance_history_gid ON grievance_history(grievance_id);
  `);
}

initSchema();

module.exports = db;
