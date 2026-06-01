"use client";

import type { Confession } from "@/lib/types";
import { formatDate, relativeLabel } from "@/lib/time";

/** Recent-confessions list: date, relative tag, and a note preview. */
export default function ConfessionLog({ items }: { items: Confession[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
        History
      </h2>
      <ul className="flex flex-col gap-2.5">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-2xl border border-border bg-surface px-5 py-4"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-serif text-[1.02rem] text-text">
                {formatDate(c.date)}
              </span>
              <span className="shrink-0 text-[0.78rem] text-text-dim">
                {relativeLabel(c.date)}
              </span>
            </div>
            {c.note && (
              <p className="mt-1.5 line-clamp-2 text-[0.88rem] leading-relaxed text-text-soft">
                {c.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
