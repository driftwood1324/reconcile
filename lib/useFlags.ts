"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { FlaggedItem } from "./types";
import { clearFlags, getFlags, removeFlag, subscribe, toggleFlag } from "./storage";

const EMPTY: FlaggedItem[] = [];

/**
 * Reactive view of the "bring to confession" list — the examination questions
 * the user has flagged as applying to them. `keys` is a Set for O(1) lookup
 * while rendering the examination.
 */
export function useFlags() {
  const flags = useSyncExternalStore(subscribe, getFlags, () => EMPTY);

  const keys = useMemo(() => new Set(flags.map((f) => f.key)), [flags]);

  const toggle = useCallback((item: FlaggedItem) => toggleFlag(item), []);
  const remove = useCallback((key: string) => removeFlag(key), []);
  const clear = useCallback(() => clearFlags(), []);

  return { flags, keys, count: flags.length, toggle, remove, clear };
}
