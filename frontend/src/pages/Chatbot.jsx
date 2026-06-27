import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Loader2, Sparkles, Lightbulb } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const examples = {
  en: [
    'My tomato leaves have yellow spots.',
    'Which fertilizer should I use for wheat?',
    'How much water does rice need?',
    'Can I grow mustard this season?',
  ],
  hi: [
    'मेरे टमाटर की पत्तियों पर पीले धब्बे हैं।',
    'गेहूं के लिए कौन सा उर्वरक उपयोग करूं?',
    'चावल को कितना पानी चाहिए?',
    'क्या मैं इस मौसम में सरसों उगा सकता हूं?',
  ],
}

export default function Chatbot() {
  const { t, lang, api } = useLanguage()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const msg = text || input
    if (!msg.trim() || loading) return
    setInput('')
    const userMsg = { role: 'user', content: msg }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)
    try {
      const result = await api.chat(msg, messages)
      setMessages([...history, { role: 'assistant', content: result.reply }])
    } catch {
      setMessages([...history, { role: 'assistant', content: t('common.error') }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 p-8 text-white shadow-xl"
      >
        <div className="absolute right-0 top-0 -mr-8 -mt-8 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute bottom-0 right-1/4 h-24 w-24 rounded-full bg-white/5" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold md:text-4xl">{t('chat.title')}</h2>
          <p className="mt-2 max-w-xl text-lg text-white/80">{t('chat.subtitle')}</p>
        </div>
      </motion.div>

      <div className="glass-card-strong flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid h-full grid-cols-1 items-center gap-6 md:grid-cols-2"
              >
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('chat.empty_title')}</h3>
                  <p className="mt-3 max-w-md text-gray-500 dark:text-gray-400">{t('chat.empty_subtitle')}</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-krishi-green md:justify-start">
                    <Lightbulb size={16} />
                    <span>{t('chat.examples')}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                    {examples[lang].map((ex) => (
                      <motion.button
                        key={ex}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => send(ex)}
                        className="rounded-full border border-blue-200 bg-white/50 px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 dark:border-blue-800 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                      >
                        {ex}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <svg viewBox="0 0 260 260" className="h-52 w-52 md:h-64 md:w-64" style={{ filter: 'drop-shadow(0 20px 40px rgba(99,102,241,0.3)) drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}>
                    <defs>
                      <linearGradient id="purpleAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                      <linearGradient id="cyanEye" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#67e8f9" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="bodyMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e5e7eb" />
                        <stop offset="50%" stopColor="#9ca3af" />
                        <stop offset="100%" stopColor="#6b7280" />
                      </linearGradient>
                      <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.2" />
                      </filter>
                    </defs>

                    <ellipse cx="130" cy="240" rx="85" ry="12" fill="#000" opacity="0.15" filter="url(#shadow)" />
                    <rect x="108" y="190" width="24" height="35" rx="12" fill="url(#bodyMetal)" stroke="#4b5563" strokeWidth="2.5" filter="url(#shadow)" />
                    <rect x="108" y="218" width="24" height="14" rx="7" fill="#374151" />
                    <rect x="108" y="160" width="24" height="30" rx="12" fill="url(#bodyMetal)" stroke="#4b5563" strokeWidth="2.5" filter="url(#shadow)" />
                    <rect x="108" y="148" width="24" height="12" rx="6" fill="#374151" />
                    <ellipse cx="130" cy="180" rx="55" ry="60" fill="url(#bodyMetal)" stroke="#4b5563" strokeWidth="3" filter="url(#shadow)" />
                    <circle cx="130" cy="192" r="20" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
                    <path d="M125 188 l3 6 h6" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#softGlow)" />
                    <path d="M105 210 q25 10 50 0" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
                    <motion.g animate={{ rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} style={{ transformOrigin: "90px 155px" }}>
                      <rect x="70" y="145" width="22" height="45" rx="11" fill="url(#bodyMetal)" stroke="#4b5563" strokeWidth="2.5" filter="url(#shadow)" />
                      <circle cx="81" cy="192" r="12" fill="url(#bodyMetal)" stroke="#4b5563" strokeWidth="2.5" />
                      <circle cx="88" cy="130" r="10" fill="#10b981" filter="url(#softGlow)" />
                    </motion.g>
                    <motion.g animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} style={{ transformOrigin: "170px 155px" }}>
                      <rect x="168" y="145" width="22" height="45" rx="11" fill="url(#bodyMetal)" stroke="#4b5563" strokeWidth="2.5" filter="url(#shadow)" />
                      <circle cx="179" cy="192" r="12" fill="url(#bodyMetal)" stroke="#4b5563" strokeWidth="2.5" />
                    </motion.g>
                    <rect x="78" y="55" width="104" height="90" rx="35" fill="url(#bodyMetal)" stroke="#4b5563" strokeWidth="3" filter="url(#shadow)" />
                    <rect x="88" y="68" width="84" height="62" rx="22" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
                    <motion.g animate={{ scaleY: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} style={{ transformOrigin: "110px 88px" }}>
                      <rect x="102" y="82" width="18" height="18" rx="4" fill="url(#cyanEye)" filter="url(#softGlow)" />
                      <rect x="105" y="85" width="5" height="5" rx="1" fill="#ffffff" opacity="0.9" />
                    </motion.g>
                    <motion.g animate={{ scaleY: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} style={{ transformOrigin: "150px 88px" }}>
                      <rect x="142" y="82" width="18" height="18" rx="4" fill="url(#cyanEye)" filter="url(#softGlow)" />
                      <rect x="145" y="85" width="5" height="5" rx="1" fill="#ffffff" opacity="0.9" />
                    </motion.g>
                    <path d="M115 118 q15 8 30 0" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
                    <path d="M75 75 Q60 75 60 95 Q60 110 75 110" stroke="url(#purpleAccent)" strokeWidth="12" strokeLinecap="round" fill="none" filter="url(#shadow)" />
                    <path d="M185 75 Q200 75 200 95 Q200 110 185 110" stroke="url(#purpleAccent)" strokeWidth="12" strokeLinecap="round" fill="none" filter="url(#shadow)" />
                    <ellipse cx="60" cy="95" rx="8" ry="18" fill="url(#purpleAccent)" opacity="0.8" />
                    <ellipse cx="200" cy="95" rx="8" ry="18" fill="url(#purpleAccent)" opacity="0.8" />
                    <rect x="105" y="48" width="50" height="8" rx="4" fill="url(#purpleAccent)" filter="url(#softGlow)" />
                    <path d="M90 135 Q75 170 85 200 Q105 210 130 205 Q155 210 175 200 Q185 170 170 135" fill="#15803d" opacity="0.9" stroke="#166534" strokeWidth="2" />
                    <circle cx="130" cy="132" r="12" fill="#10b981" stroke="#059669" strokeWidth="2.5" filter="url(#softGlow)" />
                    <path d="M126 130 l3 5 h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}
            >
              {m.role === 'assistant' && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-krishi-green to-emerald-600 text-white shadow-md">
                  <Sparkles size={20} />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-base leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-krishi-green to-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-200 shadow-sm dark:bg-gray-700">
                  <User size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-gray-500"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-krishi-green to-emerald-600 text-white shadow-md">
                <Sparkles size={20} />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-5 py-3 dark:bg-gray-800">
                <Loader2 className="animate-spin" size={18} />
                <span>{t('common.loading')}</span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-gray-200 bg-white/50 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/50">
          <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="input-field flex-1 text-base"
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary !px-5 disabled:opacity-50">
              <Send size={20} className="hidden sm:block" />
              <span>{t('chat.send')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}