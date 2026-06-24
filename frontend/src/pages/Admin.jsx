import { useEffect, useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Admin() {
  const { t, api } = useLanguage()
  const [tab, setTab] = useState('diseases')
  const [diseases, setDiseases] = useState([])
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    Promise.all([api.adminGetDiseases(), api.adminGetSchemes()])
      .then(([d, s]) => {
        setDiseases(d.diseases)
        setSchemes(s.schemes)
      })
      .finally(() => setLoading(false))
  }, [])

  const saveDisease = async (disease) => {
    setSaving(disease.id)
    try {
      await api.adminUpdateDisease(disease.id, disease)
      setMessage('Disease updated successfully')
    } catch {
      setMessage(t('common.error'))
    } finally {
      setSaving(null)
    }
  }

  const saveScheme = async (scheme) => {
    setSaving(scheme.id)
    try {
      await api.adminUpdateScheme(scheme.id, scheme)
      setMessage('Scheme updated successfully')
    } catch {
      setMessage(t('common.error'))
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-krishi-green" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="page-title">{t('admin.title')}</h2>

      {message && (
        <div className="rounded-xl bg-green-100 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          {message}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setTab('diseases')}
          className={`rounded-xl px-4 py-2 font-medium ${tab === 'diseases' ? 'bg-krishi-green text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
        >
          {t('admin.diseases')}
        </button>
        <button
          onClick={() => setTab('schemes')}
          className={`rounded-xl px-4 py-2 font-medium ${tab === 'schemes' ? 'bg-krishi-green text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
        >
          {t('admin.schemes')}
        </button>
      </div>

      {tab === 'diseases' && (
        <div className="space-y-4">
          {diseases.map((d, i) => (
            <div key={d.id} className="glass-card p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={d.name}
                  onChange={(e) => {
                    const updated = [...diseases]
                    updated[i] = { ...d, name: e.target.value }
                    setDiseases(updated)
                  }}
                  className="rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                />
                <input
                  value={d.crop}
                  onChange={(e) => {
                    const updated = [...diseases]
                    updated[i] = { ...d, crop: e.target.value }
                    setDiseases(updated)
                  }}
                  className="rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                />
                <textarea
                  value={d.description}
                  onChange={(e) => {
                    const updated = [...diseases]
                    updated[i] = { ...d, description: e.target.value }
                    setDiseases(updated)
                  }}
                  rows={2}
                  className="md:col-span-2 rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <button
                onClick={() => saveDisease(d)}
                disabled={saving === d.id}
                className="btn-primary mt-3 !py-2 !text-base"
              >
                {saving === d.id ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'schemes' && (
        <div className="space-y-4">
          {schemes.map((s, i) => (
            <div key={s.id} className="glass-card p-4">
              <input
                value={s.name}
                onChange={(e) => {
                  const updated = [...schemes]
                  updated[i] = { ...s, name: e.target.value }
                  setSchemes(updated)
                }}
                className="mb-2 w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              />
              <textarea
                value={s.short_description}
                onChange={(e) => {
                  const updated = [...schemes]
                  updated[i] = { ...s, short_description: e.target.value }
                  setSchemes(updated)
                }}
                rows={2}
                className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              />
              <button
                onClick={() => saveScheme(s)}
                disabled={saving === s.id}
                className="btn-primary mt-3 !py-2 !text-base"
              >
                {saving === s.id ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
