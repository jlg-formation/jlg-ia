Format de fichier : voir exemple `./assets/securite.yaml`

Vu que le fichier pourra contenir plusieurs centaines de questions, il sera enorme et probablement intraitable en une seule passe avec un LLM. Il faut donc utiliser des subagents en parallele qui construiront des fichiers intermediaire avec des portions de YAML, lance par un agent orchestrateur, et terminer par un agent assembleur qui va construire le fichier YAML final.

Il faut aussi utiliser des scripts de verification, des linter YAML, des verificateurs de schemas (construire un schema a partir de l'exemple `./assets/securite.yaml`)

Entree du skill :
3 cas :

- une URL avec un plan de formation
- un fichier markdown avec un plan de formation
- un simple sujet theme

Volume cible :
Faire par defaut 6 chapitres contenant 20 questions.
Si le plan de formation contient des chapitres, reprendre exactement les titres de chapitres et leur nombre. (ex: un plan de formation contient 8 chapitres -> alors faire 8 chapitres)

Granularité de parallélisation : Faire des vagues de parallelisme avec 4 sous- agents max en paralleles pour eviter de saturer le forfait de l'assistant IA.

Format des reponses : toujours 4 reponses, une seule correcte. Les reponses doivent avoir une longueur de caractere similaires.

Schema YAML : il faut le construire et le mettre en `assets/` pour que la verification se fasse par un script. Constuire aussi le script. Eviter de faire avec un LLM ce qui peut etre fait par un script. En revanche, il faut preparer les scripts en amont. Les scripts doivent etre avec `bun`. Ils doivent etre dans un repertoire `/.skills-tmp-scripts/` et peuvent utiliser un `/.skills-tmp-scripts/package.json` et `bun install`.

Python interdit. Utiliser bun

Sortie finale du fichier : `/squizzer-qcm/qcm-<slug>.yaml`

Fichier intermediaire : `/.tmp/<slug>/chap-<id>-q<idQS>-q<idQE>`
avec :

- id : numero de chapitre
- idQS : numero de depart de question
- idQE : numero de fin de question

Attention a ce que les questions ne soit pas presque identique.
