import { useEffect, useState } from 'react'
import { Phone, FileText, HelpCircle, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Insurance() {
  const { t, api } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getInsurance().then(setData).finally(() => setLoading(false))
  }, [api])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-krishi-green" size={40} />
      </div>
    )
  }

  const sections = [
    { key: 'insurance.reporting', icon: FileText, content: data.reporting_guide },
    { key: 'insurance.compensation', icon: FileText, content: data.compensation_process },
    { key: 'insurance.documents', icon: FileText, content: data.required_documents, list: true },
    { key: 'insurance.claim', icon: FileText, content: data.claim_process, steps: true },
  ]

  return (
    <div className="space-y-8">
      <h2 className="page-title">{t('insurance.title')}</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map(({ key, icon: Icon, content, list, steps }) => (
          <div key={key} className="glass-card p-6">
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Icon size={22} /> {t(key)}
            </h3>
            {list && Array.isArray(content) ? (
              <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                {content.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : steps && Array.isArray(content) ? (
              <ol className="list-inside list-decimal space-y-2 text-gray-700 dark:text-gray-300">
                {content.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{content}</p>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="section-title mb-4 flex items-center gap-2">
          <HelpCircle size={22} /> {t('insurance.faqs')}
        </h3>
        <div className="space-y-4">
          {data.faqs.map((faq, i) => (
            <div key={i} className="rounded-xl bg-krishi-yellow/30 p-4 dark:bg-gray-800">
              <p className="font-semibold">{faq.q}</p>
              <p className="mt-1 text-gray-600 dark:text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="section-title mb-4 flex items-center gap-2">
          <Phone size={22} /> {t('insurance.helpline')}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.helplines.map((h, i) => (
            <div key={i} className="rounded-xl border border-krishi-green/20 p-4">
              <p className="font-semibold">{h.name}</p>
              <a href={`tel:${h.number}`} className="text-xl text-krishi-green">{h.number}</a>
            </div>
          ))}
        </div>
      </div>

      {data.programs && (
        <div className="glass-card p-6">
          <h3 className="section-title mb-4">PMFBY & State Programs</h3>
          {data.programs.map((p, i) => (
            <div key={i} className="mb-4 rounded-xl bg-white/50 p-4 dark:bg-gray-800">
              <p className="font-bold">{p.name}</p>
              <p className="text-gray-600 dark:text-gray-400">{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
