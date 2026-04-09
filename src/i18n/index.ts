import { createContext, useContext } from 'react'
import type { Locale } from '../store/types'
import { en } from './en'
import { id } from './id'

const translations = { en, id }

type Params = Record<string, string | number>

/** Resolve a dot-notation key like 'practice.correct' with optional {param} interpolation */
function resolve(obj: Record<string, unknown>, key: string, params?: Params): string {
  const parts = key.split('.')
  let cur: unknown = obj
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return key
    cur = (cur as Record<string, unknown>)[part]
  }
  if (typeof cur !== 'string') return key
  if (!params) return cur
  return cur.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`))
}

export type TFunction = (key: string, params?: Params) => string

export interface LocaleContextValue {
  locale: Locale
  t: TFunction
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  t: (key) => key,
})

export function makeT(locale: Locale): TFunction {
  const dict = translations[locale] as unknown as Record<string, unknown>
  return (key, params) => resolve(dict, key, params)
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext)
}
