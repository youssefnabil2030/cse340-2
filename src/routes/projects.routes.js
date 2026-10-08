import { Router } from 'express';
import {
  getProjectsPage,
  getProjectDetails,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation
} from '../controller/projects.controller.js';

const router = Router();

router.get('/projects', getProjectsPage);
router.get('/new-project', showNewProjectForm);
router.get('/project/:id', getProjectDetails);
router.get('/edit-project/:id', showEditProjectForm);

router.post('/new-project', projectValidation, processNewProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

export default router;
