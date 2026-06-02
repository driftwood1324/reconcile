/**
 * Local backup & restore. Produces a single text file containing all of the
 * user's data so it can be saved or moved to a new device — with no server
 * involved. If a passphrase is given, the data is encrypted with AES-256-GCM
 * (key derived via PBKDF2), so the backup file is safe to store anywhere.
 */
import { exportSnapshot, importSnapshot, type Snapshot } from "./storage";

interface Envelope {
  app: "reconcile";
  v: 1;
  enc: boolean;
  /** base64 — present when enc is true */
  salt?: string;
  iv?: string;
  /** ciphertext (base64) when enc, otherwise the raw snapshot */
  data: string | Snapshot;
}

const b64 = {
  encode: (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)),
  decode: (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)),
};

async function deriveKey(passphrase: string, salt: BufferSource): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 150_000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Build a backup string. With a passphrase, the payload is encrypted. */
export async function createBackup(passphrase?: string): Promise<string> {
  const snapshot = exportSnapshot();

  if (!passphrase) {
    const env: Envelope = { app: "reconcile", v: 1, enc: false, data: snapshot };
    return JSON.stringify(env, null, 2);
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const plaintext = new TextEncoder().encode(JSON.stringify(snapshot));
  const cipher = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext),
  );

  const env: Envelope = {
    app: "reconcile",
    v: 1,
    enc: true,
    salt: b64.encode(salt),
    iv: b64.encode(iv),
    data: b64.encode(cipher),
  };
  return JSON.stringify(env, null, 2);
}

export interface RestoreResult {
  ok: boolean;
  error?: string;
  /** True when the file is encrypted and a passphrase is required. */
  needsPassphrase?: boolean;
}

/** Restore from a backup string, decrypting if a passphrase is supplied. */
export async function restoreBackup(
  text: string,
  passphrase?: string,
): Promise<RestoreResult> {
  let env: Envelope;
  try {
    env = JSON.parse(text) as Envelope;
  } catch {
    return { ok: false, error: "This doesn't look like a Reconcile backup file." };
  }
  if (env?.app !== "reconcile" || env.v !== 1) {
    return { ok: false, error: "Unrecognized or unsupported backup file." };
  }

  let snapshot: Partial<Snapshot>;
  if (env.enc) {
    if (!passphrase) return { ok: false, needsPassphrase: true, error: "This backup is encrypted." };
    try {
      const salt = b64.decode(env.salt!);
      const iv = b64.decode(env.iv!);
      const key = await deriveKey(passphrase, salt);
      const plain = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        b64.decode(env.data as string),
      );
      snapshot = JSON.parse(new TextDecoder().decode(plain)) as Snapshot;
    } catch {
      return { ok: false, needsPassphrase: true, error: "Wrong passphrase, or the file is damaged." };
    }
  } else {
    snapshot = env.data as Snapshot;
  }

  importSnapshot(snapshot);
  return { ok: true };
}
