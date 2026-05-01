#!/usr/bin/env bun
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import YAML from "yaml";
import Ajv from "ajv";

const [, , yamlPath, schemaPath] = process.argv;
if (!yamlPath || !schemaPath) {
  console.error("usage: bun validate.ts <file.yaml> <schema.json>");
  process.exit(2);
}

const raw = readFileSync(resolve(yamlPath), "utf8");
let data: unknown;
try {
  data = YAML.parse(raw);
} catch (e) {
  console.error("YAML parse error:", (e as Error).message);
  process.exit(1);
}

const schema = JSON.parse(readFileSync(resolve(schemaPath), "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

if (!validate(data)) {
  console.error("Schema errors:");
  for (const err of validate.errors ?? []) {
    console.error(`  ${err.instancePath} ${err.message} ${JSON.stringify(err.params)}`);
  }
  process.exit(1);
}

const doc = data as { chapters: { id: string; questions: { id: string; correct: number; answers: unknown[] }[] }[] };
const errors: string[] = [];
const seenChapIds = new Set<string>();
for (const chap of doc.chapters) {
  if (seenChapIds.has(chap.id)) errors.push(`duplicate chapter id: ${chap.id}`);
  seenChapIds.add(chap.id);
  const seenQ = new Set<string>();
  for (const q of chap.questions) {
    if (seenQ.has(q.id)) errors.push(`duplicate question id in ${chap.id}: ${q.id}`);
    seenQ.add(q.id);
    if (q.correct < 0 || q.correct >= q.answers.length) {
      errors.push(`${chap.id}/${q.id}: correct index out of range`);
    }
  }
}

if (errors.length) {
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

console.log(`OK ${doc.chapters.length} chapitres, ${doc.chapters.reduce((n, c) => n + c.questions.length, 0)} questions`);
