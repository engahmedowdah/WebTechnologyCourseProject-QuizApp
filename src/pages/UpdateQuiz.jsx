import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const UpdateQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        difficulty: 'متوسط',
        questions: []
    });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [quiz, cats] = await Promise.all([
                api.getQuiz(id),
                api.getCategories()
            ]);
            setCategories(cats);
            setFormData({
                title: quiz.title,
                category: quiz.category,
                difficulty: quiz.difficulty,
                questions: quiz.questions || []
            });
        } catch (error) {
            console.error('Failed to load data', error);
        }
    };

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                {
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    difficulty: formData.difficulty
                }
            ]
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options[optIndex] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleDeleteQuestion = (index) => {
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('الرجاء إدخال عنوان الاختبار');
            return;
        }

        if (formData.questions.length === 0) {
            alert('الرجاء إضافة سؤال واحد على الأقل');
            return;
        }

        for (let i = 0; i < formData.questions.length; i++) {
            const q = formData.questions[i];
            if (!q.question.trim()) {
                alert(`الرجاء إدخال نص السؤال رقم ${i + 1}`);
                return;
            }
            if (q.options.some(opt => !opt.trim())) {
                alert(`الرجاء إدخال جميع الخيارات للسؤال رقم ${i + 1}`);
                return;
            }
        }

        try {
            await api.updateQuiz(id, formData);
            alert('تم تحديث الاختبار بنجاح!');
            navigate('/quizzes');
        } catch (error) {
            alert('فشل تحديث الاختبار');
        }
    };

    const getDifficultyClass = (difficulty) => {
        return difficulty === 'سهل' ? 'bg-green-500 text-white' :
            difficulty === 'متوسط' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-6 text-right">تعديل الاختبار</h2>

            <div className="space-y-4 sm:space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-right mb-2 font-semibold text-sm sm:text-base">عنوان الاختبار</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 sm:p-3 border rounded-lg text-right text-base"
                            placeholder="مثال: اختبار الرياضيات 1"
                        />
                    </div>
                    <div>
                        <label className="block text-right mb-2 font-semibold text-sm sm:text-base">التصنيف</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-3 sm:p-3 border rounded-lg text-right text-base"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-right mb-2 font-semibold text-sm sm:text-base">مستوى الصعوبة</label>
                    <select
                        value={formData.difficulty}
                        onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full p-3 sm:p-3 border rounded-lg text-right text-base"
                    >
                        <option value="سهل">سهل</option>
                        <option value="متوسط">متوسط</option>
                        <option value="صعب">صعب</option>
                    </select>
                </div>

                {/* Questions Section */}
                <div className="border-t pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                        <button
                            onClick={handleAddQuestion}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 sm:px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-base font-semibold min-h-[48px]"
                        >
                            ➕ إضافة سؤال
                        </button>
                        <h3 className="text-lg sm:text-xl font-bold">الأسئلة ({formData.questions.length})</h3>
                    </div>

                    {formData.questions.length === 0 ? (
                        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📝</div>
                            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">لا توجد أسئلة بعد</p>
                            <button
                                onClick={handleAddQuestion}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 sm:px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-base min-h-[48px]"
                            >
                                إضافة السؤال الأول
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6">
                            {formData.questions.map((q, qIndex) => (
                                <div key={qIndex} className="border rounded-lg p-4 sm:p-6 bg-gray-50">
                                    {/* Header with difficulty and delete button */}
                                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start mb-4 gap-3">
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 order-2 sm:order-1">
                                            <button
                                                onClick={() => handleDeleteQuestion(qIndex)}
                                                className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition font-semibold text-base min-h-[48px] w-full sm:w-auto"
                                            >
                                                🗑️ حذف
                                            </button>
                                            <select
                                                value={q.difficulty}
                                                onChange={e => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
                                                className={`px-4 py-3 rounded-lg text-base font-semibold min-h-[48px] w-full sm:w-auto ${getDifficultyClass(q.difficulty)}`}
                                            >
                                                <option value="سهل">سهل</option>
                                                <option value="متوسط">متوسط</option>
                                                <option value="صعب">صعب</option>
                                            </select>
                                        </div>
                                        <span className="font-bold text-lg sm:text-xl text-right order-1 sm:order-2">السؤال {qIndex + 1}</span>
                                    </div>

                                    {/* Question text */}
                                    <div className="mb-4">
                                        <label className="block text-right mb-2 font-semibold text-sm sm:text-base">نص السؤال</label>
                                        <textarea
                                            value={q.question}
                                            onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)}
                                            className="w-full p-3 border rounded-lg text-right text-base"
                                            rows="3"
                                            placeholder="أدخل نص السؤال هنا..."
                                        />
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-3">
                                        <label className="block text-right font-semibold text-sm sm:text-base">الخيارات</label>
                                        {q.options.map((opt, optIndex) => (
                                            <div key={optIndex} className="flex items-center gap-2 sm:gap-3">
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={q.correctAnswer === optIndex}
                                                    onChange={() => handleQuestionChange(qIndex, 'correctAnswer', optIndex)}
                                                    className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0"
                                                    title="الإجابة الصحيحة"
                                                />
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={e => handleOptionChange(qIndex, optIndex, e.target.value)}
                                                    className="flex-1 p-3 border rounded-lg text-right text-base min-h-[48px]"
                                                    placeholder={`الخيار ${optIndex + 1}`}
                                                />
                                                <span className="text-gray-600 font-semibold text-base flex-shrink-0">{optIndex + 1}</span>
                                            </div>
                                        ))}
                                        <p className="text-xs sm:text-sm text-gray-600 text-right">
                                            ✓ اختر الدائرة بجانب الإجابة الصحيحة
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
                    <button
                        onClick={handleSubmit}
                        className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition text-base min-h-[48px]"
                    >
                        💾 حفظ التعديلات
                    </button>
                    <Link
                        to="/quizzes"
                        className="w-full sm:flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition text-center text-base min-h-[48px] flex items-center justify-center"
                    >
                        ❌ إلغاء
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UpdateQuiz;
