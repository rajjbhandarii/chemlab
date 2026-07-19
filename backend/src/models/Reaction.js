const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  reactants: [{
    type: String,
    required: true
  }],
  reactantNames: [{
    type: String
  }],
  products: [{
    name: { type: String, required: true },
    formula: { type: String, required: true },
    physicalState: { type: String, enum: ['Solid', 'Liquid', 'Gas', 'Aqueous'], default: 'Aqueous' },
    color: { type: String, default: 'Colorless' }
  }],
  balancedEquation: {
    type: String,
    required: true
  },
  reactionType: {
    type: String,
    required: true,
    enum: [
      'Neutralization', 'Combustion', 'Precipitation',
      'Single Displacement', 'Double Displacement', 'Redox',
      'Synthesis', 'Decomposition', 'No Reaction', 'Acid-Metal',
      'Acid-Carbonate', 'Oxidation', 'Reduction', 'Disproportionation',
      'Complex Formation'
    ]
  },
  energy: {
    type: String,
    enum: ['Exothermic', 'Endothermic', 'Neutral'],
    default: 'Exothermic'
  },
  observations: [String],
  conditions: {
    required: { type: Boolean, default: false },
    details: [String]
  },
  explanation: {
    type: String,
    required: true
  },
  dangerLevel: {
    type: String,
    enum: ['Safe', 'Caution', 'Unsafe', 'Highly Dangerous'],
    default: 'Caution'
  },
  safetyWarnings: [{
    type: { type: String },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    description: String
  }],
  funFact: {
    type: String
  },
  isPopular: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Compound index on sorted reactants for efficient lookup
reactionSchema.index({ reactants: 1 });

module.exports = mongoose.model('Reaction', reactionSchema);
