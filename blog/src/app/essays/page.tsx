import type { Metadata } from "next";
import ArticleRow from "@/components/ArticleRow";
import { getAllEssays } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Essays",
  description: "Complete index of published essays.",
};

/**
 * /essays — the full archive. Same table grammar as the home feed, minus
 * the hero; grouped by year with a mono year marker in the left gutter.
 */
export default function EssaysPage() {
  const essays = getAllEssays();

  // Group newest-first list into { "2026": [...], "2025": [...] } buckets.
  const byYear = essays.reduce<Record<string, typeof essays>>((acc, e) => {
    const year = e.frontmatter.date.slice(0, 4);
    (acc[year] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Breadcrumb — mono, hairline separated */}
      <p className="font-mono text-xs uppercase tracking-wide text-muted">
        index_ / essays
      </p>

      <h1 className="mt-4 font-serif text-4xl font-bold tracking-tighter text-ink dark:text-[#f5f5f5]">
        Essays
      </h1>
      <p className="mt-3 max-w-[52ch] font-serif text-base text-muted">
        Everything, newest first. {essays.length} pieces total.
      </p>

      {/* Year-grouped tables */}
      <div className="mt-12 space-y-14">
        {Object.entries(byYear).map(([year, list]) => (
          <section key={year} aria-label={`Essays from ${year}`}>
            <h2 className="mb-3 border-b border-hairline pb-2 font-mono text-[10px] uppercase tracking-widest text-muted dark:border-nighthairline">
              {year}
            </h2>
            <ol>
              {list.map((essay, i) => (
                <ArticleRow
                  key={essay.slug}
                  essay={essay}
                  index={essays.indexOf(essay) + 1 || i + 1}
                />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
