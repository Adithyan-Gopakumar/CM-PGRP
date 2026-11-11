const db = require('../config/db');

exports.getDashboardStats = (req, res) => {
  try {
    // 1. Overall counts
    const totalGrievances = db.prepare('SELECT COUNT(*) as count FROM grievances').get().count;
    const resolvedGrievances = db.prepare("SELECT COUNT(*) as count FROM grievances WHERE status = 'Resolved'").get().count;
    const pendingGrievances = db.prepare("SELECT COUNT(*) as count FROM grievances WHERE status IN ('Submitted', 'Under Review', 'In Progress', 'Reopened')").get().count;
    const submittedGrievances = db.prepare("SELECT COUNT(*) as count FROM grievances WHERE status = 'Submitted'").get().count;
    const underReviewGrievances = db.prepare("SELECT COUNT(*) as count FROM grievances WHERE status = 'Under Review'").get().count;
    const inProgressGrievances = db.prepare("SELECT COUNT(*) as count FROM grievances WHERE status = 'In Progress'").get().count;
    const reopenedGrievances = db.prepare("SELECT COUNT(*) as count FROM grievances WHERE status = 'Reopened'").get().count;
    const escalatedGrievances = db.prepare('SELECT COUNT(*) as count FROM grievances WHERE is_escalated = 1').get().count;

    // Overdue grievances: pending for more than 7 days
    const overdueGrievances = db.prepare(`
      SELECT COUNT(*) as count FROM grievances 
      WHERE status != 'Resolved' AND datetime(created_at) < datetime('now', '-7 days')
    `).get().count;

    // 2. District-wise breakdown (14 Kerala districts)
    const keralaDistricts = [
      'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
      'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
      'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
    ];

    const districtStatsRaw = db.prepare(`
      SELECT district,
             COUNT(*) as total,
             SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
             SUM(CASE WHEN status != 'Resolved' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as high_priority
      FROM grievances
      GROUP BY district
    `).all();

    const districtMap = {};
    districtStatsRaw.forEach(item => {
      districtMap[item.district] = item;
    });

    const districtStats = keralaDistricts.map(name => {
      const match = districtMap[name] || { total: 0, resolved: 0, pending: 0, high_priority: 0 };
      return {
        district: name,
        total: match.total,
        resolved: match.resolved,
        pending: match.pending,
        highPriority: match.high_priority
      };
    });

    // 3. Department-wise breakdown
    const departmentStats = db.prepare(`
      SELECT d.id, d.code, d.name,
             COUNT(g.id) as total,
             SUM(CASE WHEN g.status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
             SUM(CASE WHEN g.status != 'Resolved' AND g.id IS NOT NULL THEN 1 ELSE 0 END) as pending,
             ROUND(CASE WHEN COUNT(g.id) > 0 
                   THEN (CAST(SUM(CASE WHEN g.status = 'Resolved' THEN 1 ELSE 0 END) AS REAL) / COUNT(g.id)) * 100 
                   ELSE 0 END, 1) as resolution_rate
      FROM departments d
      LEFT JOIN grievances g ON d.id = g.department_id
      GROUP BY d.id
      ORDER BY total DESC
    `).all();

    // 4. Priority breakdown
    const priorityStats = db.prepare(`
      SELECT priority, COUNT(*) as count
      FROM grievances
      GROUP BY priority
    `).all();

    // 5. Status breakdown
    const statusStats = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM grievances
      GROUP BY status
    `).all();

    // 6. Recent Audit Events (Latest 10)
    const recentActivity = db.prepare(`
      SELECT gh.*, g.reference_id, g.subject, g.district
      FROM grievance_history gh
      JOIN grievances g ON gh.grievance_id = g.id
      ORDER BY gh.created_at DESC, gh.id DESC
      LIMIT 10
    `).all();

    // 7. Contact enquiries summary
    const contactCount = db.prepare('SELECT COUNT(*) as count FROM contact_enquiries').get().count;

    return res.json({
      success: true,
      data: {
        summary: {
          total: totalGrievances,
          resolved: resolvedGrievances,
          pending: pendingGrievances,
          submitted: submittedGrievances,
          underReview: underReviewGrievances,
          inProgress: inProgressGrievances,
          reopened: reopenedGrievances,
          escalated: escalatedGrievances,
          overdue: overdueGrievances,
          resolutionRate: totalGrievances > 0 ? Math.round((resolvedGrievances / totalGrievances) * 100) : 0,
          contactEnquiries: contactCount
        },
        districtStats,
        departmentStats,
        priorityStats,
        statusStats,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error computing dashboard statistics:', error);
    return res.status(500).json({ success: false, message: 'Failed to compute dashboard stats.', error: error.message });
  }
};
