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

export default {
  getAll: getAllOrganizations,
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganization
};

export {
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganization
};
