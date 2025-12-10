const { Quiz, Question, Answer, Category } = require('../models');

const quizBusiness = {
    getAllQuizzes: async (categoryFilter = null) => {
        const whereClause = {};

        // If category filter is provided, find the category first
        if (categoryFilter) {
            const category = await Category.findOne({
                where: { name: categoryFilter }
            });

            if (category) {
                whereClause.CategoryId = category.id;
            } else {
                // Try to parse as ID
                const categoryId = parseInt(categoryFilter);
                if (!isNaN(categoryId)) {
                    whereClause.CategoryId = categoryId;
                }
            }
        }

        const quizzes = await Quiz.findAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name']
                },
                {
                    model: Question,
                    attributes: ['id']
                }
            ],
            order: [['id', 'ASC']]
        });

        // Transform to match the expected format
        return quizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            difficulty: quiz.difficulty,
            CategoryId: quiz.CategoryId,
            categoryName: quiz.Category ? quiz.Category.name : null,
            Questions: quiz.Questions || [],
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt
        }));
    },

    getQuizById: async (id) => {
        const quiz = await Quiz.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name']
                },
                {
                    model: Question,
                    include: [{
                        model: Answer
                    }]
                }
            ]
        });

        if (!quiz) {
            throw new Error('Quiz not found');
        }

        // Transform to match the expected format
        return {
            id: quiz.id,
            title: quiz.title,
            difficulty: quiz.difficulty,
            CategoryId: quiz.CategoryId,
            categoryName: quiz.Category ? quiz.Category.name : null,
            Questions: quiz.Questions || [],
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt
        };
    },

    createQuiz: async (data) => {
        // Validation
        if (!data.title || data.title.trim() === '') {
            throw new Error('Quiz title is required');
        }

        if (!data.CategoryId) {
            throw new Error('Category ID is required');
        }

        // Check if category exists
        const category = await Category.findByPk(data.CategoryId);
        if (!category) {
            throw new Error('Category not found');
        }

        // Validate difficulty
        const validDifficulties = ['سهل', 'متوسط', 'صعب'];
        if (data.difficulty && !validDifficulties.includes(data.difficulty)) {
            throw new Error('Invalid difficulty level');
        }

        // Validate questions if provided
        if (data.Questions && Array.isArray(data.Questions)) {
            for (let question of data.Questions) {
                if (!question.text || question.text.trim() === '') {
                    throw new Error('Question text is required');
                }

                if (!question.Answers || !Array.isArray(question.Answers) || question.Answers.length < 2) {
                    throw new Error('Each question must have at least 2 answers');
                }

                const correctAnswers = question.Answers.filter(a => a.isCorrect);
                if (correctAnswers.length !== 1) {
                    throw new Error('Each question must have exactly one correct answer');
                }
            }
        }

        // Create quiz with questions and answers
        const quiz = await Quiz.create({
            title: data.title,
            difficulty: data.difficulty || 'متوسط',
            CategoryId: data.CategoryId
        });

        // Create questions and answers if provided
        if (data.Questions && Array.isArray(data.Questions)) {
            for (let questionData of data.Questions) {
                const question = await Question.create({
                    text: questionData.text,
                    QuizId: quiz.id
                });

                if (questionData.Answers && Array.isArray(questionData.Answers)) {
                    for (let answerData of questionData.Answers) {
                        await Answer.create({
                            text: answerData.text,
                            isCorrect: answerData.isCorrect || false,
                            QuestionId: question.id
                        });
                    }
                }
            }
        }

        return await quizBusiness.getQuizById(quiz.id);
    },

    updateQuiz: async (id, data) => {
        // Check if quiz exists
        const quiz = await Quiz.findByPk(id);
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        // Validation
        if (data.title && data.title.trim() === '') {
            throw new Error('Quiz title cannot be empty');
        }

        // Validate difficulty if provided
        if (data.difficulty) {
            const validDifficulties = ['سهل', 'متوسط', 'صعب'];
            if (!validDifficulties.includes(data.difficulty)) {
                throw new Error('Invalid difficulty level');
            }
        }

        // Validate questions if provided
        if (data.Questions && Array.isArray(data.Questions)) {
            for (let question of data.Questions) {
                if (!question.text || question.text.trim() === '') {
                    throw new Error('Question text is required');
                }

                if (!question.Answers || !Array.isArray(question.Answers) || question.Answers.length < 2) {
                    throw new Error('Each question must have at least 2 answers');
                }

                const correctAnswers = question.Answers.filter(a => a.isCorrect);
                if (correctAnswers.length !== 1) {
                    throw new Error('Each question must have exactly one correct answer');
                }
            }
        }

        // Update quiz
        await quiz.update({
            title: data.title || quiz.title,
            difficulty: data.difficulty || quiz.difficulty
        });

        // Update questions if provided
        if (data.Questions && Array.isArray(data.Questions)) {
            // Delete existing questions (cascade will delete answers)
            await Question.destroy({ where: { QuizId: quiz.id } });

            // Create new questions and answers
            for (let questionData of data.Questions) {
                const question = await Question.create({
                    text: questionData.text,
                    QuizId: quiz.id
                });

                if (questionData.Answers && Array.isArray(questionData.Answers)) {
                    for (let answerData of questionData.Answers) {
                        await Answer.create({
                            text: answerData.text,
                            isCorrect: answerData.isCorrect || false,
                            QuestionId: question.id
                        });
                    }
                }
            }
        }

        return await quizBusiness.getQuizById(quiz.id);
    },

    deleteQuiz: async (id) => {
        const quiz = await Quiz.findByPk(id);
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        await quiz.destroy();
        return true;
    }
};

module.exports = quizBusiness;
