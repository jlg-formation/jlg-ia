#!/usr/bin/env bun
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import YAML from "yaml";

const [, , yamlPath, thresholdArg] = process.argv;
if (!yamlPath) {
  console.error("usage: bun check-duplicates.ts <file.yaml> [threshold=0.8]");
  process.exit(2);
}
const threshold = parseFloat(thresholdArg ?? "0.8");

const doc = YAML.parse(readFileSync(resolve(yamlPath), "utf8")) as {
  chapters: { id: string; questions: { id: string; question: string }[] }[];
};

function normalize(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 1;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter);
}

const all: { ref: string; tokens: Set<string>; raw: string }[] = [];
for (const chap of doc.chapters) {
  for (const q of chap.questions) {
    all.push({ ref: `${chap.id}/${q.id}`, tokens: normalize(q.question), raw: q.question });
  }
}

const dups: string[] = [];
for (let i = 0; i < all.length; i++) {
  for (let j = i + 1; j < all.length; j++) {
    const sim = jaccard(all[i].tokens, all[j].tokens);
    if (sim >= threshold) {
      dups.push(`${all[i].ref} ~ ${all[j].ref} (sim=${sim.toFixed(2)})\n    [${all[i].raw}]\n    [${all[j].raw}]`);
    }
  }
}

if (dups.length) {
  console.error(`Doublons potentiels (seuil ${threshold}):`);
  for (const d of dups) console.error("  " + d);
  process.exit(1);
}
console.log(`OK aucun doublon >= ${threshold} sur ${all.length} questions`);
