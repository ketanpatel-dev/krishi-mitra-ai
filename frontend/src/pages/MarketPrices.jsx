import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'

const trendIcon = { up: TrendingUp, down: TrendingDown, stable: Minus }
const trendColor = { up: 'text-green-600', down: 'text-red-600', stable: 'text-gray-500' }

export default function MarketPrices() {
  const { t } = useLanguage()
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMarketPrices().then((d) => setPrices(d.prices)).finally(() => setLoading(false))
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
      <h2 className="page-title">{t('market.title')}</h2>

      <div className="overflow-x-auto glass-card">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-4 text-lg">{t('market.crop')}</th>
              <th className="p-4 text-lg">{t('market.today')}</th>
              <th className="p-4 text-lg">{t('market.yesterday')}</th>
              <th className="p-4 text-lg">{t('market.trend')}</th>
              <th className="p-4 text-lg">{t('market.mandi')}</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p, i) => {
              const Icon = trendIcon[p.trend] || Minus
              return (
                <motion.tr
                  key={p.crop}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="p-4 font-semibold">{p.crop}</td>
                  <td className="p-4 text-krishi-green">₹{p.today} {t('common.perQuintal')}</td>
                  <td className="p-4 text-gray-500">₹{p.yesterday}</td>
                  <td className={`p-4 ${trendColor[p.trend]}`}>
                    <span className="flex items-center gap-1">
                      <Icon size={18} /> {t(`trend.${p.trend}`)}
                    </span>
                  </td>
                  <td className="p-4">{p.mandi}</td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
