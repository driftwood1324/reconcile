"use client";

import { useEffect, useState } from "react";
import { getLockConfig, isUnlocked, markUnlocked, subscribeLock } from "@/lib/lock";
import LockScreen from "./LockScreen";

/**
 * Wraps the app shell. When the privacy lock is enabled and the session is not
 * yet unlocked, it overlays the LockScreen on top of (and hiding) the app. The
 * decision is made after mount, so the common no-lock case renders normally.
 */
export default function LockGate({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const decide = () => setLocked(!!getLockConfig() && !isUnlocked());
    decide();
    return subscribeLock(decide);
  }, []);

  return (
    <>
      {/* While locked, the app is held inert so it can't be tabbed into or read
          by assistive tech behind the lock screen. */}
      <div inert={locked} aria-hidden={locked || undefined}>
        {children}
      </div>
      {locked && (
        <LockScreen
          onUnlock={() => {
            markUnlocked();
            setLocked(false);
          }}
        />
      )}
    </>
  );
}
