/**
 * lib/posts.ts — Content layer.
 * Reads Markdown files from /content with gray-matter frontmatter, computes
 * word count + reading time (via `reading-time`), and exposes typed helpers.
 * All functions run at build time on the server (Node fs), never in browser.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import rt from "reading-time";

/** Absolute path to the markdown content directory. */
const CONTENT_DIR = path.join(process.cwd(), "content");

/** Shape of an essay's frontmatter (as authored in the .md files). */
export interface EssayFrontmatter {
  title: string;
  date: string; // ISO yyyy-mm-dd
  tag: string; // single editorial category, e.g. "Craft"
  summary?: string;
  published?: boolean; // drafts can be excluded with published: false
}

/** YAML parses unquoted dates as Date objects; expose a consistent ISO date. */
function normalizeFrontmatter(data: Record<string, unknown>): EssayFrontmatter {
  return {
    ...data,
    date: data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : data.date,
  } as unknown as EssayFrontmatter;
}

/** Fully resolved essay record used by list & detail pages. */
export interface Essay {
  slug: string;
  frontmatter: EssayFrontmatter;
  /** Formatted display date, e.g. "2026.09.28" (mono metadata style). */
  formattedDate: string;
  words: number;
  /** Reading time label, e.g. "7 min". */
  readTime: string;
  /** Raw markdown body (frontmatter stripped). */
  content: string;
}

/**
 * Load every essay, newest first. Drafts (`published: false`) are filtered
 * out so the index only ever shows finished work.
 */
export function getAllEssays(): Essay[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  const essays = files.map<Essay>((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const fm = normalizeFrontmatter(data);
    const stats = rt(content); // e.g. { text: "7 min read", minutes, words }

    return {
      slug: file.replace(/\.md$/, ""),
      frontmatter: fm,
      formattedDate: fm.date.replaceAll("-", "."),
      words: stats.words,
      // Strip the trailing " read" — the column header already says MIN.
      readTime: stats.text.replace(/\s*read$/i, ""),
      content,
    };
  });

  return essays
    .filter((e) => e.frontmatter.published !== false)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

/** Fetch a single essay by slug, or null if it doesn't exist / is a draft. */
export function getEssayBySlug(slug: string): Essay | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = normalizeFrontmatter(data);
  if (fm.published === false) return null;

  const stats = rt(content);
  return {
    slug,
    frontmatter: fm,
    formattedDate: fm.date.replaceAll("-", "."),
    words: stats.words,
    readTime: stats.text.replace(/\s*read$/i, ""),
    content,
  };
}

/** Unique tags across all published essays (for the search palette). */
export function getAllTags(): string[] {
  return [...new Set(getAllEssays().map((e) => e.frontmatter.tag))].sort();
}
