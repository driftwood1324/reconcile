/**
 * Human-friendly elapsed-time helpers for the Home display.
 * The headline favours a single, calm unit ("3 weeks") over precise duration.
 */

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export interface Elapsed {
  /** Large value for the gold serif headline, e.g. "3". */
  value: string;
  /** Unit beneath the headline, e.g. "weeks". null for "Today". */
  unit: string | null;
  /** Whole number of days elapsed (for reminder comparisons). */
  days: number;
}

export function elapsedSince(iso: string, now: number = Date.now()): Elapsed {
  const then = new Date(iso).getTime();
  const ms = Math.max(0, now - then);
  const days = Math.floor(ms / DAY);

  if (ms < DAY && new Date(then).toDateString() === new Date(now).toDateString()) {
    return { value: "Today", unit: null, days };
  }
  if (days < 1) return { value: "Today", unit: null, days };
  if (days === 1) return { value: "Yesterday", unit: null, days };
  if (days < 7) return { value: String(days), unit: "days", days };

  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return { value: String(weeks), unit: weeks === 1 ? "week" : "weeks", days };
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return { value: String(months), unit: months === 1 ? "month" : "months", days };
  }
  const years = Math.floor(days / 365);
  return { value: String(years), unit: years === 1 ? "year" : "years", days };
}

/** "March 14, 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Short relative tag for log rows, e.g. "2 weeks ago" / "Today". */
export function relativeLabel(iso: string, now: number = Date.now()): string {
  const e = elapsedSince(iso, now);
  if (e.unit === null) return e.value; // Today / Yesterday
  return `${e.value} ${e.unit} ago`;
}
