"use client";

import { useState } from "react";

export interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  body: React.ReactNode;
}

/** Single-open accordion used by every examination tab. */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="min-w-0">
                <span
                  className="block font-serif text-[1.05rem] leading-snug text-text"
                  style={{ color: isOpen ? "var(--gold)" : "var(--text)" }}
                >
                  {item.title}
                </span>
                {item.subtitle && (
                  <span className="mt-1 block text-[0.8rem] italic leading-snug text-text-dim">
                    {item.subtitle}
                  </span>
                )}
              </span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="var(--gold-muted)"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <div className="border-t border-border px-5 py-4">{item.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
