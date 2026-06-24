import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, FileText, Phone, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function CropDamage() {
  const { t, api } = useLanguage()
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.getDisasters()
      .then((d) => setTypes(d.types))
      .finally(() => setLoading(false))
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
      <div>
        <h2 className="page-title">{t('damage.title')}</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('damage.subtitle')}</p>
      </div>

      <div className="glass-card border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
          <AlertTriangle size={20} />
          {t('damage.urgent')}
        </p>
      </div>

      <div className="space-y-4">
        {types.map((type, i) => {
          const open = expanded === type.id
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setExpanded(open ? null : type.id)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{type.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{type.name}</h3>
                    <span className={`text-sm font-medium ${
                      type.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {t(`severity.${type.severity}`)} {t('damage.risk')}
                    </span>
                  </div>
                </div>
                {open ? <ChevronUp /> : <ChevronDown />}
              </button>

              {open && (
                <div className="space-y-6 border-t border-gray-200 px-6 pb-6 dark:border-gray-700">
                  <Section title={t('damage.immediate')} icon={AlertTriangle} items={type.immediate_actions} numbered />
                  <Section title={t('damage.documents')} icon={FileText} items={type.documents} />
                  <Block title={t('damage.compensation')} content={type.compensation_process} />
                  <Section title={t('damage.insurance')} icon={FileText} items={type.insurance_claim} numbered />
                  <div className="flex items-center gap-2 rounded-xl bg-krishi-green/10 p-4">
                    <Phone className="text-krishi-green" size={22} />
                    <div>
                      <p className="text-sm text-gray-500">{t('damage.helpline')}</p>
                      <a href={`tel:${type.helpline}`} className="text-xl font-bold text-krishi-green">
                        {type.helpline}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function Section({ title, icon: Icon, items, numbered }) {
  if (!items?.length) return null
  return (
    <div>
      <h4 className="section-title mb-3 flex items-center gap-2">
        {Icon && <Icon size={20} />} {title}
      </h4>
      {numbered ? (
        <ol className="list-inside list-decimal space-y-2 text-gray-700 dark:text-gray-300">
          {items.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      ) : (
        <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
          {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
    </div>
  )
}

function Block({ title, content }) {
  return (
    <div>
      <h4 className="section-title mb-2">{title}</h4>
      <p className="text-gray-700 dark:text-gray-300">{content}</p>
    </div>
  )
}
