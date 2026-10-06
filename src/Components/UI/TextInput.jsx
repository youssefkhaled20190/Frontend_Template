/**
 * TextInput
 * A styled <input> used inside modal forms.
 *
 * Props:
 *   disabled {bool}          – renders a read-only greyed-out style
 *   error    {string|false}  – when truthy, renders a red border
 *   ...rest                  – forwarded directly to <input>
 */
export default function TextInput({ disabled, error, ...props }) {
  return (
    <input
      {...props}
      disabled={disabled}
      className={`
        w-full px-3.5 py-2.5 text-sm font-Cairo rounded-lg border
        transition-all duration-200 outline-none dark:[color-scheme:dark]
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        ${disabled
          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed'
          : error
            ? 'bg-white dark:bg-[#1e1e1e] border-danger text-gray-800 dark:text-white focus:border-danger focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30'
            : 'bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:shadow-sm'
        }`}
    />
  );
}
