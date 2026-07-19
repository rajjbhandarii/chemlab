const express = require('express');
const router = express.Router();
const chemicalController = require('../controllers/chemicalController');

router.get('/', chemicalController.getAllChemicals);
router.get('/search', chemicalController.searchChemicals);
router.get('/categories/list', chemicalController.getCategories);
router.get('/:id', chemicalController.getChemicalById);

module.exports = router;
