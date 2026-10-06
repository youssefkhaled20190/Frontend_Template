/**
 * FormRow
 * A reusable field wrapper used inside modal forms.
 * Renders: label → children (input / dropdown) → error message
 *
 * Props:
 *   label    {string}  – field label text
 *   required {bool}    – show red asterisk next to label
 *   colSpan  {1|2}     – grid column span (1 = normal, 2 = full-width in 2-col grid)
 *   error    {string|false} – error message; renders a red <p> when truthy
 *   children {node}    – the actual input / dropdown element
 */
export default function FormRow({ label, children, colSpan = 1, error, required }) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${colSpan === 2 ? 'col-span-1 md:col-span-2' : 'col-span-1'
        }`}
    >
      {label && (
        <label className="text-label-caps font-label-caps font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-200 font-Cairo">
          {label}
          {required && <span className="text-danger ltr:ml-1 rtl:mr-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-danger text-xs mt-0.5 font-Cairo">
          <i className="ri-error-warning-line text-sm" />
          {error}
        </p>
      )}
    </div>
  );
}
