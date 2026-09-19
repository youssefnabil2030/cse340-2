import { Router } from 'express';
import { getCategoriesPage, getCategoryDetails } from '../controllers/categories.controller.js';

const router = Router();

router.get('/categories', getCategoriesPage);
router.get('/category/:id', getCategoryDetails);

export default router;
