import type { Confession, FlaggedItem, Note, Settings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

/**
 * Typed, SSR-safe wrapper over localStorage. All persistence flows through here
 * so keys, JSON guarding, and change notification live in one place. A custom
 * window event keeps multiple mounted screens in sync within the same tab
 * (the native `storage` event only fires across tabs).
 */

const KEYS = {
  confessions: "reconcile.confessions",
  settings: "reconcile.settings",
  notes: "reconcile.notes",
  flags: "reconcile.flags",
} as const;

const CHANGE_EVENT = "reconcile:change";

const isBrowser = () => typeof window !== "undefined";

function write<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }));
  } catch {
    /* quota or private-mode failures are non-fatal for this app */
  }
}

/** Subscribe to any Reconcile data change (same-tab + cross-tab). */
export function subscribe(listener: () => void): () => void {
  if (!isBrowser()) return () => {};
  const onCustom = () => listener();
  const onStorage = (e: StorageEvent) => {
    if (
      e.key === KEYS.confessions ||
      e.key === KEYS.settings ||
      e.key === KEYS.notes ||
      e.key === KEYS.flags
    )
      listener();
  };
  window.addEventListener(CHANGE_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

// ── Confessions ────────────────────────────────────────────────────────────

// Snapshot cache keyed on the raw stored string. useSyncExternalStore requires
// a stable reference between calls when the data has not actually changed —
// returning a freshly sorted array every time would loop forever.
const EMPTY_CONFESSIONS: Confession[] = [];
let confessionsCache: { raw: string | null; value: Confession[] } = {
  raw: null,
  value: EMPTY_CONFESSIONS,
};

export function getConfessions(): Confession[] {
  if (!isBrowser()) return EMPTY_CONFESSIONS;
  const raw = window.localStorage.getItem(KEYS.confessions);
  if (raw === confessionsCache.raw) return confessionsCache.value;

  let parsed: Confession[] = [];
  try {
    parsed = raw ? (JSON.parse(raw) as Confession[]) : [];
  } catch {
    parsed = [];
  }
  // Newest first, defensively sorted in case of clock changes.
  const value = [...parsed].sort((a, b) => b.date.localeCompare(a.date));
  confessionsCache = { raw, value };
  return value;
}

export function addConfession(input: { date: string; note?: string }): Confession {
  const note = input.note?.trim();
  const entry: Confession = {
    id: makeId(),
    date: input.date,
    ...(note ? { note } : {}),
  };
  const next = [entry, ...getConfessions()];
  write(KEYS.confessions, next);
  return entry;
}

export function deleteConfession(id: string): void {
  write(KEYS.confessions, getConfessions().filter((c) => c.id !== id));
}

// ── Notes ────────────────────────────────────────────────────────────────────

const EMPTY_NOTES: Note[] = [];
let notesCache: { raw: string | null; value: Note[] } = {
  raw: null,
  value: EMPTY_NOTES,
};

export function getNotes(): Note[] {
  if (!isBrowser()) return EMPTY_NOTES;
  const raw = window.localStorage.getItem(KEYS.notes);
  if (raw === notesCache.raw) return notesCache.value;

  let parsed: Note[] = [];
  try {
    parsed = raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    parsed = [];
  }
  // Newest first.
  const value = [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  notesCache = { raw, value };
  return value;
}

export function addNote(text: string): Note | null {
  const body = text.trim();
  if (!body) return null;
  const entry: Note = { id: makeId(), text: body, createdAt: new Date().toISOString() };
  write(KEYS.notes, [entry, ...getNotes()]);
  return entry;
}

export function deleteNote(id: string): void {
  write(KEYS.notes, getNotes().filter((n) => n.id !== id));
}

// ── Examination flags ("bring to confession" list) ───────────────────────────

const EMPTY_FLAGS: FlaggedItem[] = [];
let flagsCache: { raw: string | null; value: FlaggedItem[] } = {
  raw: null,
  value: EMPTY_FLAGS,
};

export function getFlags(): FlaggedItem[] {
  if (!isBrowser()) return EMPTY_FLAGS;
  const raw = window.localStorage.getItem(KEYS.flags);
  if (raw === flagsCache.raw) return flagsCache.value;

  let value: FlaggedItem[] = [];
  try {
    value = raw ? (JSON.parse(raw) as FlaggedItem[]) : [];
  } catch {
    value = [];
  }
  flagsCache = { raw, value };
  return value;
}

/** Add the item if its key is absent, otherwise remove it. */
export function toggleFlag(item: FlaggedItem): void {
  const current = getFlags();
  const next = current.some((f) => f.key === item.key)
    ? current.filter((f) => f.key !== item.key)
    : [...current, item];
  write(KEYS.flags, next);
}

export function removeFlag(key: string): void {
  write(KEYS.flags, getFlags().filter((f) => f.key !== key));
}

export function clearFlags(): void {
  if (getFlags().length === 0) return;
  write(KEYS.flags, []);
}

// ── Settings ─────────────────────────────────────────────────────────────────

let settingsCache: { raw: string | null; value: Settings } = {
  raw: null,
  value: DEFAULT_SETTINGS,
};

export function getSettings(): Settings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  const raw = window.localStorage.getItem(KEYS.settings);
  if (raw === settingsCache.raw) return settingsCache.value;

  let value = DEFAULT_SETTINGS;
  try {
    const parsed = raw ? (JSON.parse(raw) as Partial<Settings> & { customDays?: number }) : {};
    value = { ...DEFAULT_SETTINGS, ...parsed };
    // Migrate the pre-units custom cadence (a bare day count) to count + unit.
    if (typeof parsed.customDays === "number" && parsed.customCount == null) {
      value = { ...value, customCount: parsed.customDays, customUnit: "days" };
    }
  } catch {
    value = DEFAULT_SETTINGS;
  }
  settingsCache = { raw, value };
  return value;
}

export function saveSettings(settings: Settings): void {
  write(KEYS.settings, settings);
}

// ── Danger zone ──────────────────────────────────────────────────────────────

export function clearAll(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEYS.confessions);
  window.localStorage.removeItem(KEYS.settings);
  window.localStorage.removeItem(KEYS.notes);
  window.localStorage.removeItem(KEYS.flags);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key: "*" } }));
}

function makeId(): string {
  if (isBrowser() && "randomUUID" in crypto) return crypto.randomUUID();
  // Fallback that does not rely on Math.random being available at module load.
  return `c_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e9).toString(36)}`;
}
