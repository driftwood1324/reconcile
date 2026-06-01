"use client";

import { useMemo, useState } from "react";
import PillToggle from "@/components/PillToggle";
import Cross from "@/components/Cross";
import {
  CONTRITION_NOTE,
  CONTRITION_VERSIONS,
  type ContritionVersion,
} from "@/lib/content/contrition";

type VersionId = ContritionVersion["id"];

export default function ContritionPage() {
  const [active, setActive] = useState<VersionId>("traditional");

  const version = useMemo(
    () => CONTRITION_VERSIONS.find((v) => v.id === active) ?? CONTRITION_VERSIONS[0],
    [active],
  );

  return (
    <div className="fade-in">
      <h1 className="font-serif text-3xl text-text">Act of Contrition</h1>

      <div className="mt-6">
        <PillToggle
          ariaLabel="Choose a version"
          options={CONTRITION_VERSIONS.map((v) => ({ value: v.id, label: v.label }))}
          value={active}
          onChange={setActive}
        />
        <p className="mt-3 text-center text-[0.82rem] text-text-dim">
          {version.caption}
        </p>
      </div>

      <article
        key={version.id}
        className="fade-in mt-8 rounded-3xl border border-border bg-surface px-6 py-9"
      >
        <Cross size={30} className="mx-auto mb-7 text-gold-muted" />
        <div className="flex flex-col gap-5">
          {version.lines.map((line, i) => (
            <p
              key={i}
              className="text-center font-serif text-[1.35rem] leading-relaxed text-text"
              style={line.trim() === "Amen." ? { color: "var(--gold)" } : undefined}
            >
              {line}
            </p>
          ))}
        </div>
      </article>

      <section className="mt-8 rounded-2xl border border-border bg-surface-2 px-5 py-5">
        <h2 className="font-serif text-lg text-gold">{CONTRITION_NOTE.heading}</h2>
        <div className="mt-3 flex flex-col gap-3">
          {CONTRITION_NOTE.body.map((p, i) => (
            <p key={i} className="text-[0.9rem] leading-relaxed text-text-soft">
              {p}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
