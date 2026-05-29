import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Le client n'est instancié que si les variables d'env sont présentes.
// En l'absence de config Supabase, le POC fonctionne en mode "seed local".
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseEnabled = supabase !== null

/** Lance l'auth GitHub OAuth via Supabase. */
export async function signInWithGitHub() {
  if (!supabase) throw new Error('Supabase non configuré (voir .env.example).')
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.origin },
  })
  if (error) throw error
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}
