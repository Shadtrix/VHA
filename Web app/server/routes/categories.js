const express = require('express');
const router = express.Router();
const db = require('../models');
const Category = db.Category;

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch categories');
  }
});

// POST a new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    await Category.create({ name });
    res.status(201).send('Category added');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add category');
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    await Category.update({ name }, { where: { id: req.params.id } });
    res.send('Category updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update category');
  }
});

// DELETE a category
router.delete('/:id', async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.send('Category deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete category');
  }
});

module.exports = router;