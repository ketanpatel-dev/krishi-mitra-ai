import { useEffect, useState } from 'react'
import { Phone, MapPin, Building, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'

export default function Emergency() {
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getEmergency().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-krishi-green" size={40} />
      </div>
    )
  }

  const sections = [
    { key: 'emergency.helpline', icon: Phone, items: data.helplines },
    { key: 'emergency.department', icon: Building, items: data.departments },
    { key: 'emergency.office', icon: MapPin, items: data.offices },
    { key: 'emergency.kvk', icon: MapPin, items: data.kvks },
    { key: 'emergency.contacts', icon: Phone, items: data.emergency_contacts },
  ]

  return (
    <div className="space-y-8">
      <h2 className="page-title">{t('emergency.title')}</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map(({ key, icon: Icon, items }) => (
          <div key={key} className="glass-card p-6">
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Icon size={22} /> {t(key)}
            </h3>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="rounded-xl bg-red-50 p-4 dark:bg-gray-800">
                  <p className="font-semibold">{item.name}</p>
                  {item.phone && (
                    <a href={`tel:${item.phone}`} className="text-lg text-krishi-green">{item.phone}</a>
                  )}
                  {item.address && <p className="text-sm text-gray-500">{item.address}</p>}
                  {item.hours && <p className="text-sm text-gray-500">{item.hours}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
