import db from '../db.js';

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80"
];

// 1. جلب كل المشاريع (كودك الأصلي)
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

// 2. جلب مشروع واحد بالـ ID (جديد للـ Details page)
const getProjectById = async (id) => {
  try {
    const sql = `
      SELECT p.*, o.name AS organization_name 
      FROM public.projects p
      LEFT JOIN public.organizations o ON p.organization_id = o.id
      WHERE p.id = $1
    `;
    const result = await db.query(sql, [id]);
    
    if (result.rows.length === 0) return null;

    const project = result.rows[0];
    return {
      ...project,
      image_url: DEFAULT_IMAGES[project.id % DEFAULT_IMAGES.length] || DEFAULT_IMAGES[0]
    };
  } catch (error) {
    console.error("Error inside getProjectById model: ", error);
    throw error;
  }
};

// 3. جلب المؤسسات (تم تحويل pool إلى db لتوحيد الاتصال)
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

export default {
  getAll: getAllProjects,
  getAllProjects,
  getProjectById,
  getOrganizations
};

export {
  getAllProjects,
  getProjectById,
  getOrganizations
};
