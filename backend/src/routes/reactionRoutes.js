const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionController');

router.post('/simulate', reactionController.simulateReaction);
router.get('/popular', reactionController.getPopularReactions);

module.exports = router;
