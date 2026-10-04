import db from '../db.js';

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80"
];

const getReliefProjects = async () => {
  try {
    const sql = `
      SELECT p.*, o.name AS organization_name 
      FROM public.projects p
      JOIN public.project_categories pc ON p.id = pc.project_id
      JOIN public.categories c ON pc.category_id = c.id
      LEFT JOIN public.organizations o ON p.organization_id = o.id
      WHERE c.name ILIKE '%Relief%' OR c.name ILIKE '%Disaster%'
      ORDER BY p.name ASC
    `;
    const result = await db.query(sql);

    return result.rows.map((project, index) => ({
      ...project,
      image_url: DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]
    }));
  } catch (error) {
    console.error("Error inside getReliefProjects model: ", error);
    throw error;
  }
};

export default {
  getReliefProjects
};

export {
  getReliefProjects
};
