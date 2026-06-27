import React, { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, Loader2, AlertTriangle, Leaf, Search, Shield, Info, FlaskConical, CheckCircle, XCircle, Scan } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function DiseaseDetection() {
  const { t, api } = useLanguage()
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [scanning, setScanning] = useState(false)
  const fileRef = useRef(null)
  const cameraRef = useRef(null)

  const analyze = async (file) => {
    setLoading(true)
    setError('')
    setResult(null)
    setScanning(true)
    try {
      const data = await api.detectDisease(file)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setTimeout(() => setScanning(false), 500)
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
    low: 'bg-green-100 text-green-800 ring-1 ring-green-300 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-700',
    medium: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-700',
    high: 'bg-red-100 text-red-800 ring-1 ring-red-300 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700',
  }

  const severityIcon = {
    low: Shield,
    medium: AlertTriangle,
    high: AlertTriangle,
  }

  const statCards = [
    { icon: Leaf, label: t('detect.crop'), value: result?.crop },
    { icon: FlaskConical, label: t('detect.disease'), value: result?.disease },
    { icon: Search, label: t('detect.confidence'), value: result ? `${result.confidence}%` : null },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-krishi-green to-emerald-700 p-8 text-white shadow-xl"
      >
        <div className="absolute right-0 top-0 -mr-8 -mt-8 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold md:text-4xl">{t('detect.title')}</h2>
          <p className="mt-2 max-w-xl text-lg text-white/80">{t('detect.subtitle')}</p>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Upload Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`group relative flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ${
                dragOver
                  ? 'border-krishi-green bg-krishi-green/10 shadow-lg shadow-krishi-green/20'
                  : 'border-gray-300 bg-white/50 hover:border-krishi-green hover:bg-krishi-green/5 dark:border-gray-600 dark:bg-gray-800/30 dark:hover:border-krishi-light'
              }`}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Crop"
                    className={`max-h-72 rounded-xl object-contain shadow-lg transition-all duration-500 ${scanning ? 'opacity-60 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}
                  />
                  <div className="absolute inset-0 rounded-xl ring-2 ring-krishi-green/30" />

                  {/* Scanning Animation Overlay */}
                  {scanning && (
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <motion.div
                        animate={{ y: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                        style={{ boxShadow: '0 0 20px rgba(52, 211, 153, 0.8)' }}
                      />
                      <motion.div
                        animate={{ y: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        className="absolute left-0 right-0 h-16 bg-gradient-to-b from-emerald-400/20 to-transparent"
                      />

                      <motion.div
                        animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-500/90 px-4 py-2 text-sm font-bold text-white shadow-2xl backdrop-blur-sm"
                      >
                        <Scan size={20} className="mr-2 animate-pulse" />
                        {loading ? t('detect.analyzing') : t('detect.analyzing')}
                      </motion.div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-krishi-green to-emerald-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Upload size={36} />
                  </div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('detect.dropzone')}</p>
                  <p className="mt-2 text-sm text-gray-500">{t('detect.upload_hint')}</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <button onClick={() => fileRef.current?.click()} className="btn-primary flex-1 sm:flex-none">
              <Upload size={20} /> {t('detect.upload')}
            </button>
            <button
              onClick={() => cameraRef.current?.click()}
              className="btn-secondary flex-1 sm:flex-none"
            >
              <Camera size={20} /> {t('detect.camera')}
            </button>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </motion.div>
        </div>

        {/* Right: Results Section */}
        <div>
          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card-strong flex flex-col items-center justify-center gap-4 p-16"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="relative"
                >
                  <div className="h-16 w-16 rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                  <Scan size={24} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600" />
                </motion.div>
                <span className="text-lg font-medium text-gray-600 dark:text-gray-400">{t('detect.analyzing')}</span>
                <motion.div
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                >
                  <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-green-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card-strong flex items-start gap-4 border-2 border-red-200 p-6 dark:border-red-800"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 dark:text-red-400">{t('detect.error_title')}</h4>
                  <p className="mt-1 text-red-600 dark:text-red-300">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {statCards.map(({ icon: Icon, label, value }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card-strong p-4 text-center"
                    >
                      <Icon size={24} className="mx-auto mb-2 text-krishi-green" />
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="mt-1 text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Severity Badge */}
                {result.severity && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <span className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold ${severityColor[result.severity] || severityColor.medium}`}>
                      {React.createElement(severityIcon[result.severity] || Shield, { size: 16 })}
                      {t('detect.severity')}: {t(`severity.${result.severity}`)}
                    </span>
                  </motion.div>
                )}

                {/* Disease Info */}
                {result.info && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card-strong overflow-hidden"
                  >
                    <div className="border-b border-gray-200 bg-gradient-to-r from-krishi-green/5 to-emerald-500/5 px-6 py-4 dark:border-gray-700">
                      <h3 className="section-title flex items-center gap-2">
                        <Info size={20} />
                        {t('detect.info')}
                      </h3>
                    </div>
                    <div className="space-y-4 p-6">
                      <InfoBlock label={t('detect.description')} value={result.info.description} />
                      <InfoBlock label={t('detect.symptoms')} value={result.info.symptoms} list />
                      <InfoBlock label={t('detect.causes')} value={result.info.causes} list />
                      <InfoBlock label={t('detect.spread')} value={result.info.spread} />
                      <InfoBlock label={t('detect.affected')} value={result.info.affected_crops} list />
                    </div>
                  </motion.div>
                )}

                {/* Treatment */}
                {result.treatment && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card-strong overflow-hidden"
                  >
                    <div className="border-b border-gray-200 bg-gradient-to-r from-emerald-500/5 to-green-500/5 px-6 py-4 dark:border-gray-700">
                      <h3 className="section-title flex items-center gap-2">
                        <Shield size={20} />
                        {t('detect.treatment')}
                      </h3>
                    </div>
                    <div className="space-y-4 p-6">
                      <InfoBlock label={t('detect.pesticides')} value={result.treatment.pesticides} list />
                      <InfoBlock label={t('detect.organic')} value={result.treatment.organic} list />
                      <InfoBlock label={t('detect.preventive')} value={result.treatment.preventive} list />
                      <InfoBlock label={t('detect.fertilizer')} value={result.treatment.fertilizer} list />
                      <InfoBlock label={t('detect.water')} value={result.treatment.water} />
                      <InfoBlock label={t('detect.recovery')} value={result.treatment.recovery_time} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!result && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card-strong flex flex-col items-center justify-center p-16 text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-krishi-green/10 to-emerald-500/10">
                <Search size={40} className="text-krishi-green/60" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('detect.empty_title')}</h3>
              <p className="mt-2 max-w-xs text-gray-500">{t('detect.empty_subtitle')}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/30">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <p className="mt-0.5 text-base font-semibold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  )
}

function InfoBlock({ label, value, list }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-krishi-green">{label}</h4>
      {list && Array.isArray(value) ? (
        <ul className="space-y-2">
          {value.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-krishi-green" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 leading-relaxed dark:text-gray-300">{value}</p>
      )}
    </div>
  )
}