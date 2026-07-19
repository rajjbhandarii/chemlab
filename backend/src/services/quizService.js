const Quiz = require('../models/Quiz');

class QuizService {
  async getQuizzes(difficulty = null, topic = null, limit = 20) {
    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topic = topic;

    return Quiz.aggregate([
      { $match: query },
      { $sample: { size: limit } }
    ]);
  }

  async getTopics() {
    return Quiz.distinct('topic');
  }

  async getQuizCount() {
    const counts = await Quiz.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    return counts.reduce((acc, c) => {
      acc[c._id] = c.count;
      return acc;
    }, {});
  }
}

module.exports = new QuizService();
