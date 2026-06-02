"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, type UIKey } from "@/lib/i18n";

interface NavItem {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const LABEL_KEY: Record<string, UIKey> = {
  "/": "nav.home",
  "/examine": "nav.examine",
  "/contrition": "nav.contrition",
  "/resources": "nav.resources",
  "/notes": "nav.notes",
};

const stroke = (active: boolean) => (active ? "var(--gold)" : "var(--text-dim)");

const NAV: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: (a) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke(a)} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20h14V9.5" />
      </svg>
    ),
  },
  {
    href: "/examine",
    label: "Examine",
    icon: (a) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke(a)} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h11" />
        <path d="M4 12h11" />
        <path d="M4 19h7" />
        <circle cx="18.5" cy="17.5" r="2.5" />
        <path d="m21 20 1.5 1.5" />
      </svg>
    ),
  },
  {
    href: "/contrition",
    label: "Contrition",
    icon: (a) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke(a)} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="7" y1="9" x2="17" y2="9" />
      </svg>
    ),
  },
  {
    href: "/resources",
    label: "Resources",
    icon: (a) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke(a)} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V4.5Z" />
        <path d="M8 3v14" />
        <path d="M4 17.5A1.5 1.5 0 0 1 5.5 16H20" />
      </svg>
    ),
  },
  {
    href: "/notes",
    label: "Notes",
    icon: (a) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke(a)} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3.5h9L19 8v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
        <path d="M13.5 3.5V8H19" />
        <path d="M8 12.5h7M8 16h5" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border backdrop-blur-md"
      style={{ backgroundColor: "color-mix(in srgb, var(--bg) 92%, transparent)" }}
    >
      <div
        className="mx-auto flex max-w-[var(--container-app)] items-stretch justify-around"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 pt-3 transition-colors"
            >
              {item.icon(active)}
              <span
                className="text-[11px] tracking-wide"
                style={{ color: active ? "var(--gold)" : "var(--text-dim)" }}
              >
                {t(LABEL_KEY[item.href])}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
