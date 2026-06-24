import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Loader2 } from 'lucide-react'
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
      <div>
        <h2 className="page-title">{t('chat.title')}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('chat.subtitle')}</p>
      </div>

      <div className="glass-card mt-6 flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500">
              <Bot size={48} className="mx-auto mb-3 text-krishi-green" />
              <p className="mb-4">{t('chat.examples')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {examples[lang].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => send(ex)}
                    className="rounded-full border border-krishi-green/30 px-4 py-2 text-sm hover:bg-krishi-green/10"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}
            >
              {m.role === 'assistant' && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-krishi-green text-white">
                  <Bot size={20} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === 'user'
                    ? 'bg-krishi-green text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <User size={20} />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin" size={20} /> {t('common.loading')}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send() }}
          className="flex gap-2 border-t border-gray-200 p-4 dark:border-gray-700"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-krishi-green focus:outline-none dark:border-gray-600 dark:bg-gray-800"
          />
          <button type="submit" disabled={loading} className="btn-primary !px-4">
            <Send size={22} /> {t('chat.send')}
          </button>
        </form>
      </div>
    </div>
  )
}
