"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Generic "tap, then tap again to confirm" button. The second tap must land
 * within `window` ms or the control resets — used for both recording a
 * confession and the destructive clear-all action.
 */
export default function ConfirmAction({
  idleLabel,
  confirmLabel,
  onConfirm,
  variant = "primary",
  window: resetMs = 4000,
}: {
  idleLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
  variant?: "primary" | "danger";
  window?: number;
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handle = () => {
    if (!armed) {
      setArmed(true);
      timer.current = setTimeout(() => setArmed(false), resetMs);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setArmed(false);
    onConfirm();
  };

  const isDanger = variant === "danger";
  const base =
    "w-full rounded-2xl px-5 py-4 text-[0.95rem] font-medium transition-all duration-200";

  const style: React.CSSProperties = armed
    ? isDanger
      ? { backgroundColor: "#5b1a1a", color: "#ffd9d9", boxShadow: "inset 0 0 0 1px #8a2b2b" }
      : { backgroundColor: "var(--gold)", color: "#1a1305" }
    : isDanger
      ? { backgroundColor: "transparent", color: "#d98a8a", boxShadow: "inset 0 0 0 1px #4a2326" }
      : { backgroundColor: "var(--gold-soft)", color: "var(--gold)", boxShadow: "inset 0 0 0 1px var(--gold-muted)" };

  return (
    <button type="button" onClick={handle} className={base} style={style}>
      {armed ? confirmLabel : idleLabel}
    </button>
  );
}
