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
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-right">تعديل الاختبار</h2>

            <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-right mb-2 font-semibold">عنوان الاختبار</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                            placeholder="مثال: اختبار الرياضيات 1"
                        />
                    </div>
                    <div>
                        <label className="block text-right mb-2 font-semibold">التصنيف</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-right mb-2 font-semibold">مستوى الصعوبة</label>
                    <select
                        value={formData.difficulty}
                        onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full p-3 border rounded-lg text-right"
                    >
                        <option value="سهل">سهل</option>
                        <option value="متوسط">متوسط</option>
                        <option value="صعب">صعب</option>
                    </select>
                </div>

                {/* Questions Section */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handleAddQuestion}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
                        >
                            ➕ إضافة سؤال
                        </button>
                        <h3 className="text-xl font-bold">الأسئلة ({formData.questions.length})</h3>
                    </div>

                    {formData.questions.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="text-gray-600 mb-4">لا توجد أسئلة بعد</p>
                            <button
                                onClick={handleAddQuestion}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
                            >
                                إضافة السؤال الأول
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {formData.questions.map((q, qIndex) => (
                                <div key={qIndex} className="border rounded-lg p-6 bg-gray-50">
                                    <div className="flex justify-between items-start mb-4">
                                        <button
                                            onClick={() => handleDeleteQuestion(qIndex)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                        >
                                            🗑️ حذف
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={q.difficulty}
                                                onChange={e => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyClass(q.difficulty)}`}
                                            >
                                                <option value="سهل">سهل</option>
                                                <option value="متوسط">متوسط</option>
                                                <option value="صعب">صعب</option>
                                            </select>
                                            <span className="font-bold text-lg">السؤال {qIndex + 1}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-right mb-2 font-semibold">نص السؤال</label>
                                        <textarea
                                            value={q.question}
                                            onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)}
                                            className="w-full p-3 border rounded-lg text-right"
                                            rows="3"
                                            placeholder="أدخل نص السؤال هنا..."
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-right font-semibold">الخيارات</label>
                                        {q.options.map((opt, optIndex) => (
                                            <div key={optIndex} className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={q.correctAnswer === optIndex}
                                                    onChange={() => handleQuestionChange(qIndex, 'correctAnswer', optIndex)}
                                                    className="w-5 h-5"
                                                    title="الإجابة الصحيحة"
                                                />
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={e => handleOptionChange(qIndex, optIndex, e.target.value)}
                                                    className="flex-1 p-3 border rounded-lg text-right"
                                                    placeholder={`الخيار ${optIndex + 1}`}
                                                />
                                                <span className="text-gray-600 font-semibold">{optIndex + 1}</span>
                                            </div>
                                        ))}
                                        <p className="text-sm text-gray-600 text-right">
                                            ✓ اختر الدائرة بجانب الإجابة الصحيحة
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition"
                    >
                        💾 حفظ التعديلات
                    </button>
                    <Link
                        to="/quizzes"
                        className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition text-center"
                    >
                        ❌ إلغاء
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UpdateQuiz;
