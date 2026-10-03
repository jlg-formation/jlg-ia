<!-- Source : https://ux-audit.github.io/criteres/ (MIT, Jean-Louis GUENEGO) -->

# Guidage

Le guidage a pour but de s'assurer que l'utilisateur puisse intéragir avec le
logiciel en ne manquant pas de :

- conseil pour s'orienter
- information sur un état ou un contexte
- direction pour le conduire à son objectif

Exemple :

**Conseil pour s'orienter**

- "Sur quel site je suis ? Ah je vois son logo dans l'entête !"
- "Je voudrais savoir si je peux avoir ce site en Français ? Ah oui, je vois en
  haut à droite de l'entête un menu d'internationalisation avec des drapeaux de
  langues"

**Information sur un état ou un contexte**

- "Je viens de cliquer sur ce bouton et je vois qu'il est désactivé avec un
  spinner qui tourne à l'intérieur : je me dis que le bouton est entrain de
  travailler..."
- "Je vois mon nom en haut dans l'entête à droite, je pense que je suis donc
  connecté."

**Direction pour le conduire à son objectif**

- "Je viens d'arriver sur un site depuis Google, est-ce le bon ? Ah ! Je vois la
  grosse phrase au centre qui correspond pile poil à ce que je veux : Réserver
  une place de cinéma partout en France !"
- "Comment on va à la suite du processus ? Ah oui, il y a un bouton intitulé
  'suivant>'."

Ce critère est très large, il englobe :

