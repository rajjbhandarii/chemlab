const Chemical = require('../models/Chemical');
const Reaction = require('../models/Reaction');
const Quiz = require('../models/Quiz');

exports.getStats = async (req, res, next) => {
  try {
    const [chemicalsCount, reactionsCount, quizzesCount] = await Promise.all([
      Chemical.countDocuments(),
      Reaction.countDocuments(),
      Quiz.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        chemicals: chemicalsCount,
        reactions: reactionsCount,
        quizzes: quizzesCount
      }
    });
  } catch (error) {
    next(error);
  }
};
