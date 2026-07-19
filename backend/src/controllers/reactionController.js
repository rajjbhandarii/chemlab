const reactionService = require('../services/reactionService');

exports.simulateReaction = async (req, res, next) => {
  try {
    const { reactants } = req.body;

    if (!reactants || !Array.isArray(reactants) || reactants.length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of reactant formulas.'
      });
    }

    const result = await reactionService.simulateReaction(reactants);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.getPopularReactions = async (req, res, next) => {
  try {
    const reactions = await reactionService.getPopularReactions();
    res.json({ success: true, data: reactions });
  } catch (error) {
    next(error);
  }
};
