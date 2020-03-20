const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { validationResult } = require('express-validator');

const Category = require('../../models/Category');

// @route   POST api/category
// @desc    Create a category
// @access  Private

router.post('/', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  const categoryFields = {};
  if (name) categoryFields.name = name;

  try {
    let category = await Category.findOne({ name });

    if (category) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Category already exists!' }] });
    }

    //create
    category = new Category(categoryFields);

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/category
// @desc    Get all categories
// @access  Private

router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/category/:category_id
// @desc    Get category by category ID
// @access  Private

router.get('/:category_id', auth, async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.category_id
    });

    if (!category) return res.status(400).json({ msg: 'Category not found' });

    res.json(category);
  } catch (err) {
    console.error(err.message);

    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Category not found!' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/category/:category_id
// @desc    Delete category by category ID
// @access  Private

router.delete('/:category_id', auth, async (req, res) => {
  try {
    await Category.findOneAndRemove({
      _id: req.params.category_id
    });

    res.json({ msg: 'Category deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
