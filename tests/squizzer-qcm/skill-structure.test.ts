import { describe, test, expect } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import Ajv from "ajv";
import { SKILL_DIR, SCHEMA_PATH, SECURITE_YAML, ensureScriptsReady, runScript } from "./helpers";

function parseFrontmatter(md: string): Record<string, unknown> {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error("frontmatter introuvable");
  return YAML.parse(m[1]) as Record<string, unknown>;
}

describe("structure du skill squizzer-qcm", () => {
  const skillMdPath = join(SKILL_DIR, "SKILL.md");

  test("SKILL.md existe et a un frontmatter avec name + description", () => {
    expect(existsSync(skillMdPath)).toBe(true);
    const fm = parseFrontmatter(readFileSync(skillMdPath, "utf8"));
    expect(fm.name).toBe("squizzer-qcm");
    expect(typeof fm.description).toBe("string");
    expect((fm.description as string).length).toBeGreaterThan(20);
  });

  test.each([
    ["assets/securite.yaml"],
    ["assets/schema.json"],
    ["scripts/validate.ts"],
    ["scripts/assemble.ts"],
    ["scripts/check-duplicates.ts"],
    ["scripts/package.json"],
  ])("le fichier référencé %s existe", (rel) => {
    expect(existsSync(join(SKILL_DIR, rel))).toBe(true);
  });

  test("schema.json est un JSON Schema compilable par Ajv", () => {
    const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
    const ajv = new Ajv({ allErrors: true, strict: false });
    expect(() => ajv.compile(schema)).not.toThrow();
  });

  test("securite.yaml est cohérent avec son propre schéma (auto-validation)", () => {
    ensureScriptsReady();
    const r = runScript("validate.ts", [SECURITE_YAML, SCHEMA_PATH]);
    expect(r.code).toBe(0);
  });
});
