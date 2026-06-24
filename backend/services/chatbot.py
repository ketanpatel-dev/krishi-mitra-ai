import os
import re

FARMING_KNOWLEDGE = """
You are Krishi Mitra AI, India's trusted multilingual farming assistant for rural farmers.
Always respond in the SAME language the farmer uses (Hindi or English).
Provide practical, actionable advice on: crop diseases, fertilizers, irrigation, seasons,
pesticides, government schemes (PM Kisan, PMFBY, KCC, Soil Health Card, eNAM, PMKSY),
crop insurance claims, disaster compensation (flood, drought, cyclone, hailstorm, pest),
and market/weather guidance.
Never say "I don't know." Always give helpful guidance even if approximate.
Keep answers concise (3-5 sentences), farmer-friendly, and specific to Indian agriculture.
If asked about diseases, suggest uploading a photo on the Disease Detection page.
For disasters, mention 72-hour reporting rule and helpline 1800-180-1551.
"""

KNOWLEDGE_BASE = [
    {
        "keywords_en": ["tomato", "yellow spot", "blight", "leaf spot"],
        "keywords_hi": ["टमाटर", "पीले", "धब्बे", "झुलसा", "पत्त"],
        "reply_en": "Yellow spots on tomato leaves often indicate Early Blight or Septoria Leaf Spot. Remove affected leaves, avoid overhead watering, and spray Mancozeb 2.5g/L or copper fungicide. Upload a photo on Disease Detection for AI diagnosis. Apply balanced NPK with extra potassium for recovery.",
        "reply_hi": "टमाटर की पत्तियों पर पीले धब्बे अक्सर Early Blight या Septoria Leaf Spot के संकेत हैं। प्रभावित पत्तियाँ हटाएं, overhead सिंचाई बंद करें, Mancozeb 2.5g/L या copper fungicide छिड़कें। AI निदान के लिए Disease Detection पर फोटो अपलोड करें। Recovery के लिए potassium युक्त NPK दें।",
    },
    {
        "keywords_en": ["wheat", "fertilizer", "npk", "urea"],
        "keywords_hi": ["गेहूं", "गेहूँ", "उर्वरक", "यूरिया", "npk"],
        "reply_en": "For wheat, apply NPK 120:60:40 kg/hectare in split doses: half at sowing, 1/4 at crown root initiation, 1/4 at flowering. Add 25 kg zinc sulphate if leaves yellow. Avoid excess nitrogen — it causes lodging. Use Soil Health Card recommendations for your field.",
        "reply_hi": "गेहूं के लिए NPK 120:60:40 kg/hectare split doses में दें: आधा बुवाई पर, 1/4 crown root initiation पर, 1/4 flowering पर। पत्तियाँ पीली हों तो 25 kg zinc sulphate। अधिक nitrogen से lodging होता है। Soil Health Card की सिफारिशें follow करें।",
    },
    {
        "keywords_en": ["rice", "water", "irrigation", "paddy"],
        "keywords_hi": ["चावल", "धान", "पानी", "सिंचाई"],
        "reply_en": "Rice needs 1200-1500 mm water per crop cycle. Maintain 5 cm standing water during tillering and flowering. Reduce water 2 weeks before harvest. For water-saving, try SRI method with intermittent irrigation. Kharif season (June-Oct) is ideal in most of India.",
        "reply_hi": "धान को पूरे crop cycle में 1200-1500 mm पानी चाहिए। Tillering और flowering में 5 cm खड़ा पानी रखें। कटाई से 2 सप्ताह पहले पानी कम करें। पानी बचाने के लिए SRI method अपनाएं। अधिकांश भारत में Kharif (जून-अक्टूबर) ideal है।",
    },
    {
        "keywords_en": ["pm kisan", "6000", "scheme", "government"],
        "keywords_hi": ["pm kisan", "पीएम किसान", "योजना", "6000", "सरकार"],
        "reply_en": "PM Kisan Samman Nidhi gives ₹6,000/year to all landholding farmer families in 3 installments of ₹2,000. Register at pmkisan.gov.in with Aadhaar and land records. Amount is directly transferred to your bank account every 4 months.",
        "reply_hi": "PM Kisan Samman Nidhi सभी भूमिधारक किसान परिवारों को वर्ष में ₹6,000 (₹2,000 की 3 किस्तों में) देती है। pmkisan.gov.in पर आधार और जमीन records से register करें। राशि हर 4 महीने bank account में direct transfer होती है।",
    },
    {
        "keywords_en": ["insurance", "pmfby", "claim", "crop damage", "compensation"],
        "keywords_hi": ["बीमा", "pmfby", "दावा", "claim", "मुआवजा", "क्षति"],
        "reply_en": "Under PMFBY, report crop damage within 72 hours to your insurance company or call 1800-180-1551. Keep geo-tagged photos, land records, and sowing certificate ready. Surveyor assesses loss; compensation is credited within 15-30 days. Premium: 2% Kharif, 1.5% Rabi crops.",
        "reply_hi": "PMFBY में crop damage की सूचना 72 घंटे के भीतर insurance company या 1800-180-1551 पर दें। Geo-tagged photos, land records, sowing certificate तैयार रखें। Surveyor loss assess करता है; 15-30 दिन में compensation मिलता है। Premium: Kharif 2%, Rabi 1.5%.",
    },
    {
        "keywords_en": ["flood", "waterlogged", "submerged", "heavy rain"],
        "keywords_hi": ["बाढ़", "डूब", "पानी भर", "भारी बारिश"],
        "reply_en": "After flood: drain water with pumps, do NOT enter field until safe, take geo-tagged photos immediately, report to agriculture officer within 72 hours for PMFBY claim. Apply lime after water recedes. Visit Crop Damage page for full flood recovery guide.",
        "reply_hi": "बाढ़ के बाद: pump से पानी निकालें, safe होने तक खेत में न जाएं, तुरंत geo-tagged photos लें, PMFBY claim के लिए 72 घंटे में कृषि अधिकारी को report करें। पानी उतरने पर चूना डालें। पूरी guide के लिए Crop Damage page देखें।",
    },
    {
        "keywords_en": ["drought", "dry", "no rain", "water scarcity"],
        "keywords_hi": ["सूखा", "सूख", "बारिश नही", "पानी की कमी"],
        "reply_en": "During drought: apply mulch to conserve moisture, reduce fertilizer dose, prioritize irrigation at critical stages (flowering/grain filling), use drought-tolerant varieties. Check if your block is declared drought-affected for state relief. PMFBY covers yield loss if enrolled.",
        "reply_hi": "सूखे में: mulch से moisture बचाएं, fertilizer dose कम करें, critical stages (flowering/grain filling) पर irrigation priority दें, drought-tolerant varieties use करें। State relief के लिए block drought-affected है check करें। PMFBY enrolled होने पर yield loss cover।",
    },
    {
        "keywords_en": ["mustard", "season", "rabi", "kharif", "when to sow"],
        "keywords_hi": ["सरसों", "मौसम", "रबी", "खरीफ", "बुवाई", "कब"],
        "reply_en": "Mustard is a Rabi crop — sow between October-November, harvest in March-April. Needs 300-400 mm water. Apply NPK 60:40:20 kg/ha. Rice is Kharif (June-July sowing). Cotton is Kharif. Wheat is Rabi (November sowing).",
        "reply_hi": "सरसों Rabi फसल है — अक्टूबर-नवंबर में बुवाई, मार्च-अप्रैल में कटाई। 300-400 mm पानी। NPK 60:40:20 kg/ha। धान Kharif (जून-जुलाई)। कपास Kharif। गेहूं Rabi (नवंबर बुवाई)।",
    },
    {
        "keywords_en": ["pesticide", "spray", "insect", "pest", "locust"],
        "keywords_hi": ["कीटनाशक", "spray", "कीट", "कीड़ा", "टिड्डी"],
        "reply_en": "Always identify pest before spraying. Spray in evening to protect bees. Use recommended dose only. For bollworm: Emamectin benzoate 0.4g/L. For locust: Malathion or Chlorpyrifos as per agriculture department advisory. Install pheromone traps for monitoring.",
        "reply_hi": "Spray से पहले कीट identify करें। मधुमक्खियों की safety के लिए शाम को spray। Recommended dose ही use करें। Bollworm: Emamectin benzoate 0.4g/L। टिड्डी: Malathion/Chlorpyrifos agriculture department advisory अनुसार। Monitoring के लिए pheromone traps।",
    },
    {
        "keywords_en": ["kcc", "credit card", "loan", "bank"],
        "keywords_hi": ["kcc", "क्रेडिट कार्ड", "loan", "ऋण", "bank"],
        "reply_en": "Kisan Credit Card provides timely credit at subsidized rates. Apply at nearest bank with Aadhaar, land records (7/12), and photos. Get 2% interest subvention on prompt repayment plus 3% extra for timely payment. Covers crop production and allied activities.",
        "reply_hi": "Kisan Credit Card subsidized rate पर समय पर credit देता है। नजदीकी bank में आधार, land records (7/12), photos के साथ apply करें। Prompt repayment पर 2% interest subvention + timely payment पर 3% extra। Crop production और allied activities cover।",
    },
    {
        "keywords_en": ["organic", "vermicompost", "natural farming"],
        "keywords_hi": ["जैविक", "organic", "vermicompost", "प्राकृतिक खेती"],
        "reply_en": "For organic farming: make vermicompost from cow dung and earthworms (ready in 45-60 days). Use neem oil 5ml/L for pest control. Apply Jeevamrut or Panchagavya as bio-stimulant. NPOP certification available through APEDA for organic produce marketing.",
        "reply_hi": "जैविक खेती: गोबर और kechua से vermicompost बनाएं (45-60 दिन)। Pest control: neem oil 5ml/L। Jeevamrut/Panchagavya bio-stimulant के रूप में। Organic produce marketing के लिए APEDA से NPOP certification।",
    },
    {
        "keywords_en": ["hailstorm", "hail", "cyclone", "storm damage"],
        "keywords_hi": ["ओla", "ओला", "तूफान", "चक्रवात", "आंधी"],
        "reply_en": "After hailstorm/cyclone: inspect crop within 24 hours, take timestamped photos, do NOT clear field before insurance survey, report within 72 hours. Apply fungicide to prevent secondary infection. Visit Crop Damage page for step-by-step recovery and claim process.",
        "reply_hi": "Olā/चक्रवात के बाद: 24 घंटे में crop inspect करें, timestamped photos लें, insurance survey से पहले field clear न करें, 72 घंटे में report करें। Secondary infection रोकने के लिए fungicide। Recovery और claim process के लिए Crop Damage page देखें।",
    },
]


