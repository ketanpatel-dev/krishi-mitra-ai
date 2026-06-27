"""Gemini Vision API client for plant image analysis."""

import base64
import json
import os
import re
import traceback as _tb


def _encode_image(image_bytes):
    """Convert image bytes to base64 string and detect mime type."""
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    if image_bytes[:3] == b"\xff\xd8\xff":
        mime = "image/jpeg"
    elif image_bytes[:4] == b"\x89PNG":
        mime = "image/png"
    elif image_bytes[:4] == b"RIFF":
        mime = "image/webp"
    else:
        mime = "image/jpeg"
    return b64, mime


ENGLISH_PROMPT = """Analyze this plant image carefully. Return ONLY valid JSON — no markdown, no code fences, no extra text.

{
  "plant_name": "Common name of the plant in English (e.g. Banana, Tomato, Mango, Rice, Wheat, Jasmine, Rose, Corn, Potato)",
  "scientific_name": "Scientific name if recognizable",
  "is_plant": true or false,
  "health_status": "Healthy" or "Diseased" or "Unclear",
  "disease_name": null or "Full disease name (e.g. Early Blight, Powdery Mildew, Rust, Leaf Spot, Mosaic Virus, Anthracnose)",
  "confidence": 0-100,
  "description": "Brief description of what you observe (1-2 sentences)",
  "symptoms": ["symptom1 visible in image", "symptom2 visible in image"],
  "causes": ["likely cause1", "likely cause2"]
}

RULES:
- is_plant must be false if the image does not contain a plant (leaf, flower with stem, fruit on plant, tree, crop).
- health_status must be "Healthy" if the plant shows no visible spots, discoloration, wilting, or abnormalities.
- health_status must be "Diseased" only if clear disease symptoms are visible (spots, rot, wilting, discoloration, mold, lesions).
- health_status must be "Unclear" if the image quality is poor, too dark, blurry, or the subject is ambiguous.
- confidence must be < 70 if you cannot clearly identify the plant or its condition.
- disease_name must be null if health_status is "Healthy" or "Unclear".
- disease_name should use the standard name from Indian agriculture (e.g. Early Blight, Late Blight, Rice Blast, Wheat Rust, Powdery Mildew, Anthracnose, Mosaic Virus, Bacterial Leaf Blight, Leaf Curl Virus).
- symptoms should only list what is VISIBLE in the image.
- Keep the JSON compact — no trailing commas.
- Do NOT return anything except the raw JSON object."""


HINDI_PROMPT = """इस पौधे की तस्वीर का ध्यानपूर्वक विश्लेषण करें। केवल वैध JSON लौटाएं — कोई मार्कडाउन, कोड फेंस या अतिरिक्त टेक्स्ट नहीं।

{
  "plant_name": "पौधे का हिंदी नाम ONLY — कभी भी अंग्रेजी में न लिखें (जैसे केला, टमाटर, आम, धान, गेहूं, चावल, जैस्मीन, गुलाब, मक्का, आलू)",
  "scientific_name": "लैटिन/वैज्ञानिक नाम यदि पहचाना जाए",
  "is_plant": true या false,
  "health_status": "Healthy" या "Diseased" या "Unclear",
  "disease_name": null या "रोग का पूरा हिंदी नाम ONLY — कभी भी अंग्रेजी में न लिखें (जैसे अर्ली ब्लाइट, पाउडरी मिल्ड्यू, रस्ट, लीफ स्पॉट, मोज़ेक वायरस, एंथ्रैकनोज़)",
  "confidence": 0-100,
  "description": "आप जो देख रहे हैं उसका संक्षिप्त विवरण (1-2 वाक्य) हिंदी में",
  "symptoms": ["तस्वीर में दिख रहा लक्षण1", "तस्वीर में दिख रहा लक्षण2"],
  "causes": ["संभावित कारण1", "संभावित कारण2"]
}

मजबूत नियम:
- plant_name को कभी भी अंग्रेजी में न लिखें। हिंदी में ही लिखें। उदाहरण: टमाटर, केला, आम, धान, गेहूं, चावल, जैस्मीन, गुलाब, मक्का, आलू, सरसों, मिर्च।
- disease_name को कभी भी अंग्रेजी में न लिखें। हिंदी में ही लिखें। उदाहरण: अर्ली ब्लाइट, पाउडरी मिल्ड्यू, रस्ट, लीफ स्पॉट, मोज़ेक वायरस, बैक्टेरियल लीफ ब्लाइट।
- description, symptoms, और causes हिंदी में ही दें।
- is_plant false तभी करें जब तस्वीर में पौधा न हो।
- health_status "Healthy" तभी करें जब पौधे पर कोई धब्बे, मलिनकिरण, मुरझान या असामान्यता न दिखे।
- health_status "Diseased" तभी करें जब स्पष्ट रोग लक्षण दिखें।
- health_status "Unclear" करें यदि तस्वीर धुंधली या अस्पष्ट हो।
- confidence < 70 करें यदि पौधे या उसकी स्थिति स्पष्ट न हो।
- disease_name null करें यदि health_status "Healthy" या "Unclear" हो।
- केवल JSON ऑब्जेक्ट लौटाएं — कोई अतिरिक्त टेक्स्ट नहीं।"""


MODEL_NAME = "gemini-2.5-flash"

