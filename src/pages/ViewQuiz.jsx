import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const ViewQuiz = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [showAnswers, setShowAnswers] = useState(false);

    useEffect(() => {
        loadQuiz();
    }, [id]);

    const loadQuiz = async () => {
        try {
            const data = await api.getQuiz(id);
            setQuiz(data);
        } catch (error) {
            console.error('Failed to load quiz', error);
        }
    };

    if (!quiz) return <div>جاري التحميل...</div>;

    const difficultyClass =
        quiz.difficulty === 'سهل' ? 'bg-green-500 text-white' :
            quiz.difficulty === 'متوسط' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white';

    return (
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-right">تفاصيل الاختبار</h2>
                <div className="space-y-3 md:space-y-4 text-right">
                    <div className="border-b pb-2 md:pb-3">
                        <span className="font-semibold text-sm md:text-base">العنوان: </span>
                        <span className="text-sm md:text-base">{quiz.title}</span>
                    </div>
                    <div className="border-b pb-2 md:pb-3">
                        <span className="font-semibold text-sm md:text-base">التصنيف: </span>
                        <span className="text-sm md:text-base">{quiz.category}</span>
                    </div>
                    <div className="border-b pb-2 md:pb-3">
                        <span className="font-semibold text-sm md:text-base">مستوى الصعوبة: </span>
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${difficultyClass}`}>
                            {quiz.difficulty}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <button
                        onClick={() => setShowAnswers(!showAnswers)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 min-h-[44px] text-sm md:text-base"
                    >
                        {showAnswers ? 'إخفاء الإجابات' : 'إظهار الإجابات'}
                    </button>
                    <h3 className="text-lg md:text-xl font-bold">الأسئلة ({quiz.questions?.length || 0})</h3>
                </div>

                {quiz.questions?.map((q, index) => {
                    const questionDifficultyClass =
                        q.difficulty === 'سهل' ? 'bg-green-500 text-white border-green-600' :
                            q.difficulty === 'متوسط' ? 'bg-yellow-500 text-white border-yellow-600' :
                                'bg-red-500 text-white border-red-600';

                    return (
                        <div key={index} className="bg-white rounded-lg shadow-md p-4 md:p-6">
                            <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-2 mb-3 md:mb-4">
                                <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold border ${questionDifficultyClass} self-start`}>
                                    {q.difficulty || 'متوسط'}
                                </span>
                                <h4 className="text-base md:text-lg font-bold text-right flex-1">{index + 1}. {q.question}</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options?.map((option, optIndex) => (
                                    <div
                                        key={optIndex}
                                        className={`p-3 rounded-lg border text-right ${showAnswers && optIndex === q.correctAnswer
                                            ? 'bg-green-100 border-green-500 text-green-800 font-bold'
                                            : 'bg-gray-50'
                                            }`}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link to={`/quiz/${id}/take`} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 text-center transition min-h-[44px] flex items-center justify-center text-sm md:text-base">
                    ابدأ الاختبار
                </Link>
                <Link to="/quizzes" className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 text-center transition min-h-[44px] flex items-center justify-center text-sm md:text-base">
                    رجوع للقائمة
                </Link>
            </div>
        </div>
    );
};

export default ViewQuiz;
