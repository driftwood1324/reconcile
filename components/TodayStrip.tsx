"use client";

import { useEffect, useState } from "react";
import { getLiturgicalDay, colorHex, type LiturgicalDay } from "@/lib/liturgy";

/**
 * A quiet liturgical "today" line for the Home screen: the season (with its
 * color), the day's feast or saint, and any penitential note (fasting /
 * abstinence). Computed entirely on-device. Rendered after mount so the date is
 * the user's local "today" rather than the build's.
 */
export default function TodayStrip() {
  const [day, setDay] = useState<LiturgicalDay | null>(null);

  useEffect(() => {
    const compute = () => setDay(getLiturgicalDay());
    compute();
  }, []);

  if (!day) return null;

  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface px-5 py-4">
      <div className="flex items-center gap-2.5">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: colorHex(day.color), boxShadow: `0 0 8px ${colorHex(day.color)}66` }}
          aria-hidden
        />
        <span className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
          {day.seasonLabel}
        </span>
      </div>

      <p className="mt-2 font-serif text-[1.15rem] leading-snug text-text">
        {day.celebration ?? day.date.toLocaleDateString(undefined, { weekday: "long" })}
      </p>

      {day.fastNote && (
        <p className="mt-1.5 text-[0.84rem] leading-relaxed text-gold-muted">
          {day.fastNote}
        </p>
      )}
    </section>
  );
}
