import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import DiseaseDetection from './pages/DiseaseDetection'
import Chatbot from './pages/Chatbot'
import Weather from './pages/Weather'
import MarketPrices from './pages/MarketPrices'
import Schemes from './pages/Schemes'
import Insurance from './pages/Insurance'
import Emergency from './pages/Emergency'
import CropRecommendation from './pages/CropRecommendation'
import Education from './pages/Education'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detect" element={<DiseaseDetection />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/market" element={<MarketPrices />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/recommend" element={<CropRecommendation />} />
        <Route path="/education" element={<Education />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  )
}
