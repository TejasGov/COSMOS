---
title: "Zero Layout Shift Is a Moral Position"
date: 2026-06-30
tag: Engineering
summary: "CLS is not a metric to game. It is the physical sensation of a page lying about its contents — and there are simple, boring fixes."
---

Core Web Vitals turned out to be an ethics course disguised as a performance audit. Cumulative Layout Shift measures one thing precisely: how often the page moves text out from under someone who is already reading it. A finger mid-tap. A line mid-sentence. The page shrugs and re-lays itself; the reader pays.

## Where shifts actually come from

Almost all CLS is three habits repeated at scale:

1. **Images without dimensions.** The browser reserves zero height, loads a 1200×800 JPEG, and everything below jumps 540 pixels.
2. **Fonts swapping late.** The fallback metrics differ from the real face, so every paragraph grows or shrinks at the moment the webfont lands.
3. **Injected chrome.** Ads, banners, cookie walls, "sign up" bars appended to the top of the document like tenants adding floors to a building nobody approved.

The fixes are famously dull:

```html
<!-- Reserve the box before the bytes arrive. -->
<img src="/plate.jpg" width="1200" height="800" alt="..." />

<!-- Or size the container, then let the media fill it. -->
<div class="embed" style="aspect-ratio: 3 / 2">…</div>
```

```css
/* Match the fallback's x-height & descent to the real font. */
@font-face {
  font-family: Newsreader;
  src: url(/newsreader.woff2) format("woff2");
  size-adjust: 104%;      /* corrects fallback width error   */
  ascent-override: 90%;   /* aligns fallback baseline rhythm */
  descent-override: 22%;
}
```

## Preload, don't pray

`size-adjust` handles the *shape* of the swap; preloading handles its *timing*. A self-hosted woff2 linked with `rel="preload"` usually wins its race against first paint, which means the swap never happens visibly at all. Two lines in `<head>` retire an entire class of jank:

```html
<link rel="preload" href="/fonts/newsreader.woff2"
      as="font" type="font/woff2" crossorigin />
```

Stabilize the grid first, then decorate it. A page that doesn't move feels honest — it said what it would occupy, and it kept its word. That is the whole moral position, and it ships in an afternoon.
