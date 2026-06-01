"use client";

import { useState } from "react";
import Link from "next/link";
import { useConfessions } from "@/lib/useConfessions";

/**
 * Top-right profile control. There is no account (the app is local-only), so the
 * menu surfaces the device's own data and the link into Settings.
 */
export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { count } = useConfessions();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Profile"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-gold-muted"
        style={{ backgroundColor: "var(--surface)", color: "var(--gold-muted)" }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-3.5 3.1-5.5 7-5.5s7 2 7 5.5" />
        </svg>
      </button>

      {open && (
        <>
          {/* Tap-away backdrop. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            className="fade-in absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-4">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--gold-soft)", color: "var(--gold)" }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c0-3.5 3.1-5.5 7-5.5s7 2 7 5.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-serif text-[1.05rem] leading-tight text-text">Profile</p>
                <p className="mt-0.5 text-[0.78rem] text-text-dim">
                  {count} {count === 1 ? "confession" : "confessions"} · stored on this device
                </p>
              </div>
            </div>

            <Link
              href="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-4 text-[0.95rem] text-text-soft transition-colors hover:bg-surface-2"
            >
              <span className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="var(--gold-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
                </svg>
                Settings
              </span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
