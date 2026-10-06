import React, { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useTranslate from "../../Hooks/Translation/useTranslate";

import { logout } from '../../Redux/slices/authSlice';
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../../config";
import person from "../../Assets/Images/Person.png"


const Sidebar = ({ isSidebarOpen, closeSidebar, isDesktop, isCollapsed, toggleCollapsed }) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const submenuRefs = useRef({});
    const { t } = useTranslate();
    const location = useLocation();
    const dispatch = useDispatch();
    const currentLang = useSelector((state) => state.language.lang);
    const navigate = useNavigate();
    const themeMode = useSelector((state) => state.theme?.mode || 'light');
    const userName = useSelector((state) => state.auth?.name);

    const languageDropdownRef = useRef(null);
    const profileDropdownRef = useRef(null);
    const sidebarRef = useRef(null);

    console.log(userName, "userName")

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                if (!event.target.closest('#profile-portal')) {
                    setIsProfileDropdownOpen(false);
                }
            }
            if (isCollapsed && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                if (!event.target.closest('#submenu-portal')) {
                    setOpenMenus({});
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCollapsed]);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
        setIsProfileDropdownOpen(false);
    };



    // ─── Generic Menu Configuration ─────────────────────────────────────
    // Items WITHOUT `children` → direct link.
    // Items WITH `children`   → expandable parent with submenu.
    // Just add/remove entries here to scale.
    // ─── Generic Menu Configuration ─────────────────────────────────────
    const menuItems = [
        {
            id: "dashboard",
            sectionLabel: t("DASHBOARD"),
            title: t("Dashboard"),
            icon: "ri-dashboard-line",
            path: "/Dashboard",
        },
        {
            id: "system",
            sectionLabel: t("SYSTEM"),
            title: t("System Settings"),
            icon: "ri-settings-4-line",
            children: [
                {
                    id: "users",
                    title: t("Users"),
                    icon: "ri-user-line",
                    path: "/System/Users",
                },
                {
                    id: "roles",
                    title: t("Roles"),
                    icon: "ri-shield-user-line",
                    path: "/System/Roles",
                }
            ],
        },
    ];

    /** Check if a specific path matches the current route */
    const isActiveLink = (path) => location.pathname === path;

    /** Check if any child of a parent menu is currently active */
    const isParentActive = (item) => {
        if (!item.children) return false;
        return item.children.some((child) => location.pathname === child.path);
    };

    /** Toggle a parent menu open/closed (accordion — only one open at a time) */
    const toggleMenu = useCallback((menuId, event) => {
        setOpenMenus((prev) => {
            const isCurrentlyOpen = prev[menuId];
            // Close all menus, then toggle the clicked one
            const newState = {};
            menuItems.forEach((item) => { newState[item.id] = false; });
            newState[menuId] = !isCurrentlyOpen;
            return newState;
        });
        if (event && event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-expand parent menus whose child matches the current route
    useEffect(() => {
        if (isCollapsed) {
            setOpenMenus({});
            return;
        }
        const newOpenMenus = {};
        menuItems.forEach((item) => {
            if (item.children && item.children.some((child) => location.pathname === child.path)) {
                newOpenMenus[item.id] = true;
            }
        });
        setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, isCollapsed]);

    /** Render a single leaf menu item (direct link) */
    const renderMenuItem = (item, isChild = false) => {
        const active = isActiveLink(item.path);
        return (
            <li key={item.id}>
                <Link
                    to={item.path}
                    onClick={!isDesktop ? closeSidebar : undefined}
                    title={isCollapsed ? item.title : undefined}
                    className={`
                        flex items-center
                        ${isCollapsed ? "justify-center px-0 py-2.5" : isChild ? "ltr:pl-10 rtl:pr-10 px-3 py-2" : "px-3 py-2.5"}
                        text-sm font-Cairo rounded-lg
                        transition-all duration-150
                        group relative
                        ${active
                            ? "bg-gray-400/10 dark:bg-primary-900/30 text-white font-bold shadow-2xs"
                            : "text-white/80 dark:text-gray-400 hover:bg-gray-400/10 dark:hover:bg-gray-800/50 hover:text-white font-medium"
                        }
                    `}
                >
                    <i className={`${item.icon} ${isChild ? "text-lg" : "text-xl"} flex-shrink-0 ${!isCollapsed ? "ltr:mr-3 rtl:ml-3" : ""} ${active ? "text-white" : "text-white/70 dark:text-gray-500 group-hover:text-white"}`} />
                    {!isCollapsed && <span className="whitespace-nowrap">{item.title}</span>}

                    {/* Tooltip when collapsed */}
                    {isCollapsed && (
                        <span className="
                            absolute ltr:left-full rtl:right-full
                            ltr:ml-3 rtl:mr-3
                            bg-gray-900 text-white text-xs font-Cairo
                            px-2.5 py-1.5 rounded-md
                            whitespace-nowrap
                            opacity-0 group-hover:opacity-100
                            pointer-events-none
                            transition-opacity duration-200
                            z-50
                            shadow-lg
                        ">
                            {item.title}
                        </span>
                    )}
                </Link>
            </li>
        );
    };

    /** Render a parent menu item with expandable children */
    const renderParentMenu = (item) => {
        const isOpen = openMenus[item.id];
        const hasActiveChild = isParentActive(item);

        return (
            <li key={item.id} className="relative">
                {/* Parent Button */}
                <button
                    type="button"
                    onClick={(e) => toggleMenu(item.id, e)}
                    title={isCollapsed ? item.title : undefined}
                    className={`
                        w-full flex items-center cursor-pointer
                        ${isCollapsed ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2.5"}
                        text-sm font-Cairo rounded-lg
                        transition-all duration-150
                        group relative
                        ${(isOpen || hasActiveChild)
                            ? "text-white font-bold dark:bg-primary-900/20"
                            : "text-white/80 dark:text-gray-400 hover:text-white font-medium"
                        }
                    `}
                >
                    <span className="flex items-center">
                        <i className={`${item.icon} text-xl flex-shrink-0 ${!isCollapsed ? "ltr:mr-3 rtl:ml-3" : ""} ${(isOpen || hasActiveChild) ? "text-white" : "text-white/70 group-hover:text-white"}`} />
                        {!isCollapsed && <span className="whitespace-nowrap">{item.title}</span>}
                    </span>

                    {!isCollapsed && (
                        <i
                            className={`
                                ri-arrow-down-s-line text-lg text-white/70
                                transition-transform duration-200 ease-in-out
                                ${isOpen ? "rotate-180 text-white" : ""}
                            `}
                        />
                    )}

                    {/* Tooltip when collapsed */}
                    {isCollapsed && (
                        <span className={`
                            absolute ltr:left-full rtl:right-full
                            ltr:ml-3 rtl:mr-3
                            bg-gray-900 text-white text-xs font-Cairo
                            px-2.5 py-1.5 rounded-md
                            whitespace-nowrap
                            pointer-events-none
                            transition-opacity duration-200
                            z-50
                            shadow-lg
                            ${isOpen ? "opacity-0" : "opacity-0 group-hover:opacity-100"}
                        `}>
                            {item.title}
                        </span>
                    )}
                </button>

                {/* Children / Submenu — ref-based height for smooth animation */}
                {!isCollapsed && (
                    <div
                        className="overflow-hidden"
                        style={{
                            maxHeight: isOpen
                                ? `${(submenuRefs.current[item.id]?.scrollHeight || 500) + 24}px`
                                : "0px",
                            opacity: isOpen ? 1 : 0,
                            transition: "max-height 250ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease",
                        }}
                    >
                        <div
                            ref={(el) => { submenuRefs.current[item.id] = el; }}
                            className="py-1"
                        >
                            {/* Submenu container — full width matching parent button */}
                            <ul className="space-y-1">
                                {item.children.map((child) => {
                                    const childActive = isActiveLink(child.path);
                                    return (
                                        <li key={child.id}>
                                            <Link
                                                to={child.path}
                                                onClick={!isDesktop ? closeSidebar : undefined}
                                                className={`
                                                    flex items-center w-full
                                                    ltr:pl-8 rtl:pr-8 ltr:pr-3 rtl:pl-3 py-2
                                                    text-sm font-Cairo rounded-lg
                                                    transition-all duration-150
                                                    group relative
                                                    ${childActive
                                                        ? "bg-gray-400/10 dark:bg-primary-900/30 text-white font-bold shadow-2xs"
                                                        : "text-white/80 dark:text-gray-400 hover:bg-gray-400/10 dark:hover:bg-gray-800/50 hover:text-white font-medium"
                                                    }
                                                `}
                                            >
                                                {/* Active accent pill indicator */}
                                                {childActive && (
                                                    <span className="absolute ltr:left-2.5 rtl:right-2.5 top-1/2 -translate-y-1/2 w-1 h-4 bg-white dark:bg-primary-500 rounded-full" />
                                                )}
                                                <i className={`${child.icon} text-lg flex-shrink-0 ltr:mr-2.5 rtl:ml-2.5 ${childActive ? "text-white" : "text-white/70 group-hover:text-white"}`} />
                                                <span className="whitespace-nowrap">{child.title}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Collapsed: show children as a flyout portal list */}
                {isCollapsed && isOpen && anchorEl && createPortal(
                    <div
                        id="submenu-portal"
                        className="
                        fixed
                        bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-gray-200/80 dark:border-gray-700
                        py-2 min-w-[180px]
                        z-[9999]
                    "
                        style={{
                            top: anchorEl.getBoundingClientRect().top,
                            ...(document.documentElement.dir === 'rtl'
                                ? { right: window.innerWidth - anchorEl.getBoundingClientRect().left + 8 }
                                : { left: anchorEl.getBoundingClientRect().right + 8 })
                        }}>
                        <p className="px-3 py-1.5 text-xs font-Cairo font-bold text-gray-400 uppercase tracking-wide">
                            {item.title}
                        </p>
                        {item.children.map((child) => {
                            const childActive = isActiveLink(child.path);
                            return (
                                <Link
                                    key={child.id}
                                    to={child.path}
                                    onClick={() => {
                                        if (!isDesktop) closeSidebar();
                                        setOpenMenus({});
                                    }}
                                    className={`
                                        flex items-center px-3 py-2 text-sm font-Cairo rounded-lg mx-1
                                        ${childActive
                                            ? "text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 font-semibold"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                                        }
                                    `}
                                >
                                    <i className={`${child.icon} text-base ltr:mr-2 rtl:ml-2 ${childActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400 dark:text-gray-500"}`} />
                                    {child.title}
                                </Link>
                            );
                        })}
                    </div>,
                    document.body
                )}
            </li>
        );
    };

    const profileDropdownContent = (
        <>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <div className="px-4   flex flex-row items-center gap-2">
                    <img
                        src={person}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full mb-2"
                    />
                    <p className="text-sm  truncate">
                        {t("Hello")} ,  {userName}
                    </p>
                </div>
            </div>
            <ul className="py-2">
                <li>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left" onClick={() => { setIsProfileDropdownOpen(false); navigate('/Profile'); }}>
                        <i className="ri-user-line ltr:mr-3 rtl:ml-3 text-gray-400 dark:text-gray-500"></i>
                        {t("My Profile")}
                    </button>
                </li>
                <li>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left" onClick={() => { setIsProfileDropdownOpen(false); navigate('/ChangePassword'); }}>
                        <i className="ri-lock-password-line ltr:mr-3 rtl:ml-3 text-gray-400 dark:text-gray-500"></i>
                        {t("Change Password")}
                    </button>
                </li>
            </ul>
            <div className="py-2 border-t border-gray-200 dark:border-gray-800">
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
                    <i className="ri-logout-box-line ltr:mr-3 rtl:ml-3"></i>
                    {t("Logout")}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Sidebar Left Component */}
            <aside
                ref={sidebarRef}
                style={{
                    width: isCollapsed ? "80px" : "280px",
                    minWidth: isCollapsed ? "80px" : "280px",
                    transition: "width 0.3s ease, min-width 0.3s ease",
                }}
                className={`
                    relative
                    h-full
                    bg-[#1a2440] dark:bg-[#1e1e1e] text-white
                    border-white/10 dark:border-gray-800
                    ltr:border-r rtl:border-l
                    shadow-2xs
                    overflow-hidden
                    flex-shrink-0
                    flex flex-col
                    transition-colors duration-300
                `}
            >
                {/* Logo / Brand Section */}
                <div
                    className={`flex items-center ${isCollapsed ? "justify-center px-2" : "justify-between px-4"} py-4 border-b border-white/10 dark:border-gray-800 flex-shrink-0`}
                    style={{ minHeight: "72px" }}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div
                            onClick={isCollapsed && isDesktop ? toggleCollapsed : undefined}
                            className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20 shadow-2xs ${isCollapsed && isDesktop ? "cursor-pointer hover:bg-white/20 hover:scale-105 transition-all" : ""}`}
                            title={isCollapsed ? t("Click to expand sidebar") : undefined}
                        >
                            <img src={APP_CONFIG.sidebarLogo} width={26} height={26} alt="Logo" />
                        </div>

                        {!isCollapsed && (
                            <span className="text-white text-base font-Cairo font-bold truncate tracking-tight">
                                {t(APP_CONFIG.systemName)}
                            </span>
                        )}
                    </div>

                    {/* Toggle button — visible when expanded or on mobile */}
                    {!isCollapsed && (
                        <button
                            onClick={isDesktop ? toggleCollapsed : closeSidebar}
                            title={!isDesktop ? t("Close menu") : t("Collapse Sidebar")}
                            className="
                                flex-shrink-0
                                w-8 h-8
                                flex items-center justify-center
                                rounded-lg
                                border border-white/10 dark:border-gray-700
                                bg-transparent
                                text-white/70
                                hover:bg-white/10 dark:hover:bg-gray-800 hover:text-white
                                transition-all duration-150
                                shadow-2xs
                            "
                        >
                            <i className={`${!isDesktop ? "ri-close-line" : "ri-side-bar-line"} text-base`} />
                        </button>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav
                    onScroll={() => setOpenMenus({})}
                    className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                >
                    <ul className="space-y-1.5 pb-8">
                        {menuItems.map((item, idx) => (
                            <React.Fragment key={item.id}>
                                {item.sectionLabel && !isCollapsed && (
                                    <li className={`px-3 ${idx > 0 ? "pt-4 mt-2 border-t border-white/10" : "pt-0.5"} pb-1.5`}>
                                        <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider font-Cairo">
                                            {item.sectionLabel}
                                        </span>
                                    </li>
                                )}
                                {item.children ? renderParentMenu(item) : renderMenuItem(item)}
                            </React.Fragment>
                        ))}
                    </ul>
                </nav>

                {/* Profile Dropdown */}
                <div className="border-t border-white/10 dark:border-gray-800 py-2 px-2 space-y-1 flex-shrink-0">

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsProfileDropdownOpen(v => !v)}
                            className={`w-full inline-flex items-center ${isCollapsed ? "justify-center px-0 py-2" : "justify-between px-3 py-2"} rounded-lg text-white hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-200 group relative`}
                        >
                            <div className="flex items-center">
                                <div className={`${isCollapsed ? "w-6 h-6" : "w-8 h-8"} rounded-full bg-white/10 dark:bg-gray-700/80 flex items-center justify-center text-gray-200 font-Cairo font-bold text-sm`}>
                                    <i className="ri-user-line"></i>
                                </div>
                                {!isCollapsed && <span className="ltr:ml-2.5 rtl:mr-2.5 text-sm font-medium text-white">{t("Profile")}</span>}
                            </div>
                            {!isCollapsed && <i className={`ri-arrow-down-s-line text-sm text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}></i>}
                            {isCollapsed && (
                                <span className="absolute ltr:left-full rtl:right-full ltr:ml-3 rtl:mr-3 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                                    {t("Profile")}
                                </span>
                            )}
                        </button>
                        {isProfileDropdownOpen && !isCollapsed && (
                            <div className="absolute ltr:right-0 rtl:left-0 bottom-full mb-2 w-52 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-50 overflow-hidden">
                                {profileDropdownContent}
                            </div>
                        )}
                        {isProfileDropdownOpen && isCollapsed && profileDropdownRef.current && createPortal(
                            <div
                                id="profile-portal"
                                className="fixed w-52 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-[9999] overflow-hidden"
                                style={{
                                    bottom: window.innerHeight - profileDropdownRef.current.getBoundingClientRect().bottom,
                                    ...(document.documentElement.dir === 'rtl'
                                        ? { right: window.innerWidth - profileDropdownRef.current.getBoundingClientRect().left + 8 }
                                        : { left: profileDropdownRef.current.getBoundingClientRect().right + 8 })
                                }}
                            >
                                {profileDropdownContent}
                            </div>,
                            document.body
                        )}
                    </div>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;
