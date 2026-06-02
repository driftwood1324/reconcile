"use client";

import { useConfessions } from "@/lib/useConfessions";
import { elapsedSince } from "@/lib/time";
import { syncReminder } from "@/lib/reminders";
import RecordConfessionFlow from "@/components/RecordConfessionFlow";
import ConfessionLog from "@/components/ConfessionLog";
import ProfileMenu from "@/components/ProfileMenu";
import TodayStrip from "@/components/TodayStrip";

export default function HomePage() {
  const { confessions, lastDate, remove } = useConfessions();
  const elapsed = lastDate ? elapsedSince(lastDate) : null;

  const handleDelete = (id: string) => {
    remove(id);
    void syncReminder(); // the next reminder may key off the entry just removed
  };

  return (
    <div className="fade-in">
      <header className="relative pt-2">
        <div className="absolute right-0 top-0">
          <ProfileMenu />
        </div>

        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-text-dim">
          Since last confession
        </p>

        {elapsed ? (
          <div className="mt-5">
            <span className="block font-serif text-7xl leading-none text-gold">
              {elapsed.value}
            </span>
            {elapsed.unit && (
              <span className="mt-2 block font-serif text-3xl text-gold-muted">
                {elapsed.unit}
              </span>
            )}
          </div>
        ) : (
          <div className="mt-5">
            <span className="block font-serif text-4xl leading-tight text-gold">
              Not yet recorded
            </span>
            <p className="mt-3 max-w-[20rem] text-[0.95rem] leading-relaxed text-text-soft">
              Begin by recording your last confession. From there, Reconcile keeps
              the count for you.
            </p>
          </div>
        )}
      </header>

      <div className="mt-9">
        <RecordConfessionFlow />
      </div>

      <TodayStrip />

      <ConfessionLog items={confessions} onDelete={handleDelete} />

      <footer className="mt-12 mb-2 text-center">
        <p className="font-serif text-[1.15rem] italic leading-relaxed text-gold-muted">
          “Create in me a clean heart, O God.”
        </p>
        <p className="mt-1.5 text-[0.78rem] uppercase tracking-[0.16em] text-text-dim">
          Psalm 51:10
        </p>
      </footer>
    </div>
  );
}
