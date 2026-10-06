# COSMOS

A personal blog built with Next.js 15, React 19, and Tailwind CSS 4. The site includes an essay archive, Markdown reading views, About and Projects pages, an RSS feed, search, and a persistent light/dark theme.

The application lives in `blog/`. The former product landing page has been removed.

## Development

Use Node.js 24 and npm 11 (validated with Node 24.19.0 and npm 11.9.0). No database or API credentials are required.

From the repository root, install the locked application dependencies:

```sh
npm --prefix blog ci
```

The current manifest does not declare TypeScript or its React/Node type packages. Install these prerequisites in a sibling tools directory and link them into the application's `node_modules` without changing the manifest or lockfile:

```sh
tools_dir="$(cd .. && pwd)/cosmos-setup-tools"
npm install --prefix "$tools_dir" --save-exact \
  typescript@5.9.3 @types/react@19.3.0 @types/node@24.19.1
mkdir -p blog/node_modules/@types
test -e blog/node_modules/typescript || \
  ln -s "$tools_dir/node_modules/typescript" blog/node_modules/typescript
test -e blog/node_modules/@types/react || \
  ln -s "$tools_dir/node_modules/@types/react" blog/node_modules/@types/react
test -e blog/node_modules/@types/node || \
  ln -s "$tools_dir/node_modules/@types/node" blog/node_modules/@types/node
```

Start the development server from the application directory:

```sh
cd blog
npm run dev
```

Next.js uses port 3000 by default. Run all application commands from `blog/`, since the content loader reads `content/` relative to the working directory.

## Build and validation

Stop the development server before building; both commands use `.next/`.

```sh
cd blog # from the repository root
npm run build
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run start
```

There is no standalone test or lint script. Validate the homepage, `/essays`, individual `/essays/<slug>` pages, `/about`, `/projects`, and `/rss.xml`. The RSS feed should contain the three bundled essays, and an unknown page should return HTTP 404.

The production build, type check, all listed routes, RSS output, and browser theme toggle have been verified. `.next/` and `next-env.d.ts` are generated locally; do not include them in commits.

## Content and customization

- Essays live in `blog/content/*.md`. Each file's name becomes its URL slug.
- Frontmatter requires `title`, `date` (`YYYY-MM-DD`), and `tag`. Optional fields are `summary` and `published`; set `published: false` to hide a draft.
- Project entries live in `blog/src/lib/projects.ts`.
- Edit the author text in `blog/src/app/page.tsx` and `blog/src/app/about/page.tsx`.
- Before deploying, replace the placeholder `https://example.com` URLs in `blog/src/app/layout.tsx` and `blog/src/app/rss.xml/route.ts`, and update project links.

Fonts are self-hosted in `blog/public/fonts/`.
