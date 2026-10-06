import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "remixicon/fonts/remixicon.css";
import { APP_CONFIG } from "../../config";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useTranslate from "../../Hooks/Translation/useTranslate";
import { setLanguage } from "../../Redux/slices/languageSlice";
import { toggleTheme } from "../../Redux/slices/themeSlice";
import Loader from "../../Components/UI/loader";
import { loginUser } from "../../Redux/slices/authSlice";

const Auth = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentLang = useSelector((state) => state.language.lang);
    const themeMode = useSelector((state) => state.theme?.mode || "light");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleLanguage = () => {
        dispatch(setLanguage(currentLang === 'ar' ? 'en' : 'ar'));
    };

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    // Set direction based on language from Redux
    useEffect(() => {
        const direction = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = direction;
        document.documentElement.lang = currentLang;
    }, [currentLang]);

    const loginValidation = Yup.object({
        userName: Yup.string().required(t("User Name is required")),
        password: Yup.string().required(t("Password is required")),
    });


    const loginFormik = useFormik({
        initialValues: { userName: "", password: "" },
        validationSchema: loginValidation,
        onSubmit: async (values, { setSubmitting }) => {
            console.log("LoginFormik submitted values:", values);
            setLoginError("");
            setIsLoading(true);
            const result = await dispatch(loginUser(values.userName, values.password));

            if (result.success) {
                const target = result.defaultPage?.toLowerCase();
                if (target?.includes("changepassword")) {
                    navigate("/ChangePassword");
                } else {
                    navigate(result.defaultPage || "/");
                }
            } else {
                setLoginError(t("Invalid credentials"));
            }

            setIsLoading(false);
            setSubmitting(false);
        },
    });

    // Shorthand dark-mode flag
    const dk = themeMode === 'dark';

    return (
        <div
            className="flex w-full min-h-screen transition-colors duration-300"
            style={{ backgroundColor: dk ? "#0f1729" : "#ffffff" }}
        >

            {/* Full-screen loader overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Loader />
                </div>
            )}

            {/* â”€â”€ LEFT PANEL: Hero â”€â”€ */}
            <div
                className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center p-12 transition-colors duration-300"
                style={{
                    background: dk
                        ? "linear-gradient(135deg, #0d1527 0%, #111e36 40%, #0f1a30 100%)"
                        : "linear-gradient(135deg, #f0f4ff 0%, #e8f1ff 40%, #dce8f8 100%)",
                }}
            >
                {/* Subtle decorative blobs */}
                <div
                    className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
                    style={{
                        background: dk
                            ? "radial-gradient(circle, #1e3a6e 0%, transparent 70%)"
                            : "radial-gradient(circle, #c9dcff 0%, transparent 70%)"
                    }}
                />
                <div
                    className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
                    style={{
                        background: dk
                            ? "radial-gradient(circle, #162d56 0%, transparent 70%)"
                            : "radial-gradient(circle, #93b8ff 0%, transparent 70%)"
                    }}
                />

                {/* â”€â”€ Scattered remix icon decorations â”€â”€ */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    {/* Top-left cluster */}
                    <i className="ri-car-fill absolute top-[8%] left-[6%] text-[72px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.07, transform: "rotate(-15deg)" }} />
                    <i className="ri-steering-2-fill absolute top-[18%] left-[18%] text-[44px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.06, transform: "rotate(10deg)" }} />
                    {/* Top-center */}
                    <i className="ri-roadster-fill absolute top-[5%] left-[42%] text-[56px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.055, transform: "rotate(6deg)" }} />
                    <i className="ri-plane-fill absolute top-[12%] left-[62%] text-[48px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.06, transform: "rotate(-8deg)" }} />
                    {/* Top-right */}
                    <i className="ri-gas-station-fill absolute top-[6%] right-[8%] text-[60px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.065, transform: "rotate(12deg)" }} />
                    {/* Mid-left */}
                    <i className="ri-map-pin-2-fill absolute top-[38%] left-[4%] text-[52px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.06, transform: "rotate(-20deg)" }} />
                    <i className="ri-tools-fill absolute top-[52%] left-[14%] text-[40px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.055, transform: "rotate(5deg)" }} />
                    {/* Mid-center */}
                    <i className="ri-truck-fill absolute top-[44%] left-[44%] text-[66px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.055, transform: "rotate(-6deg)" }} />
                    {/* Mid-right */}
                    <i className="ri-route-fill absolute top-[35%] right-[6%] text-[50px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.06, transform: "rotate(14deg)" }} />
                    <i className="ri-signal-wifi-fill absolute top-[56%] right-[14%] text-[38px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.05, transform: "rotate(-10deg)" }} />
                    {/* Bottom-left */}
                    <i className="ri-taxi-wifi-fill absolute bottom-[22%] left-[8%] text-[58px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.065, transform: "rotate(8deg)" }} />
                    {/* Bottom-center */}
                    <i className="ri-dashboard-fill absolute bottom-[14%] left-[38%] text-[46px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.055, transform: "rotate(-5deg)" }} />
                    {/* Bottom-right */}
                    <i className="ri-map-2-fill absolute bottom-[18%] right-[7%] text-[54px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.06, transform: "rotate(16deg)" }} />
                    <i className="ri-compass-3-fill absolute bottom-[32%] right-[22%] text-[38px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.05, transform: "rotate(-12deg)" }} />
                </div>

                <div className="flex flex-col items-center w-full max-w-2xl gap-10 relative z-10">

                    {/* Logo */}
                    <div className="w-56 mb-2">
                        <img
                            alt={`${APP_CONFIG.companyName} Logo`}
                            className="w-full h-auto object-contain drop-shadow-sm"
                            src={dk ? APP_CONFIG.logoDark : APP_CONFIG.logo}
                        />
                    </div>

                    {/* Vehicle Row */}
                    <div className="flex flex-row items-end justify-between w-full gap-6">
                        {APP_CONFIG.authHeroImages.map((imgSrc, idx) => (
                            <div key={idx} className="flex-1 flex items-end justify-center">
                                <img
                                    src={imgSrc}
                                    alt={`Hero Decor ${idx + 1}`}
                                    className="w-full h-auto object-contain hover:drop-shadow-lg transition-all duration-300 hover:-translate-y-1"
                                    style={{ maxHeight: "200px", filter: dk ? "brightness(0.85) contrast(1.1)" : "none" }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Brand Text */}

                </div>
            </div>

            {/* â”€â”€ RIGHT PANEL: Login Canvas â”€â”€ */}
            <div
                className="w-full lg:w-[45%] flex flex-col justify-center items-center px-8 py-12 relative z-10 transition-colors duration-300"
                style={{
                    backgroundColor: dk ? "#1a2440" : "#ffffff",
                    boxShadow: dk
                        ? "-20px 0 40px rgba(0,0,0,0.4)"
                        : "-20px 0 40px rgba(1,35,94,0.05)",
                }}
            >
                {/* â”€â”€ Top Controls: Language + Theme â”€â”€ */}
                <div className="absolute top-5 ltr:right-6 rtl:left-6 flex items-center gap-2">

                    {/* Language Toggle */}
                    <button
                        type="button"
                        onClick={handleToggleLanguage}
                        title="Switch Language"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-inter text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                            backgroundColor: dk ? "#243055" : "#f0f4ff",
                            color: dk ? "#7eaaee" : "#01235E",
                            border: dk ? "1px solid #2e3d66" : "1px solid #c9dcff",
                        }}
                    >
                        <i className="ri-translate-2 text-sm" />
                        {currentLang === 'ar' ? 'EN' : 'العربية'}
                    </button>

                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={handleToggleTheme}
                        title={dk ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                            backgroundColor: dk ? "#243055" : "#f0f4ff",
                            color: dk ? "#f6c542" : "#01235E",
                            border: dk ? "1px solid #2e3d66" : "1px solid #c9dcff",
                        }}
                    >
                        <i className={`${dk ? 'ri-sun-fill' : 'ri-moon-fill'} text-sm`} />
                    </button>
                </div>

                <div className="w-full max-w-md flex flex-col justify-center h-full">

                    {/* Mobile Branding (Hidden on Desktop) */}
                    <div className="flex lg:hidden items-center gap-3 mb-8">
                        <img
                            alt={`${APP_CONFIG.companyName} Logo`}
                            className="h-8 w-auto"
                            src={dk ? APP_CONFIG.logoDark : APP_CONFIG.logo}
                        />
                        <h1
                            className="font-Cairo font-bold text-lg"
                            style={{ color: dk ? "#7eaaee" : "#01235E" }}
                        >
                            {t(APP_CONFIG.systemName)}
                        </h1>
                    </div>

                    {/* Login Header */}
                    <div className="mb-8">
                        <h2
                            className="font-Cairo font-bold text-3xl mb-2"
                            style={{ color: dk ? "#e8eef8" : "#1a202c" }}
                        >
                            {t(APP_CONFIG.systemName)}
                        </h2>
                        <p
                            className="font-inter text-base"
                            style={{ color: dk ? "#8a9bbf" : "#718096" }}
                        >
                            {t(APP_CONFIG.systemDescription)}
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={loginFormik.handleSubmit} className="w-full" noValidate>

                        {/* Login Error Message */}
                        {loginError && (
                            <div
                                className="w-full mb-5 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-inter"
                                style={{
                                    backgroundColor: dk ? "#2d1515" : "#fff5f5",
                                    border: dk ? "1px solid #7b3030" : "1px solid #feb2b2",
                                    color: dk ? "#fc8181" : "#c53030",
                                }}
                            >
                                <i className="ri-error-warning-line text-lg" />
                                {loginError}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="mb-4">
                            <label
                                className="block font-inter font-medium text-sm mb-1.5"
                                style={{ color: dk ? "#a8b8d8" : "#2d3748" }}
                                htmlFor="userName"
                            >
                                {t("User Name")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                    <i className="ri-user-line text-lg" style={{ color: dk ? "#4a6a9e" : "#a0aec0" }} />
                                </div>
                                <input
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    placeholder={t("User Name")}
                                    onChange={loginFormik.handleChange}
                                    onBlur={loginFormik.handleBlur}
                                    value={loginFormik.values.userName}
                                    className="block w-full ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-2.5 rounded-xl font-inter text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900/40"
                                    style={{
                                        border: loginFormik.touched.userName && loginFormik.errors.userName
                                            ? "1px solid #fc8181"
                                            : dk ? "1px solid #2e3d66" : "1px solid #e2e8f0",
                                        backgroundColor: dk ? "#0f1729" : "#f7fafc",
                                        color: dk ? "#d0daf0" : "#2d3748",
                                    }}
                                />
                            </div>
                            {loginFormik.touched.userName && loginFormik.errors.userName && (
                                <p className="text-red-400 text-xs font-inter mt-1 ltr:ml-1 rtl:mr-1">
                                    {loginFormik.errors.userName}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <label
                                className="block font-inter font-medium text-sm mb-1.5"
                                style={{ color: dk ? "#a8b8d8" : "#2d3748" }}
                                htmlFor="password"
                            >
                                {t("Password")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                    <i className="ri-lock-line text-lg" style={{ color: dk ? "#4a6a9e" : "#a0aec0" }} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                    onChange={loginFormik.handleChange}
                                    onBlur={loginFormik.handleBlur}
                                    value={loginFormik.values.password}
                                    className="block w-full ltr:pl-10 rtl:pr-10 ltr:pr-10 rtl:pl-10 py-2.5 rounded-xl font-inter text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900/40"
                                    style={{
                                        border: loginFormik.touched.password && loginFormik.errors.password
                                            ? "1px solid #fc8181"
                                            : dk ? "1px solid #2e3d66" : "1px solid #e2e8f0",
                                        backgroundColor: dk ? "#0f1729" : "#f7fafc",
                                        color: dk ? "#d0daf0" : "#2d3748",
                                    }}
                                />
                                <div
                                    className="absolute inset-y-0 ltr:right-0 rtl:left-0 ltr:pr-3 rtl:pl-3 flex items-center cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    <i
                                        className={`${showPassword ? "ri-eye-off-line" : "ri-eye-line"} text-lg transition-colors`}
                                        style={{ color: dk ? "#4a6a9e" : "#a0aec0" }}
                                    />
                                </div>
                            </div>
                            {loginFormik.touched.password && loginFormik.errors.password && (
                                <p className="text-red-400 text-xs font-inter mt-1 ltr:ml-1 rtl:mr-1">
                                    {loginFormik.errors.password}
                                </p>
                            )}
                        </div>



                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || loginFormik.isSubmitting}
                            className={`
                                w-full flex justify-center
                                py-3 px-4
                                rounded-xl
                                font-Cairo font-bold text-base
                                text-white
                                shadow-md
                                transition-all duration-200
                                active:opacity-90
                                ${(isLoading || loginFormik.isSubmitting) ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:shadow-lg"}
                            `}
                            style={{
                                backgroundColor: dk ? "#1e4fa0" : "#01235E",
                                boxShadow: dk ? "0 4px 20px rgba(30,79,160,0.4)" : undefined,
                            }}
                        >
                            {isLoading ? t("Logging in...") : t("Sign In")}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="absolute bottom-6 w-full flex justify-center gap-6">
                    <span
                        className="font-inter text-xs"
                        style={{ color: dk ? "#3d5480" : "#a0aec0" }}
                    >
                        &copy; {APP_CONFIG.copyrightYear} {t(APP_CONFIG.companyName)}. {t("All rights reserved.")}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Auth;

