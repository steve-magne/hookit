# CLAUDE.md

## Commandes

```bash
npm run dev          # Serveur de développement Vite
npm run build        # tsc -b + vite build (prod)
npm run typecheck    # Vérification TypeScript sans émission
npm run lint         # ESLint
npm run preview      # Prévisualisation du build prod
```

## Architecture

Hookit est un catalogue communautaire de hooks agentiques (Claude Code, GitHub Copilot). POC React + Vite + TypeScript + Tailwind v4.

**Source de données** : `registry/registry.json` est la seule source de vérité — lue directement par `src/lib/hooks.ts` (via `allHooks`). Supabase (via `src/lib/supabase.ts`) est optionnel — il n'active que l'auth GitHub et la persistance des soumissions. Sans `.env`, tout fonctionne en mode registre local.

**Registre** : `registry/registry.json` est la source canonique et unique du registre versionné — c'est aussi ce que le front-end importe. Les scripts `.claude/skills/analyze-repo/scripts/merge-hooks.js` et `.claude/skills/analyze-repo/scripts/extract-json.js` servent au pipeline CI (`.github/workflows/analyze-repo.yml`). L'Action se déclenche sur les issues labellisées `repo-submission` et ouvre une PR `auto-generated` via Claude Code + `ANTHROPIC_API_KEY`.

**État global** : Zustand persisté dans `src/store/selection.ts` (clé `hookit-selection`) — stocke les slugs des hooks sélectionnés.

**Génération de config** : `src/lib/mergeConfig.ts` fusionne les fragments `implementation.config.hooks` de plusieurs hooks en un `settings.json` valide, en regroupant par événement puis par matcher. `collectScripts` extrait les scripts associés.

**Type `Hook`** (`src/types/hook.ts`) : chaque hook a un `slug`, une `category`, un ou plusieurs `provider[]`, un `hook_type` (événement Claude Code), un `trigger` (matcher d'outil, ex. `"Bash"`, `"Write|Edit"`, `"*"`), et une `implementation` de type `settings_json` avec un fragment `config` prêt à fusionner.

**Routes** : `/` (Home), `/catalogue` (liste filtrée), `/hook/:slug` (détail), `/contribute` (soumission de dépôt).

## Ajouter un hook au registre

Ajouter une entrée dans `registry/registry.json` en respectant le type `Hook`. Le champ `implementation.config` doit être un fragment `{ hooks: { [EventName]: [...] } }` directement fusionnable dans `settings.json`.

## Conventions hooks Claude Code

**Emplacement** : tous les scripts vivent dans `.claude/hooks/` du projet. Référencés via `$CLAUDE_PROJECT_DIR/.claude/hooks/<script>.mjs` dans `.claude/settings.json`.

**Langage** : Node.js (`.mjs`) — OS-agnostique, disponible partout où `node` est dans le PATH. Pas de dépendances externes ; utiliser uniquement les builtins Node (`fs`, `child_process`, `path`).

**I/O** : lire le contexte JSON depuis stdin avec `readFileSync(0, 'utf8')`, écrire les décisions de blocage sur stdout en JSON `{ decision: 'block', reason: '...' }`, les avertissements sur stderr.

**Règles d'écriture** :
- Un fichier = une responsabilité (pas de hooks fourre-tout)
- Toujours `process.exit(0)` implicite si pas de blocage — ne jamais laisser le process pendouiller
- Les PostToolUse sont **non bloquants** : les erreurs d'outils absents (`--no-install`) sont silencieuses
- Les PreToolUse bloquants doivent avoir une `reason` actionnable, pas juste "interdit"
- Timeout explicite sur tous les `execSync` (évite les hooks bloquants indéfiniment)
- Filtrer par extension avant de lancer un outil lourd (ex. `/.tsx?$/.test(filePath)`)

**Hooks actifs** (`.claude/settings.json`) :

| Événement | Matcher | Script | Rôle |
|---|---|---|---|
| PreToolUse | `Bash` | `detect-secrets.mjs` | Bloque les commandes avec credentials |
| PreToolUse | `Bash` | `block-destructive.mjs` | Bloque rm -rf /, force-push main, DROP TABLE |
| PreToolUse | `Write\|Edit` | `protect-paths.mjs` | Bloque les écritures sur .env, clés privées |
| PostToolUse | `Write\|Edit` | `autoformat.mjs` | prettier --write si disponible |
| PostToolUse | `Write\|Edit` | `eslint-check.mjs` | eslint si disponible, avertissement stderr |
| PostToolUse | `Write\|Edit` | `typecheck.mjs` | tsc --noEmit sur .ts/.tsx, avertissement stderr |

## Variables d'environnement

Voir `.env.example` : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_REGISTRY_REPO` (format `org/repo`). Toutes optionnelles pour le développement local.
