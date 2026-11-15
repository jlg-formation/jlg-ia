---
name: refactorer
description: "Refactorer : identifie le code mort (inutilisé, inatteignable, exports orphelins, imports inutiles, code commenté) et les doublons (copies exactes, copies renommées, quasi-doublons, logique équivalente), vérifie le formatage, le lint et la taille des fichiers, ainsi que la documentation (README, AGENTS.md, CLAUDE.md, commandes du projet), dans n'importe quel langage. Ne se déclenche que sur commande explicite de l'utilisateur."
disable-model-invocation: true
---

# Refactorer

Analyse un périmètre de code pour repérer le code mort et les doublons, vérifier le formatage, le lint, la taille des fichiers et la documentation, puis produit un rapport enregistré dans le projet. Le skill ne modifie aucun fichier source : les suppressions et fusions ne sont appliquées qu'après accord explicite de l'utilisateur.

Le skill est indépendant du langage. Ne pas supposer un langage à partir du dépôt : détecter les langages présents via les extensions et les fichiers de configuration (`package.json`, `pyproject.toml`, `composer.json`, `Makefile`, `CMakeLists.txt`, `Makefile.PL`, etc.).

## 1. Définir le périmètre

- Si l'utilisateur donne un chemin, un dossier ou un module, l'utiliser. Une inclusion explicite passe outre les exclusions ci-dessous.
- Sinon, analyser le code source du dépôt, en excluant par défaut :
  - **Dépendances** : `node_modules`, `vendor` (PHP, Go), `.venv`, `venv`, `site-packages`, `deps` (Elixir), caches des gestionnaires de paquets.
  - **Sorties de build** : `dist`, `build`, `target` (Rust, Java), `bin` et `obj` (.NET), `cmake-build-*`, `_build`, `.next`, `out`.
  - **Artefacts générés** : `coverage`, `__pycache__`, `.pytest_cache`, `.mypy_cache`, `.tox`, `.git`, `*.min.js`, fichiers générés par un outil (repérés à leur en-tête).
  - **Tout chemin listé dans `.gitignore`**.
  - **Code tiers versionné**, identifié comme tel (répertoire `vendor`, `third_party`, `external`, copie de bibliothèque avec sa licence ou son en-tête d'origine). Le signaler dans le rapport sans l'analyser.
- Pour les fichiers déjà suivis par Git malgré un `.gitignore`, se fier à `git ls-files` : un fichier suivi reste dans le périmètre sauf s'il relève des catégories ci-dessus.
- Lister les exclusions appliquées dans le rapport, pour que l'utilisateur puisse les contester.
- Lister les langages détectés et les points d'entrée (scripts, `main`, routes, tests, configuration de build).

### Outils d'analyse

Quand le langage et le projet s'y prêtent, s'appuyer d'abord sur les outils dédiés, puis compléter par grep et lecture du code pour ce qu'ils ne voient pas (appels dynamiques, enregistrements par convention, logique équivalente).

- Vérifier si l'outil est déjà disponible : dépendance du projet, script dans la configuration (`package.json`, `pyproject.toml`, `composer.json`, `Makefile`), binaire dans le `PATH`.
- Ne jamais installer un outil, ni modifier la configuration du projet, sans accord de l'utilisateur. Proposer l'installation si l'outil apporte un gain net ; sinon, continuer sans.
- Lancer les outils sur le périmètre retenu uniquement, avec les exclusions de la section précédente.
- Les résultats d'outils restent des indices : chaque constat est vérifié dans le code avant d'entrer dans le rapport.

| Langage                 | Code mort                                                                                                                           | Doublons                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| TypeScript / JavaScript | `knip`, `tsc --noUnusedLocals --noUnusedParameters`, `oxlint` / `eslint` (`no-unused-vars`, `no-unreachable`), `depcheck`           | `jscpd`, PMD CPD                   |
| Python                  | `vulture`, `ruff` (F401, F841, ARG), `pylint` (W0611, W0612, W0613)                                                                 | `pylint` (R0801), `jscpd`, PMD CPD |
| PHP                     | `psalm --find-dead-code`, `phpstan`                                                                                                 | `jscpd`, PMD CPD                   |
| C / C++                 | `cppcheck --enable=unusedFunction`, `clang-tidy`, `-Wunused -Wunreachable-code`, `-Wl,--gc-sections,--print-gc-sections`            | PMD CPD, `jscpd`                   |
| Go                      | `staticcheck` (U1000), `deadcode`                                                                                                   | PMD CPD, `jscpd`                   |
| Rust                    | avertissements `dead_code`, `cargo-udeps`, `cargo-machete`                                                                          | `jscpd`                            |
| Java                    | PMD, UCDetector, `ProGuard -printusage`                                                                                             | PMD CPD                            |
| C# / .NET               | analyseurs Roslyn (IDE0051, IDE0052)                                                                                                | PMD CPD, `jscpd`                   |
| Perl                    | `Perl::Critic` (`ProhibitUnusedPrivateSubroutines`), `perl -c` avec `warnings`                                                      | `jscpd`, PMD CPD                   |
| Tous                    | couverture d'exécution (`c8`, `coverage.py`, `gcov`, `Devel::Cover`, Xdebug) : du code jamais exécuté est un indice, pas une preuve | SonarQube s'il est déjà en place   |

## 2. Détecter le code mort

Chercher, dans cet ordre de confiance décroissante :

1. **Code inatteignable** : instructions après `return`, `throw`, `exit`, `die`, `break`, `continue` ; branches conditionnelles dont la condition est constante.
2. **Imports, variables et paramètres inutilisés** : utiliser en priorité les outils de la table « Outils d'analyse » ; à défaut, faire la recherche par grep.
3. **Fonctions, classes, constantes, exports sans référence** : pour chaque symbole candidat, chercher toutes les occurrences dans le dépôt (code, tests, configuration, documentation, chaînes de caractères).
4. **Fichiers jamais importés ou inclus** : vérifier les `import`, `require`, `use`, `include`, `#include`, `source`, et les références dans la configuration de build.
5. **Code commenté** : blocs de code désactivés par commentaire, en distinguant les commentaires explicatifs.

### Faux positifs à vérifier avant de conclure

Un symbole sans référence statique peut être utilisé. Vérifier avant de le classer mort :

- Points d'entrée implicites : `main`, handlers, hooks de cycle de vie, méthodes magiques (`__init__`, `__str__`, `__call__`, `toString`, `AUTOLOAD`, `DESTROY`).
- Appel dynamique : réflexion, `getattr`, `eval`, `call_user_func`, chaînes de noms de méthodes, dispatch par table, `dlsym`.
- Enregistrement par convention : routes, tâches planifiées, décorateurs, composants chargés par JSX ou par template, outils déclarés par nom dans une chaîne (par exemple des outils MCP).
- API publique : exports d'une bibliothèque, symboles utilisés par des consommateurs externes, ABI C/C++.
- Tests et fixtures : ne pas compter un symbole comme utilisé uniquement parce qu'il est testé, mais ne pas le supprimer si un test l'exerce.

Attribuer à chaque constat un niveau de confiance :

- **Sûr** : aucune référence, aucun faux positif plausible, détecté par le compilateur ou le linter.
- **Probable** : aucune référence statique, mais un mécanisme dynamique ou un consommateur externe est possible.
- **À vérifier** : dépend d'un contexte que seul l'utilisateur connaît.

## 3. Détecter les doublons

Identifier les blocs de code équivalents, dans les formes suivantes :

1. **Copie exacte** : blocs identiques après normalisation des espaces, des lignes vides et des commentaires.
2. **Copie renommée** : même structure, avec seulement les identifiants ou les littéraux différents.
3. **Quasi-doublon** : copie avec de petites modifications (une condition, un paramètre supplémentaire, un message).
4. **Logique équivalente** : même traitement écrit différemment (boucle explicite et `map`/`filter`, `if/else` et ternaire, deux implémentations d'une même conversion de format).

Méthode suggérée :

- Lancer d'abord un détecteur de doublons disponible (`jscpd`, PMD CPD, `pylint` R0801). Il couvre les copies exactes et renommées ; les quasi-doublons et la logique équivalente restent à chercher à la main.
- Commencer par les blocs de plus de 5 lignes ou de plus de 2 occurrences, puis descendre si nécessaire.
- Chercher les littéraux et noms distinctifs (messages, clés, URL, constantes) qui apparaissent à plusieurs endroits, pour trouver les copies rapidement.
- Pour les fonctions, comparer les signatures et les corps. Pour les fichiers, comparer les listes de symboles.
- Ignorer les doublons volontaires qui relèvent de l'isolement (tests, fichiers de configuration répétés par nécessité, code généré), et le signaler comme tel.
- Estimer le gain réel : une abstraction qui ajoute plus de complexité que la duplication ne doit pas être proposée.

## 4. Vérifier le formatage, le lint et la taille des fichiers

### Formateur et linter

1. **Détecter** ceux que le projet utilise : fichiers de configuration (`.prettierrc*`, `.oxfmtrc.json`, `biome.json`, `dprint.json`, `.editorconfig`, `eslint.config.*`, `.oxlintrc.json`, `pyproject.toml` sections `[tool.black]` / `[tool.ruff]`, `.flake8`, `.clang-format`, `.clang-tidy`, `rustfmt.toml`, `.golangci.yml`, `.php-cs-fixer.php`, `phpstan.neon`, `.perltidyrc`, `.perlcriticrc`), scripts du projet (`format`, `format:check`, `lint` dans `package.json`, `Makefile`, `composer.json`), dépendances de développement.
2. **Lancer en mode vérification seulement**, jamais en mode écriture pendant l'analyse : par exemple `prettier --check`, `oxfmt --check`, `biome check`, `black --check`, `ruff format --check`, `gofmt -l`, `cargo fmt --check`, `clang-format --dry-run --Werror`, `php-cs-fixer fix --dry-run`, `perltidy` comparé au fichier d'origine. Pour le linter, utiliser le script du projet s'il existe.
3. **Rapporter** : outil et commande utilisés, nombre de fichiers non formatés, nombre d'erreurs et d'avertissements de lint, par règle.
4. **Sans formateur ou sans linter** : le signaler et proposer dans les questions l'outil standard du langage (Prettier ou oxfmt, Black ou Ruff, gofmt, rustfmt, clang-format, perltidy, etc.), sans l'installer.

### Taille des fichiers

Un fichier trop long est coûteux à lire pour une IA et souvent le signe d'un module qui fait trop de choses.

- **Seuil** : reprendre la limite du projet si elle existe (règle `max-lines` du linter, consigne dans `AGENTS.md`, `CONTRIBUTING.md` ou équivalent). Sinon, signaler les fichiers de plus de **300 lignes**, et en priorité ceux de plus de **500 lignes**.
- Compter les lignes de tous les fichiers source du périmètre et lister ceux qui dépassent le seuil, du plus long au plus court.
- Signaler aussi les lignes très longues (plus de 200 caractères) hors données, qui trahissent du code minifié ou généré.
- Pour chaque fichier trop long, proposer un découpage par responsabilité : quels symboles vont dans quel nouveau fichier. Si le découpage est clair et mécanique, en faire une tâche ; sinon, une question.
- Ne pas compter les fichiers de données, de traduction ou de fixtures : ils sont longs par nature.

## 5. Vérifier la documentation

Objectif : un humain comme une IA doit pouvoir reprendre le projet en 30 secondes. La documentation fait partie du périmètre du refactoring.

### Inventaire des commandes

Lire toutes les sources de commandes du projet : scripts de `package.json`, tâches de `mise.toml`, cibles de `Makefile`, `justfile`, `Taskfile.yml`, scripts de `composer.json`, `pyproject.toml` (`[project.scripts]`, `[tool.poetry.scripts]`, `[tool.hatch]`), alias de `.cargo/config.toml`, `Rakefile`, `build.gradle`, workflows CI (`.github/workflows/*.yml`), etc. Relever aussi le gestionnaire de paquets réellement utilisé (fichier de verrou : `bun.lock`, `package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`, `uv.lock`, `Cargo.lock`, `composer.lock`) et les versions d'outils imposées (`mise.toml`, `.nvmrc`, `.python-version`, `.tool-versions`).

Comparer cet inventaire au README et aux fichiers d'instructions pour l'IA :

- **Commandes non documentées** : installer, lancer, tester, linter, formater, construire, déployer doivent figurer dans le README.
- **Commandes obsolètes** : documentées mais absentes des sources.
- **Incohérences** : mauvais gestionnaire de paquets (`npm` documenté alors que le verrou est `bun.lock`), versions différentes, chemins ou ports faux.
- **Contradictions avec le code** : affirmations de la documentation démenties par le dépôt (par exemple « pas de tests unitaires » alors qu'un dossier de tests unitaires existe).

### README pour l'utilisateur

Le README passe le test des 30 secondes si son premier écran répond à :

1. À quoi sert le projet (une ou deux phrases) ?
2. Quels sont les prérequis (langage, version, outils) ?
3. Comment l'installer ?
4. Comment le lancer ?
5. Comment le tester ?

Chaque critère manquant ou faux devient une tâche, avec le texte Markdown exact à insérer ou à remplacer et son emplacement (texte d'ancrage). Si le README est absent, proposer son contenu complet. Si sa structure est à revoir, proposer le nouveau plan dans les questions, sans réécrire d'office.

### Fichiers d'instructions pour l'IA

- Chercher `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `GEMINI.md`, `.cursor/rules/`, `.cursorrules`.
- **Sans `AGENTS.md`** : proposer sa création dans les questions, avec un contenu complet rédigé à partir de l'analyse : objectif du projet, stack, commandes, architecture et fichiers clés, conventions (formateur, linter, taille de fichier), pièges connus.
- **Sans `CLAUDE.md`** alors que `AGENTS.md` existe : tâche pour créer `CLAUDE.md` contenant la seule ligne `@AGENTS.md`, afin de ne pas dupliquer les instructions.
- **Fichiers existants** : vérifier qu'ils sont à jour avec l'inventaire des commandes et avec le code, comme pour le README.

## 6. Produire le rapport

Enregistrer le rapport à la racine du dépôt, sous le nom `refactorer-report-AAAA-MM-JJ.md` (date locale au format ISO, pour un tri chronologique).

- Si un rapport existe déjà pour la même date, ajouter l'heure : `refactorer-report-AAAA-MM-JJ-HHmm.md`. Ne jamais écraser un rapport existant.
- Ne pas l'ajouter au `.gitignore` ni le commiter : l'utilisateur décide de le garder, de le versionner ou de le supprimer.
- En tête du rapport : date et heure, périmètre demandé, commit analysé (`git rev-parse --short HEAD`) et présence de modifications non commitées.
- Dans le chat, donner le lien vers le fichier et un résumé de quelques lignes, sans recopier le rapport.

### Format : une liste de tâches exécutable

Le rapport est une to-do list qu'un modèle peu capable, sans accès à cette conversation, doit pouvoir exécuter seul. Suivre le modèle [report-template.md](report-template.md).

Sections, dans l'ordre :

1. **En-tête** : date, périmètre et exclusions, commit, langages, outils lancés, commandes de vérification du projet (compilation, linter, formateur en mode vérification, tests).
2. **Mode d'emploi pour l'exécutant** : recopier tel quel celui du modèle.
3. **État du code** : formateur et linter détectés, résultat de leur vérification, tableau des fichiers trop longs, état de la documentation (README au test des 30 secondes, fichiers d'instructions pour l'IA, commandes non documentées ou obsolètes).
4. **Tâches** : uniquement les constats de confiance **Sûr**, classés du plus sûr au plus risqué, puis par gain. Placer en dernier les tâches de formatage et de correction automatique du lint (`--fix`) : elles modifient le texte du code et invalideraient les textes d'ancrage des autres tâches.
5. **Questions pour l'utilisateur** : les constats **Probable** et **À vérifier**, formulés comme une question fermée, avec l'action à mener selon la réponse.
6. **Écarté** : code tiers, doublons volontaires, faux positifs identifiés, avec la raison.

Chaque tâche contient tous les champs du modèle :

- Titre avec case à cocher et identifiant : `### [ ] T1 — <verbe à l'infinitif> <cible>`.
- **Type**, **Confiance**, **Dépend de** (identifiants des tâches à faire avant, ou « aucune »).
- **Fichier(s)** avec lien et plage de lignes, et un **texte d'ancrage** : une ligne exacte et unique du fichier qui permet de retrouver le code après décalage des lignes.
- **Vérification préalable** : une recherche ou une commande précise, avec le résultat attendu.
- **Action** : étapes numérotées et littérales. Donner le code exact à écrire et le nom exact des fichiers, fonctions et imports. Aucune décision ne doit rester à l'exécutant.
- **Raison** : une phrase, avec l'outil qui a détecté le constat s'il y en a un.

Règles de rédaction :

- Une tâche = une modification atomique, vérifiable seule.
- Phrases courtes, verbes à l'infinitif, aucun renvoi implicite (« comme ci-dessus », « le bloc en question »).
- Liens au format `[chemin/fichier.ts](chemin/fichier.ts#L10-L20)`, chemins relatifs à la racine du dépôt (donc relatifs au rapport).

## 7. Appliquer les changements (seulement sur accord)

- Ne modifier le code qu'après confirmation explicite de l'utilisateur.
- Exécuter les tâches du rapport en suivant son mode d'emploi, et cocher chaque tâche dans le fichier au fur et à mesure (`[x]` réussie, `[!]` abandonnée avec la raison).
- Ne pas créer d'autre fichier Markdown que le rapport, sauf si l'utilisateur le demande.

## Critères de qualité du rapport

- Chaque tâche cite un fichier, des lignes et un texte d'ancrage réels, vérifiés dans le code.
- Chaque suppression proposée a été recherchée dans tout le dépôt.
- Chaque action est exécutable sans interprétation : un exécutant qui ne connaît ni le projet ni cette conversation peut l'appliquer.
- Les faux positifs possibles sont dans les questions ou dans « Écarté », jamais dans les tâches.
