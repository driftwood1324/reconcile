"use client";

export interface PillOption<T extends string> {
  value: T;
  label: string;
}

/** Segmented "pill" switch with a sliding gold-bordered active state. */
export default function PillToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex gap-1 rounded-full border border-border bg-surface p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className="flex-1 rounded-full px-3 py-2 text-[0.85rem] font-medium transition-all duration-200"
            style={{
              backgroundColor: active ? "var(--gold-soft)" : "transparent",
              color: active ? "var(--gold)" : "var(--text-dim)",
              boxShadow: active ? "inset 0 0 0 1px var(--gold-muted)" : "none",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
