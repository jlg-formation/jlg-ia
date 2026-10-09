# orsys

Outils ORSYS — génération de plans de formation, de livres pédagogiques et de QCM Squizzer. Compatible **Claude Code** et **GitHub Copilot** (custom agent plugins).

## Contenu du plugin

Ce plugin regroupe des skills d'orchestration pédagogique, à déclenchement **manuel uniquement** (chacun s'active sur son slash command explicite, jamais automatiquement).

| Slash command | Skill | Sortie |
|---|---|---|
| `xxxPF <sujet>` | [plan-formation-generator](skills/plan-formation-generator/SKILL.md) | Plan de cours structuré au format ORSYS (à partir d'un sujet et d'une durée). |
| `xxxLI <plan>` | [livre-formation-generator](skills/livre-formation-generator/SKILL.md) | Livre pédagogique complet en Markdown dans `/livres/<slug>/` (un fichier par bullet point, ~1000 mots, métadonnées éditoriales). |
| `/squizzer-qcm` | [squizzer-qcm](skills/squizzer-qcm/SKILL.md) | QCM au format Squizzer YAML (`qcm-<slug>.yaml`), généré par vagues de subagents parallèles puis assemblé et validé via scripts Bun. |

## Pattern d'orchestration

Les skills lourds (`squizzer-qcm`, `livre-formation-generator`) suivent trois phases :

1. **Plan** (séquentiel) — résout les entrées et produit un contrat persisté sur disque.
2. **Exécution** (parallèle par vagues de ≤ 4 subagents) — chaque subagent écrit sa portion de sortie.
3. **Assemblage** (séquentiel) — fusionne, trie, valide et finalise.

L'idempotence est assurée par un fichier d'état (hashes SHA256, statut par bullet) permettant de reprendre exactement là où le traitement s'était arrêté.

## Structure

```
orsys/
├── plugin.json                 # Manifeste GitHub Copilot
├── .claude-plugin/plugin.json  # Manifeste Claude Code CLI
└── skills/
    ├── plan-formation-generator/
    ├── livre-formation-generator/
    └── squizzer-qcm/
        ├── assets/   # schema.json, exemples de référence
        └── scripts/  # validate.ts, assemble.ts, check-duplicates.ts (Bun)
```

## Installation

### Claude Code CLI

```bash
claude plugin marketplace add jlguenego/jlg-ia
claude plugin install orsys@jlg-ia
```

### GitHub Copilot

Palette de commandes VS Code → **« Chat: Install Plugin From Source »**, puis sélectionner ce dossier. Note : sous Copilot, les subagents s'exécutent de façon séquentielle (pas parallèle).

## Auteur

Jean-Louis GUENEGO — [jlguenego@gmail.com](mailto:jlguenego@gmail.com) · Licence MIT
