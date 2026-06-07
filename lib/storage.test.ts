import { beforeEach, describe, expect, it, vi } from "vitest";

const preferenceStore = new Map<string, string>();

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: () => true,
  },
}));

vi.mock("@capacitor/preferences", () => ({
  Preferences: {
    get: vi.fn(async ({ key }: { key: string }) => ({ value: preferenceStore.get(key) ?? null })),
    set: vi.fn(async ({ key, value }: { key: string; value: string }) => {
      preferenceStore.set(key, value);
    }),
    remove: vi.fn(async ({ key }: { key: string }) => {
      preferenceStore.delete(key);
    }),
  },
}));

describe("storage on native platforms", () => {
  beforeEach(() => {
    preferenceStore.clear();
  });

  it("hydrates Capacitor Preferences from existing localStorage once and then reads synchronously", async () => {
    const legacy = [{ id: "c1", date: "2026-06-01T12:00:00.000Z", note: "legacy" }];
    window.localStorage.setItem("reconcile.confessions", JSON.stringify(legacy));

    const { getConfessions, initializeStorage } = await import("@/lib/storage");

    expect(getConfessions()).toEqual([]);

    await initializeStorage();

    expect(getConfessions()).toEqual(legacy);
    expect(preferenceStore.get("reconcile.confessions")).toBe(JSON.stringify(legacy));
  });

  it("writes new data through Capacitor Preferences instead of using localStorage as the source of truth", async () => {
    const { addNote, getNotes, initializeStorage } = await import("@/lib/storage");

    await initializeStorage();
    const note = addNote("bring this up");

    expect(note?.text).toBe("bring this up");
    expect(getNotes()).toHaveLength(1);
    expect(preferenceStore.get("reconcile.notes")).toContain("bring this up");
  });
});
