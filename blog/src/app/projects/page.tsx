import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected engineering work — tools, libraries, small machines.",
};

/** Status → a single restrained dot; only Active gets the accent. */
function StatusDot({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted">
      <span
        aria-hidden
        className={
          status === "Active"
            ? "h-1.5 w-1.5 rounded-full bg-accent dark:bg-accent-dark"
            : "h-1.5 w-1.5 rounded-full border border-hairline dark:border-nighthairline"
        }
      />
      {status}
    </span>
  );
}

/**
 * /projects — index table with the same grammar as the essay feed:
 * [No.] [Name + deck] [Stack] [Year] [Status] [↗]. Hairlines only.
 */
export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-muted">
        index_ / projects
      </p>

      <h1 className="mt-4 font-serif text-4xl font-bold tracking-tighter text-ink dark:text-[#f5f5f5]">
        Projects
      </h1>
      <p className="mt-3 max-w-[52ch] font-serif text-base text-muted">
        Selected engineering work. Small machines, built to be read.
      </p>

      {/* Column header */}
      <div className="mt-12 hidden items-baseline gap-x-6 border-b border-hairline px-4 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted dark:border-nighthairline sm:px-6 md:flex">
        <span className="w-10 shrink-0">No.</span>
        <span className="flex-1">Project</span>
        <span className="hidden w-44 shrink-0 lg:inline">Stack</span>
        <span className="w-14 shrink-0">Year</span>
        <span className="w-28 shrink-0">Status</span>
        <span className="w-4 shrink-0" aria-hidden />
      </div>

      <ul className="border-b border-hairline dark:border-nighthairline">
        {PROJECTS.map((p, i) => (
          <li
            key={p.id}
            className="group/row border-b border-hairline last:border-b-0 dark:border-nighthairline"
          >
            <div className="-mx-4 flex items-baseline gap-x-6 px-4 py-5 transition-colors duration-100 hover:bg-surface sm:-mx-6 sm:px-6 dark:hover:bg-nightsurface">
              <span className="hidden w-10 shrink-0 font-mono text-xs text-muted md:inline">
                [{String(i + 1).padStart(2, "0")}]
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg font-medium tracking-tight text-ink dark:text-[#ededed]">
                  {p.name}
                </span>
                <span className="mt-1 block max-w-prose font-serif text-sm text-muted">
                  {p.description}
                </span>
              </span>

              <span className="hidden w-44 shrink-0 font-mono text-xs text-muted lg:inline">
                {p.stack.join(" · ")}
              </span>

              <span className="w-14 shrink-0 font-mono text-xs text-muted">
                {p.year}
              </span>

              <span className="w-28 shrink-0">
                <StatusDot status={p.status} />
              </span>

              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${p.name} (external link)`}
                  className="w-4 shrink-0 text-accent opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 dark:text-accent-dark"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <span className="w-4 shrink-0" aria-hidden />
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="pt-8 font-mono text-xs text-muted">
        Older experiments live on{" "}
        <Link
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-100 hover:text-accent dark:hover:text-accent-dark"
        >
          GitHub →
        </Link>
      </p>
    </div>
  );
}
