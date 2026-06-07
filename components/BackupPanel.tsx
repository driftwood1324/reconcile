"use client";

import { useRef, useState } from "react";
import { createBackup, restoreBackup } from "@/lib/backup";
import { saveBackupFile } from "@/lib/backupExport";

type Mode = "idle" | "export" | "import";

export default function BackupPanel() {
  const [mode, setMode] = useState<Mode>("idle");

  // Export
  const [exportPass, setExportPass] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  // Import
  const [importText, setImportText] = useState("");
  const [importPass, setImportPass] = useState("");
  const [needsPass, setNeedsPass] = useState(false);
  const [message, setMessage] = useState("");
  const [restored, setRestored] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setMode("idle");
    setExportPass("");
    setOutput("");
    setCopied(false);
    setImportText("");
    setImportPass("");
    setNeedsPass(false);
    setMessage("");
    setRestored(false);
  };

  const makeBackup = async () => {
    setOutput(await createBackup(exportPass.trim() || undefined));
  };

  const download = async () => {
    await saveBackupFile(output);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the textarea is selectable as a fallback */
    }
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImportText(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  const restore = async () => {
    setMessage("");
    const result = await restoreBackup(importText.trim(), importPass.trim() || undefined);
    if (result.ok) {
      setRestored(true);
      setMessage("Restored. Your data has been replaced.");
    } else {
      setNeedsPass(!!result.needsPassphrase);
      setMessage(result.error ?? "Could not restore this file.");
    }
  };

  const fieldCls =
    "w-full rounded-xl border border-border bg-[var(--bg)] px-4 py-3 text-base text-text placeholder:text-text-dim/70 focus:border-gold-muted focus:outline-none";
  const btnGhost =
    "rounded-2xl border border-border px-5 py-3 text-[0.9rem] text-text-soft transition-colors hover:border-gold-muted";

  if (mode === "idle") {
    return (
      <div className="mt-4 flex gap-2.5">
        <button type="button" onClick={() => setMode("export")} className={`flex-1 ${btnGhost}`}>
          Back up
        </button>
        <button type="button" onClick={() => setMode("import")} className={`flex-1 ${btnGhost}`}>
          Restore
        </button>
      </div>
    );
  }

  if (mode === "export") {
    return (
      <div className="fade-in mt-4 rounded-2xl border border-border bg-surface px-5 py-5">
        <p className="text-[0.9rem] text-text-soft">
          Save a copy of all your data to a file. Add a passphrase to encrypt it
          (recommended) — you&rsquo;ll need it to restore.
        </p>
        <input
          type="password"
          value={exportPass}
          onChange={(e) => setExportPass(e.target.value)}
          placeholder="Passphrase (optional)"
          className={`mt-4 ${fieldCls}`}
        />
        {!output ? (
          <button
            type="button"
            onClick={makeBackup}
            className="mt-3 w-full rounded-2xl px-5 py-3 text-[0.92rem] font-medium"
            style={{ backgroundColor: "var(--gold)", color: "#1a1305" }}
          >
            Create backup
          </button>
        ) : (
          <>
            <div className="mt-3 flex gap-2.5">
              <button type="button" onClick={download} className={`flex-1 ${btnGhost}`}>
                Download
              </button>
              <button type="button" onClick={copy} className={`flex-1 ${btnGhost}`}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              onFocus={(e) => e.currentTarget.select()}
              rows={4}
              className="mt-3 w-full resize-none rounded-xl border border-border bg-[var(--bg)] px-4 py-3 font-mono text-[0.72rem] leading-relaxed text-text-dim focus:outline-none"
            />
          </>
        )}
        <button type="button" onClick={reset} className="mt-3 text-[0.85rem] text-text-dim">
          Done
        </button>
      </div>
    );
  }

  // import
  return (
    <div className="fade-in mt-4 rounded-2xl border border-border bg-surface px-5 py-5">
      {restored ? (
        <>
          <p className="text-[0.92rem] text-gold">{message}</p>
          <button type="button" onClick={reset} className="mt-3 text-[0.85rem] text-text-dim">
            Done
          </button>
        </>
      ) : (
        <>
          <p className="text-[0.9rem] text-text-soft">
            Restore from a backup file. <span className="text-[#d98a8a]">This replaces
            all current data on this device.</span>
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".json,.txt,application/json,text/plain"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`mt-4 w-full ${btnGhost}`}
          >
            Choose backup file
          </button>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={3}
            placeholder="…or paste backup text here"
            className="mt-3 w-full resize-none rounded-xl border border-border bg-[var(--bg)] px-4 py-3 font-mono text-[0.72rem] leading-relaxed text-text placeholder:text-text-dim/70 focus:border-gold-muted focus:outline-none"
          />
          {needsPass && (
            <input
              type="password"
              value={importPass}
              onChange={(e) => setImportPass(e.target.value)}
              placeholder="Passphrase"
              className={`mt-3 ${fieldCls}`}
            />
          )}
          {message && <p className="mt-3 text-[0.85rem] text-[#d98a8a]">{message}</p>}
          <button
            type="button"
            onClick={restore}
            disabled={!importText.trim()}
            className="mt-3 w-full rounded-2xl px-5 py-3 text-[0.92rem] font-medium disabled:opacity-40"
            style={{ backgroundColor: "var(--gold)", color: "#1a1305" }}
          >
            Restore
          </button>
          <button type="button" onClick={reset} className="mt-3 text-[0.85rem] text-text-dim">
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
