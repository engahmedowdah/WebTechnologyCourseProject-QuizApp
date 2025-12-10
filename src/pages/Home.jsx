import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Home = () => {
    const [stats, setStats] = useState({
        quizCount: 0,
        categoriesCount: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const quizzes = await api.getQuizzes();
            const categories = await api.getCategories();
            setStats({
                quizCount: quizzes.length,
                categoriesCount: categories.length
            });
        } catch (error) {
            console.error('Failed to load stats', error);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6 md:p-12 text-center">
                <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">مرحباً بك في تطبيق الاختبارات</h1>
                <p className="text-base md:text-xl mb-4 md:mb-6">اختبر معلوماتك في مختلف المجالات وتحدى نفسك</p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                    <Link to="/categories" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition min-h-[44px] flex items-center justify-center">
                        ابدأ الاختبار
                    </Link>
                    <Link to="/add" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition min-h-[44px] flex items-center justify-center">
                        إضافة اختبار جديد
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-yellow-500 text-4xl md:text-5xl mb-3">🏆</div>
                    <h3 className="text-xl font-bold mb-2">{stats.quizCount}</h3>
                    <p className="text-gray-600 text-sm md:text-base">اختبار متاح</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-blue-500 text-4xl md:text-5xl mb-3">📚</div>
                    <h3 className="text-xl font-bold mb-2">{stats.categoriesCount}</h3>
                    <p className="text-gray-600 text-sm md:text-base">تصنيف مختلف</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center sm:col-span-2 md:col-span-1">
                    <div className="text-green-500 text-4xl md:text-5xl mb-3">📋</div>
                    <h3 className="text-xl font-bold mb-2">متعدد</h3>
                    <p className="text-gray-600 text-sm md:text-base">مستويات الصعوبة</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
