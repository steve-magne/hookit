#!/usr/bin/env bash
# fetch-hook-sources.sh <github-url> [registry.json]
# Un seul appel — découverte + récupération des sources de hooks d'un dépôt GitHub.
# Sortie : JSON compact {repo, has_hooks, hooks, hooks_local, hook_scripts, existing_slugs}
# Seule la clé "hooks" de settings.json est extraite (pas le fichier complet).

set -euo pipefail

URL="${1:-}"
REGISTRY="${2:-registry/registry.json}"

[[ -z "$URL" ]] && jq -n '{"error":"Usage: fetch-hook-sources.sh <github-url> [registry.json]"}' && exit 1

REPO=$(echo "$URL" | sed 's|https://github\.com/||;s|\.git$||;s|/$||')

# Phase 1 — un seul appel API pour l'arbre complet du dépôt
TREE=$(gh api "repos/$REPO/git/trees/HEAD?recursive=1" 2>/dev/null) || {
  jq -n --arg r "$REPO" '{"error":("Repo inaccessible: " + $r)}'
  exit 0
}

# Chemins des sources de hooks (exclut CLAUDE.md, commands/*.md, README)
SETTINGS_PATH=$(echo "$TREE" | jq -r '[.tree[].path] | map(select(. == ".claude/settings.json")) | .[0] // ""')
SETTINGS_LOCAL_PATH=$(echo "$TREE" | jq -r '[.tree[].path] | map(select(. == ".claude/settings.local.json")) | .[0] // ""')
HOOK_SCRIPT_PATHS=$(echo "$TREE" | jq -r '[.tree[].path | select(startswith(".claude/hooks/"))] | .[]' 2>/dev/null || true)

# Extrait uniquement la clé "hooks" d'un fichier JSON distant
fetch_hooks_key() {
  local path="$1"
  [[ -z "$path" ]] && echo "null" && return
  local raw
  raw=$(gh api "repos/$REPO/contents/$path" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null) || { echo "null"; return; }
  echo "$raw" | jq '.hooks // null' 2>/dev/null || echo "null"
}

# Récupère un fichier texte sous forme de chaîne JSON
fetch_text_json() {
  local path="$1"
  [[ -z "$path" ]] && echo "null" && return
  local raw
  raw=$(gh api "repos/$REPO/contents/$path" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null) || { echo "null"; return; }
  [[ -z "$raw" ]] && echo "null" && return
  echo "$raw" | jq -Rs '.'
}

HOOKS=$(fetch_hooks_key "$SETTINGS_PATH")
HOOKS_LOCAL=$(fetch_hooks_key "$SETTINGS_LOCAL_PATH")

# Scripts dans .claude/hooks/ → alimentent code_snippet
SCRIPTS_ARR="[]"
if [[ -n "$HOOK_SCRIPT_PATHS" ]]; then
  SCRIPTS_ARR=$(
    while IFS= read -r p; do
      [[ -z "$p" ]] && continue
      content=$(fetch_text_json "$p")
      [[ "$content" == "null" ]] && continue
      jq -n --arg path "$p" --argjson c "$content" '{"path":$path,"content":$c}'
    done <<< "$HOOK_SCRIPT_PATHS" | jq -s '.'
  )
fi

HAS_HOOKS=$(jq -n \
  --argjson h "$HOOKS" --argjson l "$HOOKS_LOCAL" \
  '($h != null and ($h|keys|length) > 0) or ($l != null and ($l|keys|length) > 0)')

# Slugs existants pré-calculés pour la déduplication (évite de charger le registre en contexte)
EXISTING_SLUGS="[]"
[[ -f "$REGISTRY" ]] && EXISTING_SLUGS=$(jq '[.[].slug]' "$REGISTRY")

jq -n \
  --arg repo "$REPO" \
  --argjson has_hooks "$HAS_HOOKS" \
  --argjson hooks "$HOOKS" \
  --argjson hooks_local "$HOOKS_LOCAL" \
  --argjson scripts "$SCRIPTS_ARR" \
  --argjson existing_slugs "$EXISTING_SLUGS" \
  '{repo:$repo,has_hooks:$has_hooks,hooks:$hooks,hooks_local:$hooks_local,hook_scripts:$scripts,existing_slugs:$existing_slugs}'
