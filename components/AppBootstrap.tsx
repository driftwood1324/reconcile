"use client";

import { useEffect } from "react";
import { initializeLockStorage } from "@/lib/lock";
import { installLockLifecycle } from "@/lib/lockLifecycle";
import { initializeStorage } from "@/lib/storage";

export default function AppBootstrap() {
  useEffect(() => {
    let cancelled = false;
    let removeLifecycle: (() => Promise<void>) | undefined;

    void (async () => {
      await initializeStorage();
      await initializeLockStorage();
      if (cancelled) return;
      removeLifecycle = await installLockLifecycle();
    })();

    return () => {
      cancelled = true;
      void removeLifecycle?.();
    };
  }, []);

  return null;
}
