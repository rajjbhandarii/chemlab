const searchService = require('../services/searchService');

exports.globalSearch = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const limit = parseInt(req.query.limit) || 20;
    const results = await searchService.globalSearch(query, limit);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
