const Chemical = require('../models/Chemical');
const Reaction = require('../models/Reaction');

class SearchService {
  async globalSearch(query, limit = 20) {
    if (!query || query.length < 1) {
      return { chemicals: [], reactions: [] };
    }

    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const [chemicals, reactions] = await Promise.all([
      Chemical.find({
        $or: [
          { name: regex },
          { formula: regex },
          { category: regex }
        ]
      })
        .select('name formula category physicalState color')
        .limit(limit)
        .lean(),

      Reaction.find({
        $or: [
          { balancedEquation: regex },
          { reactants: regex },
          { reactantNames: regex },
          { reactionType: regex }
        ]
      })
        .select('reactants reactantNames balancedEquation reactionType')
        .limit(limit)
        .lean()
    ]);

    return { chemicals, reactions };
  }
}

module.exports = new SearchService();
