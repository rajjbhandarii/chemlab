const Chemical = require('../models/Chemical');

class ChemicalService {
  async getAllChemicals(page = 1, limit = 50, category = null) {
    const query = category ? { category } : {};
    const skip = (page - 1) * limit;

    const [chemicals, total] = await Promise.all([
      Chemical.find(query)
        .select('name formula category color physicalState molarMass hazards imageUrl')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Chemical.countDocuments(query)
    ]);

    return {
      chemicals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getChemicalById(id) {
    return Chemical.findById(id).lean();
  }

  async searchChemicals(query, limit = 20) {
    if (!query || query.length < 1) return [];

    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    return Chemical.find({
      $or: [
        { name: regex },
        { formula: regex },
        { category: regex }
      ]
    })
      .select('name formula category physicalState color')
      .limit(limit)
      .lean();
  }

  async getCategories() {
    const categories = await Chemical.distinct('category');
    const categoryCounts = await Chemical.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    return categoryCounts.map(c => ({
      name: c._id,
      count: c.count
    }));
  }
}

module.exports = new ChemicalService();
