"use client";

import { useMemo, useState } from "react";
import Tabs from "@/components/Tabs";
import Accordion from "@/components/Accordion";
import { useSettings } from "@/lib/useSettings";
import {
  UNIVERSAL_EXAMS,
  STATE_OF_LIFE_OPTIONS,
  getStateOfLifeExam,
  type Examination,
} from "@/lib/content/examination";
import type { StateOfLife } from "@/lib/types";

type TabId = "quick" | "commandments" | "vocation";

const TABS: { id: TabId; label: string }[] = [
  { id: "quick", label: "Quick" },
  { id: "commandments", label: "Commandments" },
  { id: "vocation", label: "State of life" },
];

function toAccordionItems(exam: Examination) {
  return exam.sections.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    body: (
      <ul className="flex flex-col gap-3">
        {s.questions.map((q, i) => (
          <li key={i} className="flex gap-3 text-[0.95rem] leading-relaxed text-text-soft">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-muted" />
            <span>{q}</span>
          </li>
        ))}
      </ul>
    ),
  }));
}

export default function ExaminePage() {
  const [active, setActive] = useState<TabId>("quick");
  const { settings, update } = useSettings();
  const stateOfLife = settings.stateOfLife ?? "single_man";

  const [quick, commandments] = UNIVERSAL_EXAMS;
  const vocationExam = useMemo(
    () => getStateOfLifeExam(stateOfLife),
    [stateOfLife],
  );

  const exam =
    active === "quick" ? quick : active === "commandments" ? commandments : vocationExam;

  const items = useMemo(() => toAccordionItems(exam), [exam]);

  return (
    <div className="fade-in">
      <h1 className="font-serif text-3xl text-text">Examination</h1>
      <p className="mt-1.5 text-[0.92rem] text-text-dim">of conscience</p>

      <div className="mt-6">
        <Tabs tabs={TABS} active={active} onChange={setActive} />
      </div>

      {active === "vocation" && (
        <div className="fade-in mt-5">
          <p className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-text-dim">
            Examining as
          </p>
          <div className="flex flex-wrap gap-2">
            {STATE_OF_LIFE_OPTIONS.map((opt) => {
              const selected = opt.id === stateOfLife;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update({ stateOfLife: opt.id as StateOfLife })}
                  className="rounded-full px-4 py-2 text-[0.85rem] font-medium transition-all"
                  style={{
                    backgroundColor: selected ? "var(--gold-soft)" : "var(--surface)",
                    color: selected ? "var(--gold)" : "var(--text-dim)",
                    boxShadow: selected
                      ? "inset 0 0 0 1px var(--gold-muted)"
                      : "inset 0 0 0 1px var(--border)",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p
        key={`intro-${exam.id}`}
        className="fade-in mt-5 text-[0.92rem] leading-relaxed text-text-soft"
      >
        {exam.intro}
      </p>

      <div key={`acc-${exam.id}`} className="fade-in mt-5">
        <Accordion items={items} />
      </div>
    </div>
  );
}
