const { Quiz, Question, Answer, Category } = require('../models');

const getAllQuizzes = async (categoryName) => {
    const where = {};

    if (categoryName && categoryName !== 'all') {
        const cat = await Category.findOne({ where: { name: categoryName } });
        if (cat) {
            where.CategoryId = cat.id;
        }
    }

    const quizzes = await Quiz.findAll({
        where,
        include: [
            { model: Category, attributes: ['name'] },
            { model: Question }
        ]
    });

    return quizzes.map(q => ({
        id: q.id,
        title: q.title,
        category: q.Category ? q.Category.name : 'Uncategorized',
        questions: q.Questions.length,
        difficulty: q.difficulty
    }));
};

const getQuizById = async (id) => {
    const quiz = await Quiz.findByPk(id, {
        include: [
            { model: Category },
            {
                model: Question,
                include: [Answer]
            }
        ]
    });

    if (!quiz) throw new Error('Quiz not found');

    return {
        id: quiz.id,
        title: quiz.title,
        category: quiz.Category ? quiz.Category.name : 'Uncategorized',
        difficulty: quiz.difficulty,
        questions: quiz.Questions.map(q => ({
            id: q.id,
            text: q.text,
            answers: q.Answers.map(a => ({
                id: a.id,
                text: a.text,
                isCorrect: a.isCorrect
            }))
        }))
    };
};

const createQuiz = async (data) => {
    const { title, categoryName, difficulty, questions } = data;

    // Validation: Check if questions exist
    if (!questions || questions.length === 0) {
        throw new Error('Cannot create a quiz without questions');
    }

    let category = await Category.findOne({ where: { name: categoryName } });
    if (!category) {
        category = await Category.create({ name: categoryName });
    }

    const quiz = await Quiz.create({
        title,
        difficulty,
        CategoryId: category.id
    });

    for (const q of questions) {
        const question = await Question.create({
            text: q.text,
            QuizId: quiz.id
        });

        if (q.answers && q.answers.length > 0) {
            for (const a of q.answers) {
                await Answer.create({
                    text: a.text,
                    isCorrect: a.isCorrect,
                    QuestionId: question.id
                });
            }
        }
    }

    return quiz;
};

const updateQuiz = async (id, data) => {
    const { title, categoryName, difficulty } = data;
    const quiz = await Quiz.findByPk(id);

    if (!quiz) throw new Error('Quiz not found');

    let categoryId = quiz.CategoryId;
    if (categoryName) {
        let category = await Category.findOne({ where: { name: categoryName } });
        if (!category) {
            category = await Category.create({ name: categoryName });
        }
        categoryId = category.id;
    }

    await quiz.update({
        title,
        difficulty,
        CategoryId: categoryId
    });

    return quiz;
};

const deleteQuiz = async (id) => {
    const deleted = await Quiz.destroy({
        where: { id }
    });
    if (!deleted) throw new Error('Quiz not found');
    return true;
};

module.exports = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz
};
