/**
 * SectionDivider
 * A decorative section header used inside modal forms to group related fields.
 *
 * Props:
 *   label {string} – section title displayed on the left
 *   icon  {string} – optional remix icon class (e.g. 'ri-settings-3-line')
 *
 * Note: spans full width (col-span-2) when placed inside a 2-column grid form.
 */
export default function SectionDivider({ label, icon }) {
  return (
    <div className="col-span-1 md:col-span-2 flex items-center gap-3 pt-2 pb-1">
      {icon && (
        <i className={`${icon} text-primary-500 text-base`} />
      )}
      <span className="text-label-caps font-label-caps font-bold uppercase tracking-widest text-primary-500 whitespace-nowrap font-Cairo">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-primary-200 via-primary-100 to-transparent" />
    </div>
  );
}
