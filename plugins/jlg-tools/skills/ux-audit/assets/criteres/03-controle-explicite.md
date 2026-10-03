<!-- Source : https://ux-audit.github.io/criteres/ (MIT, Jean-Louis GUENEGO) -->

# Contrôle explicite

Deux catégories :

- [actions explicites](./03a-actions-explicites)
- [contrôle utilisateur](./03b-controle-utilisateur)

## Actions explicites

L'application doit seulement exécuter les actions demandées par l'utilisateur,
et pas d'autre, pour éviter l'effet de (mauvaise) surprise.

Si jamais l'application venait à executer d'autres actions sans que
l'utilisateur l'ait demandé, alors il faut que l'interface l'en informe aussitôt
et que l'utilisateur constate le plus vite possible l'intérêt.

En effet, dans la relation homme-machine, l'homme est le "chef", la machine est
l'assistant. Si l'assistant prend des initiatives, elles ont intérêt à être
bonnes, sinon c'est la catastrophe.

Il peut aussi arriver que le "chef" donne des ordres par erreur, par exemple un
mauvais tremblement de la main sur la souris, dans ce cas, il faut que le
système permette de revenir en arrière, si l'action est réversible. Si l'action
n'est pas réversible, on dit qu'elle est critique et dans cette situation, il
est bien de demander une confirmation de l'action.

::: tip Astuces 😊

1. Les actions critiques devraient avoir une validation par confirmation.
2. Les actions critiques devraient nécessiter deux actions à des endroits
   différent de l'écran.
3. Les raccourcis claviers devraient avoir plusieurs touches simultanées pour ne
   pas avoir d'accident de clavier.
4. Les actions devraient être là où l'utilisateur cherche en premier.
5. Les formulaires ne devraient être envoyés qu'après avoir cliqué sur un bouton
   validation.
6. L'interface ne devrait pas faire d'actions métiers qui n'ont pas été
   souhaitées par l'utilisateur. Une action ne devrait pas cacher une autre
   action.

:::

## Contrôle utilisateur

L'utilisateur doit toujours avoir la sensation qu'il est le chef, aux commandes.
Lorsqu'ils veut démarrer une action, la suspendre ou la reprendre, il doit vite
trouver comment faire sur l'interface.

Ensuite, il faut savoir que l'utilisateur a des limites motrices. Des fois, il
peut cliquer approximativement sur des boutons. Il faut donc que les boutons
aient des tailles minimum et soit un peu distant entre eux.

::: tip Astuces 😊

1. Un utilisateur ne doit pas être limité en temps par des phénomènes
   indépendant de sa volonté pour intéragir avec un écran.
2. Eviter les CLS (Cumulative Layout Shift)
3. Eviter les carroussels ininterrompables.
4. Une action en cours doit pouvoir être interrompable, et pourquoi pas
   reprenable de là où elle a été arrêtée.
5. Prévoir des actions "undo"/"redo"
6. Prévoir une taille minimum pour les boutons
7. Augmenter la surface clickable au label.
8. [Prévoir un minimum de distance entre les boutons](../exemples/distance-entre-boutons).
9. Si une carte a une image, du texte et seulement une action, alors faire que
   l'action soit le clic sur la carte elle-même, même si il y a un visuel de
   bouton.

:::
