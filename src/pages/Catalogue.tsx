import { useSearchParams } from 'react-router-dom'
import { CatalogueExplorer } from '../components/CatalogueExplorer'
import type { Category } from '../types/hook'

export function Catalogue() {
  const [params] = useSearchParams()
  const initialCategory = params.get('category') as Category | null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-white">Catalogue de hooks</h1>
      <p className="mb-6 text-zinc-400">
        Sélectionne les hooks pertinents puis génère ta configuration.
      </p>

      <CatalogueExplorer initialCategory={initialCategory} />
    </div>
  )
}
