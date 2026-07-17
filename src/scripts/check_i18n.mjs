// Structural drift guard between data/articles.ts (EN) and data/articles.is.ts
// (IS). The two arrays must agree on every slug, section id, block kind/order,
// checklist id (localStorage keys — a mismatch would silently reset packing
// checklists on the Icelandic side), image src, and CTA href. Runs as
// `prebuild`, so a drifted translation fails the build instead of shipping.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Fingerprint = the ordered sequence of structural key/value pairs. Values of
// slug/id/kind/src/href must be byte-identical between the two files; all
// translated fields (title, text, items…) are deliberately not matched.
function fingerprint(file, marker) {
  const src = readFileSync(join(root, file), "utf8");
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`${file}: marker ${marker} not found`);
  const body = src.slice(start);
  const seq = [];
  for (const m of body.matchAll(/\b(slug|id|kind|src|href):\s*"([^"]*)"/g)) {
    seq.push(`${m[1]}=${m[2]}`);
  }
  return seq;
}

const en = fingerprint("data/articles.ts", "export const ARTICLES");
const is = fingerprint("data/articles.is.ts", "export const ARTICLES_IS");

if (en.length === 0) {
  console.error("check_i18n: extracted an empty EN fingerprint — check the script");
  process.exit(1);
}

const max = Math.max(en.length, is.length);
for (let i = 0; i < max; i++) {
  if (en[i] !== is[i]) {
    console.error(
      `check_i18n: articles.ts and articles.is.ts diverge at structural token #${i}:\n` +
        `  EN: ${en[i] ?? "(missing)"}\n  IS: ${is[i] ?? "(missing)"}\n` +
        `Every slug/section id/block kind/checklist id/image src/href must match 1:1.`
    );
    process.exit(1);
  }
}
console.log(`check_i18n: OK — ${en.length} structural tokens match across en/is articles`);
