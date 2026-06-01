"use client";

import { useState } from "react";
import { useConfessions } from "@/lib/useConfessions";
import { formatDate } from "@/lib/time";
import Calendar from "./Calendar";
import Cross from "./Cross";

type Stage = "idle" | "form" | "calendar" | "done";
type Mode = "today" | "past";

/**
 * Home CTA. Two paths:
 *  - "I just went to confession" → confirm + optional note → "grace received".
 *  - "Log a past confession" → calendar → pick a day + note → "logged".
 */
export default function RecordConfessionFlow() {
  const { record } = useConfessions();
  const [stage, setStage] = useState<Stage>("idle");
  const [mode, setMode] = useState<Mode>("today");
  const [note, setNote] = useState("");
  const [pickedDate, setPickedDate] = useState<Date | null>(null);

  const reset = () => {
    setNote("");
    setPickedDate(null);
    setMode("today");
    setStage("idle");
  };

  const confirmToday = () => {
    record({ note });
    setStage("done");
  };

  const confirmPast = () => {
    if (!pickedDate) return;
    // Anchor at local noon so the calendar day isn't shifted by timezone.
    const d = new Date(
      pickedDate.getFullYear(),
      pickedDate.getMonth(),
      pickedDate.getDate(),
      12, 0, 0,
    );
    record({ note, date: d.toISOString() });
    setStage("done");
  };

  // ── Confirmation ───────────────────────────────────────────────────────────
  if (stage === "done") {
    const past = mode === "past";
    return (
      <div className="fade-rise rounded-3xl border border-border bg-surface px-6 py-8 text-center">
        <Cross size={34} className="mx-auto text-gold" />
        <p className="mt-4 font-serif text-2xl text-gold">
          {past ? "Confession recorded" : "Go in peace"}
        </p>
        <p className="mx-auto mt-2 max-w-[22rem] text-[0.92rem] leading-relaxed text-text-soft">
          {past
            ? `Recorded for ${pickedDate ? formatDate(pickedDate.toISOString()) : "the chosen day"}.`
            : "Give thanks for the mercy you have received. Pray your penance, and resolve to begin again."}
        </p>
        <div className="mt-7">
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl border border-border px-8 py-3 text-[0.92rem] text-text-soft transition-colors hover:border-gold-muted"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ── Calendar: pick a past day ────────────────────────────────────────────────
  if (stage === "calendar") {
    return (
      <div className="fade-in">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-serif text-lg text-text">Log a past confession</p>
          <button
            type="button"
            onClick={reset}
            className="text-[0.85rem] text-text-dim"
          >
            Cancel
          </button>
        </div>
        <Calendar selected={pickedDate} onSelect={setPickedDate} />

        {pickedDate && (
          <div className="fade-in mt-4 rounded-2xl border border-border bg-surface px-5 py-5">
            <p className="text-[0.9rem] text-text-soft">
              Record a confession on{" "}
              <span className="font-medium text-gold">
                {formatDate(pickedDate.toISOString())}
              </span>
              ?
            </p>
            <label className="mt-4 block text-[0.78rem] uppercase tracking-[0.12em] text-text-dim">
              Note <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Anything you want to remember…"
              className="mt-2 w-full resize-none rounded-xl border border-border bg-[var(--bg)] px-4 py-3 text-[0.92rem] text-text placeholder:text-text-dim/70 focus:border-gold-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={confirmPast}
              className="mt-4 w-full rounded-2xl px-5 py-3.5 text-[0.92rem] font-medium"
              style={{ backgroundColor: "var(--gold)", color: "#1a1305" }}
            >
              Log this confession
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Confirm today + optional note ────────────────────────────────────────────
  if (stage === "form") {
    return (
      <div className="fade-in rounded-3xl border border-border bg-surface px-6 py-6">
        <p className="font-serif text-lg text-text">Record this confession?</p>
        <p className="mt-1 text-[0.85rem] text-text-dim">
          This logs today as your last confession.
        </p>
        <label className="mt-4 block text-[0.78rem] uppercase tracking-[0.12em] text-text-dim">
          Note <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Penance given, what I'm resolving to work on…"
          className="mt-2 w-full resize-none rounded-xl border border-border bg-[var(--bg)] px-4 py-3 text-[0.92rem] text-text placeholder:text-text-dim/70 focus:border-gold-muted focus:outline-none"
        />
        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={reset}
            className="flex-1 rounded-2xl border border-border px-5 py-3.5 text-[0.92rem] text-text-soft"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmToday}
            className="flex-1 rounded-2xl px-5 py-3.5 text-[0.92rem] font-medium"
            style={{ backgroundColor: "var(--gold)", color: "#1a1305" }}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }

  // ── Idle ─────────────────────────────────────────────────────────────────────
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setMode("today");
          setStage("form");
        }}
        className="w-full rounded-3xl px-6 py-5 text-center text-[1.02rem] font-medium"
        style={{ backgroundColor: "var(--gold)", color: "#1a1305" }}
      >
        I just went to confession
      </button>
      <button
        type="button"
        onClick={() => {
          setMode("past");
          setStage("calendar");
        }}
        className="mt-3 w-full py-2 text-center text-[0.9rem] text-text-dim transition-colors hover:text-gold"
      >
        Log a past confession
      </button>
    </div>
  );
}
