const { quizOperations, categoryOperations } = require('../json_db');

const quizBusiness = {
    getAllQuizzes: async (categoryId = null) => {
        return quizOperations.getAll(categoryId);
    },

    getQuizById: async (id) => {
        const quiz = quizOperations.getById(id);
        if (!quiz) {
            throw new Error('Quiz not found');
        }
        return quiz;
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
        const category = categoryOperations.getById(data.CategoryId);
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

        return quizOperations.create(data);
    },

    updateQuiz: async (id, data) => {
        // Check if quiz exists
        const existing = quizOperations.getById(id);
        if (!existing) {
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

        return quizOperations.update(id, data);
    },

    deleteQuiz: async (id) => {
        const quiz = quizOperations.getById(id);
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        const deleted = quizOperations.delete(id);
        if (!deleted) {
            throw new Error('Failed to delete quiz');
        }
        return true;
    }
};

module.exports = quizBusiness;
