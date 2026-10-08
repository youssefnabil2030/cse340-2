import { Router } from 'express';
import {
  getOrganizationsPage,
  getOrganizationDetails,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation
} from '../controller/organizations.controller.js';

const router = Router();

router.get('/organizations', getOrganizationsPage);
router.get('/new-organization', showNewOrganizationForm);
router.get('/organization/:id', getOrganizationDetails);
router.get('/edit-organization/:id', showEditOrganizationForm);

router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

export default router;
