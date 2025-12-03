const { Category, Quiz } = require('../models');

const getAllCategories = async () => {
    const categories = await Category.findAll({
        include: [{
            model: Quiz,
            attributes: ['id']
        }]
    });

    return categories.map(cat => ({
        ...cat.toJSON(),
        quizCount: cat.Quizzes ? cat.Quizzes.length : 0,
        canDelete: !cat.Quizzes || cat.Quizzes.length === 0
    }));
};

const createCategory = async (data) => {
    return await Category.create(data);
};

const updateCategory = async (id, data) => {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');
    return await category.update(data);
};

const deleteCategory = async (id) => {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');
    return await category.destroy();
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
