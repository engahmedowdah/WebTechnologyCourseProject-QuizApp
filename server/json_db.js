const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// Helper function to read data
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
}

// Helper function to write data
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
}

// Generate unique ID
function generateId(items) {
    if (!items || items.length === 0) return 1;
    const maxId = Math.max(...items.map(item => item.id || 0));
    return maxId + 1;
}

// CRUD Operations for Categories
const categoryOperations = {
    // Get all categories
    getAll: () => {
        return readData();
    },

    // Get category by ID
    getById: (id) => {
        const data = readData();
        return data.find(cat => cat.id === parseInt(id));
    },

    // Create new category
    create: (categoryData) => {
        const data = readData();
        const newCategory = {
            id: generateId(data),
            name: categoryData.name,
            description: categoryData.description || null,
            Quizzes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.push(newCategory);
        writeData(data);
        return newCategory;
    },

    // Update category
    update: (id, categoryData) => {
        const data = readData();
        const index = data.findIndex(cat => cat.id === parseInt(id));
        if (index === -1) return null;

        data[index] = {
            ...data[index],
            name: categoryData.name || data[index].name,
            description: categoryData.description !== undefined ? categoryData.description : data[index].description,
            updatedAt: new Date().toISOString()
        };
        writeData(data);
        return data[index];
    },

    // Delete category
    delete: (id) => {
        const data = readData();
        const filteredData = data.filter(cat => cat.id !== parseInt(id));
        if (filteredData.length === data.length) return false;
        writeData(filteredData);
        return true;
    }
};

// CRUD Operations for Quizzes
const quizOperations = {
    // Get all quizzes (optionally filter by category)
    getAll: (categoryFilter = null) => {
        const data = readData();
        let allQuizzes = [];

        data.forEach(category => {
            // Skip if filter is provided and doesn't match
            if (categoryFilter) {
                // Check if filter matches category ID (as number or string)
                const matchesId = category.id === parseInt(categoryFilter);
                // Check if filter matches category name
                const matchesName = category.name === categoryFilter;

                if (!matchesId && !matchesName) return;
            }

            if (category.Quizzes) {
                category.Quizzes.forEach(quiz => {
                    allQuizzes.push({
                        ...quiz,
                        CategoryId: category.id,
                        categoryName: category.name
                    });
                });
            }
        });

        return allQuizzes;
    },

    // Get quiz by ID
    getById: (id) => {
        const data = readData();
        for (let category of data) {
            if (category.Quizzes) {
                const quiz = category.Quizzes.find(q => q.id === parseInt(id));
                if (quiz) {
                    return {
                        ...quiz,
                        CategoryId: category.id,
                        categoryName: category.name
                    };
                }
            }
        }
        return null;
    },

    // Create new quiz
    create: (quizData) => {
        const data = readData();
        const categoryIndex = data.findIndex(cat => cat.id === parseInt(quizData.CategoryId));
        if (categoryIndex === -1) return null;

        if (!data[categoryIndex].Quizzes) {
            data[categoryIndex].Quizzes = [];
        }

        const allQuizzes = [];
        data.forEach(cat => {
            if (cat.Quizzes) allQuizzes.push(...cat.Quizzes);
        });

        const newQuiz = {
            id: generateId(allQuizzes),
            title: quizData.title,
            difficulty: quizData.difficulty || 'متوسط',
            CategoryId: parseInt(quizData.CategoryId),
            Questions: quizData.Questions || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data[categoryIndex].Quizzes.push(newQuiz);
        writeData(data);
        return newQuiz;
    },

    // Update quiz
    update: (id, quizData) => {
        const data = readData();

        for (let categoryIndex = 0; categoryIndex < data.length; categoryIndex++) {
            if (!data[categoryIndex].Quizzes) continue;

            const quizIndex = data[categoryIndex].Quizzes.findIndex(q => q.id === parseInt(id));
            if (quizIndex !== -1) {
                data[categoryIndex].Quizzes[quizIndex] = {
                    ...data[categoryIndex].Quizzes[quizIndex],
                    title: quizData.title || data[categoryIndex].Quizzes[quizIndex].title,
                    difficulty: quizData.difficulty || data[categoryIndex].Quizzes[quizIndex].difficulty,
                    Questions: quizData.Questions !== undefined ? quizData.Questions : data[categoryIndex].Quizzes[quizIndex].Questions,
                    updatedAt: new Date().toISOString()
                };
                writeData(data);
                return data[categoryIndex].Quizzes[quizIndex];
            }
        }
        return null;
    },

    // Delete quiz
    delete: (id) => {
        const data = readData();

        for (let categoryIndex = 0; categoryIndex < data.length; categoryIndex++) {
            if (!data[categoryIndex].Quizzes) continue;

            const initialLength = data[categoryIndex].Quizzes.length;
            data[categoryIndex].Quizzes = data[categoryIndex].Quizzes.filter(q => q.id !== parseInt(id));

            if (data[categoryIndex].Quizzes.length < initialLength) {
                writeData(data);
                return true;
            }
        }
        return false;
    }
};

module.exports = {
    categoryOperations,
    quizOperations,
    readData,
    writeData
};
