---
name: analyze-repo
description: Analyse un dépôt GitHub pour en extraire les hooks agentiques et alimenter le catalogue Hookit. Déclencher quand l'utilisateur fournit une URL GitHub à analyser, mentionne "ajouter un repo", "scanner un dépôt", "enrichir le registre" ou veut ajouter des hooks au catalogue. Utiliser même si l'utilisateur se contente de coller une URL GitHub sans explication supplémentaire.
---

Pipeline d'analyse pour `$ARGUMENTS` (URL GitHub). Exécuter depuis la racine du projet hookit.

## Phase 1+2 — Découverte et récupération (script, 0 token LLM)

```bash
DATA=$(bash .claude/skills/analyze-repo/scripts/fetch-hook-sources.sh "$ARGUMENTS" registry/registry.json)
echo "$DATA"
```

- Si `DATA` contient la clé `"error"` → afficher l'erreur et s'arrêter.
- Si `has_hooks` est `false` → écrire `[]` dans `/tmp/hookit-hooks-new.json` et passer directement à la Phase 3.5.

## Phase 3 — Extraction des hooks (seule phase LLM)

À partir du `DATA` ci-dessus, produire une entrée JSON pour chaque hook présent dans `hooks` et `hooks_local`. Les contenus de `hook_scripts` alimentent `code_snippet`.

**Règle fondamentale** : ne créer une entrée que pour un hook explicitement déclaré sous la clé `hooks` (ou `hooks_local`). Ne jamais inventer un hook depuis un README, CLAUDE.md ou documentation.

**Déduplication** : si un slug figure dans `existing_slugs` → réutiliser ce slug ; le merge ajoutera l'exemple communautaire sans créer de doublon.

Schema d'une entrée (toutes les clés sont requises) :

```json
{
  "id": "kebab-case-unique",
  "slug": "kebab-case-unique",
  "name": "Nom court en français",
  "category": "security|context|validation|notification|workflow|documentation",
  "provider": ["claude-code"],
  "hook_type": "PreToolUse|PostToolUse|UserPromptSubmit|Notification|Stop|SubagentStop|PreCompact|SessionStart|SessionEnd",
  "trigger": "Bash|Write|Edit|WebFetch|*",
  "description": "Ce que fait ce hook, en français.",
  "use_cases": ["cas 1", "cas 2"],
  "implementation": {
    "type": "settings_json",
    "config": {
      "hooks": {
        "<HookType>": [{ "matcher": "<trigger>", "hooks": [{ "type": "command", "command": "..." }] }]
      }
    },
    "script_path": ".claude/hooks/nom.sh",
    "code_snippet": "contenu du script si présent dans hook_scripts, sinon omis"
  },
  "community_examples": [
    { "repo": "$ARGUMENTS", "file_path": ".claude/settings.json", "added_by": "claude-code-analysis" }
  ],
  "tags": ["tag1", "tag2"],
  "votes": 0
}
```

Écrire le tableau JSON résultant dans `/tmp/hookit-hooks-new.json`.

## Phase 3.5 — Validation qualité (script, 0 token LLM)

```bash
node .claude/skills/analyze-repo/scripts/validate-hooks.js /tmp/hookit-hooks-new.json
HOOKS_VALID=$(cat /tmp/hookit-validation-count.txt)
```

Ce script filtre les anti-patterns agentiques (champs manquants, `PreToolUse/*` avec appels réseau,
commandes destructives sans garde-fou) et produit :
- `/tmp/hookit-hooks-validated.json` — hooks retenus pour le registre
- `/tmp/hookit-hooks-recommended.json` — sous-ensemble bénéfique pour le projet courant

## Phase 4+5 — Merge et enregistrement (scripts, 0 token LLM)

```bash
node .claude/skills/analyze-repo/scripts/merge-hooks.js /tmp/hookit-hooks-validated.json registry/registry.json "$ARGUMENTS"
HOOKS_FOUND=$(jq 'length' /tmp/hookit-hooks-new.json)
HOOKS_ADDED=$(cat /tmp/added-count.txt)
node .claude/skills/analyze-repo/scripts/update-scanned-repos.js registry/scanned-repos.json "$ARGUMENTS" "$HOOKS_FOUND" "$HOOKS_ADDED" success
```

## Phase 6 — Application au projet courant (script, 0 token LLM)

```bash
node .claude/skills/analyze-repo/scripts/apply-best-practices.js registry/registry.json .claude/settings.json /tmp/hookit-hooks-recommended.json
APPLIED=$(cat /tmp/applied-count.txt 2>/dev/null || echo 0)
APPLIED_FROM_SCAN=$(cat /tmp/applied-from-scan-count.txt 2>/dev/null || echo 0)
```

Applique en priorité les slugs de référence (`RECOMMENDED_SLUGS`), puis les hooks du repo
scanné marqués comme recommandés (catégorie `security`/`validation`, sans effet réseau en pre-hook).

## Résumé

Afficher uniquement ce bloc, sans autre texte :

```
Repo analysé     : <repo>
Hooks extraits   : <HOOKS_FOUND>
Hooks valides    : <HOOKS_VALID> (<HOOKS_FOUND - HOOKS_VALID> rejeté(s))
Hooks ajoutés    : <HOOKS_ADDED> (ou "0 — exemples communautaires enrichis")
Appliqués projet : <APPLIED> dont <APPLIED_FROM_SCAN> du repo scanné (ou "déjà à jour")

Fichiers modifiés :
  registry/registry.json
  src/data/hooks-seed.json
  registry/scanned-repos.json
  .claude/settings.json
```
