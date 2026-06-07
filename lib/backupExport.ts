import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

export type BackupSaveResult = {
  method: "native" | "browser";
  filename: string;
};

function filenameFor(now = new Date()): string {
  return `reconcile-backup-${now.toISOString().slice(0, 10)}.json`;
}

function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export async function saveBackupFile(text: string, now = new Date()): Promise<BackupSaveResult> {
  const filename = filenameFor(now);

  if (isNative()) {
    const written = await Filesystem.writeFile({
      path: filename,
      data: text,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    await Share.share({
      title: "Reconcile backup",
      text: "Save your Reconcile backup somewhere private.",
      url: written.uri,
      dialogTitle: "Save Reconcile backup",
    });

    return { method: "native", filename };
  }

  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return { method: "browser", filename };
}
