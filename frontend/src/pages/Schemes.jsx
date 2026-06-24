import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Schemes() {
  const { t, api } = useLanguage()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.getSchemes().then((d) => setSchemes(d.schemes)).finally(() => setLoading(false))
  }, [api])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-krishi-green" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="page-title">{t('schemes.title')}</h2>

      <div className="space-y-4">
        {schemes.map((scheme, i) => {
          const open = expanded === scheme.id
          return (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setExpanded(open ? null : scheme.id)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div>
                  <h3 className="text-xl font-bold text-krishi-dark dark:text-krishi-light">{scheme.name}</h3>
                  <p className="mt-1 text-gray-500">{scheme.short_description}</p>
                </div>
                {open ? <ChevronUp /> : <ChevronDown />}
              </button>

              {open && (
                <div className="border-t border-gray-200 px-6 pb-6 dark:border-gray-700">
                  <SchemeSection title={t('schemes.benefits')} items={scheme.benefits} />
                  <SchemeSection title={t('schemes.eligibility')} items={scheme.eligibility} />
                  <SchemeSection title={t('schemes.documents')} items={scheme.documents} />
                  <div className="mb-4">
                    <h4 className="mb-2 font-medium text-krishi-green">{t('schemes.process')}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{scheme.application_process}</p>
                  </div>
                  <a
                    href={scheme.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex !text-base"
                  >
                    <ExternalLink size={18} /> {t('schemes.website')}
                  </a>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function SchemeSection({ title, items }) {
  if (!items?.length) return null
  return (
    <div className="mb-4">
      <h4 className="mb-2 font-medium text-krishi-green">{title}</h4>
      <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}
