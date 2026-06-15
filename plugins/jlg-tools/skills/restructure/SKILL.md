---
name: restructure
description: Skill à déclenchement manuel uniquement — ne s'active QUE sur appel explicite /restructure. Ne pas invoquer automatiquement, quelle que soit la demande de l'utilisateur.
disable-model-invocation: true
---

# restructure

## Objectif

Réécrire un fichier contenant un prompt destiné à une IA afin d'en maximiser l'efficacité en prompt engineering, en respectant scrupuleusement le contexte et le format d'origine.

## Entrée

L'utilisateur fournit un chemin de fichier. Si aucun fichier n'est précisé, demander le chemin avant de continuer.

## Pipeline

### 1. Lire le fichier

Lire le contenu intégral du fichier fourni.

### 2. Clarification si nécessaire

Si après lecture du fichier des points restent ambigus (objectif flou, contexte d'exécution inconnu, cas limites non identifiables seul), poser des questions de clarification **avant de continuer**.

- Poser les questions **une par une**, jamais toutes d'un coup.
- Utiliser un outil approprié pour poser des questions de type QCM (choix multiples) quand c'est pertinent.
- Si le fichier est suffisamment explicite, sauter cette étape sans demander quoi que ce soit.

Exemples de points qui justifient une clarification :
- L'objectif de la restructuration n'est pas clair (amélioration générale ? problème précis constaté ?)
- Le type de prompt est ambigu et impacte la stratégie de réécriture
- L'utilisateur souhaite-t-il écraser le fichier original ou créer une version `<nom>-v2.<ext>` ?

### 4. Identifier le type de prompt

Analyser le contenu et le nom du fichier pour déterminer son type parmi :

| Type | Critères de détection |
|---|---|
| **SKILL.md** | Frontmatter YAML avec `name:`, `description:`, `disable-model-invocation:` ; pipeline structuré en sections |
| **Agent** (`*.agent.md`) | Extension `.agent.md` ou frontmatter avec `tools:`, `model:` ; instructions de comportement d'un agent |
| **Prompt système** | Fichier décrivant un rôle global, des règles de comportement, un persona — sans pipeline d'exécution |
| **Prompt utilisateur simple** | Instruction directe à exécuter une tâche précise, sans structure YAML ni pipeline |
| **Prompt de chaîne** | Prompt destiné à être injecté dans un pipeline multi-agents (contient des variables `{{...}}` ou `${...}`) |
| **Brief de projet** | Prompt qui initie un projet ou une mission : décrit le contexte, les objectifs, les livrables attendus et les contraintes de haut niveau — sans pipeline d'exécution détaillé. Souvent le point d'entrée d'une série de tâches. |
| **Autre** | Tout ce qui ne correspond pas aux catégories ci-dessus — indiquer la catégorie détectée à l'utilisateur avant de continuer |

### 5. Diagnostiquer les faiblesses

Identifier les problèmes selon les axes suivants, en les adaptant au type détecté :

**Clarté de l'objectif**
- L'objectif principal est-il énoncé dès le début, en une phrase ?
- Les critères de succès sont-ils explicites ?

**Structure**
- Les sections sont-elles clairement délimitées ?
- L'ordre est-il logique (contexte → tâche → contraintes → format de sortie) ?

**Contraintes**
- Les contraintes sont-elles exhaustives et sans ambiguïté ?
- Les cas limites sont-ils couverts ?

**Format de sortie**
- Le format attendu est-il spécifié (type de fichier, structure, longueur) ?
- Un exemple de sortie est-il fourni ou serait-il utile ?

**Ton et registre**
- Le niveau d'expertise attendu du modèle est-il précisé ?
- Le ton est-il cohérent sur l'ensemble du fichier ?

**Spécificités par type**
- *SKILL.md* : la `description` du frontmatter décourage-t-elle bien le déclenchement automatique ? Le pipeline est-il idempotent ? Les garde-fous sont-ils présents ?
- *Agent* : les outils autorisés sont-ils listés ? Le comportement en cas d'échec est-il défini ? L'agent sait-il quand s'arrêter ?
- *Prompt système* : le persona est-il cohérent ? Les limites de compétence sont-elles posées ?
- *Prompt de chaîne* : les variables sont-elles documentées ? Les dépendances entre étapes sont-elles explicites ?
- *Brief de projet* : le contexte métier est-il suffisant pour qu'une IA parte sans question ? Les livrables attendus sont-ils listés et mesurables ? Les contraintes de périmètre (ce qui est hors-scope) sont-elles explicites ?

### 6. Réécrire

Produire une version améliorée du fichier en appliquant les corrections identifiées.

**Format cible obligatoire pour la partie prompt** (corps markdown, hors frontmatter YAML éventuel) :

```markdown
## Rôles

**IA** : <rôle, expertise et posture de l'assistant>
**Utilisateur** : <profil, niveau, contexte de la personne qui interagit>

## Objectif

<Ce que le prompt doit accomplir, en 1 à 3 phrases.>

## Format

**Entrée** : <ce que l'utilisateur fournit>
**Sortie** : <format, structure et longueur attendus de la réponse>

## Instructions

<Étapes ou directives ordonnées. Omettre cette section si le prompt est une instruction directe sans pipeline.>

## Contraintes

**Obligations :**
- <ce que l'IA doit impérativement faire>

**Interdictions :**
- <ce que l'IA ne doit jamais faire>

## Livrables

L'IA ne s'arrête pas tant que les conditions suivantes ne sont pas toutes remplies :
- <condition 1>
- <condition 2>
- ...
```

**Règles de réécriture :**
- Conserver le frontmatter YAML d'origine intact (ne pas modifier `name:`, `description:`, `disable-model-invocation:`).
- Ne pas changer la langue du fichier.
- Ne pas ajouter de fonctionnalités absentes du prompt original.
- Ne pas supprimer d'informations métier — seulement reformuler, restructurer, préciser.
- Préférer des formulations courtes et actives aux phrases passives longues.
- **Ajouter des exemples** dans n'importe quelle section (Format, Contraintes, Instructions…) lorsqu'un exemple concret réduit une ambiguïté ou remplace avantageusement une description abstraite, et à condition de ne pas alourdir le prompt inutilement. Ne pas en ajouter si la formulation est déjà sans équivoque.
- Si une section n'a pas de contenu pertinent (ex. pas d'étapes → pas d'`Instructions`), l'omettre plutôt que de la laisser vide.

### 7. Présenter le résultat

Avant d'écrire le fichier, afficher :

1. **Type détecté** : le type de prompt identifié à l'étape 4.
2. **Diagnostic** : liste des faiblesses trouvées (5 lignes max, en bullets).
3. **Modifications clés** : ce qui a changé dans la réécriture (5 lignes max).

Puis demander confirmation avant d'écrire.

### 8. Écrire le fichier

Selon la réponse à la Question 3 (étape 2) :
- **Option A** : écraser le fichier original.
- **Option B** : créer `<nom>-v2.<ext>` dans le même répertoire.

Une fois confirmé, écraser le fichier original avec la version restructurée.

Afficher : `✓ <chemin> restructuré.`

Rappeler brièvement les 3 améliorations principales apportées.

## Garde-fous

- Ne jamais écrire le fichier sans confirmation explicite de l'utilisateur.
- Ne jamais changer le `name:` d'un SKILL.md ou d'un agent.
- Si le fichier est déjà bien structuré et ne présente pas de faiblesses significatives, le dire honnêtement plutôt que de réécrire pour le principe.
