import { Router } from 'express';
import categoryRoutes from './categories.route.js';
import projectRoutes from './projects.route.js';
import organizationRoutes from './organizations.route.js';

const router = Router();

router.use(categoryRoutes);
router.use(projectRoutes);
router.use(organizationRoutes);

export default router;
