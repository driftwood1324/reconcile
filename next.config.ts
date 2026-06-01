import type { NextConfig } from "next";

// GitHub Pages serves this project repo from the `/reconcile` sub-path, so the
// CI build sets GITHUB_PAGES=true to prefix every asset/route accordingly. The
// Capacitor/iOS build and local `next build` leave it unset and serve from root
// (WKWebView loads `out/` at `/`), so basePath must stay conditional.
const basePath = process.env.GITHUB_PAGES === "true" ? "/reconcile" : "";

const nextConfig: NextConfig = {
  // Static HTML export — required by Capacitor (serves the `out/` folder) and a
  // clean fit since Reconcile has no backend (all state lives in localStorage).
  output: "export",
  images: { unoptimized: true },
  // Helps static hosting / Capacitor's WKWebView resolve nested routes.
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
