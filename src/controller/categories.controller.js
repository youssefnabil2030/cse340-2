import categoryModel from '../models/categories.js';

// عرض صفحة كل التصنيفات
export const getCategoriesPage = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.render('categories', {
      title: 'Categories',
      categories
    });
  } catch (error) {
    next(error);
  }
};

// عرض صفحة تفاصيل تصنيف معين (جديد)
export const getCategoryDetails = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryModel.getCategoryById(categoryId);

    if (!category) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }

    const projects = await categoryModel.getProjectsByCategory(categoryId);

    res.render('category-details', {
      title: category.name,
      category,
      projects
    });
  } catch (error) {
    next(error);
  }
};
