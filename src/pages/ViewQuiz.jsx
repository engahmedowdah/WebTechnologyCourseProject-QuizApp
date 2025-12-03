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
        quiz.difficulty === 'سهل' ? 'bg-green-100 text-green-800' :
            quiz.difficulty === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-right">تفاصيل الاختبار</h2>
                <div className="space-y-4 text-right">
                    <div className="border-b pb-3">
                        <span className="font-semibold">العنوان: </span>
                        <span>{quiz.title}</span>
                    </div>
                    <div className="border-b pb-3">
                        <span className="font-semibold">التصنيف: </span>
                        <span>{quiz.categoryName}</span>
                    </div>
                    <div className="border-b pb-3">
                        <span className="font-semibold">مستوى الصعوبة: </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${difficultyClass}`}>
                            {quiz.difficulty}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setShowAnswers(!showAnswers)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                        {showAnswers ? 'إخفاء الإجابات' : 'إظهار الإجابات'}
                    </button>
                    <h3 className="text-xl font-bold">الأسئلة ({quiz.Questions?.length || 0})</h3>
                </div>

                {quiz.Questions?.map((q, index) => (
                    <div key={q.id} className="bg-white rounded-lg shadow-md p-6">
                        <h4 className="text-lg font-bold mb-4 text-right">{index + 1}. {q.text}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.Answers?.map(a => (
                                <div
                                    key={a.id}
                                    className={`p-3 rounded-lg border text-right ${showAnswers && a.isCorrect
                                        ? 'bg-green-100 border-green-500 text-green-800 font-bold'
                                        : 'bg-gray-50'
                                        }`}
                                >
                                    {a.text}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <Link to={`/quiz/${id}/take`} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 text-center transition">
                    ابدأ الاختبار
                </Link>
                <Link to="/quizzes" className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 text-center transition">
                    رجوع للقائمة
                </Link>
            </div>
        </div>
    );
};

export default ViewQuiz;
