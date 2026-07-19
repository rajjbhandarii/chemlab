const Reaction = require('../models/Reaction');
const Chemical = require('../models/Chemical');
const aiReactionService = require('./aiReactionService');

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

    // Algorithmic Fallback Engine
    if (!reaction && normalized.length === 2) {
      reaction = await this.predictReaction(normalized);
    }

    // AI Prediction Engine (Ultimate Fallback)
    if (!reaction) {
      reaction = await aiReactionService.predictReaction(reactantFormulas);
    }

    if (reaction) {
      return { found: true, reaction };
    }

    return {
      found: false,
      message: `No known reaction found for the combination: ${reactantFormulas.join(' + ')}. This combination may not produce a significant reaction, or it may not be in our database yet.`
    };
  }

  async predictReaction(reactantFormulas) {
    const formulas = reactantFormulas.map(r => r.trim());
    const chemicals = await Chemical.find({ formula: { $in: formulas } }).lean();
    
    // We need both chemicals to be recognized in the DB to predict properly.
    if (chemicals.length !== 2) return null;

    let acid = chemicals.find(c => c.category === 'Acids' || c.formula.startsWith('H'));
    let base = chemicals.find(c => c.category === 'Bases' || c.formula.endsWith('OH'));

    // If one is acid and one is base, it's neutralization
    if (acid && base && acid !== base) {
      return this.predictNeutralization(acid, base);
    }

    return null;
  }

  predictNeutralization(acid, base) {
    let anion = acid.formula.replace(/^H[0-9₀-₉]*/, '');
    let cation = base.formula.replace(/\(OH\)[0-9₀-₉]*$/, '').replace(/OH$/, '');

    // Simplistic valency lookup
    const cationValencies = { 'Na': 1, 'K': 1, 'Li': 1, 'Ag': 1, 'NH₄': 1, 'Ca': 2, 'Mg': 2, 'Ba': 2, 'Zn': 2, 'Cu': 2, 'Fe': 2, 'Pb': 2, 'Al': 3 };
    const anionValencies = { 'Cl': 1, 'Br': 1, 'I': 1, 'F': 1, 'NO₃': 1, 'CH₃COO': 1, 'SO₄': 2, 'CO₃': 2, 'S': 2, 'PO₄': 3 };

    const cVal = cationValencies[cation] || 1;
    const aVal = anionValencies[anion] || 1;

    let cCount = aVal;
    let aCount = cVal;

    // Simplify ratio
    if (cCount === aCount) {
      cCount = 1;
      aCount = 1;
    } else if (cCount % 2 === 0 && aCount % 2 === 0) {
      cCount = cCount / 2;
      aCount = aCount / 2;
    }

    let saltFormula = '';
    
    // Format Cation part
    if (cCount > 1) {
      const subCount = String(cCount).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
      if (cation.match(/[A-Z][a-z]?[0-9₀-₉]+/)) {
        saltFormula += `(${cation})${subCount}`;
      } else {
        saltFormula += `${cation}${subCount}`;
      }
    } else {
      saltFormula += cation;
    }

    // Format Anion part
    if (aCount > 1) {
      const subCount = String(aCount).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
      if (anion.match(/[A-Z][a-z]?[0-9₀-₉]+/)) {
        saltFormula += `(${anion})${subCount}`;
      } else {
        saltFormula += `${anion}${subCount}`;
      }
    } else {
      saltFormula += anion;
    }

    const reaction = {
      reactants: [acid.formula, base.formula],
      reactantNames: [acid.name, base.name],
      products: [
        { name: 'Water', formula: 'H₂O', physicalState: 'Liquid', color: 'Colorless' },
        { name: `${cation} ${anion} Salt`, formula: saltFormula, physicalState: 'Aqueous', color: 'Colorless' }
      ],
      reactionType: 'Neutralization',
      balancedEquation: `${acid.formula} + ${base.formula} → ${saltFormula} + H₂O (Predicted)`,
      energy: 'Exothermic',
      observations: ['The solution may become warm due to the exothermic nature of neutralization.'],
      explanation: `This is a dynamically predicted Acid-Base neutralization reaction. The acid (${acid.name}) reacts with the base (${base.name}) to form a salt (${saltFormula}) and water.`,
      dangerLevel: 'Caution',
      safetyWarnings: [{ type: 'Heat', severity: 'Low', description: 'Neutralization reactions release heat.' }],
      isPopular: false
    };

    return reaction;
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
