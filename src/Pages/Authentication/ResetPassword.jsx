import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import "remixicon/fonts/remixicon.css";
import GroundServiceLogo from "../../Assets/Images/GroundServiceLogo.png";
import GroundServiceLogoDark from "../../Assets/Images/logo3.png";
import FollowMeImg from "../../Assets/Images/car1.png";
import FrontPushBackImg from "../../Assets/Images/car2.png";
import SampleCopyImg from "../../Assets/Images/car3.png";
import { useDispatch, useSelector } from "react-redux";
import useTranslate from "../../Hooks/Translation/useTranslate.jsx";
import { useNavigate } from "react-router-dom";
import { createPostRequest } from "../../Hooks/Services/Requests.jsx";
import { logout } from "../../Redux/slices/authSlice.jsx";

import Loader from "../../Components/UI/loader.jsx";

const ResetPassword = () => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentLang = useSelector((state) => state.language.lang);
    const themeMode = useSelector((state) => state.theme?.mode || "light");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const direction = currentLang === "ar" ? "rtl" : "ltr";
        document.documentElement.dir = direction;
        document.documentElement.lang = currentLang;
    }, [currentLang]);



    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword((prev) => !prev);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const ResetPasswordValidation = yup.object({
        currentPassword: yup.string().required(t("Current password is required")),
        newPassword: yup
            .string()
            .required(t("New password is required"))
            .min(8, t("Password must be at least 8 characters"))
            .max(20, t("Password cannot exceed 20 characters"))
            .matches(/[A-Z]/, t("Must contain at least one uppercase letter"))
            .matches(/[a-z]/, t("Must contain at least one lowercase letter"))
            .matches(/[0-9]/, t("Must contain at least one number"))
            .matches(/[!@#$%^&*(),.?":{}|<>_\-]/, t("Must contain at least one special character"))
            .notOneOf([yup.ref("currentPassword")], t("New password cannot be the same as the current password")),
        confirmPassword: yup
            .string()
            .required(t("Confirm password is required"))
            .oneOf([yup.ref("newPassword"), null], t("Passwords must match")),
    });

    const ResetPasswordFormik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: ResetPasswordValidation,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setError("");
            setIsLoading(true);
            try {
                const response = await createPostRequest("/Auth/UpdatePassword", {
                    currrentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                    comfirmPassword: values.confirmPassword,
                });
                if (response.result) {
                    resetForm();
                    dispatch(logout());
                    navigate(response.defaultPage || "/Login", { replace: true });
                } else {
                    setError(response.message || t("Failed to update password"));
                }
            } catch (err) {
                setError(t("An error occurred. Please try again."));
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
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

            {/* ── LEFT PANEL: Hero ── */}
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

                {/* ── Scattered remix icon decorations ── */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <i className="ri-car-fill absolute top-[8%] left-[6%] text-[72px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.07, transform: "rotate(-15deg)" }} />
                    <i className="ri-steering-2-fill absolute top-[18%] left-[18%] text-[44px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.06, transform: "rotate(10deg)" }} />
                    <i className="ri-roadster-fill absolute top-[5%] left-[42%] text-[56px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.055, transform: "rotate(6deg)" }} />
                    <i className="ri-plane-fill absolute top-[12%] left-[62%] text-[48px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.06, transform: "rotate(-8deg)" }} />
                    <i className="ri-gas-station-fill absolute top-[6%] right-[8%] text-[60px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.065, transform: "rotate(12deg)" }} />
                    <i className="ri-map-pin-2-fill absolute top-[38%] left-[4%] text-[52px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.06, transform: "rotate(-20deg)" }} />
                    <i className="ri-tools-fill absolute top-[52%] left-[14%] text-[40px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.055, transform: "rotate(5deg)" }} />
                    <i className="ri-truck-fill absolute top-[44%] left-[44%] text-[66px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.055, transform: "rotate(-6deg)" }} />
                    <i className="ri-route-fill absolute top-[35%] right-[6%] text-[50px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.06, transform: "rotate(14deg)" }} />
                    <i className="ri-signal-wifi-fill absolute top-[56%] right-[14%] text-[38px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.05, transform: "rotate(-10deg)" }} />
                    <i className="ri-taxi-wifi-fill absolute bottom-[22%] left-[8%] text-[58px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.065, transform: "rotate(8deg)" }} />
                    <i className="ri-dashboard-fill absolute bottom-[14%] left-[38%] text-[46px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.055, transform: "rotate(-5deg)" }} />
                    <i className="ri-map-2-fill absolute bottom-[18%] right-[7%] text-[54px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.06, transform: "rotate(16deg)" }} />
                    <i className="ri-compass-3-fill absolute bottom-[32%] right-[22%] text-[38px]" style={{ color: dk ? "#4a7fd4" : "#01235E", opacity: 0.05, transform: "rotate(-12deg)" }} />
                </div>

                <div className="flex flex-col items-center w-full max-w-2xl gap-10 relative z-10">
                    {/* Logo */}
                    <div className="w-56 mb-2">
                        <img
                            alt="EgyptAir Ground Services Logo"
                            className="w-full h-auto object-contain drop-shadow-sm"
                            src={dk ? GroundServiceLogoDark : GroundServiceLogo}
                        />
                    </div>

                    {/* Vehicle Row */}
                    <div className="flex flex-row items-end justify-between w-full gap-6">
                        <div className="flex-1 flex items-end justify-center">
                            <img
                                src={FollowMeImg}
                                alt="Fleet Van 1"
                                className="w-full h-auto object-contain hover:drop-shadow-lg transition-all duration-300 hover:-translate-y-1"
                                style={{ maxHeight: "200px", filter: dk ? "brightness(0.85) contrast(1.1)" : "none" }}
                            />
                        </div>
                        <div className="flex-1 flex items-end justify-center">
                            <img
                                src={SampleCopyImg}
                                alt="Fleet Van 2"
                                className="w-full h-auto object-contain hover:drop-shadow-lg transition-all duration-300 hover:-translate-y-1"
                                style={{ maxHeight: "200px", filter: dk ? "brightness(0.85) contrast(1.1)" : "none" }}
                            />
                        </div>
                        <div className="flex-1 flex items-end justify-center">
                            <img
                                src={FrontPushBackImg}
                                alt="Fleet Van 3"
                                className="w-full h-auto object-contain hover:drop-shadow-lg transition-all duration-300 hover:-translate-y-1"
                                style={{ maxHeight: "200px", filter: dk ? "brightness(0.85) contrast(1.1)" : "none" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL: Reset Password Canvas ── */}
            <div
                className="w-full lg:w-[45%] flex flex-col justify-center items-center px-8 py-12 relative z-10 transition-colors duration-300"
                style={{
                    backgroundColor: dk ? "#1a2440" : "#ffffff",
                    boxShadow: dk
                        ? "-20px 0 40px rgba(0,0,0,0.4)"
                        : "-20px 0 40px rgba(1,35,94,0.05)",
                }}
            >


                <div className="w-full max-w-md flex flex-col justify-center h-full">
                    {/* Mobile Branding (Hidden on Desktop) */}
                    <div className="flex lg:hidden items-center gap-3 mb-8">
                        <img
                            alt="EgyptAir Logo"
                            className="h-8 w-auto"
                            src={dk ? GroundServiceLogoDark : GroundServiceLogo}
                        />
                        <h1
                            className="font-Cairo font-bold text-lg"
                            style={{ color: dk ? "#7eaaee" : "#01235E" }}
                        >
                            {t("Ground Services Portal")}
                        </h1>
                    </div>

                    {/* Header */}
                    <div className="mb-8 mt-6">
                        <h2
                            className="font-Cairo font-bold text-3xl mb-2"
                            style={{ color: dk ? "#e8eef8" : "#1a202c" }}
                        >
                            {t("Reset Password")}
                        </h2>
                        <p
                            className="font-inter text-base"
                            style={{ color: dk ? "#8a9bbf" : "#718096" }}
                        >
                            {t("Update your account password.")}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={ResetPasswordFormik.handleSubmit} className="w-full" noValidate>
                        {/* Error Message */}
                        {error && (
                            <div
                                className="w-full mb-5 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-inter"
                                style={{
                                    backgroundColor: dk ? "#2d1515" : "#fff5f5",
                                    border: dk ? "1px solid #7b3030" : "1px solid #feb2b2",
                                    color: dk ? "#fc8181" : "#c53030",
                                }}
                            >
                                <i className="ri-error-warning-line text-lg" />
                                {error}
                            </div>
                        )}

                        {/* Current Password Field */}
                        <div className="mb-4">
                            <label
                                className="block font-inter font-medium text-sm mb-1.5"
                                style={{ color: dk ? "#a8b8d8" : "#2d3748" }}
                                htmlFor="currentPassword"
                            >
                                {t("Current Password")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                    <i className="ri-lock-line text-lg" style={{ color: dk ? "#4a6a9e" : "#a0aec0" }} />
                                </div>
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={ResetPasswordFormik.handleChange}
                                    onBlur={ResetPasswordFormik.handleBlur}
                                    value={ResetPasswordFormik.values.currentPassword}
                                    className="block w-full ltr:pl-10 rtl:pr-10 ltr:pr-10 rtl:pl-10 py-2.5 rounded-xl font-inter text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900/40"
                                    style={{
                                        border: ResetPasswordFormik.touched.currentPassword && ResetPasswordFormik.errors.currentPassword
                                            ? "1px solid #fc8181"
                                            : dk ? "1px solid #2e3d66" : "1px solid #e2e8f0",
                                        backgroundColor: dk ? "#0f1729" : "#f7fafc",
                                        color: dk ? "#d0daf0" : "#2d3748",
                                    }}
                                />
                                <div
                                    className="absolute inset-y-0 ltr:right-0 rtl:left-0 ltr:pr-3 rtl:pl-3 flex items-center cursor-pointer"
                                    onClick={toggleCurrentPasswordVisibility}
                                >
                                    <i
                                        className={`${showCurrentPassword ? "ri-eye-off-line" : "ri-eye-line"} text-lg transition-colors`}
                                        style={{ color: dk ? "#4a6a9e" : "#a0aec0" }}
                                    />
                                </div>
                            </div>
                            {ResetPasswordFormik.touched.currentPassword && ResetPasswordFormik.errors.currentPassword && (
                                <p className="text-red-400 text-xs font-inter mt-1 ltr:ml-1 rtl:mr-1">
                                    {ResetPasswordFormik.errors.currentPassword}
                                </p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div className="mb-4">
                            <label
                                className="block font-inter font-medium text-sm mb-1.5"
                                style={{ color: dk ? "#a8b8d8" : "#2d3748" }}
                                htmlFor="newPassword"
                            >
                                {t("New Password")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                    <i className="ri-lock-line text-lg" style={{ color: dk ? "#4a6a9e" : "#a0aec0" }} />
                                </div>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={ResetPasswordFormik.handleChange}
                                    onBlur={ResetPasswordFormik.handleBlur}
                                    value={ResetPasswordFormik.values.newPassword}
                                    className="block w-full ltr:pl-10 rtl:pr-10 ltr:pr-10 rtl:pl-10 py-2.5 rounded-xl font-inter text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900/40"
                                    style={{
                                        border: ResetPasswordFormik.touched.newPassword && ResetPasswordFormik.errors.newPassword
                                            ? "1px solid #fc8181"
                                            : dk ? "1px solid #2e3d66" : "1px solid #e2e8f0",
                                        backgroundColor: dk ? "#0f1729" : "#f7fafc",
                                        color: dk ? "#d0daf0" : "#2d3748",
                                    }}
                                />
                                <div
                                    className="absolute inset-y-0 ltr:right-0 rtl:left-0 ltr:pr-3 rtl:pl-3 flex items-center cursor-pointer"
                                    onClick={toggleNewPasswordVisibility}
                                >
                                    <i
                                        className={`${showNewPassword ? "ri-eye-off-line" : "ri-eye-line"} text-lg transition-colors`}
                                        style={{ color: dk ? "#4a6a9e" : "#a0aec0" }}
                                    />
                                </div>
                            </div>
                            {ResetPasswordFormik.touched.newPassword && ResetPasswordFormik.errors.newPassword && (
                                <p className="text-red-400 text-xs font-inter mt-1 ltr:ml-1 rtl:mr-1">
                                    {ResetPasswordFormik.errors.newPassword}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-6">
                            <label
                                className="block font-inter font-medium text-sm mb-1.5"
                                style={{ color: dk ? "#a8b8d8" : "#2d3748" }}
                                htmlFor="confirmPassword"
                            >
                                {t("Confirm Password")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3 flex items-center pointer-events-none">
                                    <i className="ri-lock-line text-lg" style={{ color: dk ? "#4a6a9e" : "#a0aec0" }} />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={ResetPasswordFormik.handleChange}
                                    onBlur={ResetPasswordFormik.handleBlur}
                                    value={ResetPasswordFormik.values.confirmPassword}
                                    className="block w-full ltr:pl-10 rtl:pr-10 ltr:pr-10 rtl:pl-10 py-2.5 rounded-xl font-inter text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900/40"
                                    style={{
                                        border: ResetPasswordFormik.touched.confirmPassword && ResetPasswordFormik.errors.confirmPassword
                                            ? "1px solid #fc8181"
                                            : dk ? "1px solid #2e3d66" : "1px solid #e2e8f0",
                                        backgroundColor: dk ? "#0f1729" : "#f7fafc",
                                        color: dk ? "#d0daf0" : "#2d3748",
                                    }}
                                />
                                <div
                                    className="absolute inset-y-0 ltr:right-0 rtl:left-0 ltr:pr-3 rtl:pl-3 flex items-center cursor-pointer"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    <i
                                        className={`${showConfirmPassword ? "ri-eye-off-line" : "ri-eye-line"} text-lg transition-colors`}
                                        style={{ color: dk ? "#4a6a9e" : "#a0aec0" }}
                                    />
                                </div>
                            </div>
                            {ResetPasswordFormik.touched.confirmPassword && ResetPasswordFormik.errors.confirmPassword && (
                                <p className="text-red-400 text-xs font-inter mt-1 ltr:ml-1 rtl:mr-1">
                                    {ResetPasswordFormik.errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || ResetPasswordFormik.isSubmitting}
                            className={`
                                w-full flex justify-center
                                py-3 px-4
                                rounded-xl
                                font-Cairo font-bold text-base
                                text-white
                                shadow-md
                                transition-all duration-200
                                active:opacity-90
                                ${(isLoading || ResetPasswordFormik.isSubmitting) ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:shadow-lg"}
                            `}
                            style={{
                                backgroundColor: dk ? "#1e4fa0" : "#01235E",
                                boxShadow: dk ? "0 4px 20px rgba(30,79,160,0.4)" : undefined,
                            }}
                        >
                            {isLoading ? t("Updating...") : t("Update")}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="absolute bottom-6 w-full flex justify-center gap-6">
                    <span
                        className="font-inter text-xs"
                        style={{ color: dk ? "#3d5480" : "#a0aec0" }}
                    >
                        &copy; {new Date().getFullYear()} {t("EgyptAir Ground Services. All rights reserved.")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
