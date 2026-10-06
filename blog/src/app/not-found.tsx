import Link from "next/link";

/**
 * 404 — deliberately understated. One mono line, one link. The grid is the
 * brand; even the error page obeys it.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start px-4 py-32 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        Error 404
      </p>
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tighter text-ink dark:text-[#f5f5f5]">
        This entry isn&apos;t in the index.
      </h1>
      <Link
        href="/"
        className="mt-8 font-mono text-xs text-accent underline underline-offset-4 transition-colors duration-100 hover:text-accent dark:text-accent-dark"
      >
        ← Back to the index
      </Link>
    </div>
  );
}
