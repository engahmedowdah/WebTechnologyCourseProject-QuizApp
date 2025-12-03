const { sequelize, Category, Quiz, Question, Answer } = require('./models');

const categoriesData = [
    {
        name: 'الذكاء الاصطناعي والتقنية',
        description: 'AI & Tech',
        quizzes: [
            { title: 'أساسيات البرمجة', difficulty: 'سهل' },
            { title: 'نظام التشغيل', difficulty: 'متوسط' },
            { title: 'الشبكات', difficulty: 'صعب' },
            { title: 'الذكاء الاصطناعي', difficulty: 'صعب' },
            { title: 'الأمن السيبراني', difficulty: 'صعب' },
            { title: 'قواعد البيانات', difficulty: 'متوسط' }
        ]
    },
    {
        name: 'اللغة الإنجليزية',
        description: 'English Learning',
        quizzes: [
            { title: 'مفردات', difficulty: 'سهل' },
            { title: 'قواعد Grammar', difficulty: 'متوسط' },
            { title: 'محادثات', difficulty: 'متوسط' },
            { title: 'أفعال شائعة', difficulty: 'سهل' },
            { title: 'الاستماع Listening', difficulty: 'صعب' }
        ]
    },
    {
        name: 'العلوم',
        description: 'Science',
        quizzes: [
            { title: 'الفيزياء', difficulty: 'صعب' },
            { title: 'الكيمياء', difficulty: 'متوسط' },
            { title: 'الأحياء', difficulty: 'سهل' },
            { title: 'الفضاء', difficulty: 'متوسط' },
            { title: 'الطاقة', difficulty: 'سهل' }
        ]
    },
    {
        name: 'التاريخ',
        description: 'History',
        quizzes: [
            { title: 'تاريخ العالم', difficulty: 'متوسط' },
            { title: 'الحضارات القديمة', difficulty: 'صعب' },
            { title: 'الحرب العالمية', difficulty: 'صعب' },
            { title: 'تاريخ الإسلام', difficulty: 'متوسط' },
            { title: 'شخصيات تاريخية', difficulty: 'سهل' }
        ]
    },
    {
        name: 'الجغرافيا',
        description: 'Geography',
        quizzes: [
            { title: 'الدول والعواصم', difficulty: 'سهل' },
            { title: 'الخرائط', difficulty: 'صعب' },
            { title: 'المعالم الشهيرة', difficulty: 'سهل' },
            { title: 'الأنهار والجبال', difficulty: 'متوسط' }
        ]
    },
    {
        name: 'الأفلام والمسلسلات',
        description: 'Fun & Entertainment',
        quizzes: [
            { title: 'أفلام هوليوود', difficulty: 'سهل' },
            { title: 'أنمي', difficulty: 'متوسط' },
            { title: 'مسلسلات نتفليكس', difficulty: 'سهل' },
            { title: 'شخصيات مارفل / DC', difficulty: 'سهل' }
        ]
    },
    {
        name: 'الألعاب',
        description: 'Gaming',
        quizzes: [
            { title: 'ألعاب الكمبيوتر', difficulty: 'متوسط' },
            { title: 'ألعاب PlayStation', difficulty: 'سهل' },
            { title: 'ألعاب الموبايل', difficulty: 'سهل' },
            { title: 'Trivia عن PUBG / Fortnite', difficulty: 'سهل' }
        ]
    },
    {
        name: 'الرياضة',
        description: 'Sports',
        quizzes: [
            { title: 'كرة القدم', difficulty: 'سهل' },
            { title: 'كأس العالم', difficulty: 'متوسط' },
            { title: 'لاعبين مشهورين', difficulty: 'سهل' },
            { title: 'الرياضات الأولمبية', difficulty: 'صعب' }
        ]
    },
    {
        name: 'ألغاز وذكاء',
        description: 'Skills & IQ',
        quizzes: [
            { title: 'ألغاز منطق', difficulty: 'صعب' },
            { title: 'رياضيات سريعة', difficulty: 'متوسط' },
            { title: 'Patterns', difficulty: 'صعب' },
            { title: 'أسئلة تركيز وانتباه', difficulty: 'متوسط' }
        ]
    },
    {
        name: 'أسئلة معلومات عامة',
        description: 'General Knowledge',
        quizzes: [
            { title: 'ثقافة عامة', difficulty: 'سهل' },
            { title: 'حقائق سريعة', difficulty: 'سهل' },
            { title: 'معلومات غريبة', difficulty: 'متوسط' }
        ]
    },
    {
        name: 'الدين والثقافة',
        description: 'Religion & Culture',
        quizzes: [
            { title: 'الإسلام', difficulty: 'سهل' },
            { title: 'القرآن الكريم', difficulty: 'متوسط' },
            { title: 'شخصيات دينية', difficulty: 'متوسط' },
            { title: 'ثقافات الدول', difficulty: 'صعب' }
        ]
    },
    {
        name: 'عالم الأعمال',
        description: 'Business',
        quizzes: [
            { title: 'ريادة أعمال', difficulty: 'صعب' },
            { title: 'تسويق', difficulty: 'متوسط' },
            { title: 'اقتصاد', difficulty: 'صعب' },
            { title: 'استثمار طويل المدى', difficulty: 'صعب' }
        ]
    },
    {
        name: 'مواد دراسية',
        description: 'Student Subjects',
        quizzes: [
            { title: 'الرياضيات', difficulty: 'صعب' },
            { title: 'العلوم', difficulty: 'متوسط' },
            { title: 'اللغة العربية', difficulty: 'صعب' },
            { title: 'الحاسب الآلي', difficulty: 'متوسط' },
            { title: 'الجغرافيا', difficulty: 'سهل' }
        ]
    }
];

// Helper to generate dummy questions if we don't have specific ones
const generateQuestions = (quizTitle, count) => {
    const questions = [];
    for (let i = 1; i <= count; i++) {
        questions.push({
            text: `سؤال ${i} عن ${quizTitle}؟`,
            answers: [
                { text: 'إجابة صحيحة', isCorrect: true },
                { text: 'إجابة خاطئة 1', isCorrect: false },
                { text: 'إجابة خاطئة 2', isCorrect: false },
                { text: 'إجابة خاطئة 3', isCorrect: false }
            ]
        });
    }
    return questions;
};

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Don't drop tables, just sync
        console.log('Database synced for seeding.');

        for (const catData of categoriesData) {
            const [category, created] = await Category.findOrCreate({
                where: { name: catData.name },
                defaults: { description: catData.description }
            });

            if (created) {
                console.log(`Category created: ${category.name}`);
            } else {
                console.log(`Category exists: ${category.name}`);
            }

            for (const quizData of catData.quizzes) {
                const [quiz, quizCreated] = await Quiz.findOrCreate({
                    where: { title: quizData.title, CategoryId: category.id },
                    defaults: { difficulty: quizData.difficulty }
                });

                if (quizCreated) {
                    console.log(`  Quiz created: ${quiz.title}`);

                    // Generate questions for the new quiz
                    // Random number of questions between 5 and 20
                    const questionCount = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
                    const questions = generateQuestions(quiz.title, questionCount);

                    for (const qData of questions) {
                        const question = await Question.create({
                            text: qData.text,
                            QuizId: quiz.id
                        });

                        for (const aData of qData.answers) {
                            await Answer.create({
                                text: aData.text,
                                isCorrect: aData.isCorrect,
                                QuestionId: question.id
                            });
                        }
                    }
                    console.log(`    Added ${questionCount} questions to ${quiz.title}`);
                } else {
                    console.log(`  Quiz exists: ${quiz.title}`);
                }
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
