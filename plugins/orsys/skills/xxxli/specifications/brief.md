# Brief — Skill `orsys-formation-livre`

## 1. Objectif

Transformer un **plan de formation** (fichier Markdown) en un **livre pédagogique complet** au format Markdown compatible GitHub, structuré en répertoires et fichiers, en français, avec illustrations Mermaid, exemples de code (TypeScript / Bun) et métadonnées éditoriales.

## 2. Entrée

- **Type** : un fichier Markdown unique.
- **Contenu** : plan hiérarchique de la formation (chapitres → bullet points).
- **Convention attendue** :
  - `#` ou `##` pour les chapitres.
  - listes à puces (`-`, `*`) pour les bullet points à développer.

## 3. Sortie

### 3.1 Arborescence

```
/livres/
└── <slug-formation>/
    ├── README.md              # page de garde + table des matières
    ├── preface.md
    ├── bibliographie.md
    ├── 01-<chapitre-slug>/
    │   ├── README.md          # introduction de chapitre + sommaire local
    │   ├── 01-<bullet-slug>.md
    │   ├── 02-<bullet-slug>.md
    │   └── ...
    ├── 02-<chapitre-slug>/
    │   └── ...
    └── ...
```

- `<slug-formation>` : dérivé automatiquement du **titre `#` de niveau 1** du plan d'entrée (kebab-case, sans accents).
- `<chapitre-slug>` et `<bullet-slug>` : kebab-case, sans accents, dérivés des titres / bullet points.
- Numérotation préfixée (`01-`, `02-`, …) pour préserver l'ordre du plan.

### 3.4 Idempotence

Si `/livres/<slug-formation>/` existe déjà, le répertoire est **écrasé** (suppression puis régénération complète). Aucune fusion, aucun suffixe `-v2`.

### 3.2 Contenu d'un fichier bullet point

Chaque fichier Markdown correspondant à **un bullet point du plan** doit :

- faire **800 à 1200 mots** (cible ~1000).
- être structuré ainsi :
  1. **Problématique** : exposition claire de la question traitée.
  2. **Développement pédagogique** : explication progressive, ton vulgarisateur mais rigoureux.
  3. **Illustrations** : diagrammes **Mermaid uniquement** (flux, séquence, architecture, état). Aucune image externe (PNG/SVG/JPG) ni autre format.
  4. **Code** : extraits **TypeScript / Bun** lorsque le sujet s'y prête, commentés.
  5. **Exemples concrets** : cas d'usage, analogies, mises en situation.
  6. **Réponse à la problématique** : synthèse explicite qui boucle sur l'introduction.
  7. **Renvois** : liens Markdown relatifs vers les autres bullet points / chapitres concernés.

### 3.3 Métadonnées éditoriales

- **Page de garde** (`README.md` racine) : titre, public cible, niveau, table des matières générée automatiquement avec liens cliquables.
- **Préface** (`preface.md`) : contexte, objectifs pédagogiques, parcours de lecture recommandé.
- **Bibliographie** (`bibliographie.md`) : deux sections distinctes —
  - **Sources citées** : références effectivement citées dans le contenu des chapitres.
  - **Ressources complémentaires recommandées** : livres, documentations officielles, articles utiles pour approfondir.

## 4. Paramètres du skill

| Paramètre       | Valeurs                                   | Défaut          |
| --------------- | ----------------------------------------- | --------------- |
| `plan`          | chemin vers le fichier Markdown du plan   | (obligatoire)   |
| `niveau`        | `debutant` \| `intermediaire` \| `expert` | `intermediaire` |
| `langue`        | `fr`                                      | `fr`            |
| `racine_sortie` | chemin                                    | `/livres/`      |

## 5. Style et ton

- **Langue** : français exclusivement.
- **Ton** : pédagogique, vulgarisateur, précis ; pose explicitement les problématiques avant d'y répondre.
- **Cohérence narrative** : progression et **storytelling** entre chapitres et bullet points ; les notions s'appuient sur celles déjà introduites (renvois explicites par liens Markdown).

## 6. Stratégie de génération

Génération **chapitre par chapitre, bullet point par bullet point**, orchestrée :

1. **Phase 1 — Plan directeur** (séquentiel, par l'orchestrateur)
   - Lecture du plan d'entrée.
   - Production d'un **plan directeur du livre** : pour chaque bullet point, fiche synthétique précisant l'angle, les notions abordées, les pré-requis (renvois en arrière), les annonces (renvois en avant), les exemples de code prévus, les diagrammes envisagés.
   - Ce plan directeur garantit la cohérence narrative globale et évite redondances et contradictions entre sous-agents.

2. **Phase 2 — Rédaction parallélisée** (sous-agents en parallèle)
   - Un sous-agent par bullet point, alimenté par sa fiche du plan directeur + le contexte global (titres des autres bullets, glossaire commun).
   - Chaque sous-agent produit un fichier Markdown conforme à la section 3.2.
   - Recommandation de parallélisation explicite dans le `SKILL.md`.

3. **Phase 3 — Assemblage** (séquentiel)
   - Génération du `README.md` racine, des `README.md` de chapitre, de la préface, de la bibliographie.
   - Vérification des liens internes (renvois) et de la table des matières.

## 7. Livrable du skill

Un fichier `SKILL.md` dans `plugins/orsys/skills/orsys-formation-livre/` décrivant :

- la description et les triggers d'invocation,
- les paramètres acceptés,
- le pipeline en 3 phases ci-dessus,
- les conventions de nommage et d'arborescence,
- les contraintes éditoriales (volume, structure, ton),
- la stratégie de parallélisation recommandée.

