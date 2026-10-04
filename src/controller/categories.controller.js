import { getEducationProjects } from '../models/education.js';
import { getReliefProjects } from '../models/relief.js';

// Controller لصفحة Education
export const getEducationPage = async (req, res, next) => {
  try {
    const projects = await getEducationProjects();
    res.render('category-details', {
      title: 'Education & Tutoring',
      category: { name: 'Education & Tutoring', description: 'Explore tutoring and educational service projects.' },
      projects
    });
  } catch (error) {
    next(error);
  }
};

// Controller لصفحة Relief
export const getReliefPage = async (req, res, next) => {
  try {
    const projects = await getReliefProjects();
    res.render('category-details', {
      title: 'Disaster Relief',
      category: { name: 'Disaster Relief', description: 'Explore disaster relief and community aid projects.' },
      projects
    });
  } catch (error) {
    next(error);
  }
};
