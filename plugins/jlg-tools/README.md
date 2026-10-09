# jlg-tools

Outils généraux JLG — skills personnels de Jean-Louis GUENEGO. Compatible **Claude Code** et **GitHub Copilot**.

## Contenu du plugin

Ce plugin regroupe des skills d'usage transversal, à déclenchement **manuel uniquement** (chacun s'active sur son slash command explicite, jamais automatiquement).

| Slash command | Skill | Description |
|---|---|---|
| `/clarify <fichier> [N]` | [clarify](skills/clarify/SKILL.md) | Génère `N` questions de clarification (10 par défaut) à partir d'un fichier source, pour préciser un besoin avant de démarrer un développement avec un assistant IA. |
| `/restructure <fichier>` | [restructure](skills/restructure/SKILL.md) | Réécrit un fichier contenant un prompt destiné à une IA afin d'en maximiser l'efficacité en prompt engineering, en respectant le contexte et le format d'origine. |
| `/ux-audit <cible> [critères]` | [ux-audit](skills/ux-audit/SKILL.md) | Réalise un audit ergonomique expert (8 critères de Bastien & Scapin, référentiel [ux-audit.github.io](https://ux-audit.github.io/)) sur une URL, du code front-end ou des maquettes. Produit `ux-audit/<slug>/rapport.md` + captures annotées. |

## Structure

```
jlg-tools/
├── plugin.json                 # Manifeste GitHub Copilot
├── .claude-plugin/plugin.json  # Manifeste Claude Code CLI
└── skills/
    ├── clarify/
    ├── restructure/
    └── ux-audit/
        ├── assets/criteres/    # Les 8 critères de Bastien & Scapin
        └── assets/exemples/    # Exemples pédagogiques (lois UX, Gestalt…)
```

## Installation

### Claude Code CLI

```bash
claude plugin marketplace add jlguenego/jlg-ia
claude plugin install jlg-tools@jlg-ia
```

### GitHub Copilot

Palette de commandes VS Code → **« Chat: Install Plugin From Source »**, puis sélectionner ce dossier.

## Auteur

Jean-Louis GUENEGO — [jlguenego@gmail.com](mailto:jlguenego@gmail.com) · Licence MIT
