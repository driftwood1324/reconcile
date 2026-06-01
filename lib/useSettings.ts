"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Settings } from "./types";
import { DEFAULT_SETTINGS } from "./types";
import { getSettings, saveSettings, subscribe } from "./storage";

/** Reactive read/write access to user settings (reminder interval). */
export function useSettings() {
  const settings = useSyncExternalStore(
    subscribe,
    getSettings,
    () => DEFAULT_SETTINGS,
  );

  const update = useCallback((patch: Partial<Settings>) => {
    saveSettings({ ...getSettings(), ...patch });
  }, []);

  return { settings, update };
}
