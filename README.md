# Hookit 🪝

> Catalogue communautaire de **hooks agentiques** pour Claude Code (et bientôt GitHub Copilot).
> POC v0.1 — découverte, sélection, génération de configuration et registre vivant.

Hookit permet aux développeurs de **découvrir** des hooks pertinents, de les
**sélectionner**, et de **générer un `settings.json`** prêt à coller. Le
registre s'enrichit en analysant des dépôts GitHub soumis par la communauté via
un agent Claude Code.

## Stack

- **Frontend** : React + Vite + TypeScript + Tailwind v4
- **État** : Zustand (sélection persistée)
- **Données** : seed JSON local (`src/data/hooks-seed.json`), Supabase optionnel
- **Registre source** : `registry/registry.json` (versionné, PR-friendly)
- **Enrichissement** : GitHub Action + Claude Code (`.github/workflows/analyze-repo.yml`)

## Démarrage

```bash
npm install
cp .env.example .env   # optionnel : Supabase + repo registre
npm run dev
```

> Sans `.env`, le POC fonctionne en mode **seed local** : catalogue, filtres,
> sélection et génération de config sont pleinement fonctionnels. Supabase
> n'active que l'auth GitHub et la persistance des soumissions.

Scripts : `npm run build` (build prod), `npm run typecheck`, `npm run preview`.

## Structure

```
src/
  components/   HookCard, FilterBar, HookConfigurator, ContributeForm, Header, Badge
  pages/        Home, Catalogue, HookDetail, Contribute
  data/         hooks-seed.json (16 hooks Claude Code)
  lib/          hooks (filtre), mergeConfig (fusion settings.json), supabase, github
  store/        selection (zustand persisté)
  types/        hook.ts
registry/       registry.json — source de vérité du registre
supabase/       schema.sql
scripts/        merge-hooks.js, extract-json.js (pipeline CI)
.github/        workflows/analyze-repo.yml + prompts/analyze-repo.md
```

## Workflows

- **Découvrir** : filtrer par catégorie / provider / recherche → ajouter à la
  sélection → copier/télécharger `settings.json` (+ scripts associés).
- **Contribuer** : soumettre une URL de dépôt → issue `repo-submission` →
  l'Action clone le dépôt, lance l'analyse Claude Code, ouvre une PR
  `auto-generated` sur le registre.

## Configuration de l'enrichissement automatique

Sur le dépôt qui héberge le registre, définir le secret `ANTHROPIC_API_KEY`.
L'Action se déclenche sur les issues labellisées `repo-submission`.

## Catégories de hooks

`security` · `context` · `validation` · `notification` · `workflow` · `documentation`
