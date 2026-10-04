import db from '../db.js';

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80"
];

const getEducationProjects = async () => {
  try {
    const sql = `
      SELECT p.*, o.name AS organization_name 
      FROM public.projects p
      JOIN public.project_categories pc ON p.id = pc.project_id
      JOIN public.categories c ON pc.category_id = c.id
      LEFT JOIN public.organizations o ON p.organization_id = o.id
      WHERE c.name ILIKE '%Education%' OR c.name ILIKE '%Tutoring%'
      ORDER BY p.name ASC
    `;
    const result = await db.query(sql);

    return result.rows.map((project, index) => ({
      ...project,
      image_url: DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]
    }));
  } catch (error) {
    console.error("Error inside getEducationProjects model: ", error);
    throw error;
  }
};

export default {
  getEducationProjects
};

export {
  getEducationProjects
};
