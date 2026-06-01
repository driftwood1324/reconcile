"use client";

import { useMemo, useState } from "react";
import Tabs from "@/components/Tabs";
import Accordion from "@/components/Accordion";
import { useSettings } from "@/lib/useSettings";
import { useFlags } from "@/lib/useFlags";
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

const CheckMark = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function toAccordionItems(
  exam: Examination,
  flagged: Set<string>,
  toggle: (item: { key: string; text: string }) => void,
) {
  return exam.sections.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    body: (
      <ul className="flex flex-col gap-1">
        {s.questions.map((q, i) => {
          const key = `${exam.id}:${s.id}:${i}`;
          const isFlagged = flagged.has(key);
          return (
            <li key={i}>
              <button
                type="button"
                aria-pressed={isFlagged}
                onClick={() => toggle({ key, text: q })}
                className="flex w-full gap-3 rounded-xl px-2.5 py-2 text-left text-[0.95rem] leading-relaxed transition-colors"
                style={{
                  backgroundColor: isFlagged ? "var(--gold-soft)" : "transparent",
                  color: isFlagged ? "var(--gold)" : "var(--text-soft)",
                }}
              >
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                  {isFlagged ? (
                    <CheckMark />
                  ) : (
                    <span className="h-1 w-1 rounded-full bg-gold-muted" />
                  )}
                </span>
                <span>{q}</span>
              </button>
            </li>
          );
        })}
      </ul>
    ),
  }));
}

export default function ExaminePage() {
  const [active, setActive] = useState<TabId>("quick");
  const [showList, setShowList] = useState(false);
  const { settings, update } = useSettings();
  const { flags, keys, count, remove, clear, toggle } = useFlags();
  const stateOfLife = settings.stateOfLife ?? "single_man";

  const [quick, commandments] = UNIVERSAL_EXAMS;
  const vocationExam = useMemo(
    () => getStateOfLifeExam(stateOfLife),
    [stateOfLife],
  );

  const exam =
    active === "quick" ? quick : active === "commandments" ? commandments : vocationExam;

  const items = useMemo(
    () => toAccordionItems(exam, keys, toggle),
    [exam, keys, toggle],
  );

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
      <p className="mt-2 text-[0.82rem] leading-relaxed text-text-dim">
        Tap anything that applies — it gathers a private list to bring to the
        confessional. Nothing leaves this device.
      </p>

      {/* "Bring to confession" summary — spans all tabs */}
      {count > 0 && (
        <div className="fade-in mt-5 overflow-hidden rounded-2xl border border-[var(--gold-muted)] bg-gold-soft">
          <button
            type="button"
            onClick={() => setShowList((s) => !s)}
            aria-expanded={showList}
            className="flex w-full items-center justify-between px-5 py-3.5 text-left"
          >
            <span className="text-[0.92rem] font-medium text-gold">
              {count} {count === 1 ? "thing" : "things"} to bring to confession
            </span>
            <svg
              viewBox="0 0 24 24" width="18" height="18" fill="none"
              stroke="var(--gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0 transition-transform duration-300"
              style={{ transform: showList ? "rotate(180deg)" : "none" }}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {showList && (
            <div className="fade-in border-t border-[var(--gold-muted)]/40 px-5 py-4">
              <ul className="flex flex-col gap-2.5">
                {flags.map((f) => (
                  <li key={f.key} className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-text-soft">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-muted" />
                    <span className="min-w-0 flex-1">{f.text}</span>
                    <button
                      type="button"
                      onClick={() => remove(f.key)}
                      aria-label="Remove from list"
                      className="shrink-0 rounded-md px-1.5 text-text-dim transition-colors hover:text-gold"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={clear}
                className="mt-4 text-[0.82rem] text-text-dim transition-colors hover:text-gold"
              >
                Clear the list
              </button>
            </div>
          )}
        </div>
      )}

      <div key={`acc-${exam.id}`} className="fade-in mt-5">
        <Accordion items={items} />
      </div>
    </div>
  );
}
