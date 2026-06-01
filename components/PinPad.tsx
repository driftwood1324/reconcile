"use client";

import { useState } from "react";

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Numeric PIN entry: a row of dots plus an on-screen keypad (so it works
 * without a system keyboard). Calls `onComplete` once `PIN_LENGTH` digits are
 * entered. To flag a wrong entry, the parent remounts this pad with a new
 * `key` and a truthy `error` — that both clears the digits and plays the shake.
 */
export default function PinPad({
  title,
  subtitle,
  error,
  onComplete,
}: {
  title: string;
  subtitle?: string;
  /** Truthy on a remount after a wrong entry — triggers the shake. */
  error?: number;
  onComplete: (pin: string) => void;
}) {
  const [digits, setDigits] = useState("");
  const shake = !!error;

  const press = (d: string) => {
    setDigits((cur) => {
      if (cur.length >= PIN_LENGTH) return cur;
      const next = cur + d;
      if (next.length === PIN_LENGTH) {
        // Defer so the last dot paints before the parent reacts.
        setTimeout(() => onComplete(next), 80);
      }
      return next;
    });
  };

  const del = () => setDigits((d) => d.slice(0, -1));

  return (
    <div className="flex w-full max-w-[19rem] flex-col items-center">
      <p className="font-serif text-xl text-text">{title}</p>
      {subtitle && (
        <p className="mt-1.5 text-center text-[0.85rem] text-text-dim">{subtitle}</p>
      )}

      <div
        className="mt-7 flex gap-4"
        style={shake ? { animation: "pin-shake 0.4s" } : undefined}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = i < digits.length;
          return (
            <span
              key={i}
              className="h-3.5 w-3.5 rounded-full transition-colors"
              style={{
                backgroundColor: filled ? "var(--gold)" : "transparent",
                boxShadow: `inset 0 0 0 1.5px ${filled ? "var(--gold)" : "var(--border)"}`,
              }}
            />
          );
        })}
      </div>

      <div className="mt-9 grid grid-cols-3 gap-4">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => press(k)}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-border text-[1.4rem] font-light text-text transition-colors active:bg-[var(--gold-soft)]"
          >
            {k}
          </button>
        ))}
        <span />
        <button
          type="button"
          onClick={() => press("0")}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-border text-[1.4rem] font-light text-text transition-colors active:bg-[var(--gold-soft)]"
        >
          0
        </button>
        <button
          type="button"
          onClick={del}
          aria-label="Delete"
          className="flex h-16 w-16 items-center justify-center rounded-full text-text-dim transition-colors active:text-gold"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 4H8l-7 8 7 8h13a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z" />
            <path d="m15 9-6 6M9 9l6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
