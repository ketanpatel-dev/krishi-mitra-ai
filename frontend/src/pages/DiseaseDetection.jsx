import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, Loader2, AlertTriangle, Check, Beaker, Droplet, Leaf, AlertCircle, TrendingDown } from 'lucide-react'
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
    low: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300', badge: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
    medium: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-300', badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' },
    high: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300', badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  }

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="page-title mb-2">{t('detect.title')}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">{t('detect.subtitle')}</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`glass-card-premium flex min-h-80 cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 transition ${
              dragOver ? 'border-krishi-emerald bg-emerald-50/50 dark:bg-emerald-900/20 scale-105' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {preview ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <img src={preview} alt="Crop" className="max-h-64 rounded-2xl object-contain shadow-lg" />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-2 -right-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 p-2 text-white shadow-lg"
                >
                  <Check size={24} />
                </motion.div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="mb-6"
                >
                  <Leaf size={64} className="mx-auto text-emerald-500" />
                </motion.div>
                <p className="text-center text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{t('detect.dropzone')}</p>
                <p className="text-center text-sm text-gray-500">or click to browse</p>
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
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {loading && (
            <div className="glass-card-premium flex flex-col items-center justify-center gap-4 p-12 h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="ai-scan-pulse"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 blur-lg opacity-75"></div>
                  <Loader2 className="relative text-emerald-600 dark:text-emerald-400" size={48} />
                </div>
              </motion.div>
              <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('detect.analyzing')}</span>
              <p className="text-sm text-gray-500 text-center">AI is scanning your crop for diseases...</p>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-premium flex items-start gap-4 border-l-4 border-red-500 p-6 h-full"
            >
              <AlertTriangle className="text-red-500 shrink-0 mt-1" size={28} />
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-1">Analysis Failed</h4>
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card-premium p-6 border-l-4 ${severityColor[result.severity]?.border}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">{t('detect.result.title')}</h3>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`rounded-full px-4 py-2 font-semibold ${severityColor[result.severity]?.badge}`}
                  >
                    {t(`severity.${result.severity}`)}
                  </motion.span>
                </div>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                  <InfoCard label={t('detect.crop')} value={result.crop} icon={Leaf} />
                  <InfoCard label={t('detect.disease')} value={result.disease} icon={AlertCircle} />
                  <InfoCard label={t('detect.confidence')} value={`${result.confidence}%`} icon={TrendingDown} />
                  <InfoCard label="Status" value={result.severity === 'high' ? 'Alert' : 'Monitor'} />
                </div>
              </motion.div>

              {result.info && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card-premium p-6"
                >
                  <h3 className="section-title mb-4 flex items-center gap-2">
                    <Beaker size={24} /> Disease Information
                  </h3>
                  <InfoBlock label={t('detect.description')} value={result.info.description} />
                  <InfoBlock label={t('detect.symptoms')} value={result.info.symptoms} list />
                  <InfoBlock label={t('detect.causes')} value={result.info.causes} list />
                  <InfoBlock label={t('detect.spread')} value={result.info.spread} />
                  <InfoBlock label={t('detect.affected')} value={result.info.affected_crops} list />
                </motion.div>
              )}

              {result.treatment && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card-premium p-6"
                >
                  <h3 className="section-title mb-4 flex items-center gap-2">
                    <Droplet size={24} /> Treatment & Prevention
                  </h3>
                  <InfoBlock label={t('detect.pesticides')} value={result.treatment.pesticides} list />
                  <InfoBlock label={t('detect.organic')} value={result.treatment.organic} list />
                  <InfoBlock label={t('detect.preventive')} value={result.treatment.preventive} list />
                  <InfoBlock label={t('detect.fertilizer')} value={result.treatment.fertilizer} list />
                  <InfoBlock label={t('detect.water')} value={result.treatment.water} />
                  <InfoBlock label={t('detect.recovery')} value={result.treatment.recovery_time} />
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function InfoCard({ label, value, icon: Icon }) {
  return (
    <div className="text-center">
      {Icon && <Icon className="mx-auto mb-2 text-emerald-600 dark:text-emerald-400" size={24} />}
      <p className="text-2xl font-bold gradient-heading">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
    >
      <h4 className="mb-2 font-semibold text-krishi-green dark:text-krishi-emerald flex items-center gap-2">
        <Leaf size={16} /> {label}
      </h4>
      {list && Array.isArray(value) ? (
        <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300 ml-4">
          {value.map((item, i) => <li key={i} className="text-sm">{item}</li>)}
        </ul>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 ml-4">{value}</p>
      )}
    </motion.div>
  )
}
