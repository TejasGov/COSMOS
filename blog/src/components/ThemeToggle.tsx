"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

/**
 * ThemeToggle — inline light/dark switch in the header.
 * Cycles: system → light → dark → system. Preference persists in
 * localStorage("theme"); the actual <html class="dark"> mutation happens in
 * an inline script in layout.tsx before first paint (zero flash / zero CLS).
 */
export default function ThemeToggle() {
  const [pref, setPref] = useState<"system" | "light" | "dark">("system");

  // Hydrate the stored preference after mount (server renders default).
  useEffect(() => {
    const stored = localStorage.getItem("theme") as typeof pref | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      setPref(stored);
    }
  }, []);

  function cycle() {
    const next =
      pref === "system" ? "light" : pref === "light" ? "dark" : "system";
    setPref(next);
    localStorage.setItem("theme", next);
    // Re-apply immediately: remove class for light/system-light, add for dark.
    const root = document.documentElement;
    if (next === "dark") root.classList.add("dark");
    else if (next === "light") root.classList.remove("dark");
    else {
      root.classList.toggle(
        "dark",
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
  }

  const Icon = pref === "dark" ? Moon : pref === "light" ? Sun : Monitor;
  const label =
    pref === "system"
      ? "Theme: following system"
      : pref === "dark"
        ? "Theme: dark"
        : "Theme: light";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${label} — click to change`}
      title={label}
      className="flex h-8 w-8 items-center justify-center text-muted transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}
