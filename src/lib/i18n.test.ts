import { describe, it, expect } from 'vitest'
import { getT, translations } from './i18n'

describe('getT', () => {
  it("retourne les traductions francaises pour 'fr'", () => {
    expect(getT('fr').navCatalogue).toBe('Catalogue')
  })

  it("retourne les traductions anglaises pour 'en'", () => {
    expect(getT('en').navCatalogue).toBe('Catalogue')
    expect(getT('en').copy).toBe('Copy')
  })

  it("fallback sur 'fr' pour une locale inconnue", () => {
    // @ts-expect-error locale inconnue intentionnelle
    expect(getT('de')).toBe(translations.fr)
  })
})

describe('coherence des traductions', () => {
  const fr = translations.fr
  const en = translations.en

  it('les deux locales ont les memes cles', () => {
    const frKeys = Object.keys(fr).sort()
    const enKeys = Object.keys(en).sort()
    expect(frKeys).toEqual(enKeys)
  })

  it("aucune valeur de chaine n'est vide", () => {
    for (const [key, val] of Object.entries(fr)) {
      if (typeof val === 'string') expect(val, `fr.${key} est vide`).not.toBe('')
    }
    for (const [key, val] of Object.entries(en)) {
      if (typeof val === 'string') expect(val, `en.${key} est vide`).not.toBe('')
    }
  })

  it('categoryLabels couvre les memes categories dans les deux locales', () => {
    expect(Object.keys(fr.categoryLabels).sort()).toEqual(Object.keys(en.categoryLabels).sort())
  })

  it('contributeSteps a le meme nombre elements dans les deux locales', () => {
    expect(fr.contributeSteps).toHaveLength(en.contributeSteps.length)
  })
})
