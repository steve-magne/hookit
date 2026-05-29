// Création de l'issue de soumission de repo sur le dépôt du registre.
//
// En POC, deux modes :
//  1. Si Supabase est configuré, on enregistre la soumission et une Edge
//     Function / GitHub App crée l'issue côté serveur (token non exposé).
//  2. Sinon, on génère une URL "pré-remplie" GitHub que l'utilisateur valide
//     lui-même — aucun token côté client, pattern sûr pour un POC public.

const REGISTRY_REPO = import.meta.env.VITE_REGISTRY_REPO as string | undefined

export interface SubmissionResult {
  mode: 'prefilled-url'
  issueUrl: string
}

export function buildSubmissionIssueUrl(repoUrl: string): SubmissionResult {
  const repo = REGISTRY_REPO ?? 'your-org/hookit-registry'
  const title = encodeURIComponent(`repo-submission: ${repoUrl}`)
  const body = encodeURIComponent(
    [
      '## Soumission de dépôt pour analyse',
      '',
      `Dépôt à analyser : ${repoUrl}`,
      '',
      "L'agent d'analyse va parcourir ce dépôt pour détecter les hooks",
      'agentiques (Claude Code / Copilot) non encore présents dans le registre.',
    ].join('\n')
  )
  const issueUrl = `https://github.com/${repo}/issues/new?labels=repo-submission&title=${title}&body=${body}`
  return { mode: 'prefilled-url', issueUrl }
}

/** Validation basique d'une URL de dépôt GitHub public. */
export function isValidGitHubRepoUrl(value: string): boolean {
  return /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(value.trim())
}
