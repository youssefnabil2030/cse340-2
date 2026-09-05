import projectModel from '../models/projects.js';
import categoryModel from '../models/categories.js';

// عرض صفحة كل المشاريع
export const getProjectsPage = async (req, res, next) => {
  try {
    const projects = await projectModel.getAllProjects();
    res.render('index', {
      title: 'Home - Service Projects',
      projects
    });
  } catch (error) {
    next(error);
  }
};

// عرض صفحة تفاصيل مشروع معين مع الـ Category Tags بتاعته
export const getProjectDetails = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await projectModel.getProjectById(projectId);

    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }

    // جلب تصنيفات هذا المشروع لعرضها في الـ Details Page
    const categories = await categoryModel.getCategoriesByProject(projectId);

    res.render('project-details', {
      title: project.name || project.title,
      project,
      categories
    });
  } catch (error) {
    next(error);
  }
};
