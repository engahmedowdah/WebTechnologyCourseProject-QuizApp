const { sequelize, Category, Quiz, Question } = require('./models');

const checkDatabase = async () => {
    try {
        const categories = await Category.findAll({
            include: [{
                model: Quiz,
                include: [{
                    model: Question
                }]
            }]
        });

        console.log('\n=== قاعدة البيانات ===\n');

        for (const category of categories) {
            console.log(`\n📁 ${category.name} (${category.Quizzes.length} اختبار)`);

            for (const quiz of category.Quizzes) {
                const questionCount = quiz.Questions.length;
                console.log(`  📝 ${quiz.title} - ${quiz.difficulty} - (${questionCount} سؤال)`);

                // عرض أول سؤالين لكل اختبار
                if (questionCount > 0) {
                    const sampleQuestions = quiz.Questions.slice(0, 2);
                    for (const q of sampleQuestions) {
                        console.log(`     - [${q.difficulty}] ${q.text.substring(0, 50)}...`);
                    }
                }
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDatabase();
