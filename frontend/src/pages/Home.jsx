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
      {/* Hero Section with Farm Background */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[80vh] overflow-hidden rounded-3xl"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-farm.png')" }}
        />
        
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        {/* Decorative top gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 py-20 text-center text-white">
          <motion.span
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="mb-6 text-8xl drop-shadow-2xl"
          >
            🌾
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-4xl font-bold drop-shadow-lg md:text-5xl lg:text-6xl"
          >
            {t('home.hero.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-2 max-w-2xl text-lg text-white/90 md:text-xl"
          >
            {t('home.hero.subtitle')}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10 text-base italic text-green-300"
          >
            {t('tagline')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/detect"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-xl transition hover:bg-green-600 hover:shadow-2xl hover:scale-105"
            >
              <Scan size={22} /> {t('home.hero.cta.detect')}
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-white/20 px-8 py-4 text-lg font-semibold text-white shadow-xl backdrop-blur-sm transition hover:bg-white/30 hover:shadow-2xl hover:scale-105"
            >
              <MessageCircle size={22} /> {t('home.hero.cta.chat')}
            </Link>
          </motion.div>
        </div>

        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-krishi-cream to-transparent dark:from-gray-950" />
      </motion.section>

      {/* Features Section */}
      <section className="px-4">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="page-title mb-2 text-center"
        >
          {t('home.features.title')}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-lg text-gray-600 dark:text-gray-400"
        >
          {t('home.features.subtitle')}
        </motion.p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={f.path}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur-glass transition hover:shadow-xl hover:scale-[1.02] dark:border-white/10 dark:bg-gray-900/70"
                >
                  <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${f.color} p-3 text-white shadow-md transition group-hover:scale-110 group-hover:shadow-xl`}>
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