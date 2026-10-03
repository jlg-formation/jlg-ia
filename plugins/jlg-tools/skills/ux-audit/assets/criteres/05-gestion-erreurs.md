<!-- Source : https://ux-audit.github.io/criteres/ (MIT, Jean-Louis GUENEGO) -->

# Gestion des erreurs

Trois catégories :

- [Protection contre les erreurs](./05a-protection-erreurs)
- [Qualité des messages d'erreurs](./05b-qualite-message-erreurs)
- [Correction des erreurs](./05c-correction-erreurs)

## Protection contre les erreurs

Mettre en place les mécanismes d'interface pour bien détecter et prévenir les
erreurs.

::: tip Astuces 😊

1. Bien guider l'utilisateur pour qu'il ne tombe pas dans des situations
   d'erreurs.
   - ne pas faire d'appel non authentifié alors que back-end exige une
     authentification.
   - ne pas faire d'appel au back-end qui vont renvoyer une erreur 400, 401,
     403, 404, etc.
2. L'empêcher de saisir des champs en faisant des erreurs. Filtrage de
   caractères. Validation synchrone, asynchrone avec debounce, et avant
   validation.
3. Eventuellement désactiver le bouton d'envoi du formulaire tant que certains
   champs sont invalides. Ou alors activer le bouton, mais lui demander de
   scroller vers le champ invalide aulieu d'envoyer le formulaire.
4. Désactiver ou cacher les boutons qui n'ont pas de sens dans le contexte ou
   l'état.

:::

## Qualité des messages d'erreurs

Si la plupart des situations d'erreurs peut être évitées par le chapitre
précédent (protection contre les erreurs), il faut cependant faire face à des
situations d'erreurs dûes à des conditions externes ou des systèmes externes que
l'on ne maîtrise pas :

- erreur de réseau internet, site web absent, DNS mal réglé, certificat
  invalide, etc.
- périphérique non présent ou non visible
- système externe exigeant une authentification, et qui s'est déconnecté sur sa
  propre initiative.
- système externe renvoyant une erreur interne technique (web: erreur >=500)
- une librairie du système d'exploitation non présente et nécessaire pour faire
  fonctionner le système logiciel.
- erreur de surcharge de système (quota dépassé, etc.),
- validation que seul le back-end connait.

::: tip Astuces 😊

1. Dans l'idéal, essayer de faire passer les messages d'erreur comme des
   informations, sans prendre les codes habituelles de message d'erreur (page de
   rouge, pas de point d'exclamation, ou de tonalité de réprimande)
2. Adopter un ton diplomatique et télégraphique, qui est rapide à lire et à
   comprendre.
3. Utiliser des termes les plus précis possible tout en étant compris par les
   utilisateurs.
4. Eviter l'humour, cas aucune réelle maîtrise du contexte. On peut rire de tout
   mais pas avec tout le monde.
5. Montrer le ou les champs qui ne sont pas correctement rempli pour permettre
   le bon traitement d'un formulaire.

:::

## Correction des erreurs

Indiquer si possible comment corriger l'erreur.

En effet, l'utilisateur sera moins perturbé si il sait comment sortir de la
situation d'erreur.

- rebrancher le réseau
- attendre que le système externe soit accessible à nouveau après un dépassement
  de quota
- se reconnecter après une déconnection intempestive.

::: tip Astuces 😊

1. Le message d'erreur peut donner une suggestion de correction d'erreur, brève
   mais compréhensible.
2. Le système peut rediriger l'utilisateur sur les entrées en erreur.

:::
