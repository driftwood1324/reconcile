"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Confession } from "./types";
import { addConfession, deleteConfession, getConfessions, subscribe } from "./storage";

const EMPTY: Confession[] = [];

/**
 * Reactive view of the confession log. Uses useSyncExternalStore so every
 * mounted screen reflects writes immediately and SSR/export renders a stable
 * empty list (avoiding hydration mismatches).
 */
export function useConfessions() {
  const confessions = useSyncExternalStore(
    subscribe,
    getConfessions,
    () => EMPTY,
  );

  const record = useCallback((opts?: { note?: string; date?: string }) => {
    return addConfession({
      date: opts?.date ?? new Date().toISOString(),
      note: opts?.note,
    });
  }, []);

  const remove = useCallback((id: string) => deleteConfession(id), []);

  const last = confessions[0] ?? null;

  return {
    confessions,
    count: confessions.length,
    last,
    lastDate: last?.date ?? null,
    record,
    remove,
  };
}
