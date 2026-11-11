const express = require('express');
const router = express.Router();
const cmoController = require('../controllers/cmoController');
const { verifyToken, requireRoles } = require('../middleware/auth');

router.get(
  '/stats',
  verifyToken,
  requireRoles('cmo_admin'),
  cmoController.getDashboardStats
);

module.exports = router;
