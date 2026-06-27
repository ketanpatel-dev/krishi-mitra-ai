import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Scan, MessageCircle, Cloud, TrendingUp, Landmark,
  Shield, Phone, Sprout, BookOpen, Settings, Menu, X,
  Moon, Sun, Languages, AlertTriangle,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import VoiceAssistant from './VoiceAssistant'

const navItems = [
  { path: '/', icon: Home, key: 'nav.home' },
  { path: '/detect', icon: Scan, key: 'nav.detect' },
  { path: '/chat', icon: MessageCircle, key: 'nav.chat' },
  { path: '/weather', icon: Cloud, key: 'nav.weather' },
  { path: '/market', icon: TrendingUp, key: 'nav.market' },
  { path: '/schemes', icon: Landmark, key: 'nav.schemes' },
  { path: '/insurance', icon: Shield, key: 'nav.insurance' },
  { path: '/damage', icon: AlertTriangle, key: 'nav.damage' },
  { path: '/emergency', icon: Phone, key: 'nav.emergency' },
  { path: '/recommend', icon: Sprout, key: 'nav.recommend' },
  { path: '/education', icon: BookOpen, key: 'nav.education' },
  { path: '/admin', icon: Settings, key: 'nav.admin' },
]

export default function Layout({ children }) {
  const { t, lang, toggleLang } = useLanguage()
  const { dark, toggleDark } = useTheme()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isHome = location.pathname === '/'

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const NavLink = ({ item }) => {
    const active = location.pathname === item.path
    const Icon = item.icon
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
          active
            ? 'bg-gradient-to-r from-krishi-green to-emerald-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-krishi-green/10 dark:text-gray-200 dark:hover:bg-krishi-green/20'
        }`}
      >
        <Icon size={22} className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span>{t(item.key)}</span>
        {active && (
          <motion.div
            layoutId="activeNav"
            className="ml-auto h-2 w-2 rounded-full bg-white"
          />
        )}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-krishi-yellow via-krishi-cream to-green-50 font-sans dark:from-gray-950 dark:via-gray-900 dark:to-krishi-dark/30">
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b border-white/30 bg-white/80 backdrop-blur-lg transition-all dark:border-white/10 dark:bg-gray-900/80 ${isHome ? 'bg-opacity-60' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-3xl transition-transform duration-300 group-hover:scale-110"
            >
              🌾
            </motion.span>
            <div>
              <h1 className="text-xl font-bold text-krishi-dark dark:text-krishi-light">{t('appName')}</h1>
              <p className="hidden text-xs text-gray-500 sm:block">{t('mission')}</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="group relative inline-flex items-center gap-2 rounded-xl border-2 border-krishi-green bg-krishi-green/10 px-4 py-2 text-sm font-semibold text-krishi-green shadow-sm transition-all duration-200 hover:bg-krishi-green hover:text-white hover:shadow-md dark:border-emerald-400 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
            >
              <Languages size={18} className="transition-transform group-hover:rotate-12" />
              {lang === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button
              onClick={toggleDark}
              className="rounded-xl border-2 border-gray-300 bg-white/50 p-2.5 shadow-sm transition-all duration-200 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-gray-700" />}
            </button>
            <button
              className="rounded-xl p-2.5 transition-colors duration-200 hover:bg-gray-200 lg:hidden dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main content area with sidebar */}
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="glass-card sticky top-24 space-y-1 p-3">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <motion.nav
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 25 }}
                className="h-full w-72 space-y-1 overflow-y-auto border-r border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/95"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
                  <span className="text-3xl">🌾</span>
                  <div>
                    <h2 className="text-lg font-bold text-krishi-dark dark:text-krishi-light">{t('appName')}</h2>
                    <p className="text-xs text-gray-500">{t('mission')}</p>
                  </div>
                </div>
                {navItems.map((item) => (
                  <NavLink key={item.path} item={item} />
                ))}
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="min-w-0 flex-1 pb-24">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <VoiceAssistant />
    </div>
  )
}