import { describe, test, expect, beforeAll } from "bun:test";
import { mkdtempSync, rmSync, readFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import YAML from "yaml";
import { ensureScriptsReady, runScript, fixture, SCHEMA_PATH, SECURITE_YAML, FIXTURES } from "./helpers";

beforeAll(() => {
  ensureScriptsReady();
});

describe("validate.ts", () => {
  test("accepte le YAML minimal valide", () => {
    const r = runScript("validate.ts", [fixture("valid", "minimal.yaml"), SCHEMA_PATH]);
    expect(r.code).toBe(0);
    expect(r.stdout).toContain("OK");
  });

  test("accepte l'asset securite.yaml du skill", () => {
    const r = runScript("validate.ts", [SECURITE_YAML, SCHEMA_PATH]);
    expect(r.code).toBe(0);
  });

  test("rejette argv manquants (exit 2)", () => {
    const r = runScript("validate.ts", []);
    expect(r.code).toBe(2);
  });

  test.each([
    ["bad-answers-count.yaml"],
    ["bad-correct-index.yaml"],
    ["duplicate-question-ids.yaml"],
    ["duplicate-chapter-ids.yaml"],
    ["missing-explanation.yaml"],
    ["malformed.yaml"],
  ])("rejette %s (exit 1)", (file) => {
    const r = runScript("validate.ts", [fixture("invalid", file), SCHEMA_PATH]);
    expect(r.code).toBe(1);
  });
});

describe("assemble.ts", () => {
  test("assemble plusieurs chunks, trie chapitres et questions, fusionne par chapter_id", () => {
    const tmp = mkdtempSync(join(tmpdir(), "qcm-assemble-"));
    const chunksDir = join(tmp, "chunks");
    mkdirSync(chunksDir);
    for (const f of ["chap-basics-q1-q5.yaml", "chap-basics-q6-q10.yaml", "chap-advanced-q1-q5.yaml"]) {
      copyFileSync(fixture("chunks", f), join(chunksDir, f));
    }
    const out = join(tmp, "out.yaml");
    const r = runScript("assemble.ts", [chunksDir, out, "Mon QCM Test"]);
    expect(r.code).toBe(0);
    expect(existsSync(out)).toBe(true);

    const doc = YAML.parse(readFileSync(out, "utf8")) as {
      title: string;
      chapters: { id: string; title: string; questions: { id: string }[] }[];
    };
    expect(doc.title).toBe("Mon QCM Test");
    expect(doc.chapters).toHaveLength(2);
    // chapter_order : basics(0) puis advanced(1)
    expect(doc.chapters[0].id).toBe("basics");
    expect(doc.chapters[1].id).toBe("advanced");
    // fusion : 3 questions sur basics (q1, q2, q3 venant de 2 chunks)
    expect(doc.chapters[0].questions.map((q) => q.id)).toEqual(["q1", "q2", "q3"]);
    expect(doc.chapters[1].questions.map((q) => q.id)).toEqual(["q1"]);

    // chaînage : la sortie passe validate.ts
    const v = runScript("validate.ts", [out, SCHEMA_PATH]);
    expect(v.code).toBe(0);

    rmSync(tmp, { recursive: true, force: true });
  });

  test("exit 2 si argv manquants", () => {
    const r = runScript("assemble.ts", []);
    expect(r.code).toBe(2);
  });

  test("exit 1 si répertoire de chunks vide", () => {
    const tmp = mkdtempSync(join(tmpdir(), "qcm-empty-"));
    const r = runScript("assemble.ts", [tmp, join(tmp, "out.yaml"), "Vide"]);
    expect(r.code).toBe(1);
    rmSync(tmp, { recursive: true, force: true });
  });
});

describe("check-duplicates.ts", () => {
  test("exit 0 quand toutes les questions sont distinctes", () => {
    const r = runScript("check-duplicates.ts", [fixture("duplicates", "all-distinct.yaml")]);
    expect(r.code).toBe(0);
    expect(r.stdout).toContain("aucun doublon");
  });

  test("exit 1 quand deux questions sont quasi-identiques au seuil 0.8", () => {
    const r = runScript("check-duplicates.ts", [fixture("duplicates", "near-duplicates.yaml"), "0.8"]);
    expect(r.code).toBe(1);
    expect(r.stderr).toContain("Doublons");
  });

  test("seuil 0.99 ne déclenche pas sur les near-duplicates (paramétrage)", () => {
    const r = runScript("check-duplicates.ts", [fixture("duplicates", "near-duplicates.yaml"), "0.99"]);
    expect(r.code).toBe(0);
  });

  test("exit 2 si argv manquant", () => {
    const r = runScript("check-duplicates.ts", []);
    expect(r.code).toBe(2);
  });
});
