import { existsSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(here, "..", "..");
export const SKILL_DIR = join(REPO_ROOT, "plugins", "orsys", "skills", "squizzer-qcm");
export const SKILL_SCRIPTS_SRC = join(SKILL_DIR, "scripts");
export const SCHEMA_PATH = join(SKILL_DIR, "assets", "schema.json");
export const SECURITE_YAML = join(SKILL_DIR, "assets", "securite.yaml");
export const FIXTURES = join(here, "fixtures");

export function ensureScriptsReady(): string {
  // Les scripts s'exécutent sur place, sans être recopiés ailleurs.
  if (existsSync(join(SKILL_SCRIPTS_SRC, "node_modules"))) return SKILL_SCRIPTS_SRC;
  const r = spawnSync("bun", ["install", "--frozen-lockfile"], {
    cwd: SKILL_SCRIPTS_SRC,
    stdio: "pipe",
    shell: true,
  });
  if (r.status !== 0) {
    throw new Error(`bun install failed: ${r.stderr?.toString()}`);
  }
  return SKILL_SCRIPTS_SRC;
}

export type RunResult = { code: number; stdout: string; stderr: string };

function quoteArg(a: string): string {
  if (process.platform === "win32") {
    return /[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a;
  }
  return /[\s"']/.test(a) ? `'${a.replace(/'/g, `'\\''`)}'` : a;
}

export function runScript(script: "validate.ts" | "assemble.ts" | "check-duplicates.ts", args: string[]): RunResult {
  const dir = ensureScriptsReady();
  const cmd = ["bun", quoteArg(join(dir, script)), ...args.map(quoteArg)].join(" ");
  const r = spawnSync(cmd, { stdio: "pipe", shell: true });
  return {
    code: r.status ?? -1,
    stdout: r.stdout?.toString() ?? "",
    stderr: r.stderr?.toString() ?? "",
  };
}

export function fixture(...parts: string[]): string {
  return join(FIXTURES, ...parts);
}
