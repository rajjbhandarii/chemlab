const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/', quizController.getQuizzes);
router.get('/topics', quizController.getTopics);
router.get('/count', quizController.getQuizCount);

module.exports = router;
