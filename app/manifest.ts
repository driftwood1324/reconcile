import type { MetadataRoute } from "next";

// The GitHub Pages build serves from the `/reconcile` sub-path, so manifest
// URLs (which are resolved against the origin, not the manifest location) must
// carry the same prefix. Native/local builds leave it empty. Mirrors the
// basePath logic in next.config.ts.
const basePath = process.env.GITHUB_PAGES === "true" ? "/reconcile" : "";

// Required so the manifest is emitted as a static file under `output: export`.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Reconcile",
    short_name: "Reconcile",
    description: "A quiet companion for the Sacrament of Confession.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#080d1a",
    theme_color: "#080d1a",
    orientation: "portrait",
    icons: [
      { src: `${basePath}/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${basePath}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${basePath}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
