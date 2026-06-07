import { describe, expect, it, vi } from "vitest";

const importSnapshot = vi.fn();

vi.mock("@/lib/storage", () => ({
  exportSnapshot: vi.fn(() => ({ confessions: [], notes: [], settings: {}, flags: [] })),
  importSnapshot,
}));

describe("restoreBackup validation", () => {
  it("rejects malformed snapshot payloads without replacing local data", async () => {
    const { restoreBackup } = await import("@/lib/backup");
    const malformed = JSON.stringify({
      app: "reconcile",
      v: 1,
      enc: false,
      data: { confessions: "not an array", notes: [], settings: {}, flags: [] },
    });

    const result = await restoreBackup(malformed);

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/damaged|unsupported|valid/i);
    expect(importSnapshot).not.toHaveBeenCalled();
  });

  it("rejects empty backup payloads instead of reporting a successful no-op restore", async () => {
    const { restoreBackup } = await import("@/lib/backup");
    const empty = JSON.stringify({ app: "reconcile", v: 1, enc: false, data: {} });

    const result = await restoreBackup(empty);

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/empty|nothing|valid/i);
    expect(importSnapshot).not.toHaveBeenCalled();
  });
});
