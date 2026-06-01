/**
 * Optional privacy lock. A 4-digit PIN gate that deters casual snooping — the
 * realistic threat for a personal confession app is someone picking up an
 * unlocked phone, not a forensic attacker. The PIN is never stored in plain
 * text: we keep a salted SHA-256 hash on the device.
 *
 * The "unlocked" state lives in sessionStorage, so the app re-locks on a cold
 * launch but stays open while you navigate. On native iOS a biometric (Face ID)
 * unlock can be layered on later via a Capacitor plugin — see Settings.
 */
const KEY = "reconcile.lock";
const SESSION_KEY = "reconcile.unlocked";
const EVENT = "reconcile:lock";

export interface LockConfig {
  enabled: boolean;
  hash: string;
  salt: string;
}

const isBrowser = () => typeof window !== "undefined";

export function getLockConfig(): LockConfig | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as LockConfig;
    return c.enabled && c.hash ? c : null;
  } catch {
    return null;
  }
}

export function isLockEnabled(): boolean {
  return getLockConfig() !== null;
}

function randomSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const input = `${salt}:${pin}`;
  if (crypto?.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback for the rare context without SubtleCrypto — weaker, but still far
  // better than storing the PIN itself.
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return `f${h.toString(16)}`;
}

/** Constant-time-ish comparison so a wrong PIN can't be timed digit by digit. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function setPin(pin: string): Promise<void> {
  if (!isBrowser()) return;
  const salt = randomSalt();
  const hash = await hashPin(pin, salt);
  window.localStorage.setItem(KEY, JSON.stringify({ enabled: true, hash, salt }));
  markUnlocked(); // setting a PIN means you're present now
  notify();
}

export async function verifyPin(pin: string): Promise<boolean> {
  const c = getLockConfig();
  if (!c) return false;
  return safeEqual(await hashPin(pin, c.salt), c.hash);
}

export function disableLock(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
  notify();
}

export function markUnlocked(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* private mode — non-fatal */
  }
}

export function isUnlocked(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function lockNow(): void {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* non-fatal */
  }
  notify();
}

function notify(): void {
  if (isBrowser()) window.dispatchEvent(new Event(EVENT));
}

export function subscribeLock(listener: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
