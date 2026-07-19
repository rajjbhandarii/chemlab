const chemicalService = require('../services/chemicalService');

exports.getAllChemicals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const category = req.query.category || null;

    const result = await chemicalService.getAllChemicals(page, limit, category);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.getChemicalById = async (req, res, next) => {
  try {
    const chemical = await chemicalService.getChemicalById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ success: false, message: 'Chemical not found' });
    }
    res.json({ success: true, data: chemical });
  } catch (error) {
    next(error);
  }
};

exports.searchChemicals = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const limit = parseInt(req.query.limit) || 20;
    const results = await chemicalService.searchChemicals(query, limit);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await chemicalService.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};
