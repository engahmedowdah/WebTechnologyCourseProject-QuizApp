// LocalStorage-based API service
// No backend required - all data stored in browser LocalStorage
import { localStorageService } from './localStorage.js';

export const api = {
    // Categories
    getCategories: async () => {
        // Simulate async behavior for consistency
        return Promise.resolve(localStorageService.getCategories());
    },

    createCategory: async (data) => {
        try {
            const newCategory = localStorageService.createCategory(data);
            return Promise.resolve(newCategory);
        } catch (error) {
            return Promise.reject(new Error('Failed to create category'));
        }
    },

    updateCategory: async (id, data) => {
        try {
            const updatedCategory = localStorageService.updateCategory(id, data);
            return Promise.resolve(updatedCategory);
        } catch (error) {
            return Promise.reject(new Error('Failed to update category'));
        }
    },

    deleteCategory: async (id) => {
        try {
            localStorageService.deleteCategory(id);
            return Promise.resolve(true);
        } catch (error) {
            return Promise.reject(new Error('Failed to delete category'));
        }
    },

    // Quizzes
    getQuizzes: async (category) => {
        return Promise.resolve(localStorageService.getQuizzes(category));
    },

    getQuiz: async (id) => {
        try {
            const quiz = localStorageService.getQuiz(id);
            return Promise.resolve(quiz);
        } catch (error) {
            return Promise.reject(new Error('Quiz not found'));
        }
    },

    createQuiz: async (quizData) => {
        try {
            const newQuiz = localStorageService.createQuiz(quizData);
            return Promise.resolve(newQuiz);
        } catch (error) {
            return Promise.reject(new Error('Failed to create quiz'));
        }
    },

    updateQuiz: async (id, quizData) => {
        try {
            const updatedQuiz = localStorageService.updateQuiz(id, quizData);
            return Promise.resolve(updatedQuiz);
        } catch (error) {
            return Promise.reject(new Error('Failed to update quiz'));
        }
    },

    deleteQuiz: async (id) => {
        try {
            localStorageService.deleteQuiz(id);
            return Promise.resolve(true);
        } catch (error) {
            return Promise.reject(new Error('Failed to delete quiz'));
        }
    }
};
