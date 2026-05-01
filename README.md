# jlg-ia — Marketplace Claude Code

Marketplace de plugins et skills Claude Code par **Jean-Louis GUENEGO**.

Cette marketplace contient des plugins et skills réutilisables pour Claude Code, notamment :

- **`orsys`** — Outils pour la création de plans de formation au format ORSYS
  - Skill **`orsys-formation-plan`** : génère un plan de formation professionnelle structuré à partir d'un sujet et d'une durée.

---

## 📦 Structure du dépôt

```
.
├── .claude-plugin/
│   └── marketplace.json          # Manifeste de la marketplace
└── plugins/
    └── orsys/
        ├── .claude-plugin/
        │   └── plugin.json       # Manifeste du plugin
        └── skills/
            └── orsys-formation-plan/
                └── SKILL.md      # Définition du skill
```

---

## 🚀 Installer la marketplace dans Claude Code

Claude Code (CLI) supporte un système de **marketplaces** permettant d'ajouter des plugins externes hébergés sur GitHub.

### Étape 1 — Pré-requis

- [Claude Code CLI](https://docs.claude.com/en/docs/claude-code) installé et fonctionnel
- Un compte GitHub (le dépôt est public, aucun token requis)

Vérifie que la commande `claude` est disponible :

```bash
claude --version
```

### Étape 2 — Ajouter la marketplace

Dans une session Claude Code, lance la commande slash :

```
/plugin marketplace add jlguenego/jlg-ia
```

> 💡 Le format `owner/repo` cible automatiquement le dépôt GitHub `https://github.com/jlguenego/jlg-ia`.

Tu peux aussi utiliser l'URL complète :

```
/plugin marketplace add https://github.com/jlguenego/jlg-ia
```

### Étape 3 — Vérifier que la marketplace est bien enregistrée

```
/plugin marketplace list
```

Tu dois voir apparaître la marketplace **`jlg-ia`**.

### Étape 4 — Installer le plugin

```
/plugin install orsys@jlg-ia
```

La syntaxe est `<plugin-name>@<marketplace-name>` :

- **`orsys`** : nom du plugin (défini dans `plugins/orsys/.claude-plugin/plugin.json`)
- **`jlg-ia`** : nom de la marketplace (défini dans `.claude-plugin/marketplace.json`)

Tu peux aussi parcourir interactivement les plugins disponibles :

```
/plugin
```

### Étape 5 — Activer / utiliser le plugin

Une fois installé, le skill `orsys-formation-plan` est disponible. Demande par exemple :

> « Génère-moi un plan de formation ORSYS sur le RAG opérationnel sur 2 jours. »

### Mettre à jour la marketplace

```
/plugin marketplace update jlg-ia
```

### Désinstaller

```
/plugin uninstall orsys@jlg-ia
/plugin marketplace remove jlg-ia
```

---

## 🧩 Installer les skills via `npx skills` (Open Agent Skills CLI)

Les skills de cette marketplace sont aussi installables indépendamment de l'écosystème plugin Claude Code, grâce à la CLI [`skills`](https://github.com/vercel-labs/skills) (compatible Claude Code, Cursor, Codex, OpenCode, etc.).

### Étape 1 — Pré-requis

- [Node.js ≥ 18](https://nodejs.org/) installé
- Accès réseau à GitHub

Vérifie :

```bash
node --version
npx --version
npx skills --help
```

### Étape 2 — Lister les skills disponibles dans la marketplace

Avant d'installer, tu peux lister les skills présents dans le dépôt :

```bash
npx skills add jlguenego/jlg-ia --list
```

### Étape 3 — Installer le skill `orsys-formation-plan`

La commande exacte avec un chemin direct vers le sous-dossier du plugin :

```bash
npx skills add https://github.com/jlguenego/jlg-ia/tree/master/plugins/orsys
```

> 💡 La CLI détecte automatiquement les agents installés (Claude Code, Cursor, Codex, …) et y déploie les skills. Utilise `-a claude-code` pour cibler uniquement Claude Code.

#### Variantes utiles

```bash
# Installation globale (utilisateur), au lieu du projet courant
npx skills add https://github.com/jlguenego/jlg-ia/tree/master/plugins/orsys -g

# Installer uniquement pour Claude Code
npx skills add https://github.com/jlguenego/jlg-ia/tree/master/plugins/orsys -a claude-code

# Installer un skill nommé précis
npx skills add jlguenego/jlg-ia --skill orsys-formation-plan

# Tout installer sans confirmation (CI/CD)
npx skills add jlguenego/jlg-ia --all
```

### Emplacements d'installation

Selon l'agent et la portée (projet vs global) :

| Agent       | Projet              | Global (`-g`)       |
| ----------- | ------------------- | ------------------- |
| Claude Code | `./.claude/skills/` | `~/.claude/skills/` |
| Cursor      | `./.agents/skills/` | `~/.cursor/skills/` |
| Codex       | `./.agents/skills/` | `~/.codex/skills/`  |

Sous Windows, `~` correspond à `%USERPROFILE%`.

### Étape 4 — Vérifier l'installation

```bash
npx skills list           # skills du projet
npx skills ls -g          # skills globaux
npx skills ls -a claude-code
```

### Mettre à jour

```bash
npx skills update                      # tout mettre à jour
npx skills update orsys-formation-plan # un skill précis
```

### Désinstaller

```bash
npx skills remove orsys-formation-plan
npx skills remove --all                # tout retirer
```

---

## 🛠️ Skills disponibles

| Skill                  | Description                                                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orsys-formation-plan` | Génère un plan de formation professionnelle au format ORSYS (titre, objectifs, chapitres avec TP, évaluation). Produit un fichier `input/plan-<slug>.md`. |

---

## 📄 Licence

MIT © Jean-Louis GUENEGO

## 🔗 Liens

- Dépôt : https://github.com/jlguenego/jlg-ia
- Auteur : Jean-Louis GUENEGO — <jlguenego@gmail.com>
- Documentation Claude Code : https://docs.claude.com/en/docs/claude-code
