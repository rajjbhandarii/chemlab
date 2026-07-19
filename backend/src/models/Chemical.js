const mongoose = require('mongoose');

const chemicalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  formula: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Acids', 'Bases', 'Salts', 'Metals', 'Non-metals',
      'Organic Compounds', 'Gases', 'Oxidizing Agents', 'Reducing Agents'
    ],
    index: true
  },
  molarMass: {
    type: Number
  },
  density: {
    value: Number,
    unit: { type: String, default: 'g/cm³' }
  },
  meltingPoint: {
    value: Number,
    unit: { type: String, default: '°C' }
  },
  boilingPoint: {
    value: Number,
    unit: { type: String, default: '°C' }
  },
  color: {
    type: String,
    default: 'Colorless'
  },
  physicalState: {
    type: String,
    enum: ['Solid', 'Liquid', 'Gas', 'Aqueous'],
    default: 'Solid'
  },
  odor: {
    type: String,
    default: 'Odorless'
  },
  solubility: {
    type: String,
    default: 'Soluble in water'
  },
  casNumber: {
    type: String
  },
  uses: [String],
  industrialUses: [String],
  labUses: [String],
  hazards: [String],
  storageInstructions: {
    type: String,
    default: 'Store in a cool, dry place.'
  },
  facts: [String],
  commonReactions: [{
    equation: String,
    description: String
  }],
  imageUrl: String
}, {
  timestamps: true
});

// Text index for search
chemicalSchema.index({
  name: 'text',
  formula: 'text',
  category: 'text'
});

module.exports = mongoose.model('Chemical', chemicalSchema);
