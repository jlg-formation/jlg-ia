# Rapport Refactorer — AAAA-MM-JJ HH:mm

- **Périmètre** : `src/` (exclusions : `node_modules`, `dist`, `coverage`, chemins du `.gitignore`)
- **Commit analysé** : `abc1234` — modifications non commitées : non
- **Langages** : TypeScript
- **Outils lancés** : `knip`, `tsc --noUnusedLocals`, `jscpd`, `oxfmt --check`, `oxlint`
- **Commandes de vérification** : `bun run lint` ; `bun run format:check` ; `bun run build` ; `bun run test`

## Mode d'emploi pour l'exécutant

1. Traiter les tâches dans l'ordre, une seule à la fois.
2. Localiser le code par le **texte d'ancrage**, pas par le numéro de ligne : les lignes bougent après chaque tâche.
3. Avant d'agir, lancer la **vérification préalable**. Si son résultat diffère de l'attendu, ne rien modifier : cocher `[!]` et noter la raison sous la tâche.
4. Appliquer exactement l'**action** décrite, sans autre modification.
5. Lancer les **commandes de vérification**. En cas d'échec, annuler la tâche, cocher `[!]` et noter l'erreur.
6. Si tout passe, cocher `[x]`.
7. Ne jamais traiter la section « Questions pour l'utilisateur ».

## État du code

- **Formateur** : `oxfmt` (configuration `.oxfmtrc.json`) — `oxfmt --check` : 3 fichiers non formatés.
- **Linter** : `oxlint` (configuration `.oxlintrc.json`) — 0 erreur, 4 avertissements (`max-lines` : 2, `no-unused-vars` : 2).
- **Fichiers trop longs** (seuil du projet : 300 lignes, règle `max-lines`) :

| Fichier                                                    | Lignes | Découpage   |
| ---------------------------------------------------------- | ------ | ----------- |
| [src/components/Chat.tsx](src/components/Chat.tsx)         | 520    | Question Q2 |
| [src/services/llm/parsers.ts](src/services/llm/parsers.ts) | 340    | T3          |

- **Documentation** :
  - README, test des 30 secondes : objectif OK, prérequis manquants (version de Bun), installation OK, lancement OK, tests OK.
  - Commandes non documentées : `format`, `format:check` (`package.json`).
  - Incohérence : `AGENTS.md` affirme « no unit tests » alors que `tests/unit/` existe.
  - Fichiers pour l'IA : `AGENTS.md` présent, `CLAUDE.md` présent (`@AGENTS.md`).

## Tâches

### [ ] T1 — Supprimer la fonction inutilisée `formatLegacyDate`

- **Type** : code mort / suppression
- **Confiance** : Sûr
- **Dépend de** : aucune
- **Fichier** : [src/services/helpers.ts](src/services/helpers.ts#L42-L58)
- **Texte d'ancrage** : `export function formatLegacyDate(`
- **Vérification préalable** : rechercher `formatLegacyDate` dans tout le dépôt. Attendu : une seule occurrence, la définition.
- **Action** : supprimer la fonction entière, de la ligne d'ancrage jusqu'à son accolade fermante, et la ligne vide qui suit.
- **Raison** : signalée par `knip`, aucune référence statique ni dynamique.

### [ ] T2 — Factoriser la construction des en-têtes HTTP

- **Type** : doublon / factorisation
- **Confiance** : Sûr
- **Dépend de** : T1
- **Fichiers** :
  - [src/services/a.ts](src/services/a.ts#L10-L18) — ancrage : `const headers = { 'Content-Type'`
  - [src/services/b.ts](src/services/b.ts#L25-L33) — ancrage : `const headers = { 'Content-Type'`
- **Vérification préalable** : les deux blocs sont identiques, au nom de la clé d'API près.
- **Action** :
  1. Créer dans `src/services/http.ts` la fonction ci-dessous.
  2. Remplacer chaque bloc par `const headers = buildHeaders(apiKey)`.
  3. Ajouter `import { buildHeaders } from './http'` dans les deux fichiers.

  ```ts
  export function buildHeaders(apiKey: string): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
  }
  ```

- **Raison** : copie renommée détectée par `jscpd`.

### [ ] T3 — Déplacer les parseurs Ollama dans un fichier dédié

- **Type** : taille de fichier / découpage
- **Confiance** : Sûr
- **Dépend de** : T2
- **Fichier** : [src/services/llm/parsers.ts](src/services/llm/parsers.ts#L210-L330)
- **Texte d'ancrage** : `export async function* parseOllamaStream(`
- **Vérification préalable** : rechercher `parseOllamaStream` et `parseOllamaResponse` dans le dépôt. Attendu : seulement `parsers.ts` et `src/services/llm/index.ts`.
- **Action** :
  1. Créer `src/services/llm/parsersOllama.ts`.
  2. Y déplacer sans les modifier les fonctions `parseOllamaStream` et `parseOllamaResponse`, avec les imports qu'elles utilisent.
  3. Dans `src/services/llm/index.ts`, remplacer l'import de ces deux fonctions depuis `./parsers` par un import depuis `./parsersOllama`.
  4. Supprimer de `parsers.ts` les imports devenus inutilisés.
- **Raison** : `parsers.ts` dépasse le seuil de 300 lignes ; les parseurs Ollama forment un bloc indépendant.

### [ ] T4 — Documenter les commandes de formatage dans le README

- **Type** : documentation
- **Confiance** : Sûr
- **Dépend de** : aucune
- **Fichier** : [README.md](README.md#L20-L26)
- **Texte d'ancrage** : `bun run lint`
- **Vérification préalable** : rechercher `format:check` dans `README.md`. Attendu : aucune occurrence.
- **Action** : insérer après la ligne d'ancrage les deux lignes suivantes, dans le même bloc de code.

  ```bash
  bun run format        # Formate le code (oxfmt)
  bun run format:check  # Vérifie le formatage sans modifier
  ```

- **Raison** : scripts présents dans `package.json` mais absents du README.

### [ ] T5 — Formater le code

- **Type** : formatage
- **Confiance** : Sûr
- **Dépend de** : toutes les tâches précédentes
- **Fichiers** : tout le périmètre
- **Vérification préalable** : `bun run format:check`. Attendu : des fichiers signalés comme non formatés.
- **Action** : lancer `bun run format`.
- **Raison** : 3 fichiers non conformes à `.oxfmtrc.json`.

## Questions pour l'utilisateur

### Q1 — `registerTool` est-il appelé par un mécanisme externe ?

- **Fichier** : [src/tools/registry.ts](src/tools/registry.ts#L5-L12)
- **Constat** : aucune référence statique, mais le nom ressemble à un point d'enregistrement.
- **Si la fonction est inutilisée** : supprimer la fonction `registerTool` entière dans `src/tools/registry.ts`.

### Q2 — Comment découper `Chat.tsx` (520 lignes) ?

- **Fichier** : [src/components/Chat.tsx](src/components/Chat.tsx)
- **Constat** : la boucle agentique et le rendu sont mélangés ; plusieurs découpages sont possibles.
- **Proposition** : extraire la boucle agentique dans un hook `useAgenticLoop` (`src/components/chat/useAgenticLoop.ts`). Valider ou proposer un autre découpage.

## Écarté

- `src/vendor/lib.js` : code tiers versionné, hors périmètre.
- Doublons dans `tests/` : isolement volontaire des tests.
