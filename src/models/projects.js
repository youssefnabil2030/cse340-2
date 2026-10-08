import db from '../db.js';

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80"
];

// 1. Fetch all projects
const getAllProjects = async () => {
  try {
    const sql = "SELECT * FROM public.projects ORDER BY name ASC";
    const result = await db.query(sql);

    return result.rows.map((project, index) => ({
      ...project,
      image_url: DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]
    }));
  } catch (error) {
    console.error("Error inside getAllProjects model: ", error);
    throw error;
  }
};

// 2. Fetch single project by project_id
const getProjectById = async (id) => {
  try {
    const sql = `
      SELECT p.*, o.name AS organization_name 
      FROM public.projects p
      LEFT JOIN public.organizations o ON p.organization_id = o.organization_id
      WHERE p.project_id = $1
    `;
    const result = await db.query(sql, [id]);
    
    if (result.rows.length === 0) return null;

    const project = result.rows[0];
    const imageIndex = project.project_id ? (project.project_id % DEFAULT_IMAGES.length) : 0;

    return {
      ...project,
      image_url: DEFAULT_IMAGES[imageIndex] || DEFAULT_IMAGES[0]
    };
  } catch (error) {
    console.error("Error inside getProjectById model: ", error);
    throw error;
  }
};

// 3. Fetch all organizations
const getOrganizations = async () => {
  try {
    const sql = "SELECT organization_id, name, description, contact_email, logo_filename, location, date_created FROM public.organizations ORDER BY name ASC";
    const result = await db.query(sql);
    return result.rows;
  } catch (error) {
    console.error("getOrganizations error: " + error);
    return [];
  }
};

// 4. Create a new service project.
// Schema: project_id, name, description, location, start_date, organization_id
const createProject = async (title, description, location, date, organizationId) => {
  try {
    const sql = `
      INSERT INTO public.projects (name, description, location, start_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;
    const result = await db.query(sql, [title, description, location, date, organizationId]);
    if (result.rows.length === 0) {
      throw new Error('Failed to create project');
    }
    return result.rows[0].project_id;
  } catch (error) {
    console.error("Error inside createProject model: ", error);
    throw error;
  }
};

// 5. Update an existing service project by project_id
const updateProject = async (id, title, description, location, date, organizationId) => {
  try {
    const sql = `
      UPDATE public.projects
      SET name = $1, description = $2, location = $3, start_date = $4, organization_id = $5
      WHERE project_id = $6
      RETURNING *;
    `;
    const result = await db.query(sql, [title, description, location, date, organizationId, id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error inside updateProject model: ", error);
    throw error;
  }
};

export default {
  getAll: getAllProjects,
  getAllProjects,
  getProjectById,
  getOrganizations,
  create: createProject,
  update: updateProject,
  createProject,
  updateProject
};

export {
  getAllProjects,
  getProjectById,
  getOrganizations,
  createProject,
  updateProject
};
