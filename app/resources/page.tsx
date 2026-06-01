"use client";

import { useState } from "react";
import Link from "next/link";
import Accordion from "@/components/Accordion";
import Cross from "@/components/Cross";
import {
  COMMON_PRAYERS,
  DIVINE_MERCY_INTRO,
  DIVINE_MERCY_STEPS,
  FATIMA_PRAYER,
  ROSARY_INTRO,
  ROSARY_MYSTERIES,
  ROSARY_STEPS,
} from "@/lib/content/prayers";
import {
  CONFESSION_GUIDE_INTRO,
  CONFESSION_GUIDE_RETURNING,
  CONFESSION_PHASES,
} from "@/lib/content/confessionGuide";

type View = "list" | "confession" | "rosary" | "divine-mercy" | "common";

const GUIDES: { id: Exclude<View, "list">; title: string; blurb: string }[] = [
  { id: "confession", title: "How to go to Confession", blurb: "The whole sacrament, step by step — especially if it's been a while." },
  { id: "rosary", title: "The Holy Rosary", blurb: "How to pray it, and the four sets of Mysteries." },
  { id: "divine-mercy", title: "Divine Mercy Chaplet", blurb: "Prayed on Rosary beads — a plea for mercy." },
  { id: "common", title: "Common Prayers", blurb: "The prayers every Catholic should know by heart." },
];

function Prayer({ lines }: { lines: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      {lines.map((line, i) => (
        <p key={i} className="font-serif text-[1.02rem] leading-relaxed text-text-soft">
          {line}
        </p>
      ))}
    </div>
  );
}

function BackBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to resources"
        className="-ml-2 rounded-lg p-2 text-text-soft transition-colors hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <h1 className="font-serif text-2xl text-text">{title}</h1>
    </div>
  );
}

export default function ResourcesPage() {
  const [view, setView] = useState<View>("list");
  const back = () => setView("list");

  if (view === "confession") {
    return (
      <div className="fade-in">
        <BackBar title="How to go to Confession" onBack={back} />
        <p className="text-[0.92rem] leading-relaxed text-text-soft">
          {CONFESSION_GUIDE_INTRO}
        </p>

        <div className="mt-7 flex flex-col gap-7">
          {CONFESSION_PHASES.map((phase) => (
            <section key={phase.id}>
              <h2 className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
                {phase.title}
              </h2>
              <ol className="flex flex-col gap-4">
                {phase.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-serif text-gold-muted">{i + 1}.</span>
                    <div className="min-w-0">
                      <p className="text-[0.93rem] leading-relaxed text-text-soft">
                        {step.text}
                      </p>
                      {step.say && (
                        <p className="mt-2 border-l-2 border-[var(--gold-muted)] pl-3 font-serif text-[1.02rem] leading-relaxed text-gold">
                          “{step.say}”
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-surface-2 px-5 py-5">
          <h2 className="font-serif text-lg text-gold">
            {CONFESSION_GUIDE_RETURNING.heading}
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {CONFESSION_GUIDE_RETURNING.body.map((p, i) => (
              <p key={i} className="text-[0.9rem] leading-relaxed text-text-soft">
                {p}
              </p>
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href="/examine"
            className="rounded-2xl border border-border bg-surface px-5 py-4 text-[0.92rem] text-text-soft transition-colors hover:border-gold-muted"
          >
            Examine your conscience →
          </Link>
          <Link
            href="/contrition"
            className="rounded-2xl border border-border bg-surface px-5 py-4 text-[0.92rem] text-text-soft transition-colors hover:border-gold-muted"
          >
            Act of Contrition →
          </Link>
        </div>
      </div>
    );
  }

  if (view === "rosary") {
    return (
      <div className="fade-in">
        <BackBar title="The Holy Rosary" onBack={back} />
        <p className="text-[0.92rem] leading-relaxed text-text-soft">{ROSARY_INTRO}</p>

        <h2 className="mt-7 mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
          How to pray
        </h2>
        <ol className="flex flex-col gap-3">
          {ROSARY_STEPS.map((step, i) => (
            <li key={i} className="flex gap-3 text-[0.93rem] leading-relaxed text-text-soft">
              <span className="font-serif text-gold-muted">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-2xl border border-border bg-surface px-5 py-4">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-gold-muted">
            {FATIMA_PRAYER.title}
          </p>
          <p className="mt-2 font-serif text-[1.02rem] leading-relaxed text-text-soft">
            {FATIMA_PRAYER.lines[0]}
          </p>
        </div>

        <h2 className="mt-8 mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
          The Mysteries
        </h2>
        <Accordion
          items={ROSARY_MYSTERIES.map((set) => ({
            id: set.id,
            title: set.name,
            subtitle: set.days,
            body: (
              <ol className="flex flex-col gap-2.5">
                {set.mysteries.map((m, i) => (
                  <li key={i} className="flex gap-3 text-[0.93rem] leading-relaxed text-text-soft">
                    <span className="font-serif text-gold-muted">{i + 1}.</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ol>
            ),
          }))}
        />
      </div>
    );
  }

  if (view === "divine-mercy") {
    return (
      <div className="fade-in">
        <BackBar title="Divine Mercy Chaplet" onBack={back} />
        <p className="text-[0.92rem] leading-relaxed text-text-soft">{DIVINE_MERCY_INTRO}</p>

        <div className="mt-6 flex flex-col gap-3">
          {DIVINE_MERCY_STEPS.map((step, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface px-5 py-4">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-gold-muted">
                {step.label}
              </p>
              <p className="mt-2 font-serif text-[1.02rem] leading-relaxed text-text-soft">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "common") {
    return (
      <div className="fade-in">
        <BackBar title="Common Prayers" onBack={back} />
        <Accordion
          items={COMMON_PRAYERS.map((p) => ({
            id: p.id,
            title: p.title,
            body: <Prayer lines={p.lines} />,
          }))}
        />
      </div>
    );
  }

  // ── Hub list ─────────────────────────────────────────────────────────────────
  return (
    <div className="fade-in">
      <h1 className="font-serif text-3xl text-text">Resources</h1>
      <p className="mt-1.5 text-[0.92rem] text-text-dim">Prayers & devotions</p>

      <div className="mt-6 flex flex-col gap-3">
        {GUIDES.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setView(g.id)}
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-5 text-left transition-colors hover:border-gold-muted"
          >
            <Cross size={24} className="shrink-0 text-gold-muted" />
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-[1.1rem] text-text">{g.title}</span>
              <span className="mt-0.5 block text-[0.85rem] leading-snug text-text-dim">
                {g.blurb}
              </span>
            </span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
