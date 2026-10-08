import orgModel from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// Validation + sanitization for organization forms
export const organizationValidation = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Organization name must be between 3 and 150 characters'),
  body('description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Organization description is required')
    .isLength({ max: 500 })
    .withMessage('Organization description cannot exceed 500 characters'),
  body('contactEmail')
    .trim()
    .notEmpty()
    .withMessage('Contact email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 150 })
    .withMessage('Location cannot exceed 150 characters')
];

// Display all organizations
export const getOrganizationsPage = async (req, res, next) => {
  try {
    const organizations = await orgModel.getAllOrganizations();
    res.render('organizations', {
      pageTitle: 'Organizations',
      title: 'Organizations',
      organizations
    });
  } catch (error) {
    next(error);
  }
};

// Display details for one organization with its projects
export const getOrganizationDetails = async (req, res, next) => {
  try {
    const orgId = req.params.id;
    const organization = await orgModel.getOrganizationById(orgId);

    if (!organization) {
      const err = new Error('Organization not found');
      err.status = 404;
      return next(err);
    }

    const projects = await orgModel.getProjectsByOrganization(orgId);

    res.render('organization-details', {
      pageTitle: organization.name,
      title: organization.name,
      organization,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// Show new-organization form (GET /new-organization)
export const showNewOrganizationForm = async (req, res) => {
  res.render('new-organization', {
    pageTitle: 'Add New Organization',
    title: 'Add New Organization',
    errors: [],
    formData: { name: '', description: '', contactEmail: '', location: '' }
  });
};

// Process new-organization form (POST /new-organization)
export const processNewOrganizationForm = async (req, res, next) => {
  try {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      return res.status(400).render('new-organization', {
        pageTitle: 'Add New Organization',
        title: 'Add New Organization',
        errors: results.array().map((e) => e.msg),
        formData: req.body
      });
    }

    const { name, description, contactEmail, location } = req.body;
    const logoFilename = 'default-logo.png';

    const organizationId = await orgModel.createOrganization(
      name,
      description,
      contactEmail,
      logoFilename,
      location || 'Unknown'
    );
    res.redirect(`/organization/${organizationId}`);
  } catch (error) {
    next(error);
  }
};

// Show edit-organization form (GET /edit-organization/:id)
export const showEditOrganizationForm = async (req, res, next) => {
  try {
    const organization = await orgModel.getOrganizationById(req.params.id);
    if (!organization) {
      const err = new Error('Organization not found');
      err.status = 404;
      return next(err);
    }
    res.render('edit-organization', {
      pageTitle: 'Edit Organization',
      title: 'Edit Organization',
      errors: [],
      organizationDetails: organization
    });
  } catch (error) {
    next(error);
  }
};

// Process edit-organization form (POST /edit-organization/:id)
export const processEditOrganizationForm = async (req, res, next) => {
  try {
    const id = req.params.id;
    const results = validationResult(req);

    if (!results.isEmpty()) {
      const organization = await orgModel.getOrganizationById(id);
      return res.status(400).render('edit-organization', {
        pageTitle: 'Edit Organization',
        title: 'Edit Organization',
        errors: results.array().map((e) => e.msg),
        organizationDetails: {
          ...(organization || {}),
          organization_id: id,
          name: req.body.name,
          description: req.body.description,
          contact_email: req.body.contactEmail,
          logo_filename: req.body.logoFilename || (organization ? organization.logo_filename : 'default-logo.png'),
          location: req.body.location
        }
      });
    }

    const { name, description, contactEmail, logoFilename, location } = req.body;
    const current = await orgModel.getOrganizationById(id);
    await orgModel.updateOrganization(
      id,
      name,
      description,
      contactEmail,
      logoFilename || (current ? current.logo_filename : 'default-logo.png'),
      location || 'Unknown'
    );
    res.redirect(`/organization/${id}`);
  } catch (error) {
    next(error);
  }
};
