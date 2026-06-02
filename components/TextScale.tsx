"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/useSettings";

/**
 * Applies the user's text-size preference by scaling the root font size. The app
 * sizes type in rem, so this scales everything proportionally. Renders nothing.
 */
export default function TextScale() {
  const { settings } = useSettings();

  useEffect(() => {
    document.documentElement.style.fontSize =
      settings.textSize === "large" ? "18px" : "";
  }, [settings.textSize]);

  return null;
}
