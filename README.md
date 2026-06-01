# Reconcile

A quiet, mobile-first companion for the Sacrament of Confession. Deep-navy dark
mode, gold accent, Lora + Inter. All data is stored locally on the device — no
account, no server, no backend.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, exported as a
static site and wrapped with **Capacitor** for iOS App Store distribution.

## Screens

- **Home** — Time since last confession, a single "I just went to confession"
  flow (confirm → optional note → "grace received"), and a history log.
- **Examine** — Examination of conscience: Quick, Traditional (Ten Commandments),
  and Married Man, each as an accordion.
- **Contrition** — Act of Contrition in Traditional, Contemporary, and Brief forms.
- **Settings** — Reminder interval, local-only data panel, and clear-all-data.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build (static export)

```bash
npm run build    # emits ./out  (output: 'export' in next.config.ts)
```

The `out/` folder is what Capacitor ships. There is no server runtime.

## Data

Everything lives in `localStorage` under two keys (`reconcile.confessions`,
`reconcile.settings`), centralized in [`lib/storage.ts`](lib/storage.ts). Clearing
app data or using "Clear all data" in Settings removes it permanently.

---

## iOS / App Store

Capacitor is configured in [`capacitor.config.ts`](capacitor.config.ts)
(`appId: com.reconcile.app`, `webDir: out`). **The Windows machine can do
everything up to the native build.** The final compile, code-sign, and upload
require **macOS + Xcode + an Apple Developer Program membership ($99/yr)** — Apple
does not allow iOS builds on Windows.

### One-time setup

```bash
npm install
npm run build          # produce ./out
npx cap add ios        # creates the native ./ios project (run on macOS)
```

### Each release (macOS)

```bash
npm run build
npx cap sync ios       # copy the latest web build into the iOS project
npx cap open ios       # opens ios/App/App.xcworkspace in Xcode
```

Then in Xcode:

1. Select the **App** target → **Signing & Capabilities** → choose your Team
   (your Apple Developer account) and set the Bundle Identifier (`com.reconcile.app`).
2. Add the app icon and launch screen (a single 1024×1024 master is enough;
   Capacitor's asset tooling can generate the rest).
3. **Product → Archive**, then distribute via **App Store Connect**.

### No Mac?

Use a cloud-macOS CI to run the Xcode build and upload:

- **Codemagic** (`codemagic.io`) — native Capacitor/Ionic support.
- **Ionic Appflow** — built by the Capacitor team.

You'll still need an Apple Developer account and signing certificates; both
services walk you through uploading them.

### Notes

- Push notifications are **not implemented yet**. The reminder interval in
  Settings is persisted for a future version.
- Because there is no backend, the app works fully offline once installed.
