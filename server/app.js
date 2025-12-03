const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const categoryRoutes = require('./routes/categories');
const quizRoutes = require('./routes/quizzes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/quizzes', quizRoutes);

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to sync database:', err);
});
