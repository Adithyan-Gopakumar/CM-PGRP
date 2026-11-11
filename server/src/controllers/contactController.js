const db = require('../config/db');

exports.submitContactEnquiry = (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Subject, and Message are required fields.'
      });
    }

    const result = db.prepare(`
      INSERT INTO contact_enquiries (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'New')
    `).run(name.trim(), email.trim(), phone ? phone.trim() : null, subject.trim(), message.trim());

    return res.status(201).json({
      success: true,
      message: 'Your enquiry has been received by the Chief Minister Office. We will get back to you shortly.',
      enquiryId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error saving contact enquiry:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit contact enquiry.', error: error.message });
  }
};

exports.listContactEnquiries = (req, res) => {
  try {
    const enquiries = db.prepare('SELECT * FROM contact_enquiries ORDER BY created_at DESC').all();
    return res.json({ success: true, count: enquiries.length, enquiries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateContactStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'Read', 'Replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    db.prepare('UPDATE contact_enquiries SET status = ? WHERE id = ?').run(status, id);
    return res.json({ success: true, message: `Enquiry status updated to ${status}.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
