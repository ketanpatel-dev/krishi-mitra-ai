import { useState } from 'react'
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

  const NavLink = ({ item }) => {
    const active = location.pathname === item.path
    const Icon = item.icon
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition ${
          active
            ? 'bg-krishi-green text-white shadow-md'
            : 'text-gray-700 hover:bg-krishi-green/10 dark:text-gray-200 dark:hover:bg-krishi-green/20'
        }`}
      >
        <Icon size={22} />
        <span>{t(item.key)}</span>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-krishi-yellow via-krishi-cream to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-krishi-dark/30">
      <header className="sticky top-0 z-40 border-b border-white/30 bg-white/80 backdrop-blur-glass dark:border-white/10 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            <div>
              <h1 className="text-xl font-bold text-krishi-dark dark:text-krishi-light">{t('appName')}</h1>
              <p className="hidden text-xs text-gray-500 sm:block">{t('mission')}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="btn-secondary !px-3 !py-2 !text-sm" aria-label="Toggle language">
              <Languages size={18} />
              {lang === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button onClick={toggleDark} className="rounded-xl p-2 hover:bg-gray-200 dark:hover:bg-gray-800" aria-label="Toggle theme">
              {dark ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button className="rounded-xl p-2 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="glass-card sticky top-24 space-y-1 p-3">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>
        </aside>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <motion.nav
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="glass-card h-full w-72 space-y-1 overflow-y-auto p-4"
                onClick={(e) => e.stopPropagation()}
              >
                {navItems.map((item) => (
                  <NavLink key={item.path} item={item} />
                ))}
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1 pb-24">{children}</main>
      </div>

      <VoiceAssistant />
    </div>
  )
}
