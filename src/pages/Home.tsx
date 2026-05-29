import { Link } from 'react-router-dom'
import { ArrowDown, Boxes, GitPullRequest, Wand2 } from 'lucide-react'
import { CatalogueExplorer } from '../components/CatalogueExplorer'
import { allHooks } from '../lib/hooks'

export function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="pt-16 pb-10 text-center">
        <span className="inline-block rounded-full bg-[var(--color-brand)]/15 px-3 py-1 text-sm font-medium text-indigo-300 ring-1 ring-[var(--color-brand)]/30">
          POC v0.1 · Claude Code
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
          Découvrez et implémentez les{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            hooks agentiques
          </span>{' '}
          en 2 minutes
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-400">
          Un catalogue communautaire de hooks pour Claude Code : sécurité,
          contexte, validation, workflow. Sélectionnez, générez votre{' '}
          <code className="text-zinc-300">settings.json</code>, collez.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#catalogue"
            className="flex items-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 py-3 font-medium text-white hover:bg-[var(--color-brand-2)]"
          >
            Parcourir les {allHooks.length} hooks <ArrowDown className="size-4" />
          </a>
          <Link
            to="/contribute"
            className="rounded-xl border border-[var(--color-border)] px-5 py-3 font-medium text-zinc-300 hover:bg-[var(--color-surface-2)]"
          >
            Contribuer un dépôt
          </Link>
        </div>
      </section>

      <section className="grid gap-4 pb-12 sm:grid-cols-3">
        {[
          {
            icon: Boxes,
            title: 'Découverte par cas d’usage',
            desc: 'Filtrez par catégorie, provider, event et besoin réel.',
          },
          {
            icon: Wand2,
            title: 'Génération de config',
            desc: 'Sélection multiple fusionnée en un settings.json prêt à coller.',
          },
          {
            icon: GitPullRequest,
            title: 'Registre vivant',
            desc: 'Soumettez un dépôt : un agent l’analyse et enrichit le registre.',
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <f.icon className="mb-3 size-6 text-[var(--color-brand)]" />
            <h3 className="mb-1 font-semibold text-zinc-100">{f.title}</h3>
            <p className="text-sm text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </section>

      <section id="catalogue" className="scroll-mt-20 pb-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Catalogue de hooks</h2>
            <p className="text-zinc-400">
              Sélectionne les hooks pertinents puis génère ta configuration.
            </p>
          </div>
          <Link
            to="/catalogue"
            className="hidden shrink-0 text-sm text-indigo-300 hover:text-indigo-200 sm:block"
          >
            Vue dédiée →
          </Link>
        </div>
        <CatalogueExplorer />
      </section>
    </div>
  )
}
