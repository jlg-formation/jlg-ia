---
name: squizzer-qcm
description: Génère un fichier YAML de QCM pour le site Squizzer à partir d'un sujet, d'un fichier markdown de plan de formation, ou d'une URL de plan de formation. Utilise des subagents en vagues parallèles pour produire des centaines de questions, puis assemble et valide via des scripts bun.
disable-model-invocation: true
---

# squizzer-qcm

## Objectif

Produire un fichier `qcm-<slug>.yaml` conforme au format Squizzer (voir `assets/securite.yaml`) à partir d'une des trois entrées :

1. Un **sujet/thème** simple (ex. « Sécurité informatique »)
2. Un **fichier markdown** contenant un plan de formation
3. Une **URL** pointant vers un plan de formation

## Règles de génération

- **Par défaut** : 6 chapitres × 20 questions = 120 questions
- **Si un plan est fourni** (markdown ou URL) : reprendre **exactement** les titres et le **nombre** de chapitres du plan ; 20 questions par chapitre par défaut (ajustable si l'utilisateur précise)
- **Format de chaque question** : 4 réponses, **une seule correcte**, longueurs des réponses **similaires** — le ratio entre la réponse la plus longue et la plus courte (en mots) doit rester **≤ 2.0** ; `validate.ts` rejette tout dépassement
- **Pas de questions quasi-identiques** : varier les formulations, les angles, les pièges
- **IDs** : chapitres en kebab-case (`basics`, `advanced`...), questions `q1`, `q2`, ... numérotées globalement croissantes au sein d'un chapitre
- Langue : **français**

## Pipeline (à exécuter dans l'ordre)

### 1. Préparer les scripts (une fois par projet)

Les scripts canoniques vivent dans `${SKILL_DIR}/scripts/`. Au premier usage dans un workspace :

```bash
mkdir -p .skills-tmp-scripts
cp ${SKILL_DIR}/scripts/*.ts ${SKILL_DIR}/scripts/package.json .skills-tmp-scripts/
cd .skills-tmp-scripts && bun install
```

Si `.skills-tmp-scripts/node_modules` existe déjà, sauter cette étape.

### 2. Résoudre l'entrée et construire le plan

- **Sujet seul** → inventer 6 titres de chapitres pertinents et progressifs.
- **Fichier `.md`** → `Read`, extraire les titres `##` ou `#` qui correspondent aux chapitres.
- **URL** → `WebFetch` avec un prompt qui demande la liste des chapitres (titres exacts).

Choisir un `<slug>` court en kebab-case dérivé du titre global (ex. `qcm-securite-informatique` → slug = `securite-informatique`).

Préparer le répertoire de travail : `.tmp/<slug>/`

### 3. Planifier les sujets (orchestrateur seul — garantie anti-doublons)

**Cette étape est la garantie centrale de non-duplication.** L'orchestrateur génère lui-même, en une seule passe, la liste exhaustive de tous les sujets de questions — avant de lancer le moindre subagent.

Pour chaque chapitre, produire exactement 20 sujets distincts sous la forme :

```yaml
# .tmp/<slug>/topics.yaml
chapters:
  - id: <chapId>
    title: "<titre du chapitre>"
    order: 0
    topics:
      - id: q1
        sujet: "Définition et rôle du chiffrement symétrique"
        angle: "Conceptuel — distinguer chiffrement symétrique vs asymétrique"
      - id: q2
        sujet: "Algorithme AES : principes de fonctionnement"
        angle: "Technique — taille de clé, blocs, modes"
      # ... 18 autres sujets uniques
  - id: <chapId2>
    # ...
```

**Règles de planification :**
- Chaque `sujet` doit être **unique sur l'ensemble du fichier** (tous chapitres confondus) — vérifier soi-même avant d'écrire.
- Couvrir des **angles différents** : définition, histoire, mécanisme technique, cas d'usage, limites, comparaison, exemple concret, erreur fréquente, bonne pratique, norme/standard…
- Varier les niveaux de difficulté au sein d'un chapitre (débutant, intermédiaire, avancé).
- Écrire `topics.yaml` dans `.tmp/<slug>/` avant de passer à l'étape suivante.

### 4. Découper en lots et lancer les vagues de subagents

Pour chaque chapitre, **découper les 20 sujets en 4 lots de 5** (`q1-q5`, `q6-q10`, `q11-q15`, `q16-q20`).
Cela donne, pour 6 chapitres, **24 lots** → exécuter en **vagues de 4 subagents max en parallèle** (6 vagues de 4).

Pour chaque lot, lancer un subagent `orsys-general-purpose` (déclaré dans `plugins/orsys/agents/orsys-general-purpose.agent.md`) avec un prompt **autonome** qui :

- précise le titre du QCM, le titre + id du chapitre, la plage de questions (ex. q11–q20)
- impose le format YAML de sortie ci-dessous
- exige : 1 seule réponse correcte, explication concise
- **contrainte de longueur stricte** : les 4 réponses doivent avoir un nombre de mots similaire — le ratio max/min ≤ 2.0 (ex. si la réponse la plus courte fait 4 mots, la plus longue ne peut pas dépasser 8 mots). Cette règle est vérifiée mécaniquement par `validate.ts` : un dépassement bloque la livraison. Pour respecter la contrainte : rallonger les distracteurs courts ou raccourcir la réponse correcte si elle est trop développée.
- fournit **les sujets pré-assignés** extraits de `topics.yaml` pour ce lot — le subagent **rédige uniquement**, il ne choisit pas les sujets
- demande l'écriture du fichier à `.tmp/<slug>/chap-<chapId>-q<idQS>-q<idQE>.yaml`

Format du fichier intermédiaire :

```yaml
chapter_id: <id>
chapter_title: "<titre du chapitre>"
chapter_order: <numéro 0-based>
questions:
  - id: q<n>
    question: "..."
    answers: ["...", "...", "...", "..."]
    correct: 0
    explanation: "..."
```

**Garantie anti-doublons :**
- **Par construction (étape 3)** : les sujets sont planifiés et dédupliqués par l'orchestrateur avant toute génération. Les subagents n'ont aucune latitude pour choisir les angles.
- **Filet de sécurité (post-assemblage)** : `check-duplicates.ts` (Jaccard ≥ 0.8) détecte tout doublon résiduel de formulation et déclenche une regénération ciblée.

### 5. Assembler

```bash
bun .skills-tmp-scripts/assemble.ts .tmp/<slug>/ ./squizzer-qcm/qcm-<slug>.yaml "<titre du QCM>"
```

### 6. Valider

```bash
bun .skills-tmp-scripts/validate.ts ./squizzer-qcm/qcm-<slug>.yaml ${SKILL_DIR}/assets/schema.json
bun .skills-tmp-scripts/check-duplicates.ts ./squizzer-qcm/qcm-<slug>.yaml 0.8
```

- `validate.ts` → schéma JSON Schema + cohérence (ids uniques, index `correct` valide, 4 réponses)
- `check-duplicates.ts` → similarité Jaccard sur les énoncés (seuil 0.8)

### 7. Boucle de correction

Si `validate.ts` échoue → corriger directement le YAML final ou regénérer le lot fautif.
Si `check-duplicates.ts` signale des doublons → relancer un subagent ciblé pour réécrire les questions incriminées (lui donner les énoncés des deux questions et exiger une reformulation distincte).

### 8. Nettoyage (optionnel, demander à l'utilisateur)

`.tmp/<slug>/` peut être supprimé une fois la validation OK.

## Sortie finale

`./squizzer-qcm/qcm-<slug>.yaml` (chemin relatif au workspace de l'utilisateur)

## Référence du format final

Voir `assets/securite.yaml` pour un exemple concret. Schéma machine-vérifiable : `assets/schema.json`.

## Garde-fous

- **Python interdit** — tout outillage en `bun` / TypeScript.
- **Ne pas faire avec un LLM ce qu'un script peut faire** : tri, déduplication d'IDs, validation de schéma, comptage → toujours via les scripts `bun`.
- **Vagues de 4 subagents max** en parallèle. Ne jamais lancer 12 subagents d'un coup.
- **Longueurs de réponses** : ratio max/min ≤ 2.0 en nombre de mots, vérifié par `validate.ts`. La contrainte est donnée explicitement dans chaque prompt de subagent avec un exemple chiffré.
