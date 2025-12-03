const { Category, Quiz } = require('../models');

const categoriesBusiness = {
    getAllCategories: async () => {
        return await Category.findAll({
            include: [{
                model: Quiz,
                attributes: ['id', 'title', 'difficulty']
            }],
            order: [['id', 'ASC']]
        });
    },

    getCategoryById: async (id) => {
        const category = await Category.findByPk(id, {
            include: [{
                model: Quiz,
                attributes: ['id', 'title', 'difficulty']
            }]
        });

        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    },

    createCategory: async (data) => {
        // Validation
        if (!data.name || data.name.trim() === '') {
            throw new Error('Category name is required');
        }

        // Check for duplicate
        const existingCategory = await Category.findOne({
            where: { name: data.name }
        });

        if (existingCategory) {
            throw new Error('Category with this name already exists');
        }

        return await Category.create(data);
    },

    updateCategory: async (id, data) => {
        // Check if category exists
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }

        // Validation
        if (data.name && data.name.trim() === '') {
            throw new Error('Category name cannot be empty');
        }

        // Check for duplicate name (excluding current category)
        if (data.name) {
            const duplicate = await Category.findOne({
                where: { name: data.name }
            });

            if (duplicate && duplicate.id !== parseInt(id)) {
                throw new Error('Category with this name already exists');
            }
        }

        await category.update(data);
        return category;
    },

    deleteCategory: async (id) => {
        const category = await Category.findByPk(id, {
            include: [Quiz]
        });

        if (!category) {
            throw new Error('Category not found');
        }

        // Check if category has quizzes
        if (category.Quizzes && category.Quizzes.length > 0) {
            throw new Error('Cannot delete category with existing quizzes');
        }

        await category.destroy();
        return true;
    }
};

module.exports = categoriesBusiness;
