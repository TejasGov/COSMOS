/**
 * lib/projects.ts — Static registry of engineering projects.
 * Kept as typed data (not markdown) because project entries are structured
 * records rather than long-form prose.
 */
export interface Project {
  /** Short machine name used in the mono column. */
  id: string;
  name: string;
  year: string;
  stack: string[];
  description: string;
  status: "Active" | "Maintenance" | "Archived";
  url?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "p-01",
    name: "Typeset",
    year: "2026",
    stack: ["TypeScript", "Rust", "WASM"],
    description:
      "A browser-native typesetting engine. Knuth-style line breaking compiled to WASM; sub-40ms layout pass on a 3,000-word document.",
    status: "Active",
    url: "https://example.com/typeset",
  },
  {
    id: "p-02",
    name: "Static Zero",
    year: "2025",
    stack: ["Next.js", "Edge Runtime"],
    description:
      "Zero-JavaScript analytics endpoint. Under 1KB per pageview, no cookies, GDPR-compliant by construction rather than paperwork.",
    status: "Active",
    url: "https://example.com/static-zero",
  },
  {
    id: "p-03",
    name: "Gridline",
    year: "2025",
    stack: ["CSS", "PostCSS", "Figma API"],
    description:
      "Design-token pipeline that compiles Figma variables into hairline-exact Tailwind themes. One source of truth, two renderers.",
    status: "Maintenance",
  },
  {
    id: "p-04",
    name: "Kerning Kit",
    year: "2024",
    stack: ["Python", "FontTools"],
    description:
      "Optical-alignment CLI for variable fonts. Reports overshoot, sidebearing and rhythm errors across an entire foundry catalog.",
    status: "Archived",
  },
];
