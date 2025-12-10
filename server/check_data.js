const { sequelize, Category, Quiz } = require('./models');

const checkData = async () => {
    try {
        const categories = await Category.findAll({ limit: 5 });
        console.log('--- Sample Categories ---');
        categories.forEach(c => console.log(`ID: ${c.id}, Name: ${c.name}`));

        const quizzes = await Quiz.findAll({ limit: 5 });
        console.log('\n--- Sample Quizzes ---');
        quizzes.forEach(q => console.log(`ID: ${q.id}, Title: ${q.title}, Difficulty: ${q.difficulty}`));

        if (categories.length === 0) {
            console.log('\nWARNING: No categories found!');
        }
    } catch (error) {
        console.error('Error checking data:', error);
    }
};

checkData();
