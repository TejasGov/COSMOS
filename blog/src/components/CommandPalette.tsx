"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

/** Minimal shape the palette needs — passed in from the server layout. */
export interface PaletteEntry {
  title: string;
  slug: string;
  tag: string;
  date: string; // display format 2026.09.28
}

/**
 * CommandPalette — ⌘K / Ctrl+K search over the essay index.
 * Deliberately austere: hairline box, mono metadata, no glassmorphism,
 * no scale/fade theatrics. Keyboard-first (↑ ↓ Enter Esc).
 */
export default function CommandPalette({ essays }: { essays: PaletteEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Filter by title/tag, keep index order (newest first). */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return essays.slice(0, 8);
    return essays
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) || e.tag.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, essays]);

  // Global shortcut: ⌘K / Ctrl+K toggles; "/" opens too (editorial habit).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the field each time the palette opens; reset state on close.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // Defer one frame so the element exists after mount.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter" && results[active]) {
        setOpen(false);
      }
    },
    [results, active]
  );

  return (
    <>
      {/* Header trigger — looks like plain nav text with a mono hint chip */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Open search (Command K)"
        className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
      >
        <Search className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded-[2px] border border-hairline px-1.5 py-0.5 text-[10px] leading-none dark:border-nighthairline sm:inline">
          ⌘K
        </kbd>
      </button>

      {open ? (
        // Backdrop is a flat dim wash — no blur, no frosted glass.
        <div
          className="fixed inset-0 z-50 bg-black/30 dark:bg-black/60"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search essays"
        >
          {/* Stop propagation so clicks inside don't close the palette */}
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className="mx-auto mt-[12vh] w-[min(560px,92vw)] border border-hairline bg-canvas shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-nighthairline dark:bg-[#101012]"
          >
            {/* Input row */}
            <div className="flex items-center gap-3 border-b border-hairline px-4 dark:border-nighthairline">
              <Search className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Filter essays…"
                className="w-full bg-transparent py-3.5 font-serif text-base text-ink outline-none placeholder:text-muted dark:text-[#ededed]"
                aria-label="Search query"
              />
              <kbd className="font-mono text-[10px] uppercase text-muted">Esc</kbd>
            </div>

            {/* Results */}
            <ul className="max-h-[45vh] overflow-y-auto py-1" role="listbox">
              {results.length === 0 ? (
                <li className="px-4 py-6 font-mono text-xs text-muted">
                  No essays match “{query}”.
                </li>
              ) : (
                results.map((e, i) => (
                  <li key={e.slug} role="option" aria-selected={i === active}>
                    <Link
                      href={`/essays/${e.slug}`}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-baseline justify-between gap-4 px-4 py-2.5 transition-colors duration-75 ${
                        i === active ? "bg-surface dark:bg-nightsurface" : ""
                      }`}
                    >
                      <span className="truncate text-sm text-ink dark:text-[#ededed]">
                        {e.title}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted">
                        {e.tag} · {e.date}
                      </span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
