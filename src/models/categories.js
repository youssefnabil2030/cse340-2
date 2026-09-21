import db from '../db.js';

const CATEGORY_IMAGES = {
  'Environmental Cleanup': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80',
  'Education & Tutoring': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80',
  'Community Outreach': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&auto=format&fit=crop&q=80',
  'Disaster Relief': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&auto=format&fit=crop&q=80'
};

const FALLBACK_POOL = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&auto=format&fit=crop&q=80'
];

// 1. جلب كل التصنيفات (الكود الأصلي بتاعك)
const getAllCategories = async () => {
  try {
    const sql = "SELECT * FROM public.categories ORDER BY name ASC";
    const result = await db.query(sql);

    return result.rows.map((category, index) => {
      const matchedImage = CATEGORY_IMAGES[category.name] || FALLBACK_POOL[index % FALLBACK_POOL.length];
      return {
        ...category,
        image_url: matchedImage
      };
    });
  } catch (error) {
    console.error("Error inside getAllCategories model: ", error);
    throw error;
  }
};

// 2. جلب تصنيف واحد بالـ ID (جديد للـ assignment)
const getCategoryById = async (id) => {
  try {
    const sql = "SELECT * FROM public.categories WHERE id = $1";
    const result = await db.query(sql, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error inside getCategoryById model: ", error);
    throw error;
  }
};

// 3. جلب المشاريع المربوطة بتصنيف معين (جديد للـ assignment)
const getProjectsByCategory = async (categoryId) => {
  try {
    const sql = `
      SELECT p.*, o.name AS organization_name 
      FROM public.projects p
      JOIN public.project_categories pc ON p.id = pc.project_id
      LEFT JOIN public.organizations o ON p.organization_id = o.id
      WHERE pc.category_id = $1
    `;
    const result = await db.query(sql, [categoryId]);
    return result.rows;
  } catch (error) {
    console.error("Error inside getProjectsByCategory model: ", error);
    throw error;
  }
};

// 4. جلب التصنيفات الخاصة بمشروع معين (جديد للـ Category Tags في صفحة المشروع)
const getCategoriesByProject = async (projectId) => {
  try {
    const sql = `
      SELECT c.* 
      FROM public.categories c
      JOIN public.project_categories pc ON c.id = pc.category_id
      WHERE pc.project_id = $1
    `;
    const result = await db.query(sql, [projectId]);
    return result.rows;
  } catch (error) {
    console.error("Error inside getCategoriesByProject model: ", error);
    throw error;
  }
};

export default {
  getAll: getAllCategories,
  getAllCategories,
  getCategoryById,
  getProjectsByCategory,
  getCategoriesByProject
};

export {
  getAllCategories,
  getCategoryById,
  getProjectsByCategory,
  getCategoriesByProject
};
