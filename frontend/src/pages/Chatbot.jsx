import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, MessageCircle, Sparkles, Lightbulb } from 'lucide-react'
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
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {/* Header */}
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

      {/* Chat Container */}
      <div className="glass-card-strong flex flex-1 flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <Bot size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('chat.empty_title')}</h3>
                <p className="mb-6 mt-2 max-w-md text-gray-500 dark:text-gray-400">
                  {t('chat.empty_subtitle')}
                </p>
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-krishi-green">
                  <Lightbulb size={16} />
                  <span>{t('chat.examples')}</span>
                </div>
                <div className="flex max-w-lg flex-wrap justify-center gap-2">
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
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

          {/* Loading Indicator */}
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

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white/50 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/50">
          <form
            onSubmit={(e) => { e.preventDefault(); send() }}
            className="flex gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="input-field flex-1 text-base"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary !px-5 disabled:opacity-50"
            >
              <Send size={20} className="hidden sm:block" />
              <span>{t('chat.send')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}