import { App } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { lockNow } from "./lock";
import { flushPersistentWrites } from "./persistentStore";

let handle: PluginListenerHandle | null = null;

function setPrivacyShield(enabled: boolean): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("privacy-shield", enabled);
}

export async function installLockLifecycle(): Promise<() => Promise<void>> {
  if (handle) {
    return async () => {
      await handle?.remove();
      handle = null;
    };
  }

  handle = await App.addListener("appStateChange", ({ isActive }) => {
    if (!isActive) {
      setPrivacyShield(true);
      lockNow();
      void flushPersistentWrites();
      return;
    }
    setPrivacyShield(false);
  });

  return async () => {
    await handle?.remove();
    handle = null;
    setPrivacyShield(false);
  };
}
