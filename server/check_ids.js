const { sequelize, Category } = require('./models');

const checkIds = async () => {
    try {
        const id1 = await Category.findByPk(1);
        const id3 = await Category.findByPk(3);

        console.log('--- ID Status ---');
        if (id1) {
            console.log(`ID 1 is TAKEN by: ${id1.name}`);
        } else {
            console.log('ID 1 is FREE');
        }

        if (id3) {
            console.log(`ID 3 is TAKEN by: ${id3.name}`);
        } else {
            console.log('ID 3 is FREE');
        }
    } catch (error) {
        console.error('Error checking IDs:', error);
    }
};

checkIds();
