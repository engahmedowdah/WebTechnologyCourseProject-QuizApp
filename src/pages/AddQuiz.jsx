import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import Modal from '../components/Modal';

const AddQuiz = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const preselectedCategory = queryParams.get('category');

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        categoryName: preselectedCategory || '',
        difficulty: 'متوسط',
        questions: []
    });

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const data = await api.getCategories();
        setCategories(data);
        if (preselectedCategory) {
            const exists = data.some(cat => cat.name === preselectedCategory);
            if (exists) {
                setFormData(prev => ({ ...prev, categoryName: preselectedCategory }));
            }
        }
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    text: '',
                    answers: [
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false }
                    ]
                }
            ]
        }));
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const updateAnswer = (qIndex, aIndex, field, value) => {
        const newQuestions = [...formData.questions];
        if (field === 'isCorrect') {
            newQuestions[qIndex].answers.forEach((a, i) => {
                a.isCorrect = i === aIndex;
            });
        } else {
            newQuestions[qIndex].answers[aIndex][field] = value;
        }
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleSubmit = async () => {
        let message = '';
        if (!formData.title && !formData.categoryName) {
            message = 'الرجاء ملء عنوان الاختبار واختيار التصنيف';
        } else if (!formData.title) {
            message = 'الرجاء ملء عنوان الاختبار';
        } else if (!formData.categoryName) {
            message = 'الرجاء اختيار التصنيف';
        }

        if (message) {
            setModalConfig({
                isOpen: true,
                title: 'بيانات ناقصة',
                message: message,
                type: 'warning'
            });
            return;
        }

        if (formData.questions.length === 0) {
            setModalConfig({
                isOpen: true,
                title: 'تنبيه هام',
                message: 'عذراً، لا يمكن إنشاء اختبار فارغ! يجب عليك إضافة سؤال واحد على الأقل للاستمرار.',
                type: 'error'
            });
            return;
        }

        for (let i = 0; i < formData.questions.length; i++) {
            const q = formData.questions[i];
            if (!q.text.trim()) {
                setModalConfig({
                    isOpen: true,
                    title: 'بيانات ناقصة',
                    message: `الرجاء كتابة نص السؤال رقم ${i + 1}`,
                    type: 'warning'
                });
                return;
            }

            const filledAnswers = q.answers.filter(a => a.text.trim());
            if (filledAnswers.length !== 4) {
                setModalConfig({
                    isOpen: true,
                    title: 'إجابات ناقصة',
                    message: `يجب إدخال 4 إجابات للسؤال رقم ${i + 1}`,
                    type: 'warning'
                });
                return;
            }

            const hasCorrect = q.answers.some(a => a.isCorrect);
            if (!hasCorrect) {
                setModalConfig({
                    isOpen: true,
                    title: 'تنبيه',
                    message: `يجب تحديد إجابة صحيحة واحدة للسؤال رقم ${i + 1}`,
                    type: 'warning'
                });
                return;
            }
        }

        try {
            await api.createQuiz(formData);
            setModalConfig({
                isOpen: true,
                title: 'تم بنجاح',
                message: 'تم إضافة الاختبار الجديد بنجاح!',
                type: 'success'
            });
            setTimeout(() => window.location.href = '/quizzes', 1500);
        } catch (error) {
            console.error(error);
            setModalConfig({
                isOpen: true,
                title: 'خطأ',
                message: 'حدث خطأ أثناء إضافة الاختبار، الرجاء المحاولة مرة أخرى.',
                type: 'error'
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
            />

            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-right">إضافة اختبار جديد</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-right mb-2 font-semibold">عنوان الاختبار</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                        />
                    </div>
                    <div>
                        <label className="block text-right mb-2 font-semibold">التصنيف</label>
                        <select
                            value={formData.categoryName}
                            onChange={e => setFormData({ ...formData, categoryName: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                        >
                            <option value="">اختر التصنيف</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
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
                </div>
            </div>

            <div className="space-y-4">
                {formData.questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold mb-4 text-right">السؤال {qIndex + 1}</h3>
                        <input
                            type="text"
                            placeholder="نص السؤال"
                            value={q.text}
                            onChange={e => updateQuestion(qIndex, 'text', e.target.value)}
                            className="w-full p-3 border rounded-lg text-right mb-4"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            {q.answers.map((a, aIndex) => (
                                <div key={aIndex} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`correct-${qIndex}`}
                                        checked={a.isCorrect}
                                        onChange={() => updateAnswer(qIndex, aIndex, 'isCorrect', true)}
                                        className="w-4 h-4"
                                    />
                                    <input
                                        type="text"
                                        placeholder={`الإجابة ${aIndex + 1}`}
                                        value={a.text}
                                        onChange={e => updateAnswer(qIndex, aIndex, 'text', e.target.value)}
                                        className={`w-full p-2 border rounded-lg text-right ${a.isCorrect ? 'border-green-500 bg-green-50' : ''}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <button onClick={addQuestion} className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
                    + إضافة سؤال
                </button>
                <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition">
                    حفظ الاختبار
                </button>
            </div>
        </div>
    );
};

export default AddQuiz;
