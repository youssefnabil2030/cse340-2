import Category from '../models/categories.js';
import { getEducationProjects } from '../models/education.js';
import { getReliefProjects } from '../models/relief.js';
import { body, validationResult } from 'express-validator';

// Validation rules for category forms.
// Server-side: name required, min 3, max 100.
// (Client-side uses required + maxlength=100 only, no minlength,
// so server-side min-length can be tested independently.)
export const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required.')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters long.')
];

// 1. Display all categories
export const getCategoriesPage = async (req, res, next) => {
  try {
    const categories = await Category.getAll();
    res.render('categories', { pageTitle: 'Categories', title: 'Categories', categories });
  } catch (error) {
    next(error);
  }
};

// 2. Display details for a single category by ID
export const getCategoryDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    const projects = await Category.getProjectsByCategory(id);
    res.render('category-details', {
      pageTitle: category.name,
      title: category.name,
      category,
      projects: projects || []
    });
  } catch (error) {
    next(error);
  }
};

// 3. Custom Education page
export const getEducationPage = async (req, res, next) => {
  try {
    const projects = await getEducationProjects();
    res.render('category-details', {
      pageTitle: 'Education & Tutoring',
      title: 'Education & Tutoring',
      category: { name: 'Education & Tutoring', description: 'Explore tutoring and educational service projects.' },
      projects
    });
  } catch (error) {
    next(error);
  }
};

// 4. Custom Disaster Relief page
export const getReliefPage = async (req, res, next) => {
  try {
    const projects = await getReliefProjects();
    res.render('category-details', {
      pageTitle: 'Disaster Relief',
      title: 'Disaster Relief',
      category: { name: 'Disaster Relief', description: 'Explore disaster relief and community aid projects.' },
      projects
    });
  } catch (error) {
    next(error);
  }
};

// 5. Show new-category form (GET /new-category)
export const getNewCategoryPage = (req, res) => {
  res.render('new-category', {
    pageTitle: 'Add Category',
    title: 'Add New Category',
    errors: [],
    formData: { name: '' }
  });
};

// 6. Process new-category form (POST /new-category)
export const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const name = req.body.name ? req.body.name.trim() : '';

    if (!errors.isEmpty()) {
      return res.status(400).render('new-category', {
        pageTitle: 'Add Category',
        title: 'Add New Category',
        errors: errors.array().map((e) => e.msg),
        formData: { name: req.body.name || '' }
      });
    }

    // Manual guard (same rules) so validation holds even without middleware
    if (!name || name.length < 3 || name.length > 100) {
      return res.status(400).render('new-category', {
        pageTitle: 'Add Category',
        title: 'Add New Category',
        errors: ['Category name is required and must be between 3 and 100 characters long.'],
        formData: { name: req.body.name || '' }
      });
    }

    await Category.create({ name });
    res.redirect('/categories');
  } catch (error) {
    next(error);
  }
};

// 7. Show edit-category form (GET /edit-category/:id)
export const getEditCategoryPage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.render('edit-category', {
      pageTitle: 'Edit Category',
      title: 'Edit Category',
      category,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// 8. Process edit-category form (POST /edit-category/:id)
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    const name = req.body.name ? req.body.name.trim() : '';

    const current = await Category.getById(id);
    if (!current) {
      return res.status(404).send('Category not found');
    }

    if (!errors.isEmpty()) {
      return res.status(400).render('edit-category', {
        pageTitle: 'Edit Category',
        title: 'Edit Category',
        category: { ...current, name: req.body.name || '' },
        errors: errors.array().map((e) => e.msg)
      });
    }

    if (!name || name.length < 3 || name.length > 100) {
      return res.status(400).render('edit-category', {
        pageTitle: 'Edit Category',
        title: 'Edit Category',
        category: { ...current, name: req.body.name || '' },
        errors: ['Category name is required and must be between 3 and 100 characters long.']
      });
    }

    await Category.update(id, { name });
    res.redirect('/categories');
  } catch (error) {
    next(error);
  }
};
