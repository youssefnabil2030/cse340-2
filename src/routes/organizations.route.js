import { Router } from 'express';
import { getOrganizationsPage, getOrganizationDetails } from '../controllers/organizations.controller.js';

const router = Router();

router.get('/organizations', getOrganizationsPage);
router.get('/organization/:id', getOrganizationDetails);

export default router;
