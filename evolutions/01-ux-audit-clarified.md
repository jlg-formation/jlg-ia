# Évolution 01 — Skill `ux-audit`

## Contexte

Le plugin `jlg-tools` de la marketplace jlg-ia regroupe des outils transverses (`clarify`, `restructure`). On y ajoute un skill d'audit d'ergonomie, destiné à un usage pédagogique en formation. Il s'appuie sur le référentiel publié sur [ux-audit.github.io](https://ux-audit.github.io/) (même auteur, licence MIT).

## Objectif

Produire, à partir d'une interface donnée, un rapport d'audit ergonomique structuré selon les critères de ux-audit.github.io. Le rapport doit servir de support d'apprentissage pour des stagiaires : chaque problème est expliqué, classé par sévérité et accompagné d'une correction concrète.

## Utilisateurs cibles

- **Stagiaires en formation** : ils lisent le rapport pour apprendre à reconnaître les défauts d'ergonomie et à les corriger.
- Le formateur lance le skill, en démonstration ou en atelier.

## Invocation

```
/ux-audit <cible> [critères]
```

- `<cible>` (obligatoire) : selon ce qui est fourni, l'une de ces sources ou plusieurs :
  - une URL d'application web en cours d'exécution ;
  - un dossier de code source front-end du workspace ;
  - des maquettes ou des captures d'écran (fichiers image).
- `[critères]` (optionnel) : liste des critères à auditer (ex. `guidage,gestion-erreurs`). Par défaut, l'audit porte sur les 8 critères.

## Référentiel

Une copie complète du contenu de ux-audit.github.io est embarquée dans `plugins/jlg-tools/skills/ux-audit/assets/` : critères, sous-critères, exemples et articles. Le skill consulte cette copie locale et ne dépend pas du site en ligne au moment de l'exécution.

Format : un fichier Markdown par critère, qui contient ses sous-critères et ses exemples. Les noms reprennent ceux du site :

```
assets/criteres/01-guidage.md
assets/criteres/02-charge-de-travail.md
...
assets/criteres/08-compatibilite.md
```

Le slug du fichier (ex. `guidage`, `gestion-erreurs`) sert d'identifiant pour le paramètre `[critères]`.

S'y ajoutent `assets/preliminaires.md` (méthodologie) et `assets/exemples/*.md` (exemples du site, sans les démos Vue interactives).

Les 8 critères (Bastien & Scapin) :

1. Guidage
2. Charge de travail
3. Contrôle explicite
4. Adaptabilité
5. Gestion des erreurs
6. Homogénéité / cohérence
7. Signifiance des codes et dénominations
8. Compatibilité

## Périmètre fonctionnel

1. **Analyse de la cible**
   - URL : navigation et captures avec les outils navigateur de l'agent (Playwright).
   - Code source : lecture des composants, templates et styles front-end. Analyse statique uniquement : le skill ne démarre aucun serveur et ne produit pas de capture. Les constats citent le fichier et la ligne concernés. Pour avoir des captures, l'utilisateur lance lui-même son application et passe l'URL.
   - Images : analyse visuelle des maquettes et captures fournies.
2. **Évaluation** : pour chaque critère retenu, relever des constats en s'appuyant sur les définitions et exemples du référentiel embarqué.
3. **Sévérité** : chaque constat est classé `mineur`, `majeur` ou `bloquant`. Il n'y a pas de note globale par critère.
4. **Recommandations** : chaque constat comporte
   - une explication pédagogique (quel critère est enfreint et pourquoi) ;
   - une recommandation de correction ;
   - un exemple de code ou de correctif, quand c'est pertinent.
5. **Captures annotées** (cible URL uniquement) : avant chaque capture, l'agent injecte dans la page un style CSS sur l'élément concerné (contour rouge épais et badge numéroté qui reprend le numéro du constat). Il prend la capture, puis retire l'annotation. Aucun traitement d'image après coup.

## Livrable

Un rapport Markdown, accompagné de ses captures d'écran annotées (images référencées depuis le rapport). Les constats y sont organisés par critère, avec leur sévérité.

Emplacement, à la racine du workspace :

```
ux-audit/<slug>/rapport.md
ux-audit/<slug>/captures/<NN>-<critere>.png
```

- `<slug>` : nom d'hôte pour une URL (ex. `localhost-5173`), nom du dossier pour du code, nom du premier fichier pour des images.
- `<NN>` : numéro du constat, sur deux chiffres.
- Si le dossier existe déjà, il est écrasé.

## Hors périmètre

- Note ou score chiffré par critère.
- Rapport HTML ou PDF.
- Consultation du site ux-audit.github.io pendant l'exécution.
- Démarrage automatique d'un serveur de dev.
- Annotation des images fournies par l'utilisateur.
- Tests automatisés du skill (pour l'instant).

## Contraintes techniques

- Emplacement : `plugins/jlg-tools/skills/ux-audit/` (`SKILL.md`, `assets/`).
- Captures : outils navigateur de l'agent (Playwright). Pas de script dédié dans `scripts/`.
- Mettre à jour les manifestes du plugin `jlg-tools` (Copilot et Claude Code) ainsi que la documentation (`CLAUDE.md`, `README.md`).

## Critères de succès

- `/ux-audit <url>` produit un rapport Markdown couvrant les 8 critères, avec des captures annotées.
- Chaque constat a une sévérité, une explication rattachée au référentiel, une recommandation et, si pertinent, un exemple de correctif.
- Le filtre `[critères]` limite effectivement l'audit aux critères demandés.
- Le skill fonctionne sans accès réseau au site ux-audit.github.io.

## Points en suspens

Aucun.
