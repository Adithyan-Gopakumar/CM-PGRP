const db = require('../config/db');

exports.getAllDepartments = (req, res) => {
  try {
    const departments = db.prepare(`
      SELECT d.*, 
        (SELECT COUNT(*) FROM grievances g WHERE g.department_id = d.id) AS total_grievances,
        (SELECT COUNT(*) FROM grievances g WHERE g.department_id = d.id AND g.status = 'Resolved') AS resolved_grievances,
        (SELECT COUNT(*) FROM grievances g WHERE g.department_id = d.id AND g.status IN ('Submitted', 'Under Review', 'In Progress', 'Reopened')) AS pending_grievances
      FROM departments d
      ORDER BY d.name ASC
    `).all();

    return res.json({ success: true, count: departments.length, departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve departments.', error: error.message });
  }
};

exports.getDepartmentById = (req, res) => {
  try {
    const { id } = req.params;
    const department = db.prepare('SELECT * FROM departments WHERE id = ? OR code = ?').get(id, id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    const officers = db.prepare('SELECT id, name, email, mobile, district FROM users WHERE department_id = ? AND role = "officer"').all(department.id);
    const recentGrievances = db.prepare(`
      SELECT id, reference_id, subject, category, district, priority, status, created_at 
      FROM grievances 
      WHERE department_id = ? 
      ORDER BY id DESC LIMIT 5
    `).all(department.id);

    return res.json({
      success: true,
      department: {
        ...department,
        officers,
        recentGrievances
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
