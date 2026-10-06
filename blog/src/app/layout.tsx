import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllEssays } from "@/lib/posts";
import "./globals.css";

/**
 * Root layout.
 * - Inline pre-paint script applies the stored theme class BEFORE hydration,
 *   eliminating flash-of-wrong-theme and any associated layout shift.
 * - Essay metadata is serialized once here and passed to the ⌘K palette,
 *   keeping client JS to a minimum.
 */
export const metadata: Metadata = {
  title: {
    default: "index_ — Essays on craft, type & engineering",
    template: "%s · index_",
  },
  description:
    "A personal blog about typography, front-end engineering and the discipline of less.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Lightweight projection of the essay index for the search palette.
  const paletteEntries = getAllEssays().map((e) => ({
    title: e.frontmatter.title,
    slug: e.slug,
    tag: e.frontmatter.tag,
    date: e.formattedDate,
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload self-hosted variable fonts → zero CLS text swap. */}
        <link
          rel="preload"
          href="/fonts/newsreader-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Theme boot script: runs before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||((t===null||t==='system')&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        {/* Skip link for keyboard/screen-reader users (WCAG). */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-hairline focus:bg-canvas focus:px-3 focus:py-2 focus:font-mono focus:text-xs dark:focus:border-nighthairline dark:focus:bg-nightcanvas"
        >
          Skip to content
        </a>
        <Header essays={paletteEntries} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
