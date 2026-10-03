<!-- Source : https://ux-audit.github.io/criteres/ (MIT, Jean-Louis GUENEGO) -->

# Critères

Ce site a pour objectif d'aider un consultant UX à trouver des points
d'amélioration d'interfaces existante. Cette activité s'appelle la réalisation
d'un audit ergonomique de logiciel.

L'audit ergonomique est efficace, bien entendu, mais moins que le test
d'utilisabilité.

Parce que le test d'utilisabilité est une méthode impliquant l'utilisateur
(méthode participative), et que l'audit ergonomique non (méthode experte). Le
test d'utilisabilité consiste à recruter un utilisateur, vrai, réputé sincère,
découvrant le logiciel, puis à observer cet utilisateur entrain de réaliser un
objectif utile. Les observateurs notent toutes les émotions négatives
rencontrées puis les débriefent en pouvant suggérer une ou plusieurs pistes de
solution pour gommer ces émotions négatives à l'avenir.

Ce site ne traite pas du test d'utilisabilité. Voir pour ce sujet l'excellent
ouvrage de Steve Krug :
[Don't make me think](https://en.wikipedia.org/wiki/Don%27t_Make_Me_Think)

Le site est constitué sous la forme de liste d'articles, chacun traitant d'un
point particulier. Il fait une synthèse de plusieurs listes de critères
ergonomiques existant comme par exemple
[Bastien & Scapin](https://inria.hal.science/inria-00070012/file/RT-0156.pdf),
ou [Jakob Nielsen](https://www.nngroup.com/articles/ten-usability-heuristics/).
Le plan du site reprend le même classement que les critères de Bastien & Scapin
publiés à l'INRIA en 1993.

Ce site est développé avec [Vitepress](https://vitepress.dev/), et il est
déployé sur des pages [github](https://github.com/). Le tout gratuit.

Vous pouvez l'améliorer en éditant les pages sur github.

## Préliminaires

Rappelons que faire un audit ergonomique a pour but d'augmenter le niveau
d'ergonomie d'une interface logicielle.

Augmenter le niveau d'ergonomie se fait en diminuant les bugs ergonomiques, ou
en tout cas les chances qu'ils surviennent.

Un bug ergonomique est un interval de temps à l'intérieur duquel un utilisateur
ressent du négatif. Par exemple, l'utilisateur essaye de comprendre quelle
action il peut faire sur une interface, il cherche la commande qu'il doit faire
dans le cadre de la réalisation de son objectif.

Rappelons au passage qu'un utilisateur a toujours un objectif lorsqu'il utilise
un logiciel. Par conséquent, quand le designer comprend cet objectif, il a
l'opportunité de faire des écrans qui se concentre UNIQUEMENT sur cet objectif,
et met en retrait les actions secondaires.

Moins l'utilisateur a besoin de réflechir pour comprendre ce qu'il doit faire,
mieux c'est.

Pour aller plus loin, ne pas hésiter à lire les ouvrages suivants :

- Steve Krug : don't make me think.
- Steve Shoger, Adam Watham : Refactoring UI
