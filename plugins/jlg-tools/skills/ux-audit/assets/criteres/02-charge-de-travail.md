<!-- Source : https://ux-audit.github.io/criteres/ (MIT, Jean-Louis GUENEGO) -->

# Charge de travail

Un utilisateur est un être humain, et donc il a un cerveau d'humain :

- il est doté de mémoire, de force de décision, et d'actions qui en suivent.
- il est aussi muni de capacité de perception : la vision, l'ouïe, le toucher,
  et tous les autres sens connu par la médecine.

Lorsque l'utilisateur intéragit avec une interface, il a donc une charge

- de perception,
- de mémoire,
- de décision
- et d'action.

Les recommandations suivantes essayent de diminuer ces différentes charge de
travail. En effet, pour gagner en productivité, il faut passer moins de temps à
comprendre une interface, et moins de temps à cliquer, saisir des informations,
bouger la souris, etc.

Les critères sont organisés en deux parties :

- [la brièveté](./02a-brievete),
- [la densité informationnelle](./02b-densite-informationnelle)

Le design minimaliste a pour objet de diminuer le nombre de signifiances d'un
objet de design (ici, une interface de logiciel) tout en conservant la bonne
compréhension de ce que permet l'interface. Ce design essaye dans son essence
même de diminuer la charge de perception mais pas forcément la charge de
mémoire.

## Brièveté

Bastien & Scapin recensent deux types :

- concision (brièveté de lecture),
- actions minimales (brièveté d'action de saisie, de clic et de mouvement).

::: tip Astuces 😊

1. Ne montrer pas la complexité du métier aux utilisateurs non concernés.
2. Les labels devraient ̂être exprimés de manière télégraphique.
3. Eviter les paragraphes et les phrases complètes, sauf à la limite dans des
   paragraphes d'aides, qui apparaissent en tooltips ou suite à un clic sur (?).
4. Le langage de l'ergonome est l'égyptien : il parle plutôt avec des icônes
   qu'avec du texte. Ajouter une icône de préférence avant le texte, voire
   supprimer le texte et le remplacer par une icône.
5. Enlever tous les widgets qui ne semblent pas utiles sur l'interface.
6. Reléguer des fonctionnalités dans un bouton "et cetera".
7. Utiliser la complétion automatique dans les champs là où nécessaire.
8. Ne laisser que le moins de choix possible en excluant tous les choix non
   valides.
9. Préselectionner un choix et laisser l'utilisateur changer que si nécessaire
   plutôt que de laisser l'utilisateur choisir systématiquement.
10. Utiliser des raccourcis claviers pour des actions répétitives.

:::

## Densité informationnelle

Trop d'infos tue l'info ! Mais pas assez nécessite une charge de mémoire !

Attention, les utilisateurs ont une mémoire courte visuelle : après 0.5s, on ne
se souvient plus de l'image complète de ce que l'on regardait, mais seulement de
ce sur quoi on se concentrait.

::: tip Astuces 😊

1. Enlever toutes les informations qui ne sont pas pertinentes pour l'atteinte
   d'un objectif.
2. Ne pas hésiter à parfois enlever certains éléments redondant ou de mise en
   page (entête, pied de page, etc.)
3. Ne pas présenter de l'information qui va induire un calcul à l'utilisateur :
   calcul d'un temps restant plutôt que d'une heure fixe, présentation d'une
   information dans une unité non palpable (ex: Calorie aulieu de Joules, ou
   inversement)
4. Eviter à l'utilisateur d'avoir à se rappeler d'une information sur un écran
   précédent. Utiliser des récapitulatifs et peut-être aussi des fils d'arianes.

:::