LOG_HEADER = "[GEMINI_VISION]"


def _get_prompt(lang="en"):
    """Return the appropriate prompt based on language."""
    if lang == "hi":
        return HINDI_PROMPT
    return ENGLISH_PROMPT


def _log_startup():
    """Log startup diagnostics so we can see config at server boot."""
    try:
        import google.generativeai as _genai_mod
        pkg_version = getattr(_genai_mod, "__version__", "unknown")
    except ImportError:
        pkg_version = "not_installed"

    api_key = os.getenv("GEMINI_API_KEY")
    print(f"{LOG_HEADER} package_version={pkg_version}")
    print(f"{LOG_HEADER} model={MODEL_NAME}")
    print(f"{LOG_HEADER} dotenv_loaded=Yes (.env via app.py load_dotenv)")
    print(f"{LOG_HEADER} GEMINI_API_KEY_found={'Yes' if api_key else 'No'}")
    if api_key:
        print(f"{LOG_HEADER} GEMINI_API_KEY_prefix={api_key[:8]}... len={len(api_key)}")


def health_check():
    """Return diagnostic dict without calling the API (used by /api/test-gemini)."""
    try:
        import google.generativeai as _genai_mod
        pkg_version = getattr(_genai_mod, "__version__", "unknown")
    except ImportError:
        pkg_version = "not_installed"

    api_key = os.getenv("GEMINI_API_KEY")
    return {
        "package": "google-generativeai",
        "package_version": pkg_version,
        "model": MODEL_NAME,
        "api_key_loaded": bool(api_key),
        "api_key_prefix": api_key[:8] + "..." if api_key and len(api_key) > 8 else None,
    }


def ping_gemini():
    """Send a minimal request to verify the API key and connectivity.

    Returns dict: {ok: bool, reply: str, error_type: str, message: str, trace: str}
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "ok": False,
            "error_type": "MISSING_API_KEY",
            "message": "GEMINI_API_KEY is not set in .env",
            "trace": "",
        }

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(MODEL_NAME)

        response = model.generate_content("Reply only the word OK. Nothing else.")
        text = (response.text or "").strip()

        return {
            "ok": True,
            "reply": text[:200],
            "error_type": None,
            "message": None,
            "trace": None,
        }

    except Exception as e:
        tb = _tb.format_exc()
        print(f"{LOG_HEADER} PING ERROR: {type(e).__name__}: {e}")
        print(tb)
        return {
            "ok": False,
            "error_type": type(e).__name__,
            "message": str(e),
            "trace": tb,
        }


def analyze_image(image_bytes, lang="en"):
    """Send image to Gemini Vision API and return parsed analysis.

    Args:
        image_bytes: Raw image bytes.
        lang: Language code ("en" or "hi"). When "hi", Gemini is prompted
              to return plant_name, description, symptoms, causes in Hindi.

    Returns:
        dict with keys: plant_name, is_plant, health_status, disease_name,
                        confidence, description, symptoms, causes, scientific_name
        or dict with error key on failure.
    """
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return {
            "error": "AI vision service is not configured. Please set GEMINI_API_KEY."
        }

    try:
        import google.generativeai as genai

        prompt = _get_prompt(lang)
        image_bytes_len = len(image_bytes)
        image_preview = image_bytes[:8].hex()
        print(f"{LOG_HEADER} analyze_image: bytes_len={image_bytes_len} preview_hex={image_preview} lang={lang}")
        print(f"{LOG_HEADER} input_type={type(image_bytes).__name__}")

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(MODEL_NAME)

        image_b64, mime_type = _encode_image(image_bytes)
        print(f"{LOG_HEADER} model={MODEL_NAME} mime_type={mime_type} b64_len={len(image_b64)}")
        print(f"{LOG_HEADER} b64_sample={image_b64[:40]}")

        image_part = {"mime_type": mime_type, "data": image_b64}
        print(f"{LOG_HEADER} sending to gemini: prompt_len={len(prompt)}, image_keys={list(image_part.keys())}")

        response = model.generate_content(
            [prompt, image_part]
        )

        raw = response.text.strip()
        print(f"{LOG_HEADER} raw_response_len={len(raw)} preview={raw[:120]}")

        # Strip markdown code fences if present
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        raw = raw.strip()

        parsed = json.loads(raw)

        # Validate required fields
        required = ["plant_name", "is_plant", "health_status", "confidence"]
        for field in required:
            if field not in parsed:
                return {"error": f"AI response missing field: {field}"}

        return parsed

    except json.JSONDecodeError as e:
        print(f"{LOG_HEADER} JSONDecodeError: {e}")
        if 'raw' in dir():
            print(f"{LOG_HEADER} raw={raw}")
        return {"error": "AI returned invalid JSON. Please try again with a clearer image.", "error_type": "JSONDecodeError"}
    except ImportError:
        return {"error": "google-generativeai package not installed. Run: pip install google-generativeai"}
    except Exception as e:
        error_msg = str(e)
        error_type = type(e).__name__
        print(f"{LOG_HEADER} EXCEPTION: {error_type}: {error_msg}")
        _tb.print_exc()
        return {
            "error": f"AI analysis service temporarily unavailable. Please try again later.",
            "error_type": error_type,
            "message": error_msg,
            "trace": _tb.format_exc(),
        }