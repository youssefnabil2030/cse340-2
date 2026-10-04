import db from '../db.js';

export const getReliefProjects = async () => {
  try {
    const sql = "SELECT * FROM public.projects WHERE ..."; // الاستعلام بتاعك
    const result = await db.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Error in relief model: ", error);
    throw error;
  }
};
