import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, Droplets, Wind, Sun, AlertTriangle, Loader2, Thermometer, Gauge, MapPin, RefreshCw } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Weather() {
  const { t, api } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchWeather = () => {
    setLoading(true)
    setError('')
    api.getWeather('Indore')
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchWeather()
  }, [api])

  const getWeatherGradient = (condition) => {
    const c = (condition || '').toLowerCase()
    if (c.includes('rain') || c.includes('drizzle') || c.includes('thunder') || c.includes('बारिश')) {
      return 'from-blue-600 to-indigo-700'
    }
    if (c.includes('cloud') || c.includes('overcast') || c.includes('बादल')) {
      return 'from-gray-500 to-slate-600'
    }
    if (c.includes('clear') || c.includes('sunny') || c.includes('धूप')) {
      return 'from-amber-500 to-orange-600'
    }
    if (c.includes('fog') || c.includes('mist') || c.includes('कोहरा')) {
      return 'from-gray-400 to-gray-500'
    }
    return 'from-krishi-green to-emerald-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Loader2 className="text-krishi-green" size={48} />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card-strong flex items-center gap-4 border-2 border-red-200 p-8 dark:border-red-800"
      >
        <AlertTriangle size={32} className="text-red-500" />
        <div>
          <h3 className="font-bold text-red-700 dark:text-red-400">{t('weather.error_title')}</h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </motion.div>
    )
  }

  const stats = [
    { icon: Thermometer, label: t('weather.temp'), value: `${data.current.temp}°C` },
    { icon: Droplets, label: t('weather.humidity'), value: `${data.current.humidity}%` },
    { icon: Cloud, label: t('weather.rain'), value: `${data.current.rain_probability}%` },
    { icon: Wind, label: t('weather.wind'), value: `${data.current.wind_speed} km/h` },
    { icon: Gauge, label: t('weather.uv'), value: data.current.uv_index },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 p-8 text-white shadow-xl"
      >
        <div className="absolute right-0 top-0 -mr-8 -mt-8 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute bottom-0 right-1/3 h-24 w-24 rounded-full bg-white/5" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">{t('weather.title')}</h2>
              <p className="mt-1 flex items-center gap-1 text-white/80">
                <MapPin size={16} />
                {data.city}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchWeather}
              className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30"
            >
              <RefreshCw size={16} />
              {t('weather.refresh')}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Current Weather */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getWeatherGradient(data.current.condition)} p-8 text-white shadow-xl`}
      >
        <div className="absolute right-4 top-4 text-6xl opacity-20">
          <Sun size={80} />
        </div>
        <div className="relative z-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-7xl font-bold">{data.current.temp}°C</p>
              <p className="mt-2 text-xl font-medium text-white/90">{data.current.condition}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">{t('weather.current')}</p>
              <p className="text-lg font-semibold">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {stats.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="glass-card-strong p-5 text-center transition hover:shadow-xl hover:scale-105"
          >
            <Icon className="mx-auto mb-3 text-krishi-green" size={28} />
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Alerts */}
      <AnimatePresence>
        {data.alerts?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card-strong overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 dark:border-amber-800 dark:from-amber-900/20 dark:to-yellow-900/20">
              <AlertTriangle className="text-amber-500" size={22} />
              <h3 className="section-title">{t('weather.alerts')}</h3>
            </div>
            <div className="space-y-3 p-6">
              {data.alerts.map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-900/10"
                >
                  <p className="font-semibold text-amber-800 dark:text-amber-300">{alert.title}</p>
                  <p className="mt-1 text-amber-700 dark:text-amber-400">{alert.message}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-strong overflow-hidden"
      >
        <div className="border-b border-gray-200 bg-gradient-to-r from-sky-500/5 to-blue-500/5 px-6 py-4 dark:border-gray-700">
          <h3 className="section-title flex items-center gap-2">
            <Sun size={20} />
            {t('weather.forecast')}
          </h3>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-7">
          {data.forecast.map((day, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl bg-white/50 p-4 text-center shadow-sm transition hover:bg-krishi-green/5 hover:shadow-md dark:bg-gray-800/50 dark:hover:bg-krishi-green/10"
            >
              <p className="text-sm font-semibold text-krishi-green">{day.day}</p>
              <p className="my-3 text-4xl transition-transform group-hover:scale-110">{day.icon}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{day.condition}</p>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                <span className="font-bold text-orange-600">{day.high}°</span>
                <span className="text-gray-400">/</span>
                <span className="font-semibold text-blue-600">{day.low}°</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                <Droplets size={12} />
                {day.rain}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}