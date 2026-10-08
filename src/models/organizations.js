import db from '../db.js';

// 1. Fetch all organizations
const getAllOrganizations = async () => {
  try {
    const sql = "SELECT * FROM public.organizations ORDER BY name ASC";
    const result = await db.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Error inside getAllOrganizations model: ", error);
    throw error;
  }
};

// 2. Fetch a single organization by organization_id
const getOrganizationById = async (id) => {
  try {
    const sql = "SELECT * FROM public.organizations WHERE organization_id = $1";
    const result = await db.query(sql, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error inside getOrganizationById model: ", error);
    throw error;
  }
};

// 3. Fetch projects associated with a specific organization (including category array)
const getProjectsByOrganization = async (orgId) => {
  try {
    const sql = `
      SELECT 
        p.project_id,
        p.name,
        p.description,
        p.location,
        p.start_date,
        p.organization_id,
        ARRAY_AGG(c.name) AS categories
      FROM public.projects p
      LEFT JOIN public.project_categories pc ON p.project_id = pc.project_id
      LEFT JOIN public.categories c ON pc.category_id = c.category_id
      WHERE p.organization_id = $1
      GROUP BY p.project_id
      ORDER BY p.start_date DESC;
    `;
    const result = await db.query(sql, [orgId]);
    return result.rows;
  } catch (error) {
    console.error("Error inside getProjectsByOrganization model: ", error);
    throw error;
  }
};

// 4. Create a new organization.
// Schema: organization_id, name, description, contact_email,
//         logo_filename, location, date_created
const createOrganization = async (name, description, contactEmail, logoFilename = 'default-logo.png', location = 'Unknown') => {
  try {
    const sql = `
      INSERT INTO public.organizations (name, description, contact_email, logo_filename, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING organization_id;
    `;
    const result = await db.query(sql, [name, description, contactEmail, logoFilename, location]);
    if (result.rows.length === 0) {
      throw new Error('Failed to create organization');
    }
    return result.rows[0].organization_id;
  } catch (error) {
    console.error("Error inside createOrganization model: ", error);
    throw error;
  }
};

// 5. Update an existing organization by organization_id
const updateOrganization = async (id, name, description, contactEmail, logoFilename, location) => {
  try {
    const sql = `
      UPDATE public.organizations
      SET name = $1, description = $2, contact_email = $3, logo_filename = $4, location = $5
      WHERE organization_id = $6
      RETURNING *;
    `;
    const result = await db.query(sql, [name, description, contactEmail, logoFilename, location, id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error inside updateOrganization model: ", error);
    throw error;
  }
};

export default {
  getAll: getAllOrganizations,
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganization,
  create: createOrganization,
  update: updateOrganization,
  createOrganization,
  updateOrganization
};

export {
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganization,
  createOrganization,
  updateOrganization
};
