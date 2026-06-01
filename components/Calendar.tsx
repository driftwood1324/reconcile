"use client";

import { useState } from "react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Month-grid date picker. Future days are disabled — you can't record a
 * confession that hasn't happened. `maxDate` defaults to today.
 */
export default function Calendar({
  selected,
  onSelect,
  maxDate,
}: {
  selected: Date | null;
  onSelect: (date: Date) => void;
  maxDate?: Date;
}) {
  const today = new Date();
  const ceiling = maxDate ?? today;

  const initial = selected ?? today;
  const [view, setView] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  });

  const firstOfMonth = new Date(view.year, view.month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  // Disable navigating to months entirely beyond the ceiling month.
  const atCeilingMonth =
    view.year === ceiling.getFullYear() && view.month === ceiling.getMonth();

  const cells: (number | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const isFuture = (day: number) => {
    const d = new Date(view.year, view.month, day);
    // Compare by day, allowing today itself.
    const ceil = new Date(
      ceiling.getFullYear(),
      ceiling.getMonth(),
      ceiling.getDate(),
    );
    return d.getTime() > ceil.getTime();
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="rounded-lg p-2 text-text-soft transition-colors hover:text-gold"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className="font-serif text-[1.05rem] text-text">
          {MONTHS[view.month]} {view.year}
        </span>
        <button
          type="button"
          onClick={() => !atCeilingMonth && shiftMonth(1)}
          disabled={atCeilingMonth}
          aria-label="Next month"
          className="rounded-lg p-2 transition-colors disabled:opacity-25"
          style={{ color: atCeilingMonth ? "var(--text-dim)" : "var(--text-soft)" }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="py-1 text-center text-[0.7rem] font-medium text-text-dim">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const date = new Date(view.year, view.month, day);
          const disabled = isFuture(day);
          const isToday = sameDay(date, today);
          const isSelected = selected != null && sameDay(date, selected);

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={date.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              onClick={() => onSelect(date)}
              className="relative flex aspect-square items-center justify-center rounded-full text-[0.9rem] transition-all disabled:cursor-not-allowed"
              style={{
                backgroundColor: isSelected ? "var(--gold)" : "transparent",
                color: isSelected
                  ? "#1a1305"
                  : disabled
                    ? "color-mix(in srgb, var(--text-dim) 45%, transparent)"
                    : "var(--text-soft)",
                boxShadow:
                  isToday && !isSelected ? "inset 0 0 0 1px var(--gold-muted)" : "none",
                fontWeight: isSelected || isToday ? 600 : 400,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
