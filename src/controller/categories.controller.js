import Category from '../models/categories.js';
import { getEducationProjects } from '../models/education.js';
import { getReliefProjects } from '../models/relief.js';

// 1. عرض كل التصنيفات
export const getCategoriesPage = async (req, res, next) => {
  try {
    const categories = await Category.getAll();
    res.render('categories', { pageTitle: 'Categories', categories });
  } catch (error) {
    next(error);
  }
};

// 2. عرض تفاصيل تصنيف معين عبر الـ ID
export const getCategoryDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.render('category-details', { 
      pageTitle: category.name, 
      category, 
      projects: category.projects || [] 
    });
  } catch (error) {
    next(error);
  }
};

// 3. صفحة Education المخصصة
export const getEducationPage = async (req, res, next) => {
  try {
    const projects = await getEducationProjects();
    res.render('category-details', {
      title: 'Education & Tutoring',
      category: { name: 'Education & Tutoring', description: 'Explore tutoring and educational service projects.' },
      projects
    });
  } catch (error) {
    next(error);
  }
};

// 4. صفحة Disaster Relief المخصصة
export const getReliefPage = async (req, res, next) => {
  try {
    const projects = await getReliefProjects();
    res.render('category-details', {
      title: 'Disaster Relief',
      category: { name: 'Disaster Relief', description: 'Explore disaster relief and community aid projects.' },
      projects
    });
  } catch (error) {
    next(error);
  }
};

// 5. صفحة إضافة تصنيف جديد (GET)
export const getNewCategoryPage = (req, res) => {
  res.render('new-category', { pageTitle: 'Add Category', errors: null, formData: {} });
};

// 6. إضافة تصنيف جديد (POST)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    // Server-side Validation
    if (!name || name.trim().length < 3) {
      return res.render('new-category', {
        pageTitle: 'Add Category',
        errors: ['Category name must be at least 3 characters long.'],
        formData: { name, description }
      });
    }
    await Category.create({ name, description });
    res.redirect('/categories');
  } catch (error) {
    next(error);
  }
};

// 7. صفحة تعديل تصنيف (GET)
export const getEditCategoryPage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);
    res.render('edit-category', { pageTitle: 'Edit Category', category, errors: null });
  } catch (error) {
    next(error);
  }
};

// 8. تحديث بيانات تصنيف (POST)
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name || name.trim().length < 3) {
      return res.render('edit-category', {
        pageTitle: 'Edit Category',
        category: { id, name, description },
        errors: ['Category name must be at least 3 characters long.']
      });
    }
    await Category.update(id, { name, description });
    res.redirect('/categories');
  } catch (error) {
    next(error);
  }
};
