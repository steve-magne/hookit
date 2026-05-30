import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { LocaleProvider } from '@/lib/locale-context'
import { getT, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const T = getT(locale as Locale)
  return {
    title: T.metaTitle,
    description: T.metaDescription,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const T = getT(locale as Locale)

  return (
    <LocaleProvider locale={locale as Locale}>
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--color-border)] py-6 text-center text-sm text-zinc-500">
        {T.footerText}
      </footer>
    </LocaleProvider>
  )
}
