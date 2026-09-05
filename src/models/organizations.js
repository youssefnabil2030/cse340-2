import db from '../db.js';

// 1. جلب كل المؤسسات (كودك الأصلي)
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

// 2. جلب مؤسسة واحدة بالـ ID
const getOrganizationById = async (id) => {
  try {
    const sql = "SELECT * FROM public.organizations WHERE id = $1";
    const result = await db.query(sql, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error inside getOrganizationById model: ", error);
    throw error;
  }
};

// 3. جلب المشاريع التابعة لمؤسسة معينة
const getProjectsByOrganization = async (orgId) => {
  try {
    const sql = "SELECT * FROM public.projects WHERE organization_id = $1 ORDER BY created_at DESC";
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
