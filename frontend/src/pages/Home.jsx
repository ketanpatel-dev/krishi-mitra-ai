import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scan, MessageCircle, Cloud, TrendingUp, Landmark, Sprout, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const features = [
  { icon: Scan, key: 'home.features.disease', descKey: 'home.features.disease.desc', path: '/detect', gradient: 'from-emerald-500 to-teal-600', bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' },
  { icon: MessageCircle, key: 'home.features.voice', descKey: 'home.features.voice.desc', path: '/chat', gradient: 'from-blue-500 to-cyan-600', bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' },
  { icon: Cloud, key: 'home.features.weather', descKey: 'home.features.weather.desc', path: '/weather', gradient: 'from-sky-500 to-blue-600', bgGradient: 'from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20' },
  { icon: TrendingUp, key: 'home.features.market', descKey: 'home.features.market.desc', path: '/market', gradient: 'from-amber-500 to-orange-600', bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20' },
  { icon: Landmark, key: 'home.features.schemes', descKey: 'home.features.schemes.desc', path: '/schemes', gradient: 'from-purple-500 to-violet-600', bgGradient: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20' },
  { icon: Shield, key: 'home.features.insurance', descKey: 'home.features.insurance.desc', path: '/insurance', gradient: 'from-rose-500 to-pink-600', bgGradient: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20' },
]

const stats = [
  { label: 'Diseases Detected', value: '500+', icon: Scan },
  { label: 'Active Farmers', value: '10K+', icon: Sprout },
  { label: 'Success Rate', value: '95%', icon: Zap },
]

export default function Home() {
  const { t } = useLanguage()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="glass-card-premium relative overflow-hidden p-0"
      >
        <div className="absolute inset-0 opacity-40">
          <img src="/hero-bg.png" alt="Agricultural background" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-krishi-dark/60 via-krishi-green/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 md:px-12 md:py-28 text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="mb-6"
          >
            <Sprout size={64} className="mx-auto text-emerald-400" />
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="page-title mb-4 text-white drop-shadow-lg"
          >
            {t('home.hero.title')}
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="mb-3 max-w-3xl text-xl text-white/90 drop-shadow-md"
          >
            {t('home.hero.subtitle')}
          </motion.p>
          
          <motion.p
            variants={itemVariants}
            className="mb-10 text-lg font-semibold text-emerald-200 drop-shadow-md"
          >
            {t('tagline')}
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/detect" className="btn-primary group">
              <Scan size={22} /> {t('home.hero.cta.detect')}
              <ArrowRight size={20} className="transition group-hover:translate-x-1" />
            </Link>
            <Link to="/chat" className="btn-secondary">
              <MessageCircle size={22} /> {t('home.hero.cta.chat')}
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-3"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              className="glass-card-premium p-8 text-center"
            >
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-4 text-white">
                <Icon size={32} />
              </div>
              <div className="text-4xl font-bold gradient-heading mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </motion.div>
          )
        })}
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={itemVariants}
          className="page-title mb-4 text-center"
        >
          {t('home.features.title')}
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="mb-12 text-center text-lg text-gray-600 dark:text-gray-300"
        >
          Comprehensive AI-powered tools for modern farming
        </motion.p>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.key}
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <Link to={f.path} className={`glass-card-premium block h-full p-8 transition card-hover group overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.bgGradient} opacity-0 group-hover:opacity-100 transition`}></div>
                  <div className="relative z-10">
                    <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${f.gradient} p-4 text-white shadow-lg`}>
                      <Icon size={32} />
                    </div>
                    <h4 className="section-title mb-3">{t(f.key)}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{t(f.descKey)}</p>
                    <div className="inline-flex items-center text-krishi-green font-semibold group-hover:gap-2 transition gap-1">
                      Learn More <ArrowRight size={18} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card-premium relative overflow-hidden p-12 md:p-16 text-center"
      >
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h3 className="page-title mb-4">Ready to Transform Your Farm?</h3>
          <p className="mb-8 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Join thousands of farmers using AI to detect diseases early and maximize their harvest.
          </p>
          <Link to="/detect" className="btn-primary inline-flex">
            Start Detecting Now <ArrowRight size={22} />
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
