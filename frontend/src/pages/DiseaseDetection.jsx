import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, Loader2, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'

export default function DiseaseDetection() {
  const { t } = useLanguage()
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)
  const cameraRef = useRef(null)

  const analyze = async (file) => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await api.detectDisease(file)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFile = useCallback((file) => {
    if (!file?.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    analyze(file)
  }, [])

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const severityColor = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="page-title">{t('detect.title')}</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('detect.subtitle')}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`glass-card flex min-h-64 cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 transition ${
              dragOver ? 'border-krishi-green bg-krishi-green/5' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {preview ? (
              <img src={preview} alt="Crop" className="max-h-64 rounded-xl object-contain" />
            ) : (
              <>
                <Upload size={48} className="mb-4 text-krishi-green" />
                <p className="text-center text-lg">{t('detect.dropzone')}</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => fileRef.current?.click()} className="btn-primary">
              <Upload size={20} /> {t('detect.upload')}
            </button>
            <button
              onClick={() => {
                if (cameraRef.current) {
                  cameraRef.current.click()
                }
              }}
              className="btn-secondary"
            >
              <Camera size={20} /> {t('detect.camera')}
            </button>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        </div>

        <div>
          {loading && (
            <div className="glass-card flex items-center justify-center gap-3 p-12">
              <Loader2 className="animate-spin text-krishi-green" size={32} />
              <span className="text-lg">{t('detect.analyzing')}</span>
            </div>
          )}

          {error && (
            <div className="glass-card flex items-center gap-3 border-red-200 p-6 text-red-700 dark:text-red-400">
              <AlertTriangle /> {error}
            </div>
          )}

          {result && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="section-title mb-4">{t('detect.result.title')}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoRow label={t('detect.crop')} value={result.crop} />
                  <InfoRow label={t('detect.disease')} value={result.disease} />
                  <InfoRow label={t('detect.confidence')} value={`${result.confidence}%`} />
                  <div>
                    <span className="text-sm text-gray-500">{t('detect.severity')}</span>
                    <p className={`mt-1 inline-block rounded-full px-3 py-1 font-semibold ${severityColor[result.severity] || severityColor.medium}`}>
                      {t(`severity.${result.severity}`)}
                    </p>
                  </div>
                </div>
              </div>

              {result.info && (
                <div className="glass-card p-6">
                  <h3 className="section-title mb-4">{t('detect.info')}</h3>
                  <InfoBlock label={t('detect.description')} value={result.info.description} />
                  <InfoBlock label={t('detect.symptoms')} value={result.info.symptoms} list />
                  <InfoBlock label={t('detect.causes')} value={result.info.causes} list />
                  <InfoBlock label={t('detect.spread')} value={result.info.spread} />
                  <InfoBlock label={t('detect.affected')} value={result.info.affected_crops} list />
                </div>
              )}

              {result.treatment && (
                <div className="glass-card p-6">
                  <h3 className="section-title mb-4">{t('detect.treatment')}</h3>
                  <InfoBlock label={t('detect.pesticides')} value={result.treatment.pesticides} list />
                  <InfoBlock label={t('detect.organic')} value={result.treatment.organic} list />
                  <InfoBlock label={t('detect.preventive')} value={result.treatment.preventive} list />
                  <InfoBlock label={t('detect.fertilizer')} value={result.treatment.fertilizer} list />
                  <InfoBlock label={t('detect.water')} value={result.treatment.water} />
                  <InfoBlock label={t('detect.recovery')} value={result.treatment.recovery_time} />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <span className="text-sm text-gray-500">{label}</span>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}

function InfoBlock({ label, value, list }) {
  if (!value) return null
  return (
    <div className="mb-4">
      <h4 className="mb-1 font-medium text-krishi-green">{label}</h4>
      {list && Array.isArray(value) ? (
        <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
          {value.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">{value}</p>
      )}
    </div>
  )
}
