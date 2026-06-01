"use client";

import { useSettings } from "@/lib/useSettings";
import { useConfessions } from "@/lib/useConfessions";
import { clearAll } from "@/lib/storage";
import ConfirmAction from "@/components/ConfirmAction";
import type { ReminderInterval } from "@/lib/types";

const INTERVALS: { value: ReminderInterval; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
];

export default function SettingsPage() {
  const { settings, update } = useSettings();
  const { count } = useConfessions();

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
                onClick={() => update({ reminderInterval: opt.value })}
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
          <div className="fade-in mt-3 flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
            <span className="text-[0.92rem] text-text-soft">Every</span>
            <input
              type="number"
              min={1}
              max={365}
              value={settings.customDays ?? 14}
              onChange={(e) =>
                update({
                  customDays: Math.max(1, Math.min(365, Number(e.target.value) || 1)),
                })
              }
              className="w-20 rounded-xl border border-border bg-[var(--bg)] px-3 py-2 text-center text-[0.95rem] text-text focus:border-gold-muted focus:outline-none"
            />
            <span className="text-[0.92rem] text-text-soft">days</span>
          </div>
        )}

        <p className="mt-3 text-[0.82rem] leading-relaxed text-text-dim">
          Push notifications aren’t implemented yet — this interval is saved for
          when reminders arrive in a later version.
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
          history lives only in this app’s local storage.
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
