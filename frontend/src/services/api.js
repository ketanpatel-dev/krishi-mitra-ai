const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  detectDisease: (file) => {
    const form = new FormData()
    form.append('image', file)
    return request('/detect-disease', { method: 'POST', body: form })
  },
  getDiseaseInfo: (diseaseId) => request(`/disease/${diseaseId}`),
  getTreatment: (diseaseId) => request(`/treatment/${diseaseId}`),
  chat: (message, history = []) =>
    request('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    }),
  getWeather: (city = 'Delhi') => request(`/weather?city=${encodeURIComponent(city)}`),
  getMarketPrices: () => request('/market-prices'),
  getSchemes: () => request('/schemes'),
  getInsurance: () => request('/insurance'),
  getEmergency: () => request('/emergency'),
  getEducation: () => request('/education'),
  recommendCrop: (data) =>
    request('/crop-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
