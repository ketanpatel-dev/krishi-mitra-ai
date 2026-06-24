import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function VoiceAssistant() {
  const { t, lang, api } = useLanguage()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const recognitionRef = useRef(null)

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    utter.rate = 0.9
    window.speechSynthesis.speak(utter)
  }, [lang])

  const handleVoiceQuery = useCallback(async (text) => {
    if (!text.trim()) return
    setResponse(t('common.loading'))
    try {
      const lower = text.toLowerCase()
      if (lower.includes('weather') || lower.includes('मौसम')) {
        navigate('/weather')
        speak(lang === 'hi' ? 'मौसम पृष्ठ खोला जा रहा है' : 'Opening weather page')
        return
      }
      if (lower.includes('market') || lower.includes('price') || lower.includes('भाव') || lower.includes('बाजार')) {
        navigate('/market')
        speak(lang === 'hi' ? 'बाजार भाव पृष्ठ खोला जा रहा है' : 'Opening market prices')
        return
      }
      if (lower.includes('damage') || lower.includes('flood') || lower.includes('बाढ़') || lower.includes('क्षति')) {
        navigate('/damage')
        speak(lang === 'hi' ? 'फसल क्षति सहायता पृष्ठ खोला जा रहा है' : 'Opening crop damage assistance page')
        return
      }
      if (lower.includes('disease') || lower.includes('रोग')) {
        navigate('/detect')
        speak(lang === 'hi' ? 'रोग पहचान पृष्ठ खोला जा रहा है' : 'Opening disease detection')
        return
      }

      const result = await api.chat(text, [])
      setResponse(result.reply)
      speak(result.reply)
    } catch {
      const err = t('common.error')
      setResponse(err)
      speak(err)
    }
  }, [api, lang, navigate, speak, t])

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setResponse(lang === 'hi' ? 'आपका ब्राउज़र वॉइस समर्थन नहीं करता' : 'Your browser does not support voice input')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      handleVoiceQuery(text)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [handleVoiceQuery, lang])

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  useEffect(() => () => recognitionRef.current?.stop(), [])

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-krishi-green text-white shadow-xl"
        aria-label="Voice assistant"
      >
        {listening ? <MicOff size={28} /> : <Mic size={28} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 glass-card p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <Volume2 className="text-krishi-green" size={20} />
              <span className="font-semibold">{t('home.features.voice')}</span>
            </div>

            {transcript && (
              <p className="mb-2 rounded-lg bg-krishi-yellow/50 p-2 text-sm dark:bg-gray-800">
                <strong>You:</strong> {transcript}
              </p>
            )}
            {response && (
              <p className="mb-3 rounded-lg bg-green-50 p-2 text-sm dark:bg-gray-800">
                <strong>AI:</strong> {response}
              </p>
            )}

            <div className="flex gap-2">
              {!listening ? (
                <button onClick={startListening} className="btn-primary flex-1 !py-2 !text-base">
                  <Mic size={18} /> {t('voice.speak')}
                </button>
              ) : (
                <button onClick={stopListening} className="btn-secondary flex-1 !py-2 !text-base">
                  <MicOff size={18} /> {t('voice.stop')}
                </button>
              )}
            </div>
            {listening && <p className="mt-2 text-center text-sm text-krishi-green">{t('voice.listening')}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
