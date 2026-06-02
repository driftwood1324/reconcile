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
  syncExamenReminder,
  type PermState,
} from "@/lib/reminders";
import ConfirmAction from "@/components/ConfirmAction";
import PillToggle from "@/components/PillToggle";
import PinPad from "@/components/PinPad";
import Cross from "@/components/Cross";
import BackupPanel from "@/components/BackupPanel";
import {
  disableLock,
  isLockEnabled,
  lockNow,
  setPin,
  subscribeLock,
  verifyPin,
} from "@/lib/lock";
import type { CustomUnit, ReminderInterval } from "@/lib/types";

type PinFlow = "set" | "confirm" | "disable";

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
  const changeCadence = (patch: Partial<typeof settings>) => {
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

  // ── Nightly examen reminder ─────────────────────────────────────────────────
  const examenOn = settings.examenReminderEnabled;

  const changeExamenHour = (hour: number) => {
    update({ examenHour: hour });
    if (examenOn) void syncExamenReminder();
  };

  const toggleExamen = async () => {
    if (busy) return;
    if (examenOn) {
      update({ examenReminderEnabled: false });
      await syncExamenReminder();
      return;
    }
    setBusy(true);
    const result = await requestReminderPermission();
    setPerm(result);
    if (result === "granted") {
      update({ examenReminderEnabled: true });
      await syncExamenReminder();
    }
    setBusy(false);
  };

  const formatHour = (h: number) => {
    const period = h < 12 ? "AM" : "PM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:00 ${period}`;
  };

  // ── Privacy lock ────────────────────────────────────────────────────────────
  const [lockOn, setLockOn] = useState(false);
  const [flow, setFlow] = useState<PinFlow | null>(null);
  const [firstPin, setFirstPin] = useState("");
  const [pinError, setPinError] = useState(0);

  useEffect(() => {
    const sync = () => setLockOn(isLockEnabled());
    sync();
    return subscribeLock(sync);
  }, []);

  const cancelFlow = () => {
    setFlow(null);
    setFirstPin("");
    setPinError(0);
  };

  const toggleLock = () => {
    setPinError(0);
    setFirstPin("");
    setFlow(lockOn ? "disable" : "set");
  };

  const onPinComplete = async (pin: string) => {
    if (flow === "set") {
      setFirstPin(pin);
      setPinError(0);
      setFlow("confirm");
    } else if (flow === "confirm") {
      if (pin === firstPin) {
        await setPin(pin);
        cancelFlow();
      } else {
        setPinError((n) => n + 1);
        setFirstPin("");
        setFlow("set");
      }
    } else if (flow === "disable") {
      if (await verifyPin(pin)) {
        disableLock();
        cancelFlow();
      } else {
        setPinError((n) => n + 1);
      }
    }
  };

  const pinTitle =
    flow === "confirm" ? "Confirm PIN" : flow === "disable" ? "Enter PIN" : "Set a PIN";
  const pinSubtitle =
    flow === "disable"
      ? pinError
        ? "Incorrect PIN — try again"
        : "Enter your PIN to turn off the lock"
      : flow === "confirm"
        ? "Re-enter to confirm"
        : pinError
          ? "PINs didn't match — choose again"
          : "Choose a 4-digit PIN";

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

      {/* Language */}
      <section className="mt-8">
        <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
          Idioma · Language
        </h2>
        <div className="mt-4">
          <PillToggle
            ariaLabel="Language"
            value={settings.language ?? "en"}
            onChange={(value) => update({ language: value })}
            options={[
              { value: "en", label: "English" },
              { value: "es", label: "Español" },
            ]}
          />
        </div>
      </section>

      {/* Reminder interval */}
      <section className="mt-10">
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
                onClick={() => changeCadence({ reminderInterval: opt.value })}
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
                  changeCadence({
                    customCount: Math.max(
                      1,
                      Math.min(MAX_BY_UNIT[customUnit], Number(e.target.value) || 1),
                    ),
                  })
                }
                className="w-20 rounded-xl border border-border bg-[var(--bg)] px-3 py-2 text-center text-base text-text focus:border-gold-muted focus:outline-none"
              />
            </div>
            <div className="mt-3">
              <PillToggle<CustomUnit>
                ariaLabel="Custom reminder unit"
                value={customUnit}
                onChange={(unit) =>
                  // Switching units keeps the number but clamps it to the new
                  // unit's sensible ceiling (e.g. 60 days → 12 months).
                  changeCadence({
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

      {/* Nightly examen */}
      <section className="mt-10">
        <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
          Daily Examen
        </h2>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
          <span className="text-[0.92rem] text-text-soft">Nightly reminder</span>
          <button
            type="button"
            role="switch"
            aria-checked={examenOn}
            aria-label="Enable the nightly examen reminder"
            disabled={busy}
            onClick={toggleExamen}
            className="relative h-7 w-12 rounded-full transition-colors disabled:opacity-60"
            style={{ backgroundColor: examenOn ? "var(--gold)" : "var(--border)" }}
          >
            <span
              className="absolute top-1 h-5 w-5 rounded-full bg-[var(--bg)] transition-all"
              style={{ left: examenOn ? "1.5rem" : "0.25rem" }}
            />
          </button>
        </div>

        {examenOn && (
          <div className="fade-in mt-3 flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
            <span className="text-[0.92rem] text-text-soft">Remind me at</span>
            <select
              value={settings.examenHour ?? 21}
              onChange={(e) => changeExamenHour(Number(e.target.value))}
              aria-label="Examen reminder time"
              className="rounded-xl border border-border bg-[var(--bg)] px-3 py-2 text-base text-text focus:border-gold-muted focus:outline-none"
            >
              {[18, 19, 20, 21, 22, 23].map((h) => (
                <option key={h} value={h}>
                  {formatHour(h)}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="mt-3 text-[0.82rem] leading-relaxed text-text-dim">
          A short, prayerful review of the day. Open it any time from Resources.
        </p>
      </section>

      {/* Display */}
      <section className="mt-10">
        <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
          Text size
        </h2>
        <div className="mt-4">
          <PillToggle
            ariaLabel="Text size"
            value={settings.textSize ?? "normal"}
            onChange={(value) => update({ textSize: value })}
            options={[
              { value: "normal", label: "Normal" },
              { value: "large", label: "Large" },
            ]}
          />
        </div>
      </section>

      {/* Privacy lock */}
      <section className="mt-10">
        <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
          Privacy lock
        </h2>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
          <span className="text-[0.92rem] text-text-soft">Require a PIN</span>
          <button
            type="button"
            role="switch"
            aria-checked={lockOn}
            aria-label="Require a PIN to open the app"
            onClick={toggleLock}
            className="relative h-7 w-12 rounded-full transition-colors"
            style={{ backgroundColor: lockOn ? "var(--gold)" : "var(--border)" }}
          >
            <span
              className="absolute top-1 h-5 w-5 rounded-full bg-[var(--bg)] transition-all"
              style={{ left: lockOn ? "1.5rem" : "0.25rem" }}
            />
          </button>
        </div>
        <p className="mt-3 text-[0.82rem] leading-relaxed text-text-dim">
          {lockOn
            ? "A 4-digit PIN is asked for each time you open Reconcile."
            : "Ask for a 4-digit PIN when Reconcile opens — so your history stays private if someone else picks up your phone."}
        </p>
        {lockOn && (
          <button
            type="button"
            onClick={lockNow}
            className="mt-3 text-[0.85rem] text-text-soft underline-offset-2 transition-colors hover:text-gold"
          >
            Lock now
          </button>
        )}
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

        <h3 className="mt-6 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-text-dim">
          Back up &amp; restore
        </h3>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-text-dim">
          Save your data to a file you control, or move it to a new device. No
          server is involved — encrypt it with a passphrase to keep it private.
        </p>
        <BackupPanel />

        <div className="mt-6">
          <ConfirmAction
            idleLabel="Clear all data"
            confirmLabel="Tap again to erase everything"
            variant="danger"
            onConfirm={clearAll}
          />
        </div>
      </section>

      {/* PIN setup / disable overlay */}
      {flow && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] px-6">
          <button
            type="button"
            onClick={cancelFlow}
            className="absolute right-6 top-6 text-[0.9rem] text-text-dim transition-colors hover:text-gold"
          >
            Cancel
          </button>
          <Cross size={36} className="mb-2 text-gold-muted" />
          <PinPad
            key={`${flow}:${pinError}`}
            title={pinTitle}
            subtitle={pinSubtitle}
            error={pinError}
            onComplete={onPinComplete}
          />
        </div>
      )}
    </div>
  );
}
