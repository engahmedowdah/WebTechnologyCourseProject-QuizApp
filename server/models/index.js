const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING
    }
});

const Quiz = sequelize.define('Quiz', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.ENUM('سهل', 'متوسط', 'صعب'),
        defaultValue: 'متوسط'
    }
});

const Question = sequelize.define('Question', {
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

const Answer = sequelize.define('Answer', {
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Relationships
Category.hasMany(Quiz);
Quiz.belongsTo(Category);

Quiz.hasMany(Question, { onDelete: 'CASCADE' });
Question.belongsTo(Quiz);

Question.hasMany(Answer, { onDelete: 'CASCADE' });
Answer.belongsTo(Question);

module.exports = {
    Category,
    Quiz,
    Question,
    Answer,
    sequelize
};
