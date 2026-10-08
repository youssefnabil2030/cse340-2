import { Router } from 'express';
import {
  getCategoriesPage,
  getCategoryDetails,
  getEducationPage,
  getReliefPage,
  getNewCategoryPage,
  createCategory,
  getEditCategoryPage,
  updateCategory,
  categoryValidation
} from '../controller/categories.controller.js';

const router = Router();

// 1. Static routes (must come before dynamic :id routes)
router.get('/categories', getCategoriesPage);
router.get('/new-category', getNewCategoryPage);
router.get('/categories/education', getEducationPage);
router.get('/categories/relief', getReliefPage);

// 2. Dynamic routes (must stay below static routes)
router.get('/category/:id', getCategoryDetails);
router.get('/edit-category/:id', getEditCategoryPage);

// 3. POST routes (create + update)
router.post('/new-category', categoryValidation, createCategory);
router.post('/edit-category/:id', categoryValidation, updateCategory);

export default router;
