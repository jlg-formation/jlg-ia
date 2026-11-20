---
name: realigne
description: Réaligne un projet front-end web sur une stack standard — Vite, Bun géré par mise (mise.toml), formatage et lint OXC (oxfmt, oxlint) avec les commandes bun run format et bun run lint. Skill à déclenchement manuel uniquement : ne s'active QUE sur appel explicite /realigne.
disable-model-invocation: true
---

# realigne

## Objectif

Mettre un projet front-end de site web au standard suivant :

- bundler **Vite** ;
- runtime et gestionnaire de paquets **Bun** ;
- versions d'outils figées par **mise** via un fichier `mise.toml` ;
- formatage et lint avec la suite **OXC**, exposés par `bun run format` et `bun run lint`.

## Pipeline

Toute demande de confirmation ou de choix adressée à l'utilisateur passe par l'outil de question (`vscode_askQuestions` ou équivalent).

### 1. Détecter le type de projet

Lire `package.json`, la présence de `index.html`, de `vite.config.*` et les dépendances (react, vue, svelte, solid, etc.).

- Le projet doit être un front-end web utilisant Vite : présence de `vite` dans `package.json` (dependencies ou devDependencies) ou de `vite.config.*`, et de `index.html`.
- Si Vite n'est pas détecté, arrêter le skill et l'indiquer à l'utilisateur sans rien modifier.
- Si le cas est ambigu, poser une question avant de modifier quoi que ce soit.

### 2. Vérifier la configuration Vite

- Vérifier que les scripts `dev`, `build` et `preview` de `package.json` utilisent Vite. Corriger uniquement s'ils ne le font pas.
- Ne pas modifier la configuration Vite existante.

### 3. Bun

- Installer les dépendances avec `bun install`. Cela génère `bun.lock`.
- Si `package-lock.json`, `yarn.lock` ou `pnpm-lock.yaml` existent, demander confirmation avant de les supprimer.
- Tous les scripts `package.json` doivent fonctionner avec `bun run <script>`.

### 4. mise

Créer `mise.toml` à la racine avec la dernière version publiée de Bun, figée à son numéro exact (via `bun info bun version`) :

```toml
[tools]
bun = "<version-exacte>"
```

Ne pas ajouter de tâches de test ni d'autres sections à `mise.toml`. Si la version ne peut pas être déterminée, demander à l'utilisateur.

### 5. OXC : formatage et lint

- Ajouter `oxlint` et `oxfmt` en devDependencies (`bun add -d oxlint oxfmt`). Si l'installation échoue, vérifier les noms de paquets sur la documentation officielle OXC.
- Scripts dans `package.json` :

```json
"format": "oxfmt",
"format:check": "oxfmt --check",
"lint": "oxlint",
"lint:fix": "oxlint --fix",
"check": "bun run lint && bun run format:check"
```

- Fichiers de configuration : ne pas en créer. Si un fichier de configuration de formatage existe déjà (par exemple `.oxfmtrc.json`), le conserver. Si aucun n'existe, utiliser les règles OXC par défaut. Même principe pour le lint avec `.oxlintrc.json`.
- Migration depuis Prettier et/ou ESLint : si l'un ou l'autre est présent, demander confirmation à l'utilisateur pour leur suppression. Si elle est refusée, arrêter le skill. Sinon, convertir d'abord sa configuration avec les outils officiels OXC (`@oxlint/migrate` pour ESLint, guide « Migrate from Prettier » d'Oxfmt pour Prettier), retirer ses dépendances et plugins de `package.json`, supprimer ses scripts et ses fichiers de configuration (`.prettierrc*`, `.prettierignore`, `.eslintrc*`, `eslint.config.*`, `.eslintignore`), puis appliquer les équivalents OXC ci-dessus.
- Ne pas recréer les règles des anciennes configurations. Les lister dans le compte rendu lorsqu'elles n'ont pas d'équivalent OXC par défaut.
- CI : si un workflow (par exemple `.github/workflows/*.yml`) appelle Prettier ou ESLint, remplacer ces appels par `oxfmt` et `oxlint` (ou par `bun run format:check` et `bun run lint`).
- Hors périmètre : hooks Git (Husky, lint-staged) et tests. Ne pas les modifier.
- Ne pas créer de documentation (README, markdown) pour ces changements.

### 6. Vérifier

Exécuter dans l'ordre :

1. `bun install`
2. `bun run lint`
3. `bun run format`
4. `bun run format:check`
5. `bun run build`

Rapporter à l'utilisateur les fichiers modifiés et le résultat de chaque commande.

### 7. Corriger les erreurs et warnings de lint

- Lister les erreurs et warnings restants de `bun run lint`, puis demander confirmation avant toute modification de code.
- Après confirmation, corriger toutes les erreurs et tous les warnings, y compris par refactorisation si nécessaire.
- Prévenir explicitement l'utilisateur de chaque modification de code effectuée, avec les fichiers concernés.
- Si des fichiers ont été modifiés, relancer `bun run format`, puis `bun run check` et `bun run build`.

## Critères de fin

- `mise.toml` existe et déclare Bun.
- Vite est utilisé pour `dev` et `build`.
- `bun run format`, `bun run format:check` et `bun run lint` existent et s'exécutent sans erreur.
- `bun run check` réussit.
- `bun run build` réussit.
- Prettier et ESLint ne subsistent plus s'ils étaient présents.
- Aucun gestionnaire de paquets concurrent ne subsiste sans confirmation de l'utilisateur.
- Si une CI utilisait Prettier ou ESLint, elle appelle désormais OXC.
- Les erreurs et warnings de lint ont été corrigés après confirmation, ou l'utilisateur a refusé explicitement.
- Si des fichiers ont été modifiés en fin de skill, le formatage a été relancé après ces modifications.
