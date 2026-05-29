Analyse le dépôt monté dans le répertoire de travail additionnel et identifie
TOUS les hooks agentiques Claude Code et GitHub Copilot qui y sont configurés.

Cherche notamment :
- `.claude/settings.json` et `settings.local.json` → clés `hooks` (PreToolUse,
  PostToolUse, UserPromptSubmit, Notification, Stop, SubagentStop, PreCompact,
  SessionStart, SessionEnd) avec leurs matchers et commandes.
- Scripts référencés dans `.claude/hooks/`.
- `.claude/commands/` (custom skills) et `.claude/CLAUDE.md` (instructions).
- `.github/copilot-instructions.md` et configurations d'agents Copilot.

Pour chaque hook détecté, produis une entrée JSON STRICTEMENT conforme à ce
schéma (mêmes champs que registry/registry.json) :

{
  "id": "kebab-case-unique",
  "slug": "kebab-case-unique",
  "name": "Nom court en français",
  "category": "security|context|validation|notification|workflow|documentation",
  "provider": ["claude-code"],
  "hook_type": "PreToolUse|PostToolUse|UserPromptSubmit|Notification|Stop|SubagentStop|PreCompact|SessionStart|SessionEnd",
  "trigger": "matcher (ex. Bash, Write|Edit, *)",
  "description": "Description en français de ce que fait le hook.",
  "use_cases": ["...", "..."],
  "implementation": {
    "type": "settings_json",
    "config": { "hooks": { "...": [] } },
    "script_path": ".claude/hooks/xxx.sh",
    "code_snippet": "contenu du script si présent"
  },
  "community_examples": [
    { "repo": "<URL du dépôt>", "file_path": "<chemin>", "added_by": "claude-code-analysis" }
  ],
  "tags": ["..."],
  "votes": 0
}

Réponds UNIQUEMENT avec un tableau JSON `[ ... ]` de ces entrées, sans texte
autour. Si aucun hook n'est trouvé, réponds `[]`.
