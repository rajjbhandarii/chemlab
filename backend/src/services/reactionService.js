const Reaction = require('../models/Reaction');

class ReactionService {
  /**
   * Simulate a reaction by looking up reactants in the database.
   * Normalizes reactant formulas for matching by sorting them.
   */
  async simulateReaction(reactantFormulas) {
    if (!reactantFormulas || reactantFormulas.length < 1) {
      return { found: false, message: 'Please provide at least one reactant.' };
    }

    // Normalize: trim, sort for consistent matching
    const normalized = reactantFormulas.map(r => r.trim()).sort();

    // Try exact match first (sorted reactants)
    let reaction = await Reaction.findOne({
      $expr: {
        $setEquals: ['$reactants', normalized]
      }
    }).lean();

    // If not found, try matching with different formula representations
    if (!reaction) {
      // Try matching by looking at all reactions and comparing sets
      const allReactions = await Reaction.find({
        reactants: { $size: normalized.length }
      }).lean();

      reaction = allReactions.find(r => {
        const dbReactants = r.reactants.map(x => x.trim()).sort();
        return dbReactants.length === normalized.length &&
          dbReactants.every((val, idx) => val === normalized[idx]);
      });
    }

    // Also try reverse order for 2-reactant reactions
    if (!reaction && normalized.length === 2) {
      reaction = await Reaction.findOne({
        $expr: {
          $setEquals: ['$reactants', [normalized[1], normalized[0]]]
        }
      }).lean();
    }

    if (reaction) {
      return { found: true, reaction };
    }

    return {
      found: false,
      message: `No known reaction found for the combination: ${reactantFormulas.join(' + ')}. This combination may not produce a significant reaction, or it may not be in our database yet.`
    };
  }

  async getPopularReactions() {
    return Reaction.find({ isPopular: true })
      .select('reactants reactantNames balancedEquation reactionType products')
      .lean();
  }

  async getReactionsByType(type) {
    return Reaction.find({ reactionType: type }).lean();
  }
}

module.exports = new ReactionService();
