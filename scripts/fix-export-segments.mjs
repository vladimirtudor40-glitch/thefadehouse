// Next.js static export writes per-segment prefetch data as
// `__next.<segment>/__PAGE__.txt`, but the client router requests the
// flattened `__next.<segment>.__PAGE__.txt`. Static hosts (GitHub Pages)
// can't rewrite URLs, so we also write the flattened copy next to it.
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const outDir = new URL("../out", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
let copied = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    if (entry.startsWith("__next.")) {
      for (const file of readdirSync(full)) {
        const source = join(full, file);
        if (statSync(source).isFile()) {
          copyFileSync(source, join(dir, `${entry}.${file}`));
          copied++;
        }
      }
    }
    walk(full);
  }
}

walk(decodeURIComponent(outDir));
console.log(`fix-export-segments: wrote ${copied} flattened segment file(s).`);
