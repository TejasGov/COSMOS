/**
 * lib/markdown.tsx — Minimal, dependency-free Markdown → React renderer.
 *
 * Why hand-rolled? The content set is small and fully authored by us; a
 * full MDX pipeline would add weight and attack surface for no gain. This
 * parser covers exactly what the essays use: headings (h2/h3), paragraphs,
 * unordered/ordered lists, blockquotes (with optional attribution line),
 * thematic breaks, fenced code blocks (```lang) and inline spans
 * (bold / italic / inline code / links).
 *
 * Code fences get a tiny regex tokenizer for JS/TS/bash so we can ship
 * JetBrains Mono syntax colouring without highlight.js.
 */
import React from "react";

/* ------------------------------------------------------------------ types */

type Block =
  | { type: "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; lines: string[] }
  | { type: "hr" }
  | { type: "code"; lang: string; body: string };

/* ------------------------------------------------------- inline parsing */

/** Tokenize inline markdown (bold, italic, code, links) into React nodes. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Single pass regex covering **bold**, *italic*, `code`, [link](url).
  const pattern =
    /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;

  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `${keyPrefix}-inline-${i++}`;

    if (m[2]) nodes.push(<strong key={key}>{m[2]}</strong>);
    else if (m[4]) nodes.push(<em key={key}>{m[4]}</em>);
    else if (m[6]) nodes.push(<code key={key}>{m[6]}</code>);
    else if (m[8]) {
      const external = /^https?:\/\//.test(m[9]);
      nodes.push(
        <a
          key={key}
          href={m[9]}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {m[8]}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/* ------------------------------------------------- code tokenisation (tiny) */

const KEYWORDS = new Set([
  "const","let","var","function","return","if","else","for","while","import",
  "from","export","default","new","await","async","class","extends","type",
  "interface","of","in","try","catch","throw","true","false","null","undefined",
  "set","get","static","yield","switch","case","break","continue","typeof",
  "setInterval","clearTimeout","setTimeout",
]);

/** Split one code line into coloured token spans. */
function tokenizeLine(line: string, lineKey: string): React.ReactNode[] {
  // Comments short-circuit the whole remainder of the line.
  const commentIdx = findComment(line);
  const parts: React.ReactNode[] = [];
  const codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : "";

  const pattern = /("[^"]*"|'[^']*'|`[^`]*`)|(\b\d[\w.]*\b)|([A-Za-z_$][\w$]*)|([{}()[\];,.:=<>+\-*/&|!?])/g;
  let out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = pattern.exec(codePart)) !== null) {
    if (m.index > last) out.push(codePart.slice(last, m.index));
    const k = `${lineKey}-t${i++}`;
    if (m[1]) out.push(<span className="tok-s" key={k}>{m[1]}</span>);       // string
    else if (m[2]) out.push(<span className="tok-n" key={k}>{m[2]}</span>);  // number
    else if (m[3]) {
      const w = m[3];
      if (KEYWORDS.has(w)) out.push(<span className="tok-k" key={k}>{w}</span>);
      // Identifier immediately followed by "(" reads as a function call.
      else if (codePart[pattern.lastIndex] === "(")
        out.push(<span className="tok-f" key={k}>{w}</span>);
      else out.push(w);
    } else if (m[4]) out.push(<span className="tok-p" key={k}>{m[4]}</span>); // punct
    last = m.index + m[0].length;
  }
  if (last < codePart.length) out.push(codePart.slice(last));

  if (commentPart) {
    out.push(<span className="tok-c" key={`${lineKey}-c`}>{commentPart}</span>);
  }
  parts.push(...out);
  return parts;
}

/** Index where a line comment starts (# or //), ignoring in-string occurrences. */
function findComment(line: string): number {
  let inStr: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inStr) {
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
    else if (ch === "#" && !line.startsWith("#!")) return i; // bash comments
    else if (ch === "/" && line[i + 1] === "/") return i;    // js comments
  }
  return -1;
}

/* --------------------------------------------------------- block parsing */

/** Split raw markdown into typed blocks. */
function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block ```lang
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++; // consume closing fence
      blocks.push({ type: "code", lang, body: body.join("\n") });
      continue;
    }
    // Headings
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
      i++; continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      i++; continue;
    }
    // Thematic break
    if (/^---\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i++; continue;
    }
    // Blockquote (consecutive "> " lines)
    if (line.startsWith("> ")) {
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) q.push(lines[i++].slice(2));
      blocks.push({ type: "quote", lines: q });
      continue;
    }
    // Unordered list
    if (/^- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- /.test(lines[i])) items.push(lines[i++].slice(2));
      blocks.push({ type: "ul", items });
      continue;
    }
    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i]))
        items.push(lines[i++].replace(/^\d+\. /, ""));
      blocks.push({ type: "ol", items });
      continue;
    }
    // Blank line → skip
    if (line.trim() === "") { i++; continue; }

    // Paragraph: gather until blank line or another block start
    const para: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(##\s|###\s|```\|?>\s|- |\d+\. |---)/.test(lines[i])
    ) para.push(lines[i++]);
    blocks.push({ type: "p", text: para.join(" ") });
  }
  return blocks;
}

/* ------------------------------------------------------------ renderer */

/** Convert authored markdown into semantic React elements. */
export function renderMarkdown(md: string): React.ReactNode {
  const blocks = parseBlocks(md);

  return blocks.map((block, bi) => {
    const key = `b-${bi}`;
    switch (block.type) {
      case "h2":
        return <h2 key={key}>{renderInline(block.text, key)}</h2>;
      case "h3":
        return <h3 key={key}>{renderInline(block.text, key)}</h3>;
      case "hr":
        return <hr key={key} />;
      case "p":
        return <p key={key}>{renderInline(block.text, key)}</p>;
      case "ul":
        return (
          <ul key={key}>
            {block.items.map((it, ii) => (
              <li key={`${key}-${ii}`}>{renderInline(it, `${key}-${ii}`)}</li>
            ))}
          </ul>
        );
      case "ol":
        return (
          <ol key={key}>
            {block.items.map((it, ii) => (
              <li key={`${key}-${ii}`}>{renderInline(it, `${key}-${ii}`)}</li>
            ))}
          </ol>
        );
      case "quote": {
        // A final "— Attribution" line renders as mono metadata footer.
        const last = block.lines[block.lines.length - 1] ?? "";
        const hasAttribution = last.startsWith("— ");
        const bodyLines = hasAttribution ? block.lines.slice(0, -1) : block.lines;
        return (
          <blockquote key={key}>
            <p>{bodyLines.map((l, li) => (
              <React.Fragment key={li}>
                {renderInline(l, `${key}-q${li}`)}
                {li < bodyLines.length - 1 ? " " : null}
              </React.Fragment>
            ))}</p>
            {hasAttribution ? <footer>{last}</footer> : null}
          </blockquote>
        );
      }
      case "code":
        return (
          <pre key={key} tabIndex={0} aria-label={`Code sample (${block.lang || "plain text"})`}>
            <code>
              {block.body.split("\n").map((ln, li) => (
                <React.Fragment key={li}>
                  {tokenizeLine(ln, `${key}-l${li}`)}
                  {li < block.body.split("\n").length - 1 ? "\n" : ""}
                </React.Fragment>
              ))}
            </code>
          </pre>
        );
    }
  });
}
