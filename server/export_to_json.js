const { Category, Quiz, Question, Answer } = require('./models');
const fs = require('fs');
const path = require('path');

async function exportToJSON() {
    try {
        // Fetch all data from database
        const categories = await Category.findAll({
            include: [{
                model: Quiz,
                include: [{
                    model: Question,
                    include: [{
                        model: Answer
                    }]
                }]
            }]
        });

        // Convert to plain JSON
        const data = categories.map(cat => cat.toJSON());

        // Save to JSON file
        const jsonPath = path.join(__dirname, 'data.json');
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

        console.log('✅ Data exported successfully to data.json');
        console.log(`📊 Total categories: ${data.length}`);
        console.log(`📝 Total quizzes: ${data.reduce((sum, cat) => sum + cat.Quizzes.length, 0)}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error exporting data:', error);
        process.exit(1);
    }
}

exportToJSON();
