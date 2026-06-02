"use client";

import { useState } from "react";
import type { Confession } from "@/lib/types";
import { formatDate, relativeLabel } from "@/lib/time";

/** Recent-confessions list: date, relative tag, a note preview, and delete. */
export default function ConfessionLog({
  items,
  onDelete,
  onPenanceToggle,
}: {
  items: Confession[];
  onDelete?: (id: string) => void;
  onPenanceToggle?: (id: string, done: boolean) => void;
}) {
  const [armed, setArmed] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
        History
      </h2>
      <ul className="flex flex-col gap-2.5">
        {items.map((c) => {
          const isArmed = armed === c.id;
          return (
            <li
              key={c.id}
              className="rounded-2xl border border-border bg-surface px-5 py-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-[1.02rem] text-text">
                  {formatDate(c.date)}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[0.78rem] text-text-dim">
                    {relativeLabel(c.date)}
                  </span>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => setArmed(isArmed ? null : c.id)}
                      aria-label={isArmed ? "Cancel delete" : "Delete this record"}
                      className="-mr-1.5 rounded-lg p-1.5 text-text-dim transition-colors hover:text-[#d98a8a]"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                        <path d="M19 6v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              {c.note && (
                <p className="mt-1.5 line-clamp-2 text-[0.88rem] leading-relaxed text-text-soft">
                  {c.note}
                </p>
              )}
              {c.penance && (
                <button
                  type="button"
                  onClick={() => onPenanceToggle?.(c.id, !c.penanceDone)}
                  disabled={!onPenanceToggle}
                  aria-pressed={!!c.penanceDone}
                  className="mt-2 flex w-full items-start gap-2.5 text-left"
                >
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px]"
                    style={{
                      backgroundColor: c.penanceDone ? "var(--gold)" : "transparent",
                      boxShadow: `inset 0 0 0 1.5px ${c.penanceDone ? "var(--gold)" : "var(--border-strong)"}`,
                    }}
                  >
                    {c.penanceDone && (
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#1a1305" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  <span
                    className="text-[0.84rem] leading-relaxed"
                    style={{
                      color: c.penanceDone ? "var(--text-dim)" : "var(--text-soft)",
                      textDecoration: c.penanceDone ? "line-through" : "none",
                    }}
                  >
                    Penance: {c.penance}
                  </span>
                </button>
              )}
              {isArmed && onDelete && (
                <div className="fade-in mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="text-[0.82rem] text-text-dim">
                    Remove this record?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setArmed(null)}
                      className="rounded-lg px-3 py-1.5 text-[0.82rem] text-text-soft"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(c.id);
                        setArmed(null);
                      }}
                      className="rounded-lg px-3 py-1.5 text-[0.82rem] font-medium"
                      style={{ backgroundColor: "#5b1a1a", color: "#ffd9d9" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
