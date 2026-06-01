"use client";

import { useState } from "react";
import Cross from "./Cross";
import PinPad from "./PinPad";
import { verifyPin } from "@/lib/lock";

/** Full-screen gate shown when the privacy lock is on and the app is locked. */
export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [error, setError] = useState(0);

  const submit = async (pin: string) => {
    if (await verifyPin(pin)) onUnlock();
    else setError((n) => n + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] px-6">
      <Cross size={40} className="mb-2 text-gold" />
      <PinPad
        key={error}
        title="Reconcile"
        subtitle={error ? "Incorrect PIN — try again" : "Enter your PIN"}
        error={error}
        onComplete={submit}
      />
    </div>
  );
}
