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
    if (!name || name.trim() === '') {
      return res.status(400).send('Category name cannot be empty');
    }

    const existing = await Category.findOne({ where: { name: name.trim() } });
    if (existing) {
      return res.status(409).send('Category name already exists');
    }

    await Category.create({ name: name.trim() });
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
    if (!name || name.trim() === '') {
      return res.status(400).send('Category name cannot be empty');
    }

    const existing = await Category.findOne({
      where: {
        name: name.trim(),
        id: { [db.Sequelize.Op.ne]: req.params.id } // exclude current category
      }
    });

    if (existing) {
      return res.status(409).send('Another category with that name already exists');
    }

    await Category.update({ name: name.trim() }, { where: { id: req.params.id } });
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