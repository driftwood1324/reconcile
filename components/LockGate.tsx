"use client";

import { useEffect, useState } from "react";
import {
  getLockConfig,
  initializeLockStorage,
  isUnlocked,
  markUnlocked,
  subscribeLock,
} from "@/lib/lock";
import LockScreen from "./LockScreen";

/**
 * Wraps the app shell. When the privacy lock is enabled and the session is not
 * yet unlocked, it overlays the LockScreen on top of (and hiding) the app.
 * On native builds, lock settings are loaded asynchronously from Capacitor
 * Preferences, so private content stays blank until that first decision is safe.
 */
export default function LockGate({ children }: { children: React.ReactNode }) {
  const [checkingLock, setCheckingLock] = useState(true);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    const decide = () => setLocked(!!getLockConfig() && !isUnlocked());

    void (async () => {
      await initializeLockStorage();
      if (cancelled) return;
      decide();
      setCheckingLock(false);
      unsubscribe = subscribeLock(decide);
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (checkingLock) return null;

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
