const { sequelize, Category, Quiz, Question } = require('./models');

const verifyAiTech = async () => {
    try {
        const category = await Category.findOne({
            where: { name: 'الذكاء الاصطناعي والتقنية' },
            include: [{
                model: Quiz,
                include: [Question]
            }]
        });

        if (category) {
            console.log(`Category Found: ${category.name} (ID: ${category.id})`);
            let totalQuestions = 0;
            category.Quizzes.forEach(q => {
                console.log(`  Quiz: ${q.title} (${q.difficulty}) - Questions: ${q.Questions.length}`);
                totalQuestions += q.Questions.length;
            });
            console.log(`Total Questions: ${totalQuestions}`);

            if (totalQuestions === 16) {
                console.log('SUCCESS: 16 questions verified.');
            } else {
                console.log('FAILURE: Question count mismatch.');
            }
        } else {
            console.log('Category not found.');
        }

    } catch (error) {
        console.error('Error verifying:', error);
    }
};

verifyAiTech();
