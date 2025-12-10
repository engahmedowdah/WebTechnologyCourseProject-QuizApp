import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-3 md:px-4 md:py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-2 md:gap-3">
                        <svg className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h1 className="text-base sm:text-lg md:text-2xl font-bold">تطبيق الاختبارات</h1>
                    </div>
                    <nav className="hidden md:flex gap-2 lg:gap-3">
                        <Link to="/" className="nav-btn px-3 lg:px-4 py-2 rounded-lg hover:bg-opacity-30 transition text-sm lg:text-base" style={{ backgroundColor: 'rgba(123, 123, 123, 0.2)' }}>
                            الرئيسية
                        </Link>
                        <Link to="/categories" className="nav-btn px-3 lg:px-4 py-2 rounded-lg hover:bg-opacity-30 transition text-sm lg:text-base" style={{ backgroundColor: 'rgba(123, 123, 123, 0.2)' }}>
                            الاختبارات
                        </Link>
                        <Link to="/manage-categories" className="nav-btn px-3 lg:px-4 py-2 rounded-lg hover:bg-opacity-30 transition text-sm lg:text-base" style={{ backgroundColor: 'rgba(123, 123, 123, 0.2)' }}>
                            التصنيفات
                        </Link>
                        <Link to="/add" className="nav-btn px-3 lg:px-4 py-2 rounded-lg hover:bg-opacity-30 transition text-sm lg:text-base" title="Add New" style={{ backgroundColor: 'rgba(123, 123, 123, 0.2)' }}>
                            إضافة اختبار
                        </Link>
                    </nav>
                    <button onClick={toggleMobileMenu} className="md:hidden p-2.5 rounded-lg min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-10 transition-all">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                {isMobileMenuOpen && (
                    <nav id="mobileMenu" className="md:hidden mt-4 pb-2 space-y-2 border-t border-white border-opacity-20 pt-4">
                        <Link to="/" onClick={toggleMobileMenu} className="block w-full text-right px-4 py-3.5 rounded-lg hover:brightness-110 transition min-h-[48px] text-base font-medium" style={{ backgroundColor: 'oklch(48.8% 0.243 264.376)' }}>
                            الرئيسية
                        </Link>
                        <Link to="/categories" onClick={toggleMobileMenu} className="block w-full text-right px-4 py-3.5 rounded-lg hover:brightness-110 transition min-h-[48px] text-base font-medium" style={{ backgroundColor: 'oklch(48.8% 0.243 264.376)' }}>
                            الاختبارات
                        </Link>
                        <Link to="/manage-categories" onClick={toggleMobileMenu} className="block w-full text-right px-4 py-3.5 rounded-lg hover:brightness-110 transition min-h-[48px] text-base font-medium" style={{ backgroundColor: 'oklch(48.8% 0.243 264.376)' }}>
                            إدارة التصنيفات
                        </Link>
                        <Link to="/add" onClick={toggleMobileMenu} className="block w-full text-right px-4 py-3.5 rounded-lg hover:brightness-110 transition min-h-[48px] text-base font-medium" style={{ backgroundColor: 'oklch(48.8% 0.243 264.376)' }}>
                            إضافة اختبار
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
