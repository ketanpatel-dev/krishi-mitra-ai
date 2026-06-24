const API_BASE = import.meta.env.VITE_API_URL || '/api'

function langParam(lang) {
  return lang ? `?lang=${lang}` : ''
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

export function createApi(lang = 'en') {
  return {
    detectDisease: (file) => {
      const form = new FormData()
      form.append('image', file)
      form.append('lang', lang)
      return request('/detect-disease', { method: 'POST', body: form })
    },
    getDiseaseInfo: (diseaseId) => request(`/disease/${diseaseId}${langParam(lang)}`),
    getTreatment: (diseaseId) => request(`/treatment/${diseaseId}${langParam(lang)}`),
    chat: (message, history = []) =>
      request('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, lang }),
      }),
    getWeather: (city = 'Delhi') => request(`/weather?city=${encodeURIComponent(city)}&lang=${lang}`),
    getMarketPrices: () => request(`/market-prices?lang=${lang}`),
    getSchemes: () => request(`/schemes?lang=${lang}`),
    getInsurance: () => request(`/insurance?lang=${lang}`),
    getEmergency: () => request('/emergency'),
    getDisasters: () => request(`/disasters?lang=${lang}`),
    getEducation: () => request('/education'),
    recommendCrop: (data) =>
      request('/crop-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang }),
      }),
    adminGetDiseases: () => request('/admin/diseases'),
    adminUpdateDisease: (id, data) =>
      request(`/admin/diseases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    adminGetSchemes: () => request('/admin/schemes'),
    adminUpdateScheme: (id, data) =>
      request(`/admin/schemes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  }
}

// Default export for backward compatibility
export const api = createApi('en')
