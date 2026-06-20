import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, BookOpen, Leaf, Loader2, ExternalLink } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'

const categoryIcons = {
  videos: Play,
  awareness: BookOpen,
  techniques: Leaf,
  training: BookOpen,
  practices: Leaf,
  organic: Leaf,
}

const categoryKeys = {
  videos: 'education.videos',
  awareness: 'education.awareness',
  techniques: 'education.techniques',
  training: 'education.training',
  practices: 'education.practices',
  organic: 'education.organic',
}

export default function Education() {
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getEducation().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-krishi-green" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="page-title">{t('education.title')}</h2>

      {Object.entries(data.categories).map(([key, items], ci) => {
        const Icon = categoryIcons[key] || BookOpen
        return (
          <motion.section
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Icon size={22} /> {t(categoryKeys[key])}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <div key={i} className="rounded-xl bg-white/50 p-4 dark:bg-gray-800">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-krishi-green">
                      <ExternalLink size={14} /> {t('common.viewMore')}
                    </a>
                  )}
                  {item.duration && <p className="mt-1 text-xs text-gray-400">{item.duration}</p>}
                </div>
              ))}
            </div>
          </motion.section>
        )
      })}
    </div>
  )
}
