import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [quizCounts, setQuizCounts] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const categoriesData = await api.getCategories();
            setCategories(categoriesData);

            const quizzesData = await api.getQuizzes();

            const counts = {};
            quizzesData.forEach(quiz => {
                counts[quiz.category] = (counts[quiz.category] || 0) + 1;
            });
            setQuizCounts(counts);
        } catch (error) {
            console.error('Failed to load data', error);
        }
    };

    const filterQuizzes = (category) => {
        navigate(`/quizzes?category=${category}`);
    };

    return (
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-right mb-4 md:mb-6">اختر التصنيف</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <button onClick={() => filterQuizzes('all')} className="p-4 md:p-6 rounded-lg text-center font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition min-h-[100px]">
                    <div className="text-lg md:text-xl mb-2">جميع الاختبارات</div>
                    <div className="text-xs md:text-sm opacity-90">عرض كل الاختبارات المتاحة</div>
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => filterQuizzes(cat.name)}
                        className="p-4 md:p-6 rounded-lg text-center font-semibold bg-white hover:bg-gray-100 shadow-md transition min-h-[100px]"
                    >
                        <div className="text-lg md:text-xl mb-2">{cat.name}</div>
                        <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-600">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-bold text-xs">
                                {quizCounts[cat.name] || 0}
                            </span>
                            <span>اختبار</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Categories;

