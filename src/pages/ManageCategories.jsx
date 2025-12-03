import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Modal from '../components/Modal';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [quizCounts, setQuizCounts] = useState({});
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const categoriesData = await api.getCategories();

            const quizzesData = await api.getQuizzes();

            const counts = {};
            quizzesData.forEach(quiz => {
                counts[quiz.category] = (counts[quiz.category] || 0) + 1;
            });
            setQuizCounts(counts);

            const categoriesWithCanDelete = categoriesData.map(cat => ({
                ...cat,
                canDelete: (counts[cat.name] || 0) === 0
            }));

            setCategories(categoriesWithCanDelete);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.updateCategory(editingId, formData);
                setModalConfig({
                    isOpen: true,
                    title: 'تم التحديث',
                    message: 'تم تحديث التصنيف بنجاح',
                    type: 'success'
                });
            } else {
                await api.createCategory(formData);
                setModalConfig({
                    isOpen: true,
                    title: 'تم الإضافة',
                    message: 'تم إضافة التصنيف بنجاح',
                    type: 'success'
                });
            }
            setFormData({ name: '', description: '' });
            setEditingId(null);
            loadCategories();
        } catch (error) {
            console.error('Failed to save category', error);
            setModalConfig({
                isOpen: true,
                title: 'خطأ',
                message: 'حدث خطأ أثناء حفظ التصنيف',
                type: 'error'
            });
        }
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name, description: category.description });
        setEditingId(category.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'تأكيد الحذف',
            message: 'هل أنت متأكد من رغبتك في حذف هذا التصنيف؟',
            type: 'warning',
            showConfirm: true,
            onConfirm: () => deleteCategory(id)
        });
    };

    const deleteCategory = async (id) => {
        try {
            await api.deleteCategory(id);
            loadCategories();
            setModalConfig({
                isOpen: true,
                title: 'تم الحذف',
                message: 'تم حذف التصنيف بنجاح',
                type: 'success',
                showConfirm: false
            });
        } catch (error) {
            console.error('Failed to delete category', error);
            setModalConfig({
                isOpen: true,
                title: 'خطأ',
                message: 'لا يمكن حذف التصنيف لأنه مرتبط باختبارات موجودة',
                type: 'error',
                showConfirm: false
            });
        }
    };

    const handleCancelEdit = () => {
        setFormData({ name: '', description: '' });
        setEditingId(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                showConfirm={modalConfig.showConfirm}
                onConfirm={modalConfig.onConfirm}
            />

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-right">
                    {editingId ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2 text-right">اسم التصنيف</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 text-right">الوصف</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 border rounded-lg text-right"
                            rows="3"
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
                            >
                                إلغاء
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer"
                        >
                            {editingId ? 'حفظ التغييرات' : 'إضافة التصنيف'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-right">قائمة التصنيفات</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 border-b text-center">اسم التصنيف</th>
                                <th className="p-4 border-b text-center">الوصف</th>
                                <th className="p-4 border-b text-center">عدد الاختبارات</th>
                                <th className="p-4 border-b text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 font-semibold text-center">{category.name}</td>
                                    <td className="p-4 text-gray-600 text-center">{category.description}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm ${(quizCounts[category.name] || 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {quizCounts[category.name] || 0}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                title="Update"
                                            >
                                                ✏️
                                            </button>
                                            <Link
                                                to={`/quizzes?category=${encodeURIComponent(category.name)}`}
                                                className="text-purple-600 hover:text-purple-800 cursor-pointer"
                                                title="Show Details"
                                            >
                                                👁️
                                            </Link>
                                            {category.canDelete ? (
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-red-600 hover:text-red-800 cursor-pointer"
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 cursor-not-allowed" title="Cannot delete: Linked to quizzes">
                                                    🔒
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageCategories;
