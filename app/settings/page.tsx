"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "@/lib/useSettings";
import { useConfessions } from "@/lib/useConfessions";
import { clearAll } from "@/lib/storage";
import {
  reminderPermission,
  requestReminderPermission,
  syncReminder,
  type PermState,
} from "@/lib/reminders";
import ConfirmAction from "@/components/ConfirmAction";
import PillToggle from "@/components/PillToggle";
import type { CustomUnit, ReminderInterval } from "@/lib/types";

const INTERVALS: { value: ReminderInterval; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
];

// Sensible ceilings per unit so the custom cadence stays within a year.
const MAX_BY_UNIT: Record<CustomUnit, number> = { days: 365, weeks: 52, months: 12 };

export default function SettingsPage() {
  const { settings, update } = useSettings();
  const { count } = useConfessions();

  const [perm, setPerm] = useState<PermState>("prompt");
  const [busy, setBusy] = useState(false);

  // Load the current permission state and self-heal the schedule on mount.
  useEffect(() => {
    reminderPermission().then(setPerm);
    void syncReminder();
  }, []);

  const remindersOn = settings.remindersEnabled;
  const customCount = settings.customCount ?? 2;
  const customUnit = settings.customUnit ?? "weeks";

  // Changing the cadence reschedules the existing reminder in place.
  const setInterval = (patch: Partial<typeof settings>) => {
    update(patch);
    if (remindersOn) void syncReminder();
  };

  const toggleReminders = async () => {
    if (busy) return;
    if (remindersOn) {
      update({ remindersEnabled: false });
      await syncReminder();
      return;
    }
    setBusy(true);
    const result = await requestReminderPermission();
    setPerm(result);
    if (result === "granted") {
      update({ remindersEnabled: true });
      await syncReminder();
    }
    setBusy(false);
  };

  const reminderHint = !remindersOn
    ? perm === "denied"
      ? "Notifications are turned off for Reconcile. Enable them in your device Settings, then turn this on."
      : "Get a gentle, private nudge when it's time to return. Nothing is sent anywhere — the reminder is scheduled on this device."
    : perm === "unsupported"
      ? "Reminders are scheduled. They fire reliably in the installed app; in a browser tab they only fire while it's open."
      : "On. You'll be nudged around your next confession, based on the cadence above.";

  return (
    <div className="fade-in">
      <h1 className="font-serif text-3xl text-text">Settings</h1>

      {/* Reminder interval */}
      <section className="mt-8">
        <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
          Reminder interval
        </h2>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-text-soft">
          How often you aim to return to confession.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {INTERVALS.map((opt) => {
            const active = settings.reminderInterval === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setInterval({ reminderInterval: opt.value })}
                className="rounded-2xl border px-4 py-3.5 text-[0.92rem] font-medium transition-all"
                style={{
                  borderColor: active ? "var(--gold-muted)" : "var(--border)",
                  backgroundColor: active ? "var(--gold-soft)" : "var(--surface)",
                  color: active ? "var(--gold)" : "var(--text-soft)",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {settings.reminderInterval === "custom" && (
          <div className="fade-in mt-3 rounded-2xl border border-border bg-surface px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-[0.92rem] text-text-soft">Every</span>
              <input
                type="number"
                min={1}
                max={MAX_BY_UNIT[customUnit]}
                value={customCount}
                onChange={(e) =>
                  setInterval({
                    customCount: Math.max(
                      1,
                      Math.min(MAX_BY_UNIT[customUnit], Number(e.target.value) || 1),
                    ),
                  })
                }
                className="w-20 rounded-xl border border-border bg-[var(--bg)] px-3 py-2 text-center text-[0.95rem] text-text focus:border-gold-muted focus:outline-none"
              />
            </div>
            <div className="mt-3">
              <PillToggle<CustomUnit>
                ariaLabel="Custom reminder unit"
                value={customUnit}
                onChange={(unit) =>
                  // Switching units keeps the number but clamps it to the new
                  // unit's sensible ceiling (e.g. 60 days → 12 months).
                  setInterval({
                    customUnit: unit,
                    customCount: Math.min(customCount, MAX_BY_UNIT[unit]),
                  })
                }
                options={[
                  { value: "days", label: "Days" },
                  { value: "weeks", label: "Weeks" },
                  { value: "months", label: "Months" },
                ]}
              />
            </div>
          </div>
        )}

        {/* Reminder toggle */}
        <div className="mt-5 flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
          <span className="text-[0.92rem] text-text-soft">Remind me</span>
          <button
            type="button"
            role="switch"
            aria-checked={remindersOn}
            aria-label="Enable reminders"
            disabled={busy}
            onClick={toggleReminders}
            className="relative h-7 w-12 rounded-full transition-colors disabled:opacity-60"
            style={{ backgroundColor: remindersOn ? "var(--gold)" : "var(--border)" }}
          >
            <span
              className="absolute top-1 h-5 w-5 rounded-full bg-[var(--bg)] transition-all"
              style={{ left: remindersOn ? "1.5rem" : "0.25rem" }}
            />
          </button>
        </div>

        <p className="mt-3 text-[0.82rem] leading-relaxed text-text-dim">
          {reminderHint}
        </p>
      </section>

      {/* Data */}
      <section className="mt-10">
        <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
          Data
        </h2>
        <div className="mt-4 rounded-2xl border border-border bg-surface px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.92rem] text-text-soft">Confessions recorded</span>
            <span className="font-serif text-xl text-gold">{count}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-[0.92rem] text-text-soft">Storage</span>
            <span className="text-[0.85rem] text-text-dim">Local only — this device</span>
          </div>
        </div>
        <p className="mt-3 text-[0.82rem] leading-relaxed text-text-dim">
          Nothing leaves your phone. Reconcile has no account and no server — your
          history lives only in this app’s local storage.{" "}
          <Link href="/privacy" className="text-gold underline-offset-2 hover:underline">
            Privacy policy
          </Link>
        </p>

        <div className="mt-5">
          <ConfirmAction
            idleLabel="Clear all data"
            confirmLabel="Tap again to erase everything"
            variant="danger"
            onConfirm={clearAll}
          />
        </div>
      </section>
    </div>
  );
}
