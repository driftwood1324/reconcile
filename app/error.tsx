"use client";

import Cross from "@/components/Cross";

/**
 * Calm fallback for any unhandled render error, so the app never drops to a
 * blank white screen. The user's data is untouched (it lives in localStorage);
 * "Try again" re-renders the failed route.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="fade-in flex min-h-[70vh] flex-col items-center justify-center text-center">
      <Cross size={36} className="mb-5 text-gold-muted" />
      <h1 className="font-serif text-2xl text-text">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-[22rem] text-[0.92rem] leading-relaxed text-text-soft">
        Your history is safe — it&rsquo;s stored only on this device and was not
        affected. You can try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-7 rounded-2xl px-8 py-3 text-[0.92rem] font-medium"
        style={{ backgroundColor: "var(--gold)", color: "#1a1305" }}
      >
        Try again
      </button>
    </div>
  );
}