def _detect_language(text):
    if re.search(r"[\u0900-\u097F]", text):
        return "hi"
    return "en"


def _match_knowledge(message, lang):
    msg = message.lower()
    for entry in KNOWLEDGE_BASE:
        keywords = entry["keywords_hi"] if lang == "hi" else entry["keywords_en"]
        if any(kw.lower() in msg for kw in keywords):
            return entry["reply_hi"] if lang == "hi" else entry["reply_en"]
    return None


def _default_reply(lang):
    if lang == "hi":
        return (
            "मैं कृषि मित्र AI हूँ — आपका smart farming साथी! मैं फसल रोग, उर्वरक, सिंचाई, "
            "सरकारी योजनाएं (PM Kisan, PMFBY), बीमा दावा, और आपदा सहायता में मदद कर सकता हूँ। "
            "कोई specific सवाल पूछें या Disease Detection पर crop photo अपलोड करें।"
        )
    return (
        "I'm Krishi Mitra AI — your smart farming companion! I can help with crop diseases, "
        "fertilizers, irrigation, government schemes (PM Kisan, PMFBY), insurance claims, "
        "and disaster assistance. Ask a specific question or upload a crop photo on Disease Detection."
    )


def chat(message, history=None, lang=None):
    history = history or []
    lang = lang or _detect_language(message)
    api_key = os.getenv("GEMINI_API_KEY")

    if api_key and api_key != "your_gemini_api_key_here":
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")

            lang_instruction = "Respond in Hindi (Devanagari script)." if lang == "hi" else "Respond in English."
            context = FARMING_KNOWLEDGE + f"\n{lang_instruction}\n\nConversation:\n"
            for msg in history[-6:]:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                context += f"{role}: {content}\n"
            context += f"user: {message}\nassistant:"

            response = model.generate_content(context)
            return {"reply": response.text.strip(), "lang": lang}
        except Exception:
            pass

    matched = _match_knowledge(message, lang)
    if matched:
        return {"reply": matched, "lang": lang}

    return {"reply": _default_reply(lang), "lang": lang}
