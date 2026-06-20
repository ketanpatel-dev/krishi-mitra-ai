import os
from services.data_store import load_json

FARMING_KNOWLEDGE = """
You are Krishi Mitra AI, a helpful multilingual farming assistant for Indian farmers.
Provide practical advice on crops, diseases, fertilizers, irrigation, seasons, pesticides, and government schemes.
Keep answers concise, farmer-friendly, and actionable. Support both Hindi and English based on the user's language.
If asked about crop diseases, suggest uploading a photo for AI detection.
"""


def _fallback_reply(message):
    msg = message.lower()
    if any(w in msg for w in ["tomato", "टमाटर", "yellow", "पीले"]):
        return (
            "Yellow spots on tomato leaves may indicate Early Blight or Septoria Leaf Spot. "
            "Remove affected leaves, avoid overhead watering, and apply copper-based fungicide. "
            "Upload a photo on the Disease Detection page for accurate AI diagnosis."
        )
    if any(w in msg for w in ["wheat", "गेहूं", "fertilizer", "उर्वरक"]):
        return (
            "For wheat, apply NPK 120:60:40 kg/hectare in split doses. "
            "First dose at sowing, second at crown root initiation, third at flowering. "
            "Add zinc sulphate if leaves show yellowing."
        )
    if any(w in msg for w in ["water", "पानी", "rice", "चावल"]):
        return (
            "Rice requires 1200-1500 mm water during the crop cycle. "
            "Maintain 5 cm standing water during tillering and flowering. "
            "Reduce water 2 weeks before harvest."
        )
    if any(w in msg for w in ["rice", "season", "मौसम", "grow"]):
        return (
            "Rice is best grown in Kharif season (June-October) in most parts of India. "
            "Ensure adequate water and use certified seeds for better yield."
        )
    return (
        "I'm Krishi Mitra AI, your farming assistant! I can help with crop diseases, fertilizers, "
        "irrigation, seasonal planning, and government schemes. Please ask a specific farming question, "
        "or upload a crop photo for disease detection."
    )


def chat(message, history=None):
    history = history or []
    api_key = os.getenv("GEMINI_API_KEY")

    if api_key and api_key != "your_gemini_api_key_here":
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")

            context = FARMING_KNOWLEDGE + "\n\nConversation:\n"
            for msg in history[-6:]:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                context += f"{role}: {content}\n"
            context += f"user: {message}\nassistant:"

            response = model.generate_content(context)
            return {"reply": response.text.strip()}
        except Exception:
            pass

    return {"reply": _fallback_reply(message)}
