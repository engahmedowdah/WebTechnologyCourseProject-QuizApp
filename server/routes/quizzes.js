const express = require('express');
const router = express.Router();
const quizBusiness = require('../business/quiz_business');

// Get all quizzes
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const quizzes = await quizBusiness.getAllQuizzes(category);
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single quiz
router.get('/:id', async (req, res) => {
    try {
        const quiz = await quizBusiness.getQuizById(req.params.id);
        res.json(quiz);
    } catch (error) {
        if (error.message === 'Quiz not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Create quiz
router.post('/', async (req, res) => {
    try {
        const quiz = await quizBusiness.createQuiz(req.body);
        res.status(201).json(quiz);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update quiz
router.put('/:id', async (req, res) => {
    try {
        const quiz = await quizBusiness.updateQuiz(req.params.id, req.body);
        res.json(quiz);
    } catch (error) {
        if (error.message === 'Quiz not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

// Delete quiz
router.delete('/:id', async (req, res) => {
    try {
        await quizBusiness.deleteQuiz(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Quiz not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
