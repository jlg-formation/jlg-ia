# jlg-ia — Marketplace Claude Code

Marketplace de plugins et skills Claude Code par **Jean-Louis GUENEGO**.

Cette marketplace contient des plugins et skills réutilisables pour Claude Code, notamment :

- **`orsys`** — Outils pour la création de plans de formation au format ORSYS
  - Skill **`orsys-formation-plan`** : génère un plan de formation professionnelle structuré à partir d'un sujet et d'une durée.
  - Skill **`squizzer-qcm`** : génère un fichier YAML de QCM pour le site Squizzer (orchestration multi-subagents, validation par schéma JSON, déduplication).
  - Agent **`orsys-general-purpose`** : agent générique réutilisable du plugin, déclaré au format `*.agent.md` pour être découvert à la fois par Claude Code et par GitHub Copilot (cf. [Custom Agent Plugins](https://code.visualstudio.com/docs/copilot/customization/agent-plugins)). Préfixé `orsys-` pour éviter tout conflit avec un agent du même nom dans un autre plugin ou avec un built-in.

### Compatibilité Claude Code / GitHub Copilot

Ce plugin suit la **structure commune** aux deux écosystèmes :

```
plugins/orsys/
├── plugin.json              # Manifeste racine (Copilot)
├── .claude-plugin/
│   └── plugin.json          # Manifeste Claude Code (équivalent)
├── agents/
│   └── orsys-general-purpose.agent.md
└── skills/
    ├── orsys-formation-plan/
    └── squizzer-qcm/
```

Sous **GitHub Copilot (VSCode)**, le plugin peut être installé via la commande de palette **« Chat: Install Plugin From Source »** en fournissant l'URL du dépôt, ou via la recherche `@agentPlugins` dans l'onglet Extensions.

⚠️ **Limite connue** : Copilot exécute les sous-agents **séquentiellement**. Le skill `squizzer-qcm`, qui repose sur des vagues de 4 subagents en parallèle sous Claude Code, fonctionne sous Copilot mais en série (plus lent).

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

Toutes les commandes ci-dessous sont à lancer **depuis ton shell** (PowerShell, bash, zsh…), pas en mode interactif dans Claude Code.

### Étape 1 — Pré-requis

- [Claude Code CLI](https://docs.claude.com/en/docs/claude-code) installé et fonctionnel
- Accès HTTPS à GitHub (le dépôt est public, aucun token requis)

Vérifie que la commande `claude` est disponible :

```bash
claude --version
```

### Étape 2 — Ajouter la marketplace (HTTPS)

```bash
claude plugin marketplace add https://github.com/jlguenego/jlg-ia
```

> 💡 Le format raccourci `owner/repo` fonctionne aussi et résout vers la même URL HTTPS :
>
> ```bash
> claude plugin marketplace add jlguenego/jlg-ia
> ```

<details>
<summary>Variante SSH (déconseillée — nécessite une clé SSH GitHub configurée)</summary>

```bash
claude plugin marketplace add git@github.com:jlguenego/jlg-ia.git
```

</details>

### Étape 3 — Vérifier que la marketplace est bien enregistrée

```bash
claude plugin marketplace list
```

Tu dois voir apparaître la marketplace **`jlg-ia`**.

### Étape 4 — Installer le plugin

```bash
claude plugin install orsys@jlg-ia
```

La syntaxe est `<plugin-name>@<marketplace-name>` :

- **`orsys`** : nom du plugin (défini dans `plugins/orsys/.claude-plugin/plugin.json`)
- **`jlg-ia`** : nom de la marketplace (défini dans `.claude-plugin/marketplace.json`)

Pour parcourir interactivement les plugins disponibles :

```bash
claude plugin
```

### Étape 5 — Activer / utiliser le plugin

Une fois installé, le skill `orsys-formation-plan` est disponible dans tes sessions Claude Code. Demande par exemple :

> « Génère-moi un plan de formation ORSYS sur le RAG opérationnel sur 2 jours. »

### Mettre à jour la marketplace

```bash
claude plugin marketplace update jlg-ia
```

### Désinstaller

```bash
claude plugin uninstall orsys@jlg-ia
claude plugin marketplace remove jlg-ia
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
