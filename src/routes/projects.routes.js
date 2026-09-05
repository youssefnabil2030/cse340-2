import { Router } from 'express';
import { getProjectsPage, getProjectDetails } from '../controllers/projects.controller.js';

const router = Router();

router.get('/', getProjectsPage);
router.get('/project/:id', getProjectDetails);

export default router;
