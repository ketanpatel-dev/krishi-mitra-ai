import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from '../i18n/en.json'
import hi from '../i18n/hi.json'

const translations = { en, hi }

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('krishi-lang') || 'en')

  useEffect(() => {
    localStorage.setItem('krishi-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = useMemo(() => {
    const dict = translations[lang] || translations.en
    return (key, fallback = key) => dict[key] ?? translations.en[key] ?? fallback
  }, [lang])

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
