// Navbar.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../Redux/slices/themeSlice";
import { setLanguage } from "../../Redux/slices/languageSlice";

import "remixicon/fonts/remixicon.css";
import useTranslate from "../../Hooks/Translation/useTranslate";


const Navbar = ({ toggleSidebar, isDesktop }) => {
    const dispatch = useDispatch();
    const themeMode = useSelector((state) => state.theme.mode);
    const currentLang = useSelector((state) => state.language.lang);
    const { t } = useTranslate();

    const handleToggleLanguage = () => {
        dispatch(setLanguage(currentLang === 'ar' ? 'en' : 'ar'));
    };

    return (
        <nav className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 shadow-sm w-full z-10 flex-shrink-0 transition-colors duration-300">
            <div className="mx-auto px-3 sm:px-4 tab-md:px-6 lg:px-7">
                <div className="flex items-center justify-between" style={{ height: "73px" }}>

                    {/* LEFT: Hamburger (mobile/tablet only) */}
                    <div className="flex items-center flex-1 ltr:mr-4 rtl:ml-4 gap-2 sm:gap-3">
                        {!isDesktop && (
                            <button
                                id="navbar-hamburger-btn"
                                onClick={toggleSidebar}
                                className="
                                    p-2 -ml-1
                                    rounded-lg
                                    text-gray-600 dark:text-gray-400
                                    hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800
                                    active:bg-gray-200 dark:active:bg-gray-700
                                    transition-colors duration-200
                                "
                                title={t("Toggle menu")}
                                aria-label={t("Toggle menu")}
                            >
                                <i className="ri-menu-line text-xl" />
                            </button>
                        )}
                    </div>

                    {/* RIGHT: Language Toggle & Theme Toggle Buttons */}
                    <div className="flex items-center gap-2">

                        {/* Language Toggle */}
                        <button
                            type="button"
                            onClick={handleToggleLanguage}
                            title="Switch Language"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-inter text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <i className="ri-translate-2 text-sm" />
                            {currentLang === 'ar' ? 'EN' : 'العربية'}
                        </button>

                        {/* Theme Toggle Button */}
                        <button
                            type="button"
                            onClick={() => dispatch(toggleTheme())}
                            title={themeMode === 'light' ? t('Switch to dark mode') : t('Switch to light mode')}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <i className={`${themeMode === 'dark' ? 'ri-sun-fill' : 'ri-moon-fill'} text-sm`} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
