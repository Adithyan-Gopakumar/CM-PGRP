const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireRoles } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getProfile);
router.get('/officers', verifyToken, requireRoles('cmo_admin'), authController.getOfficersList);

module.exports = router;
