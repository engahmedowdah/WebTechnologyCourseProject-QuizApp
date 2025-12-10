const { sequelize, Category } = require('./models');

const deleteCategories = async () => {
    try {
        const categoriesToDelete = ['العلوم', 'التاريخ'];

        for (const name of categoriesToDelete) {
            const result = await Category.destroy({
                where: { name: name }
            });

            if (result > 0) {
                console.log(`Deleted category: ${name}`);
            } else {
                console.log(`Category not found: ${name}`);
            }
        }

        console.log('Deletion process completed.');
    } catch (error) {
        console.error('Error deleting categories:', error);
    }
};

deleteCategories();
