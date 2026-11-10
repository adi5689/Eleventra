import { ChevronDown } from "lucide-react";

const controlClass =
  "w-full min-w-0 h-11 rounded-xl border border-input-border bg-mist/35 px-3.5 font-display text-base leading-normal text-ink placeholder:text-ink-soft/65 transition-[border-color,background-color,box-shadow] duration-150 hover:border-navy/45 focus:border-navy focus:bg-paper focus:outline-none focus:ring-3 focus:ring-gold/25 disabled:opacity-60";

export default function FormField({ id, label, children, ...props }) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <label
        htmlFor={id}
        className="font-display text-[13px] leading-5 font-semibold text-ink-soft"
      >
        {label}
      </label>
      {children ? (
        <div className="relative">
          <select
            id={id}
            className={`${controlClass} appearance-none pr-9`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
          />
        </div>
      ) : (
        <input id={id} className={controlClass} {...props} />
      )}
    </div>
  );
}
