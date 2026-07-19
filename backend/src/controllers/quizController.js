const quizService = require('../services/quizService');

exports.getQuizzes = async (req, res, next) => {
  try {
    const difficulty = req.query.difficulty || null;
    const topic = req.query.topic || null;
    const limit = parseInt(req.query.limit) || 10;

    const quizzes = await quizService.getQuizzes(difficulty, topic, limit);
    res.json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
};

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await quizService.getTopics();
    res.json({ success: true, data: topics });
  } catch (error) {
    next(error);
  }
};

exports.getQuizCount = async (req, res, next) => {
  try {
    const counts = await quizService.getQuizCount();
    res.json({ success: true, data: counts });
  } catch (error) {
    next(error);
  }
};
