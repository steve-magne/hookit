import { getT, type Locale } from '@/lib/i18n'
import { CatalogueExplorer } from '@/components/CatalogueExplorer'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const T = getT(locale as Locale)

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="pt-16 pb-10 text-center">
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
          {T.heroTitle1}{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {T.heroHighlight}
          </span>{' '}
          {T.heroTitle2}
        </h1>
      </section>

      <section id="catalogue" className="scroll-mt-20 pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{T.catalogueTitle}</h2>
        </div>
        <CatalogueExplorer />
      </section>
    </div>
  )
}
