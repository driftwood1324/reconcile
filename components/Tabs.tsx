"use client";

export interface TabDef<T extends string> {
  id: T;
  label: string;
}

/** Underlined segmented tabs (Examination: Quick / Traditional / Married Man). */
export default function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef<T>[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex border-b border-border" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className="relative flex-1 pb-3 pt-1 text-[0.9rem] font-medium transition-colors"
            style={{ color: isActive ? "var(--gold)" : "var(--text-dim)" }}
          >
            {tab.label}
            <span
              className="absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "var(--gold)",
                transform: isActive ? "scaleX(1)" : "scaleX(0)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
