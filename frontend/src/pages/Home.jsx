import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scan, MessageCircle, Cloud, TrendingUp, Landmark, Mic, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const features = [
  { icon: Scan, key: 'home.features.disease', descKey: 'home.features.disease.desc', path: '/detect', color: 'from-green-500 to-emerald-600' },
  { icon: Mic, key: 'home.features.voice', descKey: 'home.features.voice.desc', path: '/chat', color: 'from-blue-500 to-cyan-600' },
  { icon: Cloud, key: 'home.features.weather', descKey: 'home.features.weather.desc', path: '/weather', color: 'from-sky-500 to-blue-600' },
  { icon: TrendingUp, key: 'home.features.market', descKey: 'home.features.market.desc', path: '/market', color: 'from-amber-500 to-orange-600' },
  { icon: Landmark, key: 'home.features.schemes', descKey: 'home.features.schemes.desc', path: '/schemes', color: 'from-purple-500 to-violet-600' },
  { icon: AlertTriangle, key: 'home.features.damage', descKey: 'home.features.damage.desc', path: '/damage', color: 'from-red-500 to-rose-600' },
]

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden p-8 md:p-12"
      >
        <div className="flex flex-col items-center text-center">
          <motion.span
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="mb-4 text-7xl"
          >
            🌾
          </motion.span>
          <h2 className="page-title mb-3">{t('home.hero.title')}</h2>
          <p className="mb-2 max-w-2xl text-lg text-gray-600 dark:text-gray-300">{t('home.hero.subtitle')}</p>
          <p className="mb-8 text-sm italic text-krishi-green">{t('tagline')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/detect" className="btn-primary">
              <Scan size={22} /> {t('home.hero.cta.detect')}
            </Link>
            <Link to="/chat" className="btn-secondary">
              <MessageCircle size={22} /> {t('home.hero.cta.chat')}
            </Link>
          </div>
        </div>
      </motion.section>

      <section>
        <h3 className="page-title mb-6 text-center">{t('home.features.title')}</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={f.path} className="glass-card block h-full p-6 transition hover:shadow-xl">
                  <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${f.color} p-3 text-white`}>
                    <Icon size={28} />
                  </div>
                  <h4 className="section-title mb-2">{t(f.key)}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{t(f.descKey)}</p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
