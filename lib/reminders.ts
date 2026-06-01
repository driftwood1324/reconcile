/**
 * Local-notification reminders. The whole feature is best-effort and offline:
 * a single scheduled notification nudges the user toward their next confession.
 *
 * On iOS (Capacitor) this uses real OS-scheduled local notifications. On the
 * web the plugin falls back to the Notifications API, which can only fire while
 * a tab is open — so the web build degrades gracefully rather than promising
 * something it cannot keep. Every call is guarded; failures are non-fatal.
 */
import { getConfessions, getSettings } from "./storage";
import type { CustomUnit, Settings } from "./types";

// One reminder at a time — reschedule overwrites this fixed id.
const REMINDER_ID = 1;

export type PermState = "granted" | "denied" | "prompt" | "unsupported";

const UNIT_DAYS: Record<CustomUnit, number> = { days: 1, weeks: 7, months: 30 };

function intervalDays(s: Settings): number {
  switch (s.reminderInterval) {
    case "weekly":
      return 7;
    case "biweekly":
      return 14;
    case "monthly":
      return 30;
    case "custom": {
      const count = Math.max(1, s.customCount ?? 2);
      const unit = UNIT_DAYS[s.customUnit ?? "weeks"];
      return Math.max(1, Math.min(365, count * unit));
    }
  }
}

// Next reminder = last confession + interval, fired at 9am local. If that moment
// has already passed (no confession yet, or already overdue) fall back to 9am
// tomorrow so the user still gets a gentle nudge rather than nothing.
function nextReminderAt(lastIso: string | null, days: number): Date {
  const target = new Date(lastIso ? lastIso : Date.now());
  target.setDate(target.getDate() + days);
  target.setHours(9, 0, 0, 0);
  if (target.getTime() <= Date.now()) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow;
  }
  return target;
}

// Lazily load the plugin so nothing touches browser/native APIs during static
// prerender, and so a missing web implementation just yields `null`.
async function plugin() {
  if (typeof window === "undefined") return null;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    return LocalNotifications;
  } catch {
    return null;
  }
}

export async function reminderPermission(): Promise<PermState> {
  const ln = await plugin();
  if (!ln) return "unsupported";
  try {
    return (await ln.checkPermissions()).display as PermState;
  } catch {
    return "unsupported";
  }
}

export async function requestReminderPermission(): Promise<PermState> {
  const ln = await plugin();
  if (!ln) return "unsupported";
  try {
    return (await ln.requestPermissions()).display as PermState;
  } catch {
    return "unsupported";
  }
}

export async function cancelReminder(): Promise<void> {
  const ln = await plugin();
  if (!ln) return;
  try {
    await ln.cancel({ notifications: [{ id: REMINDER_ID }] });
  } catch {
    /* nothing scheduled — fine */
  }
}

/**
 * Reconcile the single scheduled reminder with current settings + history.
 * Safe to call after any relevant change (toggle, interval edit, a new
 * confession): it cancels then reschedules, or just cancels when reminders are
 * off or permission is missing.
 */
export async function syncReminder(): Promise<void> {
  const ln = await plugin();
  if (!ln) return;

  await cancelReminder();

  const settings = getSettings();
  if (!settings.remindersEnabled) return;

  let granted = false;
  try {
    granted = (await ln.checkPermissions()).display === "granted";
  } catch {
    granted = false;
  }
  if (!granted) return;

  const lastIso = getConfessions()[0]?.date ?? null;
  const at = nextReminderAt(lastIso, intervalDays(settings));
  try {
    await ln.schedule({
      notifications: [
        {
          id: REMINDER_ID,
          title: "Time to reconcile",
          body: "It has been a while since your last confession. Consider returning soon.",
          schedule: { at, allowWhileIdle: true },
        },
      ],
    });
  } catch {
    /* scheduling unavailable (e.g. web tab closed) — non-fatal */
  }
}
