import orgModel from '../models/organizations.js';

// عرض صفحة كل المؤسسات
export const getOrganizationsPage = async (req, res, next) => {
  try {
    const organizations = await orgModel.getAllOrganizations();
    res.render('organizations', {
      title: 'Organizations',
      organizations
    });
  } catch (error) {
    next(error);
  }
};

// عرض صفحة تفاصيل مؤسسة معينة مع مشاريعها
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
      title: organization.name,
      organization,
      projects
    });
  } catch (error) {
    next(error);
  }
};
