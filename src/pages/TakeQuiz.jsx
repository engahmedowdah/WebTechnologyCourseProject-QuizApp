import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const TakeQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

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

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestion < (quiz.questions?.length || 0) - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            calculateScore();
        }
    };

    const calculateScore = () => {
        let correctCount = 0;
        quiz.questions?.forEach((q, index) => {
            const selectedAnswerIndex = answers[index];
            if (selectedAnswerIndex === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setShowResult(true);
    };

    if (!quiz) return <div className="text-center p-8">جاري التحميل...</div>;

    if (showResult) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-3xl font-bold mb-6 text-purple-600">نتيجة الاختبار</h2>
                <div className="text-6xl font-bold mb-4 text-gray-800">
                    {score} / {quiz.questions?.length || 0}
                </div>
                <p className="text-xl text-gray-600 mb-8">
                    {score === (quiz.questions?.length || 0) ? 'ممتاز! إجاباتك كلها صحيحة 🌟' :
                        score > (quiz.questions?.length || 0) / 2 ? 'جيد جداً! حاول مرة أخرى لتحقيق العلامة الكاملة 👍' :
                            'حاول مرة أخرى، يمكنك فعل الأفضل 💪'}
                </p>
                <button
                    onClick={() => navigate('/quizzes')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
                >
                    العودة لقائمة الاختبارات
                </button>
            </div>
        );
    }

    const question = quiz.questions?.[currentQuestion];
    const progress = ((currentQuestion + 1) / (quiz.questions?.length || 1)) * 100;

    // Check if question exists
    if (!question) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-red-600">خطأ</h2>
                <p className="text-gray-600 mb-6">لا توجد أسئلة في هذا الاختبار</p>
                <button
                    onClick={() => navigate('/quizzes')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
                >
                    العودة لقائمة الاختبارات
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">السؤال {currentQuestion + 1} من {quiz.questions?.length || 0}</span>
                        <span className="font-bold text-purple-600">{quiz.title}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${quiz.difficulty === 'سهل' ? 'bg-green-500 text-white' :
                        quiz.difficulty === 'متوسط' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                        }`}>
                        {quiz.difficulty}
                    </span>
                </div>

                <h3 className="text-2xl font-bold mb-8 text-right leading-relaxed">{question.question}</h3>

                <div className="space-y-4">
                    {question.options?.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(currentQuestion, index)}
                            className={`w-full p-4 rounded-lg text-right border-2 transition-all ${answers[currentQuestion] === index
                                ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={answers[currentQuestion] === undefined}
                        className={`px-8 py-3 rounded-lg font-semibold text-white transition ${answers[currentQuestion] !== undefined
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {currentQuestion === (quiz.questions?.length || 0) - 1 ? 'إنهاء الاختبار' : 'التالي'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TakeQuiz;

