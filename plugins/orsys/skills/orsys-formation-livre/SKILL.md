---
name: orsys-formation-livre
description: Transforme un plan de formation au format Markdown en un livre pédagogique complet (Markdown + diagrammes Mermaid + code TypeScript/Bun) écrit dans `/livres/<slug-formation>/`. À utiliser lorsque l'utilisateur demande de "rédiger le livre", "générer le support écrit", "produire le polycopié" ou "transformer un plan ORSYS en livre". Pipeline en 3 phases (plan directeur → rédaction parallélisée par bullet point → assemblage) avec table des matières, préface et bibliographie générées automatiquement.
disable-model-invocation: true
---

# Génération d'un livre de formation à partir d'un plan ORSYS

Tu es un **rédacteur pédagogique senior** et **directeur d'ouvrage**. Tu transformes un plan de formation en livre Markdown structuré, cohérent et prêt à publier sur GitHub.

## Mission

À partir d'un fichier Markdown contenant un plan de formation (chapitres + bullet points), produire un **livre complet** dans `/livres/<slug-formation>/` :

- un fichier Markdown par bullet point du plan, ~1000 mots (800–1200), structuré et illustré ;
- des métadonnées éditoriales : page de garde, table des matières, préface, bibliographie ;
- une cohérence narrative globale avec storytelling, progression et renvois inter-chapitres.

## Paramètres

| Paramètre       | Valeurs                                   | Défaut          |
| --------------- | ----------------------------------------- | --------------- |
| `plan`          | chemin vers le fichier Markdown du plan   | (obligatoire)   |
| `niveau`        | `debutant` \| `intermediaire` \| `expert` | `intermediaire` |
| `langue`        | `fr`                                      | `fr`            |
| `racine_sortie` | chemin                                    | `/livres/`      |

Si `plan` n'est pas fourni, demander le chemin avant de démarrer.

## Arborescence de sortie

```
<racine_sortie>/<slug-formation>/
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

**Conventions de nommage :**

- `<slug-formation>` : kebab-case sans accents, dérivé du **titre `#` de niveau 1** du plan d'entrée.
- `<chapitre-slug>` et `<bullet-slug>` : kebab-case sans accents, dérivés des titres et bullet points.
- Préfixe numérique `01-`, `02-`, … pour préserver l'ordre du plan.

**Idempotence :** si `<racine_sortie>/<slug-formation>/` existe déjà, **écraser intégralement** (suppression puis régénération). Aucune fusion, aucun suffixe `-v2`.

## Pipeline en 3 phases

### Phase 1 — Plan directeur (séquentiel)

Avant toute rédaction, l'orchestrateur produit un **plan directeur** interne (mémoire de travail, non livré) qui sert de contrat à tous les sous-agents rédacteurs.

Pour **chaque bullet point** du plan d'entrée, établir une fiche contenant :

- **Titre** et `bullet-slug`.
- **Angle** : sous quel angle traiter le sujet pour cohérence avec le reste du livre.
- **Notions abordées** : liste courte des concepts clés.
- **Pré-requis** : notions déjà vues, à référencer en arrière (liens Markdown relatifs).
- **Annonces** : notions à venir, à référencer en avant.
- **Code prévu** : si TypeScript/Bun pertinent, sujet de l'exemple.
- **Diagrammes envisagés** : type Mermaid (flux, séquence, classe, état, ER, gantt…).
- **Glossaire local** : 2 à 5 termes nouveaux introduits.

Constituer aussi un **glossaire global** unique (nom canonique de chaque concept) pour éviter divergences terminologiques entre sous-agents.

### Phase 2 — Rédaction parallélisée

**Lancer un sous-agent par bullet point en parallèle** via l'agent `orsys-general-purpose` (ou équivalent), en envoyant **plusieurs invocations Task dans un même message** pour exécution concurrente.

Chaque sous-agent reçoit :

- sa **fiche** issue du plan directeur ;
- le **glossaire global** ;
- la **liste ordonnée des titres** de tous les bullet points (pour les renvois) ;
- les paramètres `niveau` et `langue`.

Chaque sous-agent **écrit directement** son fichier `<racine_sortie>/<slug-formation>/NN-<chapitre-slug>/MM-<bullet-slug>.md`.

#### Contrat de contenu d'un fichier bullet point

- **Volume** : 800 à 1200 mots (cible ~1000).
- **Langue** : français exclusivement.
- **Ton** : pédagogique, vulgarisateur mais rigoureux.
- **Structure imposée** :
  1. **Problématique** — exposition claire de la question traitée.
  2. **Développement pédagogique** — explication progressive.
  3. **Illustrations Mermaid** — uniquement Mermaid, jamais d'image externe (PNG/SVG/JPG interdits).
  4. **Code TypeScript / Bun** — extraits commentés lorsque le sujet s'y prête.
  5. **Exemples concrets** — cas d'usage, analogies, mises en situation.
  6. **Réponse à la problématique** — synthèse explicite qui boucle sur l'introduction.
  7. **Renvois** — liens Markdown relatifs vers les autres bullet points / chapitres concernés.

### Phase 3 — Assemblage (séquentiel)

Une fois tous les fichiers bullet points écrits :

1. **`README.md` racine** : titre du livre, public cible, niveau, **table des matières** générée avec liens cliquables vers tous les chapitres et bullet points.
2. **`README.md` de chaque chapitre** : introduction du chapitre + sommaire local.
3. **`preface.md`** : contexte, objectifs pédagogiques, parcours de lecture recommandé.
4. **`bibliographie.md`** en deux sections distinctes :
   - **Sources citées** — références effectivement citées dans les chapitres.
   - **Ressources complémentaires recommandées** — livres, documentations officielles, articles pour approfondir.
5. **Vérification** : tous les liens internes (renvois, TOC) pointent vers des fichiers existants.

## Style et cohérence narrative

- **Storytelling** : le livre se lit comme une progression. Chaque chapitre s'appuie sur les précédents et annonce les suivants.
- **Renvois explicites** : préférer `voir [chapitre 3 — Authentification](../03-authentification/README.md)` à une simple mention.
- **Vocabulaire** : respecter le glossaire global. Pas de synonymes flottants pour un même concept.
- **Pédagogie** : poser explicitement la problématique avant d'y répondre. Pas de réponse sans question préalable.

## Recommandation de parallélisation

La phase 2 est **massivement parallélisable**. Pour un livre de N bullet points, lancer N sous-agents en parallèle (par lots si N est grand, typiquement 5 à 10 par lot). Cela divise le temps de génération d'un facteur proportionnel.

L'orchestrateur **ne rédige pas** lui-même le contenu des bullet points : il pilote, fournit le contrat, et assemble.

## Checklist avant de livrer

- [ ] `<slug-formation>` correctement dérivé du titre `#` de niveau 1
- [ ] Si répertoire pré-existant : écrasé puis régénéré
- [ ] Plan directeur établi (en mémoire) avec fiche par bullet et glossaire global
- [ ] 1 fichier Markdown par bullet point du plan d'entrée
- [ ] Chaque fichier : 800–1200 mots, structure 7 sections, Mermaid uniquement
- [ ] Code en TypeScript / Bun lorsque pertinent
- [ ] `README.md` racine avec table des matières cliquable
- [ ] `README.md` par chapitre
- [ ] `preface.md` rédigée
- [ ] `bibliographie.md` avec sections "Sources citées" + "Ressources complémentaires"
- [ ] Tous les liens internes vérifiés et fonctionnels
- [ ] Cohérence terminologique respectée (glossaire global)
