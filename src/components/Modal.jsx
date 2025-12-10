import React from 'react';

const Modal = ({ isOpen, onClose, title, message, type = 'info', showConfirm = false, onConfirm = null }) => {
    if (!isOpen) return null;

    const colors = {
        info: 'text-blue-600',
        error: 'text-red-600',
        success: 'text-green-600',
        warning: 'text-yellow-600'
    };

    const icons = {
        info: 'ℹ️',
        error: '⚠️',
        success: '✅',
        warning: '⚠️'
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all scale-100">
                <div className="p-6 text-center">
                    <div className={`text-5xl mb-4 ${colors[type]}`}>
                        {icons[type]}
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${colors[type]}`}>
                        {title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                        {message}
                    </p>

                    {showConfirm ? (
                        <div className="flex gap-3">
                            <button
                                onClick={handleConfirm}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                                نعم، احذف
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                إلغاء
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onClose}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition transform hover:scale-105 cursor-pointer ${type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                                type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                                    'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            حسناً، فهمت
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
