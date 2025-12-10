const { categoryOperations } = require('../json_db');

const categoriesBusiness = {
    getAllCategories: async () => {
        return categoryOperations.getAll();
    },

    getCategoryById: async (id) => {
        const category = categoryOperations.getById(id);
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
        const existingCategories = categoryOperations.getAll();
        const duplicate = existingCategories.find(cat =>
            cat.name.toLowerCase() === data.name.toLowerCase()
        );

        if (duplicate) {
            throw new Error('Category with this name already exists');
        }

        return categoryOperations.create(data);
    },

    updateCategory: async (id, data) => {
        // Check if category exists
        const existing = categoryOperations.getById(id);
        if (!existing) {
            throw new Error('Category not found');
        }

        // Validation
        if (data.name && data.name.trim() === '') {
            throw new Error('Category name cannot be empty');
        }

        // Check for duplicate name (excluding current category)
        if (data.name) {
            const allCategories = categoryOperations.getAll();
            const duplicate = allCategories.find(cat =>
                cat.id !== parseInt(id) &&
                cat.name.toLowerCase() === data.name.toLowerCase()
            );

            if (duplicate) {
                throw new Error('Category with this name already exists');
            }
        }

        return categoryOperations.update(id, data);
    },

    deleteCategory: async (id) => {
        const category = categoryOperations.getById(id);
        if (!category) {
            throw new Error('Category not found');
        }

        // Check if category has quizzes
        if (category.Quizzes && category.Quizzes.length > 0) {
            throw new Error('Cannot delete category with existing quizzes');
        }

        const deleted = categoryOperations.delete(id);
        if (!deleted) {
            throw new Error('Failed to delete category');
        }
        return true;
    }
};

module.exports = categoriesBusiness;
