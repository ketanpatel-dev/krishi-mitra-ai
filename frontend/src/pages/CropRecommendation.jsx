import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sprout, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const seasons = ['Kharif', 'Rabi', 'Zaid']
const soils = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy']
const waterLevels = ['Low', 'Medium', 'High']

export default function CropRecommendation() {
  const { t, api } = useLanguage()
  const [form, setForm] = useState({ location: '', season: 'Kharif', soil_type: 'Alluvial', water_availability: 'Medium' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await api.recommendCrop(form)
      setResult(data)
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const riskColor = { low: 'text-green-600', medium: 'text-yellow-600', high: 'text-red-600' }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="page-title">{t('recommend.title')}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('recommend.subtitle')}</p>
      </div>

      <form onSubmit={submit} className="glass-card grid gap-6 p-6 md:grid-cols-2">
        <Field label={t('recommend.location')}>
          <input
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Pune, Maharashtra"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg dark:border-gray-600 dark:bg-gray-800"
          />
        </Field>
        <Field label={t('recommend.season')}>
          <select
            value={form.season}
            onChange={(e) => setForm({ ...form, season: e.target.value })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg dark:border-gray-600 dark:bg-gray-800"
          >
            {seasons.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label={t('recommend.soil')}>
          <select
            value={form.soil_type}
            onChange={(e) => setForm({ ...form, soil_type: e.target.value })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg dark:border-gray-600 dark:bg-gray-800"
          >
            {soils.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label={t('recommend.water')}>
          <select
            value={form.water_availability}
            onChange={(e) => setForm({ ...form, water_availability: e.target.value })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg dark:border-gray-600 dark:bg-gray-800"
          >
            {waterLevels.map((w) => <option key={w}>{w}</option>)}
          </select>
        </Field>
        <div className="md:col-span-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sprout size={20} />}
            {t('recommend.submit')}
          </button>
        </div>
      </form>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard label={t('recommend.best')} value={result.best_crop} highlight />
            <ResultCard label={t('recommend.yield')} value={result.expected_yield} />
            <ResultCard label={t('recommend.profit')} value={result.expected_profitability} />
            <div>
              <p className="text-sm text-gray-500">{t('recommend.risk')}</p>
              <p className={`text-2xl font-bold ${riskColor[result.risk_level]}`}>
                {t(`severity.${result.risk_level}`)}
              </p>
            </div>
          </div>
          {result.reasoning && (
            <p className="mt-6 rounded-xl bg-krishi-yellow/40 p-4 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {result.reasoning}
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block font-medium">{label}</label>
      {children}
    </div>
  )
}

function ResultCard({ label, value, highlight }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-krishi-green' : ''}`}>{value}</p>
    </div>
  )
}
