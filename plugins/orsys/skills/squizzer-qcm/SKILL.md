---
name: squizzer-qcm
description: Génère un fichier YAML de QCM pour le site Squizzer à partir d'un sujet, d'un fichier markdown de plan de formation, ou d'une URL de plan de formation. Utilise des subagents en vagues parallèles pour produire des centaines de questions, puis assemble et valide via des scripts bun.
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
- **Format de chaque question** : 4 réponses, **une seule correcte**, longueurs des réponses **similaires** (éviter qu'une réponse se distingue par sa taille)
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

### 3. Découper en lots et lancer les vagues de subagents

Pour chaque chapitre, **découper les 20 questions en 4 lots de 5** (`q1-q5`, `q6-q10`, `q11-q15`, `q16-q20`).
Cela donne, pour 6 chapitres, **24 lots** → exécuter en **vagues de 4 subagents max en parallèle** (6 vagues de 4).

Pour chaque lot, lancer un subagent `orsys-general-purpose` (déclaré dans `plugins/orsys/agents/orsys-general-purpose.agent.md`) avec un prompt **autonome** qui :

- précise le titre du QCM, le titre + id du chapitre, la plage de questions (ex. q11–q20)
- impose le format YAML de sortie ci-dessous
- exige : 4 réponses de longueurs similaires, 1 seule correcte, explication concise, pas de redite avec les autres lots du même chapitre (lui donner les **questions déjà écrites** des lots précédents du même chapitre comme contexte « à ne pas dupliquer »)
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

**Stratégie anti-doublons inter-lots** : les vagues sont séquentielles entre chapitres (lot 2 d'un chapitre attend le lot 1). Pour les paralléliser quand même, donner au lot 2 la **liste des intitulés** prévus dans le lot 1 (planning préalable rapide) ou laisser le script `check-duplicates.ts` détecter et déclencher une regénération ciblée.

### 4. Assembler

```bash
bun .skills-tmp-scripts/assemble.ts .tmp/<slug>/ ./squizzer-qcm/qcm-<slug>.yaml "<titre du QCM>"
```

### 5. Valider

```bash
bun .skills-tmp-scripts/validate.ts ./squizzer-qcm/qcm-<slug>.yaml ${SKILL_DIR}/assets/schema.json
bun .skills-tmp-scripts/check-duplicates.ts ./squizzer-qcm/qcm-<slug>.yaml 0.8
```

- `validate.ts` → schéma JSON Schema + cohérence (ids uniques, index `correct` valide, 4 réponses)
- `check-duplicates.ts` → similarité Jaccard sur les énoncés (seuil 0.8)

### 6. Boucle de correction

Si `validate.ts` échoue → corriger directement le YAML final ou regénérer le lot fautif.
Si `check-duplicates.ts` signale des doublons → relancer un subagent ciblé pour réécrire les questions incriminées (lui donner les énoncés des deux questions et exiger une reformulation distincte).

### 7. Nettoyage (optionnel, demander à l'utilisateur)

`.tmp/<slug>/` peut être supprimé une fois la validation OK.

## Sortie finale

`./squizzer-qcm/qcm-<slug>.yaml` (chemin relatif au workspace de l'utilisateur)

## Référence du format final

Voir `assets/securite.yaml` pour un exemple concret. Schéma machine-vérifiable : `assets/schema.json`.

## Garde-fous

- **Python interdit** — tout outillage en `bun` / TypeScript.
- **Ne pas faire avec un LLM ce qu'un script peut faire** : tri, déduplication d'IDs, validation de schéma, comptage → toujours via les scripts `bun`.
- **Vagues de 4 subagents max** en parallèle. Ne jamais lancer 12 subagents d'un coup.
- Toujours vérifier que les **réponses ont des longueurs proches** (signal donné dans le prompt de chaque subagent).
