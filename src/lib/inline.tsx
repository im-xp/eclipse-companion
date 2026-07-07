import type { ReactNode } from "react";

const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    const index = m.index ?? 0;
    if (index > last) {
      nodes.push(text.slice(last, index));
    }
    if (m[1] !== undefined) {
      nodes.push(
        <a
          key={key++}
          href={m[2]}
          target="_blank"
          rel="noreferrer"
          className="text-aurora-cyan underline decoration-aurora-cyan/40 underline-offset-2 hover:decoration-aurora-cyan transition-colors"
        >
          {m[1]}
        </a>,
      );
    } else if (m[3] !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold text-moon-white">
          {m[3]}
        </strong>,
      );
    } else {
      nodes.push(<em key={key++}>{m[4]}</em>);
    }
    last = index + m[0].length;
  }
  if (last < text.length) {
    nodes.push(text.slice(last));
  }
  return nodes;
}
