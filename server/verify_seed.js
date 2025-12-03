const { sequelize, Category, Quiz, Question } = require('./models');

const verify = async () => {
    try {
        const categories = await Category.count();
        const quizzes = await Quiz.count();
        const questions = await Question.count();

        console.log(`Verification Results:`);
        console.log(`Categories: ${categories}`);
        console.log(`Quizzes: ${quizzes}`);
        console.log(`Questions: ${questions}`);

        if (categories > 0 && quizzes > 0 && questions > 0) {
            console.log('SUCCESS: Database populated.');
        } else {
            console.log('FAILURE: Database appears empty.');
        }
    } catch (error) {
        console.error('Verification failed:', error);
    }
};

verify();
