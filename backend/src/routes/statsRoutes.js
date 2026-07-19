const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// @route   GET /api/stats
// @desc    Get counts for chemicals, reactions, and quizzes
// @access  Public
router.get('/', statsController.getStats);

module.exports = router;
