import { Router } from 'express';
import { getCategoriesPage, getCategoryDetails } from '../controllers/categories.controller.js';

const router = Router();

router.get('/categories', getCategoriesPage);
router.get('/category/:id', getCategoryDetails);
router.get('/categories/education', getEducationPage);
router.get('/categories/relief', getReliefPage);

export default router;
