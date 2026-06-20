# Krishi Mitra AI

**Your Smart Farming Companion for Disease Detection, Farmer Support and Sustainable Agriculture**

Empowering Farmers Through Artificial Intelligence.

## Features

- **AI Disease Detection** — Upload crop images for instant diagnosis with treatment recommendations
- **Multilingual UI** — Full Hindi and English support with JSON-based translations
- **Voice Assistant** — Speech-to-text and text-to-speech in Hindi and English (Web Speech API)
- **AI Chatbot** — Gemini-powered farming assistant with smart fallback responses
- **Weather Dashboard** — 7-day forecast, humidity, rain alerts (OpenWeatherMap optional)
- **Market Prices** — Live mandi prices for wheat, rice, tomato, and more
- **Government Schemes** — PM Kisan, PMFBY, KCC, Soil Health Card, eNAM, PMKSY
- **Crop Insurance** — Claim process, FAQs, helpline numbers
- **Emergency Support** — Kisan helplines, KVK contacts, agriculture offices
- **Smart Crop Recommendation** — Location, season, soil, and water-based crop advice
- **Farmer Education Center** — Tutorials, organic farming, modern techniques
- **Admin Panel** — Manage disease database and scheme information
- **Modern UI** — Glassmorphism, dark mode, Framer Motion animations, mobile responsive

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend | Python Flask |
| AI | Gemini API (chatbot), CNN simulation (disease detection) |
| i18n | JSON translation files (en/hi) |
| Deployment | Vercel (frontend) + Render (backend) |

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env       # Add your GEMINI_API_KEY
python app.py
```

Backend runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (proxies `/api` to backend)

## Environment Variables

Create `backend/.env`:

```
GEMINI_API_KEY=your_key_here
OPENWEATHER_API_KEY=your_key_here   # optional
```

## Supported Crops (Disease Detection)

Tomato, Potato, Corn, Wheat, Rice, Cotton, Pepper, Grape, Apple, Mango, Banana

## Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
```

Deploy the `frontend` folder to Vercel. Set `VITE_API_URL` to your Render backend URL.

### Backend (Render)

Deploy `backend/app.py` as a Web Service on Render. Set environment variables in the dashboard.

## Project Structure

```
krishi-mitra-ai/
├── frontend/          # React + Tailwind UI
│   └── src/
│       ├── i18n/      # en.json, hi.json
│       ├── pages/     # All 11 modules
│       └── components/
├── backend/
│   ├── app.py         # Flask API
│   ├── data/          # JSON databases
│   └── services/      # AI, weather, market logic
└── README.md
```

## Hackathon Demo Flow

1. Open home page → toggle Hindi/English
2. Upload a crop photo on Disease Detection → see AI diagnosis + treatment
3. Ask the chatbot a farming question (voice or text)
4. Check weather alerts and market prices
5. Browse government schemes and insurance info
6. Get smart crop recommendation for your region

## License

MIT — Built for hackathon demonstration purposes.