1. [l'incitation](./01a-incitation)
2. [groupement/distinction entre éléments](./01b-groupement-distinction)
3. [Feedback immédiat](./01c-feedback-immediat)
4. [lisibilité](./01d-lisibilite)

## Incitation

### Amener les utilisateurs à effectuer des actions spécifiques

Voyons par l'exemple d'une interrogation, puis par la suggestion d'une solution
logique:

> **Je voudrais que les utilisateurs viennent sur mon site.**

- Pourquoi ?
- Parce que sur mon site il y a des informations intéressantes que je voudrais
  qu'ils lisent.
- Avez-vous pensé à mettre en place des mesures SEO (référencement naturel,
  amélioration de la visibilité sur les moteurs de recherche) ?

---

> **Je voudrais que les utilisateurs créent un compte sur mon site.**

- Mais pourquoi vos utilisateurs le feraient-ils ?
- Mais parce qu'ils en ont besoin pour que je leur envoie ce qu'ils me demandent
  : des produits qu'ils achètent.
- Eh bien explique leur que pour qu'ils puissent recevoir les produits, ils faut
  qu'ils donnent leur nom, prénom, email, telephone, et adresse de livraison,
  puis que pour ne pas répéter le process d'inscription, tu peux mémoriser cela
  sur un compte qu'ils créent.
- Je pense qu'ils ont compris mais ils ne voient pas comment faire pour créer un
  compte.
- Sur quelle page sont ils lorsqu'ils se demandent cela ?
- Ils viennent de cliquer sur "Commander" dans la page du panier.
- Eh bien, à ce moment là, il faut mettre dans leur champ visuel un bouton de
  "création de compte", ou même carrément un formulaire de création de compte !

Sur ces deux exemples, on peut constater que la solution vient naturellement si
on s'interroge **qui est l'utilisateur**, et surtout **quel est son objectif**,
ses attentes en venant sur le logiciel.

Si on comprend ce que cherche à faire l'utilisateur à tout moment de
l'utilisation, alors les écrans peuvent devenir beaucoup plus simples : ils ne
montrent que ce que l'utilisateur attend, et pas autre chose.

Encore mieux : l'utilisateur peut se passer de comprendre certains aspects du
métier lorsque on ne lui laisse pas le choix de faire des « bêtises », c'est à
dire lorsque l'interface le **guide**.

::: tip Questions à se poser... 😊

- C'est qui l'utilisateur ? Il vient faire quoi ?
- Comprend-il par où commencer sur le premier écran ?
- Et ensuite que fait-il ? Et pourquoi l'utilisateur va-t-il continuer ?
- Y a-t-il pas des choses à l'écran inutiles pour ce que l'utilisateur vient
  faire ?

:::

### Les alternatives, les choix, en fonction des états ou des contextes

Un logiciel doit pouvoir faire face en général à de multiples utilisateurs, avec
des objectifs différents. Un métier est ce qu'il est. Et il est parfois complexe
et ne peut être réduit
([Loi de Tesler](https://ux-lois.github.io/cards/03-law-tesler/)).

Ce n'est pas pour autant que les écrans doivent être complexes, notamment
lorsque l'utilisateur doit faire des choix.

::: tip Astuces ! 😊

1. [Mettre en valeur un choix parmi des boutons secondaires avec un bouton primaire](../exemples/boutons-primaires-et-secondaires)
2. [Prépositionner](../exemples/prepositionner) les choix.
3. Eviter de faire
   [des questions avec des boutons OUI/NON](../exemples/eviter-oui-non).
4. Ne faire apparaitre les questions suivantes après que l'utilisateur ait
   répondu aux questions précédentes. C'est le principe de la
   [divulgation progressive](../exemples/divulgation-progressive)

:::

### Informations, aides permettant de savoir dans quel état, contexte l'utilisateur se trouve par rapport à son objectif.

En général, il est nécessaire que l'utilisateur sache toujours où il en est, et
que le reste à faire ne soit pas pénible à identifier sur l'interface et ne
paraisse pas difficile à achever.

::: tip Astuces ! 😊

1. Lorsque l'utilisateur parcours plusieurs écrans techniques différents, un
   [fil d'ariane](https://www.redacteur.com/blog/wordpress-fil-ariane-site-web/)
   dans l'entête du site l'aide à savoir où il en est.
2. A la fin d'un processus, ne pas oublier de récompenser l'utilisateur. C'est
   [la règle pic-fin](https://ux-lois.github.io/cards/98-peak-end-rule/).
3. Un bouton qui fait une action longue, devrait se désactiver et indiquer avec
   une animation (ex: spinner) que la partie non visible du logiciel est entrain
   de faire une action longue. Voir à cet effet la règle du
   [goal gradient effect](https://ux-lois.github.io/cards/02-effect-goal-gradient/).
4. Un bouton de validation de formulaire devrait faire l'un ou l'autre en cas de
   champ mal rempli :
   - soit se désactiver pour interdire la soumission
   - soit ̂être actif et servir de débogueur en scrollant vers le champ mal
     rempli.
5. Un champ de saisie mal rempli devrait avoir un message d'erreur. Ce message
   devrait être proche du champ de saisie, généralement en dessous.
6. Un message d'erreur ne devrait pas provoquer de
   [Cumulative Layout Shift](https://web.dev/articles/cls?hl=fr).
7. Eviter les champs de saisie libre. Essayer de trouver un équivalent qui
   permet une saisie uniquement en cliquant sur des boutons (ex: Calendrier,
   sélecteur de quantité). On l'appelle ici un **champ de saisie guidé**.
8. Lorsque l'utilisateur arrive sur un formulaire, mettre le focus sur le
   premier champ du formulaire.
9. Lorsque un champ de saisie guidé est complété, il est recommandé de mettre le
   focus sur le suivant pour inviter l'utilisateur dans sa saisie.
10. Lorsqu'un champ de saisie est complété et que sa valeur parait bonne
    vis-à-vis du métier, alors ne pas hésiter à l'indiquer et à féliciter
    brièvement l'utilisateur (par un :heavy_check_mark:, ou un encadrement en
    vert, etc.)
11. Filtrage du clavier sur champ de saisie. Lorsqu'un champ de saisie accepte
    uniquement certains caractères, filtrer les touches claviers qui ne sont pas
    des valeurs permises. Exemple : ne pas laisser rentrer des caractères
    alphabétiques lorsqu'un nombre est attendu.
12. Indiquer dans le champ des placeholders avec des exemples de valeurs. Un
    exemple est parfois plus parlant qu'un label.
13. [Indiquer le label d'un champ de préférence sur le dessus du champ](../exemples/label_dessus.md).
    Il est ainsi dans la zone de vision de l'utilisateur.
14. Si un champ de saisie correspond à un code (ex: numéro de sécu, carte bleue,
    téléphone) alors [insérer des espaces](../exemples/champ-espaces.md) entre
    blocs de code pour améliorer la lisibilité du code.
15. Indiquer par un tooltips, ou un bouton d'aide (?)) donnant une aide plus
    détaillée les champs dont le label risque de ne pas être bien compris.
    [On peut aussi appliquer la technique du label secondaire](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/champ-de-saisie#:~:text=Champ%20avec%20texte%20d%E2%80%99aide).
16. Indiquer par une asterisque (\*) les champs obligatoires.

:::

### Moyens d'accessibilité permettant à l'utilisateur d'atteindre son objectif.

Aujourd'hui, l'accessibilité est devenue un sujet juridique. En France par
exemple, on peut se référer au
[RGAA et ses critères d'accessibilité](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/)
pour améliorer l'accessibilité de son logiciel.

## Groupement / Distinction

Bastien et Scapin font une nuance entre l'incitation directe, par un message
explicite et les incitations indirectes, par les affordances.

On peut sur une interface exprimer des messages, sans forcement les dire.

Par exemple, certaines portes n'ont pas besoin d'écriteau "tirer" ou "pousser"
pour que les utilisateurs sachent la manoeuvrer. La présence ou l'absence de
gonds dans la vision périphérique peut suffire. Une porte donnant sur un
couloir, ou une rue se tire afin de ne pas gêner le passage sur lequel elle
débouche, sauf pour raison d'incendie.
[Voir portes de Donald Norman](https://www.hteumeuleu.fr/les-portes-de-norman/).

### Par la localisation

Les utilisateurs identifient rapidement les entêtes, pied de page, barres de
côté. Les disposition des éléments fait énormément appel aux lois de la Gestalt.
Par exemple,

- [loi de la proximité](https://ux-lois.github.io/cards/04-gestalt-02-law-of-proximity/),
- [loi des contours](https://ux-lois.github.io/cards/04-gestalt-law-of-common-region/),
- [loi de la similitude](https://ux-lois.github.io/cards/04-gestalt-law-of-similarity/)

sont utilisées pour mettre ensemble ou au contraire distinguer des groupes.

::: tip Astuces 😊

1. Identifier les bugs de [loi de proximité](../exemples/gestalt/proximite).
2. Identifier les bugs de [loi de contour](../exemples/gestalt/contours).
3. Identifier les bugs de [loi de similitude](../exemples/gestalt/similitude).
4. Identifier les bugs de [bonne forme](../exemples/gestalt/bonne-forme).
5. Dans une liste, mettre les choix les plus spécifiques en premier et les plus
   généraux et primaire en dernier. Pour éviter que l'utilisateur
   [choisisse une solution générale sans avoir vu qu'une solution plus spécifique](../exemples/ordre-choix)
   lui correspondait mieux.
6. Dans une liste, préférer un ordre cohérent : alphabétique, ou du plus
   recent/ancien, ou du plus grand au plus petit, ou du plus utilisé au moins
   utilisé, etc.
7. Considérer la loi de Hick : mettre moins de choix apparent, et
   [intégrer les choix restants dans un menu "..."](../exemples/bouton-etcetera)
8. [Préférer montrer une image avant le contenu](../exemples/image-avant-texte),
   que ce soit en lecture verticale ou horizontale.
9. Attention au sens de lecture :
   - arabe/hébreux : toute la mise en page se met en miroir par rapport au
     latin, les images se mettent à droite de leur contenu, le futur est à
     gauche tandis que le passé est à droite.
   - vertical : les images se mettent au dessus de leur contenu, le futur est en
     bas, tandis que le passé est en haut.
10. Aérer l'interface en partant de grosses valeurs d'espacement et faites les
    réduires jusqu'à une taille visuellement acceptable.
11. Utiliser moins de bordure et plus d'espacement. Privilégier la loi de
    proximité à la loi de contour.
12. Utiliser des flèches ou chevron de direction, le futur est à droite pour le
    latin, à gauche pour l'hébreu et l'arabe.
13. Le pied de page est un marqueur visuel, ne pas l'oublier de l'ajouter si
    l'utilisateur a des doutes de bien être en bas de l'écran.

:::

### Par le format

::: tip Astuces 😊

1. Appliquer la loi de Fitts :

- Préférer les boutons qui contourent le choix plutôt que les cases à cocher ou
  les boutons radio
- Si boutons radio ou case à cocher alors
  [agrandir les surfaces cliquables](../exemples/loi-de-fitts/taille)
- [Eviter les zones d'actions trop distantes des zones de lecture associées](../exemples/loi-de-fitts/distance)

2. Plonger le réel dans l'écran. Exemple : vous voulez afficher un ticket de
   cinema ? Alors mettez un ticket de cinema à l'écran... et l'utilisateur verra
   un ticket de cinema sans que ce soit besoin d'écrire "Ticket de cinema".
3. [Utiliser des formes convaincantes et distinctes](../exemples/gestalt/bonne-forme)
   selon la nature, par exemple :

   - Faire des champs de saisie qui se ressemblent.
   - Faire des labels qui se ressemblent.
   - Faire des champs de saisie qui ne ressemblent pas à des labels.

4. Utiliser des paradigmes de mise en page :
   - une carte est un duo image, et texte.
   - une carte avec action :
     - verticale : image en haut, texte, et boutons en bas.
     - horizontale : image à gauche, texte, et boutons à droite.
5. [Eviter les guirlandes d'actions](../exemples/guirlande-actions) dans des
   listes et préférer des items selectionnables avec barres d'outils en haut de
   la liste.

:::

## Feedback immédiat

Lorsqu'un utilisateur déclenche une action sur une interface, celle-ci doit
répondre immédiatement. Il peut s'agit d'un avertissement sonore, mais bien
souvent l'interface est silencieuse. Alors on utilise un moyen visuel : on
montre un changement d'état indiquant que l'action a été déclenchée. Si l'action
est longue alors l'interface signale par un état que l'action est entrain de se
faire en tâche de fond. Une animation est bienvenue car elle reflète le travail,
et un travail est un mouvement. Lorsque l'action est très longue, le mouvement
devrait refléter une progression. Pour rendre l'utilisateur encore plus patient
on peut utiliser des outils comme le
[goal gradient effect](https://ux-lois.github.io/cards/02-effect-goal-gradient/).
Une fois l'action terminée, l'utilisateur doit constater immédiatement le
résultat de l'action.

On appelle **temps de latence** le temps entre l'ordre de l'utilisateur et le
démarrage effectif de l'action.

L'utilisateur a besoin de feedback immédiat :

- pour une meilleure sensation de contrôle de l'état de l'application.
- pour limiter l'impatience où la divagation (émotion négative).

Un utilisateur peut en effet commencer à divaguer après 1 seconde d'attente sur
un processus.

::: tip Astuces 😊

1. Utiliser des boutons à taille suffisamment grosses pour cliquer dessus
   agréablement. [C'est la loi de Fitts](../exemples/loi-de-fitts/).
2. Utiliser de préférence des boutons avec un "border radius" sauf si le site
   est jugé formel. Les utilisateurs, inconsciemment n'aiment pas cliquer sur
   des choses pointues.
3. Laisser un peu d'espace entre les boutons, pour aerer visuellement et surtout
   empêcher les utilisateurs de cliquer sur le bouton d'à côté.
4. Penser à désactiver un bouton pendant qu'il effectue son action. Cela évite
   aux utilisateurs de lancer l'action plusieurs fois de suite, sans faire
   exprès.
5. Insérer un spinner dans le bouton pendant qu'il fait son action.
6. Insérer une barre de progression près du bouton pour montrer une action qui
   progresse.
7. Si l'action est très longue, penser à utiliser le goal gradient effect.
8. Eviter les temps de latence, surtout si l'interface sert à piloter un
   automate en temps réel.
9. Dans un champ de saisie, il est possible de vouloir valider l'entrée
   utilisateur en temps réel. Si cette validation prends du temps, cela peut
   provoquer de la latence. Il faut alors utiliser le **debounce**, et la
   validation asynchrone (ie: qui ne bloque pas le processus de la fenêtre).
10. Certains boutons, comme par exemple des zooms, de la translation peuvent
    causer des actions à répétition et créer une saturation de la machine. On
    suggère alors le **throttle** pour atténuer.
11. Une action asynchrone a 4 états :

    - avant de commencer
    - entrain de faire l'action, avec un taux d'avancement
    - sortie en erreur, avec cause et suggestion de correction
    - sortie en succès, avec temps de réalisation et résultat.

    L'interface devrait montrer éventuellement les différents états.

12. Une action asynchrone devrait éventuellement être interruptable et
    réversible.

13. Dans le cas d'entrée confidentielle, mettre au moins des asterisques, et un
    bouton oeil.
14. Dans un processus à étapes, penser à mettre un récapitulatif des options
    déjà sélectionnées.

:::

## Lisibilité

La lisibilité concerne tous les aspects où du texte apparait :

- contraste
- taille de caractères
- majuscules/minuscules
- gras, italic, soulignés et autres styles
- espacements : entre caractères, entre lignes, entre paragraphes
- choix des polices de caractères

Notez qu'un certains nombre de heuristiques sont bien expliquées dans le livre
"Refactoring UI".

::: tip Astuces 😊

1. Respecter les niveaux de contraste du WCAG, ou RGAA.
2. Taille des caractères :
   - éviter en dessous de 16px.
   - ne pas mixer trop de tailles de caractères différentes,
   - préferer changer le style ou le contraste que la taille de caractère
3. Ecrire la prose en minuscule, pourquoi pas certains titres en majuscules.
4. Ne pas se disperser dans les styles d'écritures et utiliser un minimum
   d'artefact pour donner de l'importance à des extraits.
5. Donner de l'importance à des textes en donnant moins d'importance à d'autres
   textes.
6. Parler de manière télégraphique, pour accélerer la bonne compréhension.
7. Eviter les labels, les valeurs parlent d'elles-mêmes, sauf si l'utilisateur
   recherche visuellement la présence du label.
8. La hierarchie d'un document n'est pas forcément la hierarchie visuelle (h1,
   h2, h3, ...)
9. Equilibrer le niveau de contraste avec le niveau de gras.
10. Ne mettre en valeur que le processus nominal : Utiliser des boutons
    secondaires pour les autres actions de branchements.
11. Privilégier l'alignement sur la ligne d'écriture, et non pas le centrage
    vertical de blocs.
12. La largeur d'un texte ne doit pas être trop grande, et la hauteur des
    espaces entre ligne devrait être proportionnel à la largeur du texte.
13. Un lien ne doit pas forcément être bleu et souligné, surtout si cela lui
    donne trop d'importance.
14. L'alignement à droite du texte est dangereux pour la lisibilité.
15. Elargir le texte (avec du "letter-spacing") si le texte est en majuscule.
16. Choisir explicitement des fontes, les réglages des utilisateurs ne sont pas
    forcément les mêmes que vous.
17. Choisir des fontes connues, avec un maximum de réglages (gras, italique,
    etc.) et suffisamment de caractères encodés.
18. Bien réfléchir au choix de la fonte pour la tonalité de votre application.
19. On peut jouer sur l'espacement entre caractères :

:::
