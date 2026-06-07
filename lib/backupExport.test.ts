import { describe, expect, it, vi } from "vitest";

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: () => true,
  },
}));

vi.mock("@capacitor/filesystem", () => ({
  Directory: { Documents: "DOCUMENTS" },
  Encoding: { UTF8: "utf8" },
  Filesystem: {
    writeFile: vi.fn(async () => ({ uri: "file:///Documents/reconcile-backup-2026-06-07.json" })),
  },
}));

vi.mock("@capacitor/share", () => ({
  Share: {
    share: vi.fn(async () => undefined),
  },
}));

describe("native backup export", () => {
  it("writes a backup file through Capacitor Filesystem and opens the native share sheet", async () => {
    const { Filesystem, Directory, Encoding } = await import("@capacitor/filesystem");
    const { Share } = await import("@capacitor/share");
    const { saveBackupFile } = await import("@/lib/backupExport");

    const result = await saveBackupFile("{\"app\":\"reconcile\"}", new Date("2026-06-07T12:00:00.000Z"));

    expect(Filesystem.writeFile).toHaveBeenCalledWith({
      path: "reconcile-backup-2026-06-07.json",
      data: "{\"app\":\"reconcile\"}",
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    expect(Share.share).toHaveBeenCalledWith({
      title: "Reconcile backup",
      text: "Save your Reconcile backup somewhere private.",
      url: "file:///Documents/reconcile-backup-2026-06-07.json",
      dialogTitle: "Save Reconcile backup",
    });
    expect(result).toEqual({ method: "native", filename: "reconcile-backup-2026-06-07.json" });
  });
});
