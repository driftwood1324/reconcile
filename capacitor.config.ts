import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.reconcile.app",
  appName: "Reconcile",
  // Capacitor loads the static export produced by `next build`.
  webDir: "out",
  ios: {
    // Match the deep-navy base so there is no white flash on launch.
    backgroundColor: "#080d1a",
    contentInset: "always",
  },
};

export default config;
