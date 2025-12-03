import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h1 className="text-2xl font-bold">تطبيق الاختبارات</h1>
                    </div>
                    <nav className="hidden md:flex gap-3">
                        <Link to="/" className="nav-btn px-4 py-2 rounded-lg hover:bg-opacity-30 transition" style={{ backgroundColor: 'rgba(123, 123, 123, 0.2)' }}>
                            الرئيسية
                        </Link>
                        <Link to="/categories" className="nav-btn px-4 py-2 rounded-lg hover:bg-opacity-30 transition" style={{ backgroundColor: 'rgba(123, 123, 123, 0.2)' }}>
                            الاختبارات
                        </Link>
                        <Link to="/manage-categories" className="nav-btn px-4 py-2 rounded-lg hover:bg-opacity-30 transition" style={{ backgroundColor: 'rgba(123, 123, 123, 0.2)' }}>
                            التصنيفات
                        </Link>
                        <Link to="/add" className="nav-btn px-4 py-2 rounded-lg hover:bg-opacity-30 transition" title="Add New" style={{ backgroundColor: 'rgba(123, 123, 123, 0.2)' }}>
                            إضافة اختبار
                        </Link>
                    </nav>
                    <button onClick={toggleMobileMenu} className="md:hidden hover:bg-white hover:bg-opacity-20 p-2 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                {isMobileMenuOpen && (
                    <nav id="mobileMenu" className="md:hidden mt-4 pb-4 space-y-2 border-t border-white border-opacity-20 pt-4">
                        <Link to="/" onClick={toggleMobileMenu} className="block w-full text-right px-4 py-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20">
                            الرئيسية
                        </Link>
                        <Link to="/categories" onClick={toggleMobileMenu} className="block w-full text-right px-4 py-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20">
                            الاختبارات
                        </Link>
                        <Link to="/manage-categories" onClick={toggleMobileMenu} className="block w-full text-right px-4 py-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20">
                            إدارة التصنيفات
                        </Link>
                        <Link to="/add" onClick={toggleMobileMenu} className="block w-full text-right px-4 py-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20">
                            إضافة اختبار
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
