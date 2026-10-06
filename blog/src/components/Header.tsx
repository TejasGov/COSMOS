import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import CommandPalette, { type PaletteEntry } from "./CommandPalette";

/**
 * SiteHeader — sticky 52px bar with a single hairline bottom border.
 * Left: mono text logo. Right: nav links (mono, uppercase, small) + ⌘K + theme.
 * Receives pre-serialized essay data so the palette stays a leaf client island.
 */
export default function Header({ essays }: { essays: PaletteEntry[] }) {
  return (
    // Flat opaque background — deliberately NO blur/glass effects.
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas dark:border-nighthairline dark:bg-nightcanvas">
      <div className="mx-auto flex h-[52px] max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* Logo — tight mono, lowercase editorial mark */}
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-ink transition-colors duration-100 hover:text-accent dark:text-[#ededed] dark:hover:text-accent-dark"
        >
          index<span className="text-muted">_</span>
        </Link>

        {/* Navigation */}
        <nav
          aria-label="Primary"
          className="flex items-center gap-5 sm:gap-7"
        >
          <Link
            href="/essays"
            className="font-mono text-xs uppercase tracking-wide text-muted transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
          >
            Essays
          </Link>
          <Link
            href="/projects"
            className="font-mono text-xs uppercase tracking-wide text-muted transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="hidden font-mono text-xs uppercase tracking-wide text-muted transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark sm:inline"
          >
            About
          </Link>

          {/* Search / ⌘K */}
          <CommandPalette essays={essays} />

          {/* Inline theme toggle */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
