---
title: "Optical Sizes Are a Contract"
date: 2026-08-14
tag: Typography
summary: "Variable fonts gave every browser a foundry. Almost nobody uses the optical size axis — here's why they should, and what breaks when they don't."
---

For four hundred years, metal type came in *cuts* matched to sizes: a 8pt Garamond was not a shrunken 24pt Garamond. It was redrawn — lighter hairlines kept from vanishing, tighter spacing kept from sprawling, larger counters kept from filling with ink. The punchcutter handled it. Then phototype flattened everything into one outline scaled infinitely, and desktop publishing let us pretend the problem had never existed.

## The axis we forgot to use

Variable fonts quietly returned the punchcutter to the browser. Among the registered axes, `opsz` (optical size) is the most consequential and the least used. Newsreader, Source Serif, Charter-like revivals — many now ship an optical axis from about 6 to 72 points, and CSS will drive it automatically if you ask:

```css
/* Let the browser interpolate opsz from the rendered font-size. */
.reading-column {
  font-family: "Newsreader Variable", serif;
  font-optical-sizing: auto; /* default, but say it out loud */
  font-size: 19px;           /* maps toward the low end of opsz */
}

/* Headlines get the display cut: high contrast, tight spacing. */
h1 {
  font-variation-settings: "opsz" 48;
  letter-spacing: -0.03em;   /* display cuts expect tracking help */
}
```

At body sizes the optical cut thins its hairlines, opens its spacing, and thickens its x-height presence. At display sizes it sharpens contrast, narrows fit, and lets fine strokes stay razor-thin — because nobody reads a 64-point headline at arm's length through a magnifier.

## What breaks without it

Set a display cut at 17px and the hairlines turn to fog on ordinary screens; readers squint and call the font "elegant but hard." Set a text cut at 64px and it looks bloated and safe — a body in a tuxedo. Both failures get blamed on taste. They are routing errors: the type was never *for* that size.

> Choosing a typeface is a conversation. Choosing its optical size is the contract: this face, at this distance, for this duration.

The honest version of responsive typography isn't just fluid measure — it's fluid *cut*. Interpolate `clamp()` your sizes, then map them onto `opsz`, and every viewport gets type that was drawn for it. The punchcutters would recognize the workflow. We just automated the apprenticeship.
