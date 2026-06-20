import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Droplets, Wind, Sun, AlertTriangle, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'

export default function Weather() {
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getWeather()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-krishi-green" size={40} />
      </div>
    )
  }

  if (error) {
    return <div className="glass-card p-6 text-red-600">{error}</div>
  }

  const stats = [
    { icon: Sun, label: t('weather.temp'), value: `${data.current.temp}°C` },
    { icon: Droplets, label: t('weather.humidity'), value: `${data.current.humidity}%` },
    { icon: Cloud, label: t('weather.rain'), value: `${data.current.rain_probability}%` },
    { icon: Wind, label: t('weather.wind'), value: `${data.current.wind_speed} km/h` },
    { icon: Sun, label: t('weather.uv'), value: data.current.uv_index },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="page-title">{t('weather.title')}</h2>
        <p className="mt-1 text-gray-500">{data.city}</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
        <h3 className="section-title mb-4">{t('weather.current')}</h3>
        <p className="mb-4 text-5xl font-bold text-krishi-green">{data.current.temp}°C</p>
        <p className="mb-6 text-lg">{data.current.condition}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-krishi-yellow/40 p-4 dark:bg-gray-800">
              <Icon className="mb-2 text-krishi-green" size={24} />
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {data.alerts?.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="section-title mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" /> {t('weather.alerts')}
          </h3>
          {data.alerts.map((alert, i) => (
            <div key={i} className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
              <p className="font-semibold text-amber-800 dark:text-amber-300">{alert.title}</p>
              <p className="text-amber-700 dark:text-amber-400">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="section-title mb-4">{t('weather.forecast')}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {data.forecast.map((day, i) => (
            <div key={i} className="rounded-xl bg-white/50 p-4 text-center dark:bg-gray-800">
              <p className="font-medium">{day.day}</p>
              <p className="my-2 text-2xl">{day.icon}</p>
              <p className="text-sm text-gray-500">{day.condition}</p>
              <p className="mt-1 font-semibold">{day.high}° / {day.low}°</p>
              <p className="text-xs text-blue-500">{day.rain}% rain</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
