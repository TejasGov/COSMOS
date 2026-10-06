import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Essay } from "@/lib/posts";

/**
 * ArticleRow — one entry in the editorial index table.
 * Grid columns: [No.] [Date] [Title + summary] [Tag] [Read time] [→]
 * Hover: subtle surface wash + arrow slides 4px (fast, non-bouncy).
 */
export default function ArticleRow({
  essay,
  index,
}: {
  essay: Essay;
  /** 1-based position, rendered as [01], [02] … in mono. */
  index: number;
}) {
  const num = String(index).padStart(2, "0");

  return (
    <li className="group/row border-b border-hairline last:border-b-0 dark:border-nighthairline">
      <Link
        href={`/essays/${essay.slug}`}
        aria-label={`Read ${essay.frontmatter.title}`}
        // Negative margins keep the hover wash flush to the container edges
        // while the link hit area extends into the gutter padding.
        className="-mx-4 flex items-baseline gap-x-6 px-4 py-5 transition-colors duration-100 sm:-mx-6 sm:px-6 hover:bg-surface dark:hover:bg-nightsurface"
      >
        {/* Article number */}
        <span className="hidden w-10 shrink-0 font-mono text-xs text-muted md:inline">
          [{num}]
        </span>

        {/* Date */}
        <time
          dateTime={essay.frontmatter.date}
          className="w-[6.5rem] shrink-0 font-mono text-xs text-muted"
        >
          {essay.formattedDate}
        </time>

        {/* Title + deck */}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-lg font-medium leading-snug tracking-tight text-ink dark:text-[#ededed]">
            {essay.frontmatter.title}
          </span>
          {essay.frontmatter.summary ? (
            <span className="mt-1 hidden max-w-prose truncate font-serif text-sm text-muted sm:block">
              {essay.frontmatter.summary}
            </span>
          ) : null}
        </span>

        {/* Tag */}
        <span className="hidden w-24 shrink-0 font-mono text-xs uppercase tracking-wide text-muted lg:inline">
          {essay.frontmatter.tag}
        </span>

        {/* Read time */}
        <span className="w-16 shrink-0 text-right font-mono text-xs text-muted">
          {essay.readTime}
        </span>

        {/* Understated arrow indicator — appears on hover/focus only */}
        <ArrowRight
          aria-hidden
          className="w-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-150 group-hover/row:translate-x-0 group-hover/row:opacity-100 group-focus-visible/row:translate-x-0 group-focus-visible/row:opacity-100 text-accent dark:text-accent-dark"
        />
      </Link>
    </li>
  );
}
