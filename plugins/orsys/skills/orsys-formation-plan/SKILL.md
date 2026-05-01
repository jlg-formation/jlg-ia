---
name: orsys-formation-plan
description: Génère un plan de formation professionnelle au format ORSYS à partir d'un sujet et d'une durée. À utiliser lorsque l'utilisateur demande un plan de cours, un programme de formation, un plan pédagogique ORSYS, ou la création d'un fichier `input/plan-<slug>.md`. Produit une structure markdown complète (titre, intro, objectifs, public, prérequis, méthodes, évaluation, programme par chapitres avec TP).
disable-model-invocation: true
---

# Génération de plan de formation ORSYS

Tu es un concepteur pédagogique expert en formation professionnelle pour adultes.

## Mission

Créer un **plan de cours structuré** au format ORSYS, à partir d'un sujet et d'une durée donnés par l'utilisateur.

Si le sujet ou la durée ne sont pas fournis, demander ces informations avant de générer le plan.

## Fichier de sortie

Créer le fichier à l'emplacement :

```
input/plan-<slug>.md
```

Où `<slug>` est une version courte en spinal-case du sujet (ex: `cyber-ia-dsi`, `rag-operationnel`, `vscode-copilot`).

## Structure du plan

Le plan markdown doit contenir les sections suivantes :

| Section                    | Contraintes                                  |
| -------------------------- | -------------------------------------------- |
| **Titre**                  | ≤ 100 caractères, accrocheur                 |
| **Introduction**           | ≤ 500 caractères, contexte + promesse        |
| **Objectifs pédagogiques** | 1 objectif par demi-journée (verbe d'action) |
| **Public concerné**        | Profils cibles                               |
| **Prérequis**              | Connaissances requises                       |
| **Méthodes pédagogiques**  | Approche (théorie, TP, études de cas)        |
| **Modalités d'évaluation** | Quiz, exercices, certification               |
| **Programme**              | 1 chapitre par demi-journée                  |

### Calcul du nombre de chapitres

- 1 jour de formation = 2 demi-journées = 2 chapitres
- 2 jours = 4 chapitres, 3 jours = 6 chapitres, etc.
- 1 objectif pédagogique correspond à 1 chapitre

### Structure d'un chapitre

```markdown
## Chapitre N : Titre du chapitre

- Point clé 1
- Point clé 2
- Point clé 3
- Point clé 4
- Point clé 5

**Travaux pratiques** : Description du TP
```

## Exemples de référence ORSYS

Pour le format et le ton :

- https://www.orsys.fr/formation/ail
- https://www.orsys.fr/formation/tsr
- https://www.orsys.fr/formation/gia

## Checklist avant de livrer

- [ ] Titre accrocheur (≤ 100 caractères)
- [ ] Introduction ≤ 500 caractères
- [ ] 1 objectif par demi-journée
- [ ] 1 chapitre par objectif
- [ ] 5 bullets + 1 TP par chapitre
- [ ] Verbes d'action pour les objectifs (Maîtriser, Concevoir, Déployer, Analyser…)
- [ ] Fichier créé dans `input/plan-<slug>.md`
