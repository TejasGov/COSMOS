import type { Metadata } from "next";
import Link from "next/link";
import ArticleRow from "@/components/ArticleRow";
import { getAllEssays } from "@/lib/posts";

export const metadata: Metadata = {
  title: "index_ — Essays on craft, type & engineering",
};

/**
 * Home / The Index.
 * Hero: two-line thesis in tight display type. Below it, the full essay
 * table — no cards, no carousels; the list IS the product.
 */
export default function HomePage() {
  const essays = getAllEssays();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {/* ---- Hero: stark scale contrast, tracking-tight ------------------ */}
      <section className="pb-14 pt-20 sm:pt-28">
        <h1 className="max-w-[18ch] font-serif text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[1.02] tracking-tighter text-ink dark:text-[#f5f5f5]">
          Writing about type, code, and the discipline of&nbsp;less.
        </h1>
        <p className="mt-6 max-w-[52ch] font-serif text-lg leading-relaxed text-muted">
          I&apos;m Mara Voss — a front-end engineer and typographer. These are
          working notes on building software that reads like it was set by hand.
        </p>
        <p className="mt-8 font-mono text-xs uppercase tracking-wide text-muted">
          {essays.length} essays · updated{" "}
          <time dateTime={essays[0]?.frontmatter.date}>
            {essays[0]?.formattedDate ?? "—"}
          </time>
        </p>
      </section>

      {/* ---- Index table -------------------------------------------------- */}
      <section aria-label="Essay index">
        {/* Column header row — mono micro-type, hairline under */}
        <div className="hidden items-baseline gap-x-6 border-b border-hairline px-4 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted dark:border-nighthairline sm:px-6 md:flex">
          <span className="w-10 shrink-0">No.</span>
          <span className="w-[6.5rem] shrink-0">Date</span>
          <span className="flex-1">Title</span>
          <span className="hidden w-24 shrink-0 lg:inline">Tag</span>
          <span className="w-16 shrink-0 text-right">Min</span>
          <span className="w-4 shrink-0" aria-hidden />
        </div>

        <ol>
          {essays.map((essay, i) => (
            <ArticleRow key={essay.slug} essay={essay} index={i + 1} />
          ))}
        </ol>

        {/* Quiet pointer to the archive view */}
        <p className="pt-8 font-mono text-xs text-muted">
          <Link
            href="/essays"
            className="transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
          >
            Full archive →
          </Link>
        </p>
      </section>
    </div>
  );
}
