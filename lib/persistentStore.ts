import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const registeredKeys = new Set<string>();
const nativeCache = new Map<string, string | null>();
const pendingNativeWrites = new Set<Promise<void>>();
let initialized = false;
let initializing: Promise<void> | null = null;

const isBrowser = () => typeof window !== "undefined";

export function registerPersistentKeys(keys: readonly string[]): void {
  for (const key of keys) registeredKeys.add(key);
}

export function usesNativePreferences(): boolean {
  try {
    return isBrowser() && Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export async function initializePersistentStore(): Promise<void> {
  if (!isBrowser() || !usesNativePreferences()) return;
  if (initialized) return;
  if (initializing) return initializing;

  initializing = (async () => {
    for (const key of registeredKeys) {
      const existing = await Preferences.get({ key });
      if (existing.value != null) {
        nativeCache.set(key, existing.value);
        continue;
      }

      const legacy = window.localStorage.getItem(key);
      nativeCache.set(key, legacy);
      if (legacy != null) {
        await Preferences.set({ key, value: legacy });
      }
    }
    initialized = true;
  })().finally(() => {
    initializing = null;
  });

  return initializing;
}

export function getRaw(key: string): string | null {
  if (!isBrowser()) return null;
  if (usesNativePreferences()) return nativeCache.get(key) ?? null;
  return window.localStorage.getItem(key);
}

function trackNativeWrite(write: Promise<void>): void {
  pendingNativeWrites.add(write);
  void write
    .catch(() => {
      /* Write failures are surfaced by the next flush; keep app interaction non-blocking. */
    })
    .finally(() => {
      pendingNativeWrites.delete(write);
    });
}

export async function flushPersistentWrites(): Promise<void> {
  if (pendingNativeWrites.size === 0) return;
  await Promise.allSettled(Array.from(pendingNativeWrites));
}

export function setRaw(key: string, value: string): void {
  if (!isBrowser()) return;
  if (usesNativePreferences()) {
    nativeCache.set(key, value);
    trackNativeWrite(Preferences.set({ key, value }));
    return;
  }
  window.localStorage.setItem(key, value);
}

export function removeRaw(key: string): void {
  if (!isBrowser()) return;
  if (usesNativePreferences()) {
    nativeCache.set(key, null);
    trackNativeWrite(Preferences.remove({ key }));
    return;
  }
  window.localStorage.removeItem(key);
}
