import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { renderMarkdown } from "@/lib/markdown";
import { getAllEssays, getEssayBySlug } from "@/lib/posts";

/** Fully static generation: every essay is rendered at build time. */
export function generateStaticParams() {
  return getAllEssays().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) return { title: "Not found" };
  return {
    title: essay.frontmatter.title,
    description: essay.frontmatter.summary,
  };
}

/**
 * Reading view — single column, max-w-[700px] for optimal cadence.
 * Header metadata (category / date / words / read time) is pure mono.
 */
export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) notFound();

  const { frontmatter } = essay;

  // Prev/next navigation within the newest-first index.
  const all = getAllEssays();
  const idx = all.findIndex((e) => e.slug === essay.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <article className="mx-auto max-w-[700px] px-4 py-16 sm:px-6">
      {/* ---- Breadcrumb -------------------------------------------------- */}
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs uppercase tracking-wide text-muted"
      >
        <Link href="/" className="hover:text-accent dark:hover:text-accent-dark">
          index_
        </Link>{" "}
        /{" "}
        <Link
          href="/essays"
          className="hover:text-accent dark:hover:text-accent-dark"
        >
          essays
        </Link>{" "}
        / <span className="text-ink dark:text-[#ededed]">{frontmatter.tag}</span>
      </nav>

      {/* ---- Title -------------------------------------------------------- */}
      <header className="mt-8">
        <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.08] tracking-tighter text-ink dark:text-[#f5f5f5]">
          {frontmatter.title}
        </h1>

        {/* Mono metadata strip: date · tag · words · read time */}
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-b border-hairline pb-6 font-mono text-xs text-muted dark:border-nighthairline">
          <div className="flex gap-2">
            <dt className="uppercase tracking-wide opacity-70">Published</dt>
            <dd>
              <time dateTime={frontmatter.date}>{essay.formattedDate}</time>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="uppercase tracking-wide opacity-70">Category</dt>
            <dd className="uppercase">{frontmatter.tag}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="uppercase tracking-wide opacity-70">Words</dt>
            <dd>{essay.words.toLocaleString("en-US")}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="uppercase tracking-wide opacity-70">Read</dt>
            <dd>{essay.readTime}</dd>
          </div>
        </dl>

        {frontmatter.summary ? (
          <p className="mt-6 font-serif text-lg italic leading-relaxed text-muted">
            {frontmatter.summary}
          </p>
        ) : null}
      </header>

      {/* ---- Body --------------------------------------------------------- */}
      <section className="prose-editorial mt-10">
        {renderMarkdown(essay.content)}
      </section>

      {/* ---- Footer nav --------------------------------------------------- */}
      <nav
        aria-label="Adjacent essays"
        className="mt-16 grid grid-cols-2 gap-4 border-t border-hairline pt-6 font-mono text-xs dark:border-nighthairline"
      >
        <div>
          {older ? (
            <Link
              href={`/essays/${older.slug}`}
              className="block text-muted transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
            >
              ← Older<br />
              <span className="text-ink dark:text-[#ededed]">
                {older.frontmatter.title}
              </span>
            </Link>
          ) : (
            <span className="text-muted opacity-50">← End of archive</span>
          )}
        </div>
        <div className="text-right">
          {newer ? (
            <Link
              href={`/essays/${newer.slug}`}
              className="block text-muted transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
            >
              Newer →<br />
              <span className="text-ink dark:text-[#ededed]">
                {newer.frontmatter.title}
              </span>
            </Link>
          ) : (
            <span className="text-muted opacity-50">Latest entry →</span>
          )}
        </div>
      </nav>
    </article>
  );
}
