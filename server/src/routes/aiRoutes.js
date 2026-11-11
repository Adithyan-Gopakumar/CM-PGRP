const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalToken } = require('../middleware/auth');

router.post('/analyze', optionalToken, aiController.analyzeComplaintText);

module.exports = router;
