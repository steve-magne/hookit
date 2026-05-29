import { Link, NavLink } from 'react-router-dom'
import { Github, Webhook } from 'lucide-react'
import { useSelection } from '../store/selection'
import { isSupabaseEnabled, signInWithGitHub } from '../lib/supabase'

export function Header() {
  const count = useSelection((s) => s.selected.length)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[var(--color-surface-2)] text-white'
        : 'text-zinc-400 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Webhook className="size-6 text-[var(--color-brand)]" />
          <span className="text-lg">Hookit</span>
        </Link>

        <nav className="ml-6 flex items-center gap-1">
          <NavLink to="/catalogue" className={linkClass}>
            Catalogue
          </NavLink>
          <NavLink to="/contribute" className={linkClass}>
            Contribuer
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {count > 0 && (
            <Link
              to="/catalogue#config"
              className="rounded-full bg-[var(--color-brand)]/15 px-3 py-1 text-sm font-medium text-indigo-300 ring-1 ring-[var(--color-brand)]/30"
            >
              {count} hook{count > 1 ? 's' : ''} sélectionné{count > 1 ? 's' : ''}
            </Link>
          )}
          <button
            onClick={() => isSupabaseEnabled && signInWithGitHub()}
            title={
              isSupabaseEnabled
                ? 'Se connecter avec GitHub'
                : 'Configurer Supabase pour activer l’auth GitHub'
            }
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50"
            disabled={!isSupabaseEnabled}
          >
            <Github className="size-4" />
            <span className="hidden sm:inline">Connexion</span>
          </button>
        </div>
      </div>
    </header>
  )
}
