import { Router } from 'express';
import { 
  getCategoriesPage, 
  getCategoryDetails, 
  getEducationPage, 
  getReliefPage,
  getNewCategoryPage,
  createCategory,
  getEditCategoryPage,
  updateCategory
} from './src/controllers/categories.controller.js';

const router = Router();

// 1. Static Routes (الروابط الثابتة)
router.get('/categories', getCategoriesPage);
router.get('/new-category', getNewCategoryPage);
router.get('/categories/education', getEducationPage);
router.get('/categories/relief', getReliefPage);

// 2. Dynamic Routes (الروابط المتغيرة - لازم تبقى تحت)
router.get('/category/:id', getCategoryDetails);
router.get('/edit-category/:id', getEditCategoryPage);

// 3. POST Routes (للإضافة والتعديل)
router.post('/new-category', createCategory);
router.post('/edit-category/:id', updateCategory);

export default router;
