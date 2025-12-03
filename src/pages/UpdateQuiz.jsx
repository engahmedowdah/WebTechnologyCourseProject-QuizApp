import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const UpdateQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        categoryName: '',
        difficulty: 'متوسط'
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
                categoryName: quiz.categoryName,
                difficulty: quiz.difficulty
            });
        } catch (error) {
            console.error('Failed to load data', error);
        }
    };

    const handleSubmit = async () => {
        try {
            await api.updateQuiz(id, formData);
            alert('تم تحديث الاختبار بنجاح!');
            navigate('/quizzes');
        } catch (error) {
            alert('فشل تحديث الاختبار');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-right">تعديل الاختبار</h2>
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
                <div className="flex gap-4">
                    <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition">
                        حفظ التعديلات
                    </button>
                    <Link to="/quizzes" className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition text-center">
                        إلغاء
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UpdateQuiz;
