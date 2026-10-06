import { getAllEssays } from "@/lib/posts";

/**
 * RSS feed generated at build time (Next Route Handler, dynamic = force-dynamic
 * so it re-runs per deploy). Escapes XML text safely.
 */
export const dynamic = "force-dynamic";

/** Minimal XML escaping for feed content. */
function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET() {
  const base = "https://example.com";
  const essays = getAllEssays();

  const items = essays
    .map(
      (e) => `    <item>
      <title>${esc(e.frontmatter.title)}</title>
      <link>${base}/essays/${e.slug}</link>
      <guid isPermaLink="true">${base}/essays/${e.slug}</guid>
      <pubDate>${new Date(e.frontmatter.date).toUTCString()}</pubDate>
      <category>${esc(e.frontmatter.tag)}</category>
      <description>${esc(e.frontmatter.summary ?? "")}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>index_ — Essays on craft, type &amp; engineering</title>
    <link>${base}</link>
    <description>A personal blog about typography, front-end engineering and the discipline of less.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
