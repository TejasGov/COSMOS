import Link from "next/link";

/**
 * Footer — quiet mono metadata strip. Hairline top border, three columns:
 * colophon (left), sitemap (center), RSS/contact (right). No decoration.
 */
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline dark:border-nighthairline">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-8 font-mono text-xs text-muted sm:flex-row sm:items-baseline sm:justify-between sm:px-6">
        <p>
          © 2026 index_ — set in Newsreader &amp; JetBrains Mono.
        </p>
        <nav aria-label="Footer" className="flex gap-5">
          <Link
            href="/essays"
            className="transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
          >
            Essays
          </Link>
          <Link
            href="/projects"
            className="transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
          >
            Projects
          </Link>
          <Link
            href="/rss.xml"
            className="transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
          >
            RSS
          </Link>
        </nav>
      </div>
    </footer>
  );
}
