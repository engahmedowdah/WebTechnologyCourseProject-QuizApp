import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Categories from './pages/Categories';
import AddQuiz from './pages/AddQuiz';
import QuizList from './pages/QuizList';
import ViewQuiz from './pages/ViewQuiz';
import UpdateQuiz from './pages/UpdateQuiz';
import ManageCategories from './pages/ManageCategories';
import TakeQuiz from './pages/TakeQuiz';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans" dir="rtl">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/manage-categories" element={<ManageCategories />} />
            <Route path="/add" element={<AddQuiz />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quiz/:id" element={<ViewQuiz />} />
            <Route path="/quiz/:id/take" element={<TakeQuiz />} />
            <Route path="/quiz/:id/edit" element={<UpdateQuiz />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
