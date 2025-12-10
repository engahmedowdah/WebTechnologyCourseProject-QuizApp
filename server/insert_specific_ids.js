const { sequelize, Category } = require('./models');

const insertSpecificIds = async () => {
    try {
        // 1. Delete conflicting IDs if they exist
        const id1 = await Category.findByPk(1);
        if (id1) {
            console.log(`Deleting existing category at ID 1: ${id1.name}`);
            await id1.destroy();
        }

        const id3 = await Category.findByPk(3);
        if (id3) {
            console.log(`Deleting existing category at ID 3: ${id3.name}`);
            await id3.destroy();
        }

        // 2. Insert new categories with specific IDs
        console.log('Inserting "Science" at ID 1...');
        await Category.create({
            id: 1,
            name: 'العلوم',
            description: 'Science'
        });

        console.log('Inserting "History" at ID 3...');
        await Category.create({
            id: 3,
            name: 'التاريخ',
            description: 'History'
        });

        console.log('Insertion completed successfully.');

    } catch (error) {
        console.error('Error inserting categories:', error);
    }
};

insertSpecificIds();
