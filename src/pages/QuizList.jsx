import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { api } from '../services/api';
import Modal from '../components/Modal';

const QuizList = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');

    const [quizzes, setQuizzes] = useState([]);
    const [displayCount, setDisplayCount] = useState(5);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        showConfirm: false,
        onConfirm: null
    });

    useEffect(() => {
        loadQuizzes();
    }, [category]);

    const loadQuizzes = async () => {
        try {
            const data = await api.getQuizzes(category);
            setQuizzes(data);
        } catch (error) {
            console.error('Failed to load quizzes', error);
        }
    };

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 5);
    };

    const confirmDelete = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'تأكيد الحذف',
            message: 'هل أنت متأكد من رغبتك في حذف هذا الاختبار؟ لا يمكن التراجع عن هذا الإجراء.',
            type: 'warning',
            showConfirm: true,
            onConfirm: () => handleDelete(id)
        });
    };

    const handleDelete = async (id) => {
        try {
            await api.deleteQuiz(id);
            setQuizzes(prev => prev.filter(q => q.id !== id));
            setModalConfig({
                isOpen: true,
                title: 'تم الحذف',
                message: 'تم حذف الاختبار بنجاح',
                type: 'success',
                showConfirm: false
            });
        } catch (error) {
            setModalConfig({
                isOpen: true,
                title: 'خطأ',
                message: 'فشل حذف الاختبار، الرجاء المحاولة مرة أخرى',
                type: 'error',
                showConfirm: false
            });
        }
    };

    const displayedQuizzes = quizzes.slice(0, displayCount);

    return (
        <div className="space-y-6">
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                showConfirm={modalConfig.showConfirm}
                onConfirm={modalConfig.onConfirm}
            />

            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold">
                    {!category || category === 'all' ? 'جميع الاختبارات' : `اختبارات ${category}`}
                </h2>
                <div className="flex gap-2">
                    <Link to="/manage-categories" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        إدارة التصنيفات
                    </Link>
                    <Link to="/categories" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700">
                        تغيير التصنيف
                    </Link>
                </div>
            </div>

            {quizzes.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد اختبارات في هذا التصنيف</h3>
                    <p className="text-gray-600 mb-6">لم يتم إضافة أي اختبارات هنا بعد. كن أول من يضيف اختباراً!</p>
                    <Link to={`/add?category=${encodeURIComponent(category || '')}`} className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        إضافة اختبار جديد ✨
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <tr>
                                <th className="p-4 text-center">العمليات</th>
                                <th className="p-4 text-center">الصعوبة</th>
                                <th className="p-4 text-center">عدد الأسئلة</th>
                                <th className="p-4 text-center">التصنيف</th>
                                <th className="p-4 text-center">العنوان</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedQuizzes.map(quiz => {
                                const difficultyClass =
                                    quiz.difficulty === 'سهل' ? 'bg-green-100 text-green-800' :
                                        quiz.difficulty === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800';

                                return (
                                    <tr key={quiz.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Link to={`/quiz/${quiz.id}/take`} className="text-purple-600 hover:text-purple-800 cursor-pointer" title="Start Quiz">🚀</Link>
                                                <Link to={`/quiz/${quiz.id}`} className="text-blue-600 hover:text-blue-800 cursor-pointer" title="Show Details">👁️</Link>
                                                <Link to={`/quiz/${quiz.id}/edit`} className="text-green-600 hover:text-green-800 cursor-pointer" title="Update">✏️</Link>
                                                <button onClick={() => confirmDelete(quiz.id)} className="text-red-600 hover:text-red-800 cursor-pointer" title="Delete">🗑️</button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm ${difficultyClass}`}>
                                                {quiz.difficulty}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">{quiz.Questions?.length || 0}</td>
                                        <td className="p-4 text-center">{quiz.categoryName}</td>
                                        <td className="p-4 font-semibold text-center">{quiz.title}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {quizzes.length > displayCount && (
                <div className="text-center">
                    <button onClick={handleLoadMore} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700">
                        عرض المزيد
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizList;
