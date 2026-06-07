import { afterEach, vi } from "vitest";

Object.defineProperty(globalThis, "crypto", {
  value: globalThis.crypto,
  configurable: true,
});

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  vi.restoreAllMocks();
  vi.resetModules();
});
