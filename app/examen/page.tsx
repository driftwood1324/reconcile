"use client";

import { useState } from "react";
import Link from "next/link";
import Cross from "@/components/Cross";
import { EXAMEN_CLOSE, EXAMEN_INTRO, EXAMEN_STEPS } from "@/lib/content/examen";

export default function ExamenPage() {
  // -1 = intro, 0..n-1 = steps, n = close
  const [stage, setStage] = useState(-1);
  const total = EXAMEN_STEPS.length;

  if (stage === -1) {
    return (
      <div className="fade-in flex min-h-[68vh] flex-col items-center justify-center text-center">
        <Cross size={36} className="mb-5 text-gold-muted" />
        <h1 className="font-serif text-3xl text-text">The Daily Examen</h1>
        <p className="mx-auto mt-4 max-w-[24rem] text-[0.95rem] leading-relaxed text-text-soft">
          {EXAMEN_INTRO}
        </p>
        <button
          type="button"
          onClick={() => setStage(0)}
          className="mt-8 rounded-2xl px-8 py-3.5 text-[0.95rem] font-medium"
          style={{ backgroundColor: "var(--gold)", color: "#1a1305" }}
        >
          Begin
        </button>
      </div>
    );
  }

  if (stage >= total) {
    return (
      <div className="fade-rise flex min-h-[68vh] flex-col items-center justify-center text-center">
        <Cross size={34} className="mb-5 text-gold" />
        <h2 className="font-serif text-2xl text-gold">{EXAMEN_CLOSE.heading}</h2>
        <p className="mx-auto mt-4 max-w-[24rem] text-[0.95rem] leading-relaxed text-text-soft">
          {EXAMEN_CLOSE.body}
        </p>
        <div className="mt-8 flex flex-col gap-2.5">
          <Link
            href="/notes"
            className="rounded-2xl border border-border bg-surface px-6 py-3.5 text-[0.92rem] text-text-soft transition-colors hover:border-gold-muted"
          >
            Jot something down →
          </Link>
          <button
            type="button"
            onClick={() => setStage(-1)}
            className="rounded-2xl px-6 py-3 text-[0.88rem] text-text-dim transition-colors hover:text-gold"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  const step = EXAMEN_STEPS[stage];
  return (
    <div className="flex min-h-[68vh] flex-col">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {EXAMEN_STEPS.map((_, i) => (
          <span
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === stage ? "1.5rem" : "0.375rem",
              backgroundColor: i <= stage ? "var(--gold)" : "var(--border-strong)",
            }}
          />
        ))}
      </div>

      <div
        key={step.id}
        className="fade-in flex flex-1 flex-col items-center justify-center text-center"
      >
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
          {stage + 1} of {total}
        </p>
        <h2 className="mt-3 max-w-[22rem] font-serif text-[1.7rem] leading-snug text-text">
          {step.title}
        </h2>
        <p className="mx-auto mt-5 max-w-[24rem] text-[1rem] leading-relaxed text-text-soft">
          {step.prompt}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 pb-2">
        <button
          type="button"
          onClick={() => setStage((s) => s - 1)}
          className="rounded-2xl px-5 py-3 text-[0.9rem] text-text-dim transition-colors hover:text-gold"
        >
          {stage === 0 ? "Back" : "Previous"}
        </button>
        <button
          type="button"
          onClick={() => setStage((s) => s + 1)}
          className="rounded-2xl px-8 py-3.5 text-[0.95rem] font-medium"
          style={{ backgroundColor: "var(--gold)", color: "#1a1305" }}
        >
          {stage === total - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
