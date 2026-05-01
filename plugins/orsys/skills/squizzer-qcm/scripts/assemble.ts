#!/usr/bin/env bun
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import YAML from "yaml";

const [, , chunksDir, outPath, title] = process.argv;
if (!chunksDir || !outPath || !title) {
  console.error("usage: bun assemble.ts <chunksDir> <out.yaml> <title>");
  process.exit(2);
}

type Chunk = {
  chapter_id: string;
  chapter_title: string;
  chapter_order: number;
  questions: { id: string; question: string; answers: (string | number)[]; correct: number; explanation: string }[];
};

const files = readdirSync(resolve(chunksDir)).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));
if (!files.length) {
  console.error("no chunk files found in", chunksDir);
  process.exit(1);
}

const chapters = new Map<string, { order: number; title: string; questions: Chunk["questions"] }>();
for (const f of files) {
  const c = YAML.parse(readFileSync(join(chunksDir, f), "utf8")) as Chunk;
  if (!c?.chapter_id || !c?.questions) {
    console.error(`invalid chunk: ${f}`);
    process.exit(1);
  }
  const existing = chapters.get(c.chapter_id);
  if (existing) {
    existing.questions.push(...c.questions);
  } else {
    chapters.set(c.chapter_id, { order: c.chapter_order ?? 0, title: c.chapter_title, questions: [...c.questions] });
  }
}

const ordered = [...chapters.entries()]
  .sort(([, a], [, b]) => a.order - b.order)
  .map(([id, c]) => {
    const sortedQs = [...c.questions].sort((a, b) => {
      const na = parseInt(a.id.replace(/^q/, ""), 10);
      const nb = parseInt(b.id.replace(/^q/, ""), 10);
      return na - nb;
    });
    return { id, title: c.title, questions: sortedQs };
  });

const final = { title, chapters: ordered };
mkdirSync(dirname(resolve(outPath)), { recursive: true });
writeFileSync(resolve(outPath), YAML.stringify(final, { lineWidth: 0 }), "utf8");
console.log(`wrote ${outPath} (${ordered.length} chapitres, ${ordered.reduce((n, c) => n + c.questions.length, 0)} questions)`);
