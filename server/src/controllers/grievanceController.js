const db = require('../config/db');
const { analyzeGrievance } = require('../services/aiService');

/**
 * Generate unique reference ID: KL-CMO-2026-XXXXX
 */
function generateReferenceId() {
  const currentYear = new Date().getFullYear();
  let unique = false;
  let refId = '';

  while (!unique) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    refId = `KL-CMO-${currentYear}-${randomNum}`;
    const existing = db.prepare('SELECT id FROM grievances WHERE reference_id = ?').get(refId);
    if (!existing) unique = true;
  }
  return refId;
}

exports.submitGrievance = async (req, res) => {
  try {
    const citizenId = req.user.id;
    const {
      district,
      taluk,
      category,
      subject,
      description,
      priority,
      department_id,
      ai_suggested_dept_id,
      ai_suggested_category,
      ai_priority_recommendation,
      ai_confidence,
      ai_summary,
      ai_duplicate_flag,
      ai_duplicate_ref
    } = req.body;

    if (!district || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'District, Subject, and Detailed Description are required fields.'
      });
    }

    const referenceId = generateReferenceId();

    // If AI analysis was not provided in frontend request, run server-side AI analysis
    let finalAiDeptId = ai_suggested_dept_id ? parseInt(ai_suggested_dept_id, 10) : null;
    let finalAiCategory = ai_suggested_category || null;
    let finalAiPriority = ai_priority_recommendation || null;
    let finalAiConfidence = ai_confidence ? parseFloat(ai_confidence) : 0.0;
    let finalAiSummary = ai_summary || null;
    let finalAiDuplicateFlag = ai_duplicate_flag ? parseInt(ai_duplicate_flag, 10) : 0;
    let finalAiDuplicateRef = ai_duplicate_ref || null;

    if (!finalAiSummary) {
      try {
        const aiResult = await analyzeGrievance({ description, subject, district });
        finalAiDeptId = aiResult.department?.id || null;
        finalAiCategory = aiResult.category;
        finalAiPriority = aiResult.priority;
        finalAiConfidence = aiResult.confidence;
        finalAiSummary = aiResult.summary;
        finalAiDuplicateFlag = aiResult.duplicateDetection?.isDuplicate ? 1 : 0;
        finalAiDuplicateRef = aiResult.duplicateDetection?.matchedRef || null;
      } catch (aiErr) {
        console.warn('AI analysis on submission fallback:', aiErr.message);
      }
    }

    const assignedDeptId = department_id ? parseInt(department_id, 10) : finalAiDeptId;
    const assignedCategory = category || finalAiCategory || 'General Grievance';
    const assignedPriority = ['Low', 'Medium', 'High'].includes(priority) ? priority : (finalAiPriority || 'Medium');

    const insertStmt = db.prepare(`
      INSERT INTO grievances (
        reference_id, citizen_id, department_id, district, taluk, category, subject, description,
        priority, status, is_escalated, escalation_reason, ai_suggested_dept_id, ai_suggested_category,
        ai_priority_recommendation, ai_confidence, ai_summary, ai_duplicate_flag, ai_duplicate_ref,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, 'Submitted', 0, NULL, ?, ?,
        ?, ?, ?, ?, ?,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `);

    const result = insertStmt.run(
      referenceId,
      citizenId,
      assignedDeptId,
      district,
      taluk || null,
      assignedCategory,
      subject.trim(),
      description.trim(),
      assignedPriority,
      finalAiDeptId,
      finalAiCategory,
      finalAiPriority,
      finalAiConfidence,
      finalAiSummary,
      finalAiDuplicateFlag,
      finalAiDuplicateRef
    );

    const grievanceId = result.lastInsertRowid;

    // Save attachment if present
    let attachmentData = null;
    if (req.file) {
      const attachStmt = db.prepare(`
        INSERT INTO attachments (grievance_id, file_name, original_name, file_path, file_size, mime_type, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const attachRes = attachStmt.run(
        grievanceId,
        req.file.filename,
        req.file.originalname,
        `/uploads/${req.file.filename}`,
        req.file.size,
        req.file.mimetype,
        citizenId
      );
      attachmentData = {
        id: attachRes.lastInsertRowid,
        fileName: req.file.originalname,
        url: `/uploads/${req.file.filename}`
      };
    }

    // Record initial status history
    db.prepare(`
      INSERT INTO grievance_history (
        grievance_id, user_id, user_name, user_role, action, previous_status, new_status, remarks
      ) VALUES (?, ?, ?, 'citizen', 'SUBMITTED', NULL, 'Submitted', 'Grievance submitted by citizen via portal.')
    `).run(grievanceId, citizenId, req.user.name);

    const savedGrievance = db.prepare(`
      SELECT g.*, d.name AS department_name, d.code AS department_code
      FROM grievances g
      LEFT JOIN departments d ON g.department_id = d.id
      WHERE g.id = ?
    `).get(grievanceId);

    return res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully to the Chief Minister Office.',
      referenceId,
      grievance: savedGrievance,
      attachment: attachmentData
    });
  } catch (error) {
    console.error('Error submitting grievance:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit grievance.', error: error.message });
  }
};

exports.listGrievances = (req, res) => {
  try {
    const user = req.user;
    const {
      status,
      district,
      category,
      priority,
      department_id,
      is_escalated,
      search,
      limit = 100,
      offset = 0
    } = req.query;

    let query = `
      SELECT g.*, 
             u.name AS citizen_name, u.email AS citizen_email, u.mobile AS citizen_mobile,
             d.name AS department_name, d.code AS department_code,
             cf.rating AS feedback_rating, cf.comments AS feedback_comments,
             (SELECT COUNT(*) FROM attachments a WHERE a.grievance_id = g.id) AS attachment_count
      FROM grievances g
      LEFT JOIN users u ON g.citizen_id = u.id
      LEFT JOIN departments d ON g.department_id = d.id
      LEFT JOIN citizen_feedback cf ON g.id = cf.grievance_id
      WHERE 1=1
    `;
    const params = [];

    // Role-based scoping
    if (user.role === 'citizen') {
      query += ` AND g.citizen_id = ?`;
      params.push(user.id);
    } else if (user.role === 'officer') {
      if (user.department_id) {
        query += ` AND g.department_id = ?`;
        params.push(user.department_id);
      } else {
        query += ` AND 1=0`; // No department assigned to officer
      }
    }

    // Optional filters
    if (status) {
      query += ` AND g.status = ?`;
      params.push(status);
    }
    if (district) {
      query += ` AND g.district = ?`;
      params.push(district);
    }
    if (category) {
      query += ` AND g.category = ?`;
      params.push(category);
    }
    if (priority) {
      query += ` AND g.priority = ?`;
      params.push(priority);
    }
    if (department_id) {
      query += ` AND g.department_id = ?`;
      params.push(parseInt(department_id, 10));
    }
    if (is_escalated !== undefined && is_escalated !== '') {
      query += ` AND g.is_escalated = ?`;
      params.push(parseInt(is_escalated, 10));
    }
    if (search) {
      query += ` AND (g.reference_id LIKE ? OR g.subject LIKE ? OR g.description LIKE ? OR u.name LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ` ORDER BY g.id DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const grievances = db.prepare(query).all(...params);

    return res.json({
      success: true,
      count: grievances.length,
      grievances
    });
  } catch (error) {
    console.error('Error listing grievances:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve grievances.', error: error.message });
  }
};

exports.getGrievanceDetails = (req, res) => {
  try {
    const { identifier } = req.params; // ID or reference_id
    const user = req.user;

    const grievance = db.prepare(`
      SELECT g.*, 
             u.name AS citizen_name, u.email AS citizen_email, u.mobile AS citizen_mobile,
             d.name AS department_name, d.code AS department_code, d.nodal_officer, d.email AS department_email,
             ai_d.name AS ai_department_name
      FROM grievances g
      LEFT JOIN users u ON g.citizen_id = u.id
      LEFT JOIN departments d ON g.department_id = d.id
      LEFT JOIN departments ai_d ON g.ai_suggested_dept_id = ai_d.id
      WHERE g.id = ? OR g.reference_id = ?
    `).get(identifier, identifier);

    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance record not found.' });
    }

    // Role security check
    if (user.role === 'citizen' && grievance.citizen_id !== user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this grievance record.' });
    }
    if (user.role === 'officer' && user.department_id && grievance.department_id !== user.department_id) {
      return res.status(403).json({ success: false, message: 'Access denied: Grievance not assigned to your department.' });
    }

    // Fetch lifecycle timeline history
    const history = db.prepare(`
      SELECT * FROM grievance_history 
      WHERE grievance_id = ? 
      ORDER BY created_at ASC, id ASC
    `).all(grievance.id);

    // Fetch attachments
    const attachments = db.prepare(`
      SELECT * FROM attachments 
      WHERE grievance_id = ? 
      ORDER BY id ASC
    `).all(grievance.id);

    // Fetch feedback if any
    const feedback = db.prepare(`
      SELECT * FROM citizen_feedback 
      WHERE grievance_id = ?
    `).get(grievance.id);

    return res.json({
      success: true,
      grievance: {
        ...grievance,
        history,
        attachments,
        feedback
      }
    });
  } catch (error) {
    console.error('Error fetching grievance details:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Public Unauthenticated Grievance Tracking
 */
exports.trackPublicGrievance = (req, res) => {
  try {
    const { referenceId } = req.params;

    const grievance = db.prepare(`
      SELECT g.id, g.reference_id, g.district, g.taluk, g.category, g.subject, g.priority, g.status,
             g.is_escalated, g.action_taken_report, g.resolution_notes, g.resolved_at, g.created_at, g.updated_at,
             d.name AS department_name, d.code AS department_code,
             cf.rating AS feedback_rating
      FROM grievances g
      LEFT JOIN departments d ON g.department_id = d.id
      LEFT JOIN citizen_feedback cf ON g.id = cf.grievance_id
      WHERE g.reference_id = ?
    `).get(referenceId.trim());

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `No grievance found with reference number '${referenceId}'. Please double-check your ID.`
      });
    }

    // Public milestone history
    const history = db.prepare(`
      SELECT action, previous_status, new_status, remarks, created_at, user_role
      FROM grievance_history
      WHERE grievance_id = ?
      ORDER BY created_at ASC, id ASC
    `).all(grievance.id);

    return res.json({
      success: true,
      grievance: {
        ...grievance,
        history
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Status (Mandatory Workflow transition)
 */
exports.updateGrievanceStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, resolution_notes, action_taken_report } = req.body;
    const user = req.user;

    const validStatuses = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Reopened'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const currentGrievance = db.prepare('SELECT * FROM grievances WHERE id = ?').get(id);
    if (!currentGrievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found.' });
    }

    const previousStatus = currentGrievance.status;
    const resolvedAt = status === 'Resolved' ? new Date().toISOString() : (status === 'Reopened' ? null : currentGrievance.resolved_at);

    // Update grievance record
    db.prepare(`
      UPDATE grievances 
      SET status = ?, 
          resolution_notes = COALESCE(?, resolution_notes),
          action_taken_report = COALESCE(?, action_taken_report),
          resolved_at = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      status,
      resolution_notes || null,
      action_taken_report || null,
      resolvedAt,
      id
    );

    // Record lifecycle audit history
    db.prepare(`
      INSERT INTO grievance_history (
        grievance_id, user_id, user_name, user_role, action, previous_status, new_status, remarks
      ) VALUES (?, ?, ?, ?, 'STATUS_UPDATED', ?, ?, ?)
    `).run(
      id,
      user.id,
      user.name,
      user.role,
      previousStatus,
      status,
      remarks || `Status transitioned from '${previousStatus}' to '${status}' by ${user.role.toUpperCase()}.`
    );

    const updated = db.prepare(`
      SELECT g.*, d.name AS department_name 
      FROM grievances g 
      LEFT JOIN departments d ON g.department_id = d.id 
      WHERE g.id = ?
    `).get(id);

    return res.json({
      success: true,
      message: `Grievance status updated to '${status}'.`,
      grievance: updated
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CMO: Forward / Assign to Department
 */
exports.forwardToDepartment = (req, res) => {
  try {
    const { id } = req.params;
    const { department_id, remarks, priority } = req.body;
    const user = req.user;

    if (!department_id) {
      return res.status(400).json({ success: false, message: 'Department ID is required.' });
    }

    const dept = db.prepare('SELECT * FROM departments WHERE id = ?').get(department_id);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Selected department does not exist.' });
    }

    const currentGrievance = db.prepare('SELECT * FROM grievances WHERE id = ?').get(id);
    if (!currentGrievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found.' });
    }

    const newPriority = ['Low', 'Medium', 'High'].includes(priority) ? priority : currentGrievance.priority;

    db.prepare(`
      UPDATE grievances 
      SET department_id = ?, 
          priority = ?, 
          status = CASE WHEN status = 'Submitted' THEN 'Under Review' ELSE status END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(department_id, newPriority, id);

    db.prepare(`
      INSERT INTO grievance_history (
        grievance_id, user_id, user_name, user_role, action, previous_status, new_status, remarks
      ) VALUES (?, ?, ?, ?, 'FORWARDED_TO_DEPT', ?, 'Under Review', ?)
    `).run(
      id,
      user.id,
      user.name,
      user.role,
      currentGrievance.status,
      remarks || `CMO forwarded grievance to ${dept.name} (${dept.code}) for immediate investigation.`
    );

    return res.json({
      success: true,
      message: `Grievance forwarded to ${dept.name}.`,
      department: dept
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CMO: Escalate Grievance
 */
exports.escalateGrievance = (req, res) => {
  try {
    const { id } = req.params;
    const { escalation_reason } = req.body;
    const user = req.user;

    const grievance = db.prepare('SELECT * FROM grievances WHERE id = ?').get(id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found.' });
    }

    const newEscalatedState = grievance.is_escalated ? 0 : 1;
    const reason = newEscalatedState ? (escalation_reason || 'Escalated by Chief Minister Office for priority action.') : null;

    db.prepare(`
      UPDATE grievances 
      SET is_escalated = ?, escalation_reason = ?, priority = 'High', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newEscalatedState, reason, id);

    db.prepare(`
      INSERT INTO grievance_history (
        grievance_id, user_id, user_name, user_role, action, previous_status, new_status, remarks
      ) VALUES (?, ?, ?, ?, 'ESCALATED', ?, ?, ?)
    `).run(
      id,
      user.id,
      user.name,
      user.role,
      grievance.status,
      grievance.status,
      newEscalatedState 
        ? `Grievance ESCALATED by CMO. Reason: ${reason}`
        : 'Escalation flag removed by CMO administrator.'
    );

    return res.json({
      success: true,
      is_escalated: newEscalatedState,
      message: newEscalatedState ? 'Grievance escalated successfully.' : 'Grievance de-escalated.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Department Officer: Submit Action Taken Report (ATR)
 */
exports.submitActionTakenReport = (req, res) => {
  try {
    const { id } = req.params;
    const { action_taken_report, mark_resolved, remarks } = req.body;
    const user = req.user;

    if (!action_taken_report || action_taken_report.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Action Taken Report (ATR) text cannot be empty.' });
    }

    const grievance = db.prepare('SELECT * FROM grievances WHERE id = ?').get(id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found.' });
    }

    const newStatus = mark_resolved ? 'Resolved' : 'In Progress';
    const resolvedAt = mark_resolved ? new Date().toISOString() : null;

    db.prepare(`
      UPDATE grievances 
      SET action_taken_report = ?, 
          status = ?, 
          resolved_at = COALESCE(?, resolved_at),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(action_taken_report.trim(), newStatus, resolvedAt, id);

    db.prepare(`
      INSERT INTO grievance_history (
        grievance_id, user_id, user_name, user_role, action, previous_status, new_status, remarks
      ) VALUES (?, ?, ?, ?, 'ATR_SUBMITTED', ?, ?, ?)
    `).run(
      id,
      user.id,
      user.name,
      user.role,
      grievance.status,
      newStatus,
      remarks || `Action Taken Report (ATR) submitted by Officer ${user.name}: ${action_taken_report.substring(0, 150)}...`
    );

    return res.json({
      success: true,
      message: mark_resolved ? 'Action Taken Report submitted and grievance marked Resolved.' : 'Action Taken Report submitted.',
      status: newStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Citizen: Submit Feedback on Resolved Grievance
 */
exports.submitFeedback = (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comments } = req.body;
    const citizenId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5 stars.' });
    }

    const grievance = db.prepare('SELECT * FROM grievances WHERE id = ?').get(id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found.' });
    }

    if (grievance.citizen_id !== citizenId) {
      return res.status(403).json({ success: false, message: 'Only the grievance owner can submit feedback.' });
    }

    // Upsert feedback
    db.prepare(`
      INSERT INTO citizen_feedback (grievance_id, citizen_id, rating, comments, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(grievance_id) DO UPDATE SET 
        rating = excluded.rating, 
        comments = excluded.comments, 
        created_at = CURRENT_TIMESTAMP
    `).run(id, citizenId, rating, comments || null);

    db.prepare(`
      INSERT INTO grievance_history (
        grievance_id, user_id, user_name, user_role, action, previous_status, new_status, remarks
      ) VALUES (?, ?, ?, 'citizen', 'FEEDBACK_ADDED', ?, ?, ?)
    `).run(
      id,
      citizenId,
      req.user.name,
      grievance.status,
      grievance.status,
      `Citizen provided ${rating}-star rating: "${comments || 'No comment provided'}"`
    );

    return res.json({
      success: true,
      message: 'Thank you! Your feedback has been recorded and submitted to the Chief Minister Office.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Citizen: Reopen Grievance
 */
exports.reopenGrievance = (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const citizenId = req.user.id;

    const grievance = db.prepare('SELECT * FROM grievances WHERE id = ?').get(id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found.' });
    }

    if (grievance.citizen_id !== citizenId) {
      return res.status(403).json({ success: false, message: 'Only the filing citizen can reopen this grievance.' });
    }

    if (grievance.status !== 'Resolved') {
      return res.status(400).json({ success: false, message: 'Only grievances in "Resolved" state can be reopened.' });
    }

    db.prepare(`
      UPDATE grievances 
      SET status = 'Reopened', 
          is_escalated = 1, 
          escalation_reason = 'Reopened by citizen due to incomplete resolution.',
          resolved_at = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);

    db.prepare(`
      INSERT INTO grievance_history (
        grievance_id, user_id, user_name, user_role, action, previous_status, new_status, remarks
      ) VALUES (?, ?, ?, 'citizen', 'REOPENED', 'Resolved', 'Reopened', ?)
    `).run(
      id,
      citizenId,
      req.user.name,
      remarks || 'Citizen reopened grievance indicating the solution provided on ground was incomplete or unsatisfactory.'
    );

    return res.json({
      success: true,
      message: 'Grievance has been reopened and escalated to the CMO for expedited review.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
