const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, district } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory fields (Name, Email, Mobile, Password).' });
    }

    // Check email uniqueness
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, mobile, password, role, district)
      VALUES (?, ?, ?, ?, 'citizen', ?)
    `).run(name.trim(), email.toLowerCase().trim(), mobile.trim(), hashedPassword, district || 'Thiruvananthapuram');

    const newUserId = result.lastInsertRowid;
    const user = db.prepare('SELECT id, name, email, mobile, role, district, created_at FROM users WHERE id = ?').get(newUserId);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Citizen registration completed successfully.',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.prepare(`
      SELECT u.id, u.name, u.email, u.mobile, u.password, u.role, u.district, u.department_id,
             d.name as department_name, d.code as department_code
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE LOWER(u.email) = ?
    `).get(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, department_id: user.department_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during authentication.', error: error.message });
  }
};

exports.getProfile = (req, res) => {
  try {
    const user = db.prepare(`
      SELECT u.id, u.name, u.email, u.mobile, u.role, u.district, u.department_id,
             d.name as department_name, d.code as department_code
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOfficersList = (req, res) => {
  try {
    const officers = db.prepare(`
      SELECT u.id, u.name, u.email, u.mobile, u.district, u.department_id, d.name as department_name, d.code as department_code
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.role = 'officer'
      ORDER BY d.name, u.name
    `).all();

    return res.json({ success: true, count: officers.length, officers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
