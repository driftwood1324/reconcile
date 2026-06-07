import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

let resolveInitialize: (() => void) | undefined;
let initialized = false;

vi.mock("@/lib/lock", () => ({
  initializeLockStorage: vi.fn(
    () =>
      new Promise<void>((resolve) => {
        resolveInitialize = () => {
          initialized = true;
          resolve();
        };
      }),
  ),
  getLockConfig: vi.fn(() => (initialized ? null : { enabled: true, hash: "hash", salt: "salt" })),
  isUnlocked: vi.fn(() => false),
  markUnlocked: vi.fn(),
  subscribeLock: vi.fn(() => () => {}),
}));

vi.mock("./LockScreen", () => ({
  default: () => React.createElement("div", null, "Locked"),
}));

describe("LockGate", () => {
  beforeEach(() => {
    resolveInitialize = undefined;
    initialized = false;
  });

  it("does not render private app content until lock storage has initialized", async () => {
    const { default: LockGate } = await import("./LockGate");
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(React.createElement(LockGate, null, "Private confession note"));
    });

    expect(container.textContent).not.toContain("Private confession note");

    await act(async () => {
      resolveInitialize?.();
    });

    expect(container.textContent).toContain("Private confession note");
  });
});
