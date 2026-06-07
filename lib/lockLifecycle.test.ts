import { describe, expect, it, vi } from "vitest";

const flushPersistentWrites = vi.fn(() => new Promise<void>(() => {}));

vi.mock("@/lib/persistentStore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/persistentStore")>();
  return {
    ...actual,
    flushPersistentWrites,
  };
});

vi.mock("@capacitor/app", () => ({
  App: {
    addListener: vi.fn(),
  },
}));

describe("native lock lifecycle", () => {
  it("locks the app when Capacitor reports the app moved to the background", async () => {
    const { App } = await import("@capacitor/app");
    const { isUnlocked, markUnlocked } = await import("@/lib/lock");
    const { installLockLifecycle } = await import("@/lib/lockLifecycle");

    let appStateHandler: ((state: { isActive: boolean }) => void) | undefined;
    vi.mocked(App.addListener).mockImplementation(async (eventName: string, handler: unknown) => {
      if (eventName === "appStateChange") {
        appStateHandler = handler as (state: { isActive: boolean }) => void;
      }
      return { remove: vi.fn() };
    });

    markUnlocked();
    expect(isUnlocked()).toBe(true);

    await installLockLifecycle();
    appStateHandler?.({ isActive: false });

    expect(flushPersistentWrites).toHaveBeenCalledOnce();
    expect(isUnlocked()).toBe(false);
  });
});
