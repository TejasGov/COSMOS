---
title: "The Index Is the Product"
date: 2026-09-28
tag: Craft
summary: "Why a well-set table of contents beats a gallery of cards — and what print periodicals knew about feeds long before the feed existed."
---

Every blog redesign starts in the same place: a grid of oversized cards, each one a rounded rectangle shouting for attention. Every blog redesign ends in the same place: nobody reads anything. The problem is not the readers. It is that we replaced the *index* — the oldest information design in publishing — with a shop window.

## What an index actually does

An index is a promise of completeness, delivered at reading speed. A phone book, a library catalogue, the contents page of a New Yorker issue from 1954: none of them decorate. They align. Columns of dates, titles, categories — set tight, scanned fast, trusted.

> An index does not ask you to feel anything. It asks you to decide. And deciding, done well, is its own quiet pleasure.
> — Otto Neurath, paraphrased

The card grid, by contrast, asks you to feel *curiosity* on command. A thumbnail says "this image will make you want this story," which is an advertising claim, not an editorial one. When every entry gets a hero image and a drop shadow, the visual system spends all its budget on noise: nothing stands out because everything is standing out.

## Table as interface

Rebuilding this site around a plain list produced immediate, measurable effects:

- Scanning time dropped. A row of `date · title · tag · read-time` answers the only three questions a reader has — *when, what, how long* — before the click.
- Contrast came from typography alone. Dates in a monospaced face sit in a fixed column; titles carry weight and size; nothing needs a border-radius to have presence.
- The hover state became the entire animation vocabulary. One background shift, one arrow. Cost: 150ms. Benefit: the cursor feels like a pointer again, not a lottery lever.

Consider the difference in what each layout says when it loads:

```js
// Card grid: N competing claims, zero structure.
const feed = posts.map((p) => ({
  hero: p.image ?? PLACEHOLDER, // decorative, often wrong
  weight: "loud",               // every item shouts
}));

// Index: one structure, N scannable rows.
const index = posts.map((p) => ({
  date: p.date,   // fixed column, tabular numerals
  title: p.title, // measure-limited, truncated honestly
  minutes: p.readTime,
}));
```

## Restraint is a feature list

The discipline required to keep a page monochrome except for one blue is not aesthetic snobbery; it is respect for the reader's attention budget. Hover states get the accent. Active states get the accent. Nothing else does, because a second use of the signal destroys the first.

This is the same logic a printer uses when they reserve red ink for rubrics. Once red means "heading," red can never mean "sale."

The index was never the boring version of a blog. It was always the honest one. Put everything in a column, set it well, and get out of the way — the product was never the container. The index *is* the product.
