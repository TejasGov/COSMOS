import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Who writes here, and why the page looks like this.",
};

/**
 * /about — a single narrow column of prose plus a mono colophon table.
 * The colophon documents the design system itself (typefaces, palette,
 * stack) — an engineer's version of a print imprint.
 */
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[700px] px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-muted">
        index_ / about
      </p>

      <h1 className="mt-4 font-serif text-4xl font-bold tracking-tighter text-ink dark:text-[#f5f5f5]">
        About
      </h1>

      {/* Prose body reuses the reading-view styles for consistency. */}
      <section className="prose-editorial mt-8">
        <p>
          I&apos;m <strong>Mara Voss</strong>, a front-end engineer working at
          the seam between typography and software. For a decade I built
          publishing tools for newsrooms; now I build smaller things and write
          about them here.
        </p>
        <p>
          This site is an argument that a blog can be a <em>table of
          contents</em> rather than a gallery of cards. No hero images, no
          cookie banners, no infinite scroll — one grid, two typefaces, one
          blue. If it reads well on a five-year-old phone, it works.
        </p>
        <p>
          Essays live in Markdown files next to the source. Reading times are
          computed at build time; nothing here needs a database.
        </p>
      </section>

      {/* Colophon — hairline definition list in mono */}
      <h2 className="mt-14 border-b border-hairline pb-2 font-mono text-[10px] uppercase tracking-widest text-muted dark:border-nighthairline">
        Colophon
      </h2>
      <dl className="mt-4 grid grid-cols-[8rem_1fr] gap-y-2 font-mono text-xs">
        {[
          ["Display/Body", "Newsreader 400–700"],
          ["Data/Meta", "JetBrains Mono 400/500"],
          ["Canvas", "#FAFAFA / #0C0C0C"],
          ["Ink", "#111111 / #EDEDED"],
          ["Accent", "International Klein Blue #002FA7"],
          ["Borders", "1px hairline #E5E7EB / #222222"],
          ["Stack", "Next.js App Router · Tailwind v4 · Lucide"],
          ["Licence", "CC BY-NC 4.0"],
        ].map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="uppercase tracking-wide text-muted">{k}</dt>
            <dd className="text-ink dark:text-[#ededed]">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-10 font-mono text-xs text-muted">
        Reachable at{" "}
        <a
          href="mailto:mara@example.com"
          className="transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
        >
          mara@example.com
        </a>
      </p>
    </div>
  );
}
