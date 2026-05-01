import { describe, test, expect } from "bun:test";
import { mkdirSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import YAML from "yaml";
import { REPO_ROOT, SCHEMA_PATH, ensureScriptsReady, runScript } from "./helpers";

const RUN_E2E = process.env.RUN_E2E === "1";
const d = RUN_E2E ? describe : describe.skip;

d("e2e squizzer-qcm (gated par RUN_E2E=1)", () => {
  test(
    "génère un QCM tailwindcss 2 chapitres × 10 questions, valide schéma + doublons",
    async () => {
      ensureScriptsReady();

      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const workdir = join(REPO_ROOT, "tests", ".tmp-e2e", stamp);
      mkdirSync(workdir, { recursive: true });

      const prompt =
        "Utilise le skill squizzer-qcm pour generer un QCM sur le sujet TailwindCSS. " +
        "Contraintes strictes : exactement 2 chapitres ; exactement 10 questions par chapitre (soit 20 questions au total) ; " +
        "slug = tailwindcss ; fichier de sortie = ./squizzer-qcm/qcm-tailwindcss.yaml relatif au workspace courant. " +
        "Suis le pipeline du skill jusqu'a validation et check-duplicates inclus.";

      const claudeBin = process.platform === "win32" ? "claude.exe" : "claude";
      const r = spawnSync(
        claudeBin,
        ["-p", prompt, "--dangerously-skip-permissions"],
        {
          cwd: workdir,
          stdio: "pipe",
          shell: false,
          timeout: 15 * 60 * 1000,
          env: { ...process.env },
        }
      );
      if (r.error) console.error("spawn error:", r.error);

      const stdout = r.stdout?.toString() ?? "";
      const stderr = r.stderr?.toString() ?? "";
      writeFileSync(join(workdir, "_claude.stdout.log"), stdout);
      writeFileSync(join(workdir, "_claude.stderr.log"), stderr);
      console.log(`claude exit=${r.status} workdir=${workdir}`);
      console.log("stdout (last 2k):\n" + stdout.slice(-2000));
      console.log("stderr (last 2k):\n" + stderr.slice(-2000));
      const tree = readdirSync(workdir, { recursive: true }) as string[];
      console.log("workdir tree:\n" + tree.join("\n"));

      const outPath = join(workdir, "squizzer-qcm", "qcm-tailwindcss.yaml");
      expect(existsSync(outPath)).toBe(true);

      const v = runScript("validate.ts", [outPath, SCHEMA_PATH]);
      expect(v.code).toBe(0);

      const c = runScript("check-duplicates.ts", [outPath, "0.8"]);
      expect(c.code).toBe(0);

      const doc = YAML.parse(readFileSync(outPath, "utf8")) as {
        title: string;
        chapters: {
          id: string;
          title: string;
          questions: { id: string; question: string; answers: string[]; correct: number }[];
        }[];
      };

      expect(doc.chapters).toHaveLength(2);
      const totalQ = doc.chapters.reduce((n, c) => n + c.questions.length, 0);
      expect(totalQ).toBe(20);
      for (const chap of doc.chapters) {
        expect(chap.questions).toHaveLength(10);
      }

      // Qualitatif : longueurs des 4 réponses « similaires » (écart-type / moyenne < 0.6)
      const offenders: string[] = [];
      for (const chap of doc.chapters) {
        for (const q of chap.questions) {
          const lens = q.answers.map((a) => String(a).length);
          const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
          const variance = lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length;
          const cv = Math.sqrt(variance) / Math.max(mean, 1);
          if (cv > 0.6) offenders.push(`${chap.id}/${q.id} cv=${cv.toFixed(2)} lens=${lens.join(",")}`);
        }
      }
      // Tolérance : on accepte jusqu'à 10% de questions « hors norme » (le LLM est non déterministe)
      expect(offenders.length).toBeLessThanOrEqual(2);
    },
    20 * 60 * 1000
  );
});
