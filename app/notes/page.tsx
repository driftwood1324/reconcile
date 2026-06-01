"use client";

import { useState } from "react";
import { useNotes } from "@/lib/useNotes";
import { relativeLabel } from "@/lib/time";

export default function NotesPage() {
  const { notes, add, remove } = useNotes();
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    add(draft);
    setDraft("");
  };

  return (
    <div className="fade-in">
      <h1 className="font-serif text-3xl text-text">Notes</h1>
      <p className="mt-1.5 text-[0.92rem] leading-relaxed text-text-dim">
        A private place for what you want to bring to confession. Kept only on
        this device.
      </p>

      {/* Composer */}
      <div className="mt-6 rounded-2xl border border-border bg-surface px-5 py-5">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Something to confess, a resolution, a prayer intention…"
          className="w-full resize-none rounded-xl border border-border bg-[var(--bg)] px-4 py-3 text-base leading-relaxed text-text placeholder:text-text-dim/70 focus:border-gold-muted focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!draft.trim()}
          className="mt-3 w-full rounded-2xl px-5 py-3 text-[0.92rem] font-medium transition-opacity disabled:opacity-40"
          style={{ backgroundColor: "var(--gold)", color: "#1a1305" }}
        >
          Add note
        </button>
      </div>

      {/* List */}
      {notes.length === 0 ? (
        <p className="mt-10 text-center text-[0.9rem] text-text-dim">
          No notes yet.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2.5">
          {notes.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-3 rounded-2xl border border-border bg-surface px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed text-text-soft">
                  {n.text}
                </p>
                <p className="mt-1.5 text-[0.75rem] text-text-dim">
                  {relativeLabel(n.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(n.id)}
                aria-label="Delete note"
                className="-mr-1.5 shrink-0 rounded-lg p-2 text-text-dim transition-colors hover:text-[#d98a8a]"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                  <path d="M19 6v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
