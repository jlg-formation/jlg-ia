# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**jlg-ia-claude-marketplace** est une marketplace de plugins pour Claude Code et GitHub Copilot, maintenue par Jean-Louis GUENEGO. Elle contient des skills d'orchestration pédagogique : génération de plans de formation, de QCM validés, et de livres complets en Markdown.

## Commands

```bash
# Installer les dépendances de test
cd tests && bun install

# Lancer les tests (unit + intégration, sans E2E)
cd tests && bun test --timeout 30000

# Lancer un fichier de test spécifique
cd tests && bun test squizzer-qcm/scripts.test.ts

# Lancer les tests E2E (nécessite le CLI claude, ~20 min)
cd tests && RUN_E2E=1 bun test e2e --timeout 1200000

# Valider un YAML généré manuellement
bun plugins/orsys/skills/squizzer-qcm/scripts/validate.ts <fichier.yaml> plugins/orsys/skills/squizzer-qcm/assets/schema.json

# Détecter les doublons dans un QCM
bun plugins/orsys/skills/squizzer-qcm/scripts/check-duplicates.ts <fichier.yaml> 0.8
```

## Architecture

### Dualité des manifestes

Chaque plugin expose deux manifestes parallèles :
- `plugins/<plugin>/plugin.json` — GitHub Copilot (VSCode agent plugins API)
- `plugins/<plugin>/.claude-plugin/plugin.json` — Claude Code CLI marketplace

### Structure d'un skill

Chaque skill est un sous-dossier de `plugins/<plugin>/skills/<name>/` contenant :
- **SKILL.md** : frontmatter YAML (`name`, `description`, `disable-model-invocation`) + pipeline complet.
- **scripts/** : utilitaires Bun/TypeScript (validation, assemblage, déduplication). Chaque script sort avec code 0 (succès), 1 (erreur logique), 2 (mauvais arguments).
- **assets/** : schémas JSON, exemples de référence, sorties générées.
- **specifications/brief.md** : exigences d'origine.

`disable-model-invocation: true` interdit le déclenchement automatique ; le skill ne répond qu'à son slash command explicite.

### Pattern d'orchestration multi-phases (commun à tous les skills)

Les skills lourds (`squizzer-qcm`, `xxxli`) suivent trois phases :

1. **Plan** (séquentiel) — résout les entrées, calcule slugs/hashes, produit un contrat (fiches, glossaire, schéma) persisté sur disque.
2. **Exécution** (parallèle par vagues de ≤ 4 subagents) — chaque subagent reçoit sa portion du contrat et écrit son fichier de sortie directement.
3. **Assemblage** (séquentiel) — fusionne, trie, valide (Ajv + Jaccard), finalise.

### Idempotence (pattern `xxxli`)

Le fichier `.livre-state.json` est la source de vérité : il trace phase, hashes SHA256 des fiches sources et des fichiers générés, et statut de chaque bullet (`a_faire` / `en_cours` / `fait`). Les écritures sont atomiques (fichier temp → rename). Relancer le skill reprend exactement là où il s'était arrêté ; si une fiche change, seuls les bullets affectés sont re-générés.

## Skills disponibles

### Plugin `orsys`

| Slash command | Skill | Sortie |
|---|---|---|
| `/xxxpf` | Plan de formation ORSYS | `input/plan-<slug>.md` |
| `/xxxli` | Livre pédagogique complet | `/livres/<slug>/` |
| `/squizzer-qcm` | QCM au format Squizzer YAML | `assets/qcm/qcm-<slug>.yaml` |

### Plugin `jlg-tools`

| Slash command | Skill | Description |
|---|---|---|
| `/restructure` | Réécriture de prompt IA | Optimise un fichier prompt en prompt engineering |
| `/clarify` | Clarification de discussion | Génère des questions de clarification à partir d'une discussion |
| `/ux-audit` | Audit ergonomique | Audite une URL, du code front ou des maquettes selon ux-audit.github.io ; produit `ux-audit/<slug>/rapport.md` + captures annotées |

## Tests

- `tests/squizzer-qcm/skill-structure.test.ts` — vérifie l'intégrité du SKILL.md, l'existence des assets, la compilabilité du schéma JSON.
- `tests/squizzer-qcm/scripts.test.ts` — tests unitaires de `validate.ts`, `assemble.ts`, `check-duplicates.ts` avec fixtures YAML.
- `tests/squizzer-qcm/e2e.test.ts` — invoque le CLI `claude` et vérifie que le QCM généré passe validation + déduplication.
- `tests/squizzer-qcm/helpers.ts` — utilitaires partagés (`ensureScriptsReady`, `runScript`, fixture paths).

Les fixtures se trouvent dans `tests/squizzer-qcm/fixtures/` : `valid/`, `invalid/`, `duplicates/`, `chunks/`.

## Distribution

```bash
# Claude Code CLI
claude plugin marketplace add jlguenego/jlg-ia
claude plugin install orsys@jlg-ia
claude plugin install jlg-tools@jlg-ia
```

Pour GitHub Copilot : "Chat: Install Plugin From Source" dans la palette VSCode. Les subagents y sont séquentiels (pas parallèles).
