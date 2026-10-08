import projectModel from '../models/projects.js';
import categoryModel from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// Validation + sanitization for service-project forms
export const projectValidation = [
  body('title')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Project title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 1000 })
    .withMessage('Project description cannot exceed 1000 characters'),
  body('location')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Project location is required')
    .isLength({ max: 200 })
    .withMessage('Project location cannot exceed 200 characters'),
  body('date')
    .notEmpty()
    .withMessage('Project date is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('organizationId')
    .notEmpty()
    .withMessage('Organization is required')
    .isInt()
    .withMessage('Please select a valid organization')
];

// Display all service projects
export const getProjectsPage = async (req, res, next) => {
  try {
    const projects = await projectModel.getAllProjects();
    res.render('projects', {
      pageTitle: 'Service Projects',
      title: 'Service Projects',
      projects
    });
  } catch (error) {
    next(error);
  }
};

// Display details for one project with its category tags
export const getProjectDetails = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await projectModel.getProjectById(projectId);

    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }

    const categories = await categoryModel.getCategoriesByProject(projectId);

    res.render('project-details', {
      pageTitle: project.name,
      title: project.name || project.title,
      project,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// Show new-project form (GET /new-project)
export const showNewProjectForm = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('new-project', {
      pageTitle: 'Add New Project',
      title: 'Add New Service Project',
      errors: [],
      organizations,
      formData: { title: '', description: '', location: '', date: '', organizationId: '' }
    });
  } catch (error) {
    next(error);
  }
};

// Process new-project form (POST /new-project)
export const processNewProjectForm = async (req, res, next) => {
  try {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      const organizations = await getAllOrganizations();
      return res.status(400).render('new-project', {
        pageTitle: 'Add New Project',
        title: 'Add New Service Project',
        errors: results.array().map((e) => e.msg),
        organizations,
        formData: req.body
      });
    }

    const { title, description, location, date, organizationId } = req.body;
    await projectModel.createProject(title, description, location, date, organizationId);
    res.redirect('/projects');
  } catch (error) {
    next(error);
  }
};

// Show edit-project form (GET /edit-project/:id)
export const showEditProjectForm = async (req, res, next) => {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }
    const organizations = await getAllOrganizations();
    res.render('edit-project', {
      pageTitle: 'Edit Project',
      title: 'Edit Service Project',
      errors: [],
      organizations,
      project
    });
  } catch (error) {
    next(error);
  }
};

// Process edit-project form (POST /edit-project/:id)
export const processEditProjectForm = async (req, res, next) => {
  try {
    const id = req.params.id;
    const results = validationResult(req);

    if (!results.isEmpty()) {
      const project = await projectModel.getProjectById(id);
      const organizations = await getAllOrganizations();
      return res.status(400).render('edit-project', {
        pageTitle: 'Edit Project',
        title: 'Edit Service Project',
        errors: results.array().map((e) => e.msg),
        organizations,
        project: {
          ...(project || {}),
          project_id: id,
          name: req.body.title,
          description: req.body.description,
          location: req.body.location,
          start_date: req.body.date,
          organization_id: req.body.organizationId
        }
      });
    }

    const { title, description, location, date, organizationId } = req.body;
    await projectModel.updateProject(id, title, description, location, date, organizationId);
    res.redirect(`/project/${id}`);
  } catch (error) {
    next(error);
  }
};
