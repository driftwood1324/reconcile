// Generates every raster icon/splash from a single vector source so the brand
// mark (a thin gold Latin cross on deep navy) stays identical everywhere:
//   - app/apple-icon.png          Safari / iOS home-screen touch icon
//   - public/icon-192/512.png     PWA manifest icons (web add-to-home-screen)
//   - assets/*                     master set consumed by `@capacitor/assets`
//                                  to emit the native iOS icon + splash sets
//
// Run with:  node scripts/gen-assets.mjs   (needs the dev-dependency `sharp`)
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const NAVY = "#080d1a";
const GOLD = "#c9a96e";

// Cross geometry expressed as fractions of the canvas, scaled about the centre.
// Matches components/Cross.tsx: a tall vertical bar with the crossbar in the
// upper third.
function cross(size, scale) {
  const c = size / 2;
  const halfH = 0.236 * size * scale;
  const halfW = 0.148 * size * scale;
  const barOffset = 0.1 * size * scale; // crossbar sits above centre
  const sw = 0.037 * size * scale;
  return `<g stroke="${GOLD}" stroke-width="${sw}" stroke-linecap="round">
    <line x1="${c}" y1="${c - halfH}" x2="${c}" y2="${c + halfH}"/>
    <line x1="${c - halfW}" y1="${c - barOffset}" x2="${c + halfW}" y2="${c - barOffset}"/>
  </g>`;
}

const svg = (size, { bg = NAVY, scale = 1, withCross = true } = {}) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      (bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : "") +
      (withCross ? cross(size, scale) : "") +
      `</svg>`,
  );

const iconMaster = svg(1024); // full-bleed navy + cross
const foreground = svg(1024, { bg: null, scale: 0.62 }); // Android adaptive safe zone
const background = svg(1024, { withCross: false }); // Android adaptive background
const splashMaster = svg(2732, { scale: 0.28 }); // small centred mark

mkdirSync(join(root, "assets"), { recursive: true });
mkdirSync(join(root, "public"), { recursive: true });

const png = (buf, size) => sharp(buf).resize(size, size).png();

await Promise.all([
  // Web
  png(iconMaster, 180).toFile(join(root, "app/apple-icon.png")),
  png(iconMaster, 192).toFile(join(root, "public/icon-192.png")),
  png(iconMaster, 512).toFile(join(root, "public/icon-512.png")),
  // Capacitor master set (consumed by @capacitor/assets on macOS)
  png(iconMaster, 1024).toFile(join(root, "assets/icon-only.png")),
  png(foreground, 1024).toFile(join(root, "assets/icon-foreground.png")),
  png(background, 1024).toFile(join(root, "assets/icon-background.png")),
  png(splashMaster, 2732).toFile(join(root, "assets/splash.png")),
  png(splashMaster, 2732).toFile(join(root, "assets/splash-dark.png")),
]);

console.log("Generated app/apple-icon.png, public/icon-192/512.png, assets/*");
