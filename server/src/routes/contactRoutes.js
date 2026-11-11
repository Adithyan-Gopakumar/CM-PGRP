const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyToken, requireRoles } = require('../middleware/auth');

router.post('/', contactController.submitContactEnquiry);
router.get('/', verifyToken, requireRoles('cmo_admin'), contactController.listContactEnquiries);
router.patch('/:id/status', verifyToken, requireRoles('cmo_admin'), contactController.updateContactStatus);

module.exports = router;
