// Use Render backend URL in production, localhost in development
const API_URL = import.meta.env.PROD
    ? 'https://webtechnologycourseproject-quizapp-27.onrender.com/api'
    : 'http://localhost:3000/api';

export const api = {
    // Categories
    getCategories: async () => {
        const res = await fetch(`${API_URL}/categories`);
        return res.json();
    },
    createCategory: async (data) => {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create category');
        return response.json();
    },

    updateCategory: async (id, data) => {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update category');
        return response.json();
    },

    deleteCategory: async (id) => {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete category');
        return true;
    },

    // Quizzes
    getQuizzes: async (category) => {
        const url = category && category !== 'all'
            ? `${API_URL}/quizzes?category=${encodeURIComponent(category)}`
            : `${API_URL}/quizzes`;
        const res = await fetch(url);
        return res.json();
    },
    getQuiz: async (id) => {
        const res = await fetch(`${API_URL}/quizzes/${id}`);
        return res.json();
    },
    createQuiz: async (quizData) => {
        const res = await fetch(`${API_URL}/quizzes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizData)
        });
        return res.json();
    },
    updateQuiz: async (id, quizData) => {
        const res = await fetch(`${API_URL}/quizzes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizData)
        });
        return res.json();
    },
    deleteQuiz: async (id) => {
        const res = await fetch(`${API_URL}/quizzes/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete quiz');
        return true;
    }
};
