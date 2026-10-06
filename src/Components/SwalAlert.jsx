import React, { useEffect } from 'react';

/**
 * CustomSwal
 * A premium-styled alert/confirmation modal that replaces the plain sweetalert.
 * Uses the design system colors (primary, danger, success, warning) from tailwind.config.
 *
 * Props:
 *   isOpen          {bool}   – controls visibility
 *   type            {string} – 'success' | 'error' | 'warning' | 'info'
 *   title           {string} – heading text
 *   message         {string} – body text
 *   confirmText     {string} – confirm button label
 *   showCancelButton {bool}  – show the cancel button
 *   cancelText      {string} – cancel button label
 *   onConfirm       {func}   – called when confirm is clicked
 *   onCancel        {func}   – called when cancel is clicked
 *   onClose         {func}   – called to close the modal
 */

const iconMap = {
  success: {
    icon: 'ri-checkbox-circle-line',
    bgColor: 'bg-green-50 dark:bg-green-950/50',
    iconColor: 'text-success',
    ringColor: 'ring-green-100 dark:ring-green-900/40',
    btnColor: 'bg-success hover:bg-green-600',
  },
  error: {
    icon: 'ri-error-warning-line',
    bgColor: 'bg-red-50 dark:bg-red-950/50',
    iconColor: 'text-danger',
    ringColor: 'ring-red-100 dark:ring-red-900/40',
    btnColor: 'bg-danger hover:bg-red-600',
  },
  warning: {
    icon: 'ri-alert-line',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-warning',
    ringColor: 'ring-amber-100 dark:ring-amber-900/40',
    btnColor: 'bg-warning hover:bg-amber-600',
  },
  info: {
    icon: 'ri-information-line',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-info',
    ringColor: 'ring-blue-100 dark:ring-blue-900/40',
    btnColor: 'bg-info hover:bg-blue-600',
  },
};

export default function CustomSwal({
  isOpen,
  type = 'success',
  title,
  message,
  confirmText = 'OK',
  showCancelButton = false,
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
}) {
  const config = iconMap[type] || iconMap.info;

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div
        className="
          relative bg-white dark:bg-[#1e1e1e] border border-transparent dark:border-gray-800 rounded-2xl shadow-2xl
          w-full max-w-sm
          transform transition-all duration-300
          animate-[fadeInScale_0.25s_ease-out]
          overflow-hidden
        "
      >
        {/* Icon area */}
        <div className="flex justify-center pt-8 pb-2">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${config.bgColor} ring-4 ${config.ringColor}
          `}>
            <i className={`${config.icon} text-3xl ${config.iconColor}`} />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-3 pb-2 text-center">
          {title && (
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-Cairo mb-1">
              {title}
            </h3>
          )}
          {message && (
            <p className="text-sm text-gray-500 dark:text-gray-300 font-Cairo leading-relaxed">
              {message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className={`flex gap-3 px-6 pt-4 pb-6 ${showCancelButton ? 'justify-center' : 'justify-center'}`}>
          {showCancelButton && (
            <button
              type="button"
              onClick={handleCancel}
              className="
                px-5 py-2.5 text-sm font-semibold font-Cairo
                text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-600 rounded-lg
                hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500
                transition-all duration-200
                shadow-sm
              "
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className={`
              px-5 py-2.5 text-sm font-semibold font-Cairo
              text-white rounded-lg
              ${config.btnColor}
              transition-all duration-200
              shadow-sm hover:shadow-md
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* Inline keyframe for entry animation */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
