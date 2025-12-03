const express = require('express');
const router = express.Router();
const categoriesBusiness = require('../business/categories_business');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await categoriesBusiness.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create category
router.post('/', async (req, res) => {
    try {
        const category = await categoriesBusiness.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update category
router.put('/:id', async (req, res) => {
    try {
        const category = await categoriesBusiness.updateCategory(req.params.id, req.body);
        res.json(category);
    } catch (error) {
        if (error.message === 'Category not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        await categoriesBusiness.deleteCategory(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Category not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
