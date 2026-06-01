import Link from "next/link";

export const metadata = {
  title: "Privacy — Reconcile",
  description: "Reconcile collects nothing. All data stays on your device.",
};

// A short, plain-language policy. Apple requires a reachable privacy-policy URL
// for every App Store listing; this page is that URL on the public site.
export default function PrivacyPage() {
  return (
    <div className="fade-in pb-4">
      <h1 className="font-serif text-3xl text-text">Privacy</h1>
      <p className="mt-2 text-[0.82rem] text-text-dim">Last updated May 31, 2026</p>

      <section className="mt-7 space-y-4 text-[0.95rem] leading-relaxed text-text-soft">
        <p>
          <span className="text-gold">Reconcile collects nothing.</span> There is
          no account, no server, and no analytics. Everything you enter stays on
          your device.
        </p>

        <div>
          <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
            What is stored
          </h2>
          <p className="mt-2">
            Your confession history (dates and any optional notes), your private
            notes, and your settings are saved in this app&rsquo;s local storage
            on your device. Nothing is uploaded.
          </p>
        </div>

        <div>
          <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
            What leaves your device
          </h2>
          <p className="mt-2">
            Nothing. Reconcile makes no network requests with your data, contacts
            no third parties, and uses no advertising or tracking. Fonts are
            bundled into the app, so even page rendering needs no outside
            connection. The app works fully offline.
          </p>
        </div>

        <div>
          <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
            Reminders
          </h2>
          <p className="mt-2">
            If you turn on reminders, the notification is scheduled locally by
            your device&rsquo;s operating system. No reminder data is sent to any
            server.
          </p>
        </div>

        <div>
          <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
            Deleting your data
          </h2>
          <p className="mt-2">
            Use <span className="text-text">Clear all data</span> in Settings to
            erase everything permanently, or delete the app. Because the data is
            only on your device, there is nothing for us to delete on our end —
            we never had it.
          </p>
        </div>

        <div>
          <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-text-dim">
            Contact
          </h2>
          <p className="mt-2">
            Questions about this policy? Email{" "}
            <a className="text-gold underline-offset-2 hover:underline" href="mailto:aethreal@proton.me">
              aethreal@proton.me
            </a>
            .
          </p>
        </div>
      </section>

      <div className="mt-8">
        <Link
          href="/settings"
          className="inline-block rounded-2xl border border-border px-6 py-3 text-[0.92rem] text-text-soft transition-colors hover:border-gold-muted"
        >
          Back to Settings
        </Link>
      </div>
    </div>
  );
}
