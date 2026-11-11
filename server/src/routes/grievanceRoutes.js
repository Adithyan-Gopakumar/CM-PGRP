const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { verifyToken, requireRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public tracking
router.get('/track/:referenceId', grievanceController.trackPublicGrievance);

// Authenticated endpoints
router.post(
  '/',
  verifyToken,
  requireRoles('citizen'),
  upload.single('attachment'),
  grievanceController.submitGrievance
);

router.get('/', verifyToken, grievanceController.listGrievances);
router.get('/:identifier', verifyToken, grievanceController.getGrievanceDetails);

// Status updates & workflow
router.patch(
  '/:id/status',
  verifyToken,
  requireRoles('cmo_admin', 'officer'),
  grievanceController.updateGrievanceStatus
);

router.post(
  '/:id/forward',
  verifyToken,
  requireRoles('cmo_admin'),
  grievanceController.forwardToDepartment
);

router.post(
  '/:id/escalate',
  verifyToken,
  requireRoles('cmo_admin'),
  grievanceController.escalateGrievance
);

router.post(
  '/:id/atr',
  verifyToken,
  requireRoles('officer'),
  grievanceController.submitActionTakenReport
);

router.post(
  '/:id/feedback',
  verifyToken,
  requireRoles('citizen'),
  grievanceController.submitFeedback
);

router.post(
  '/:id/reopen',
  verifyToken,
  requireRoles('citizen'),
  grievanceController.reopenGrievance
);

module.exports = router;
