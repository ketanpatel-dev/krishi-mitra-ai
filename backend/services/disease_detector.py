import hashlib
import io
import random
from PIL import Image

from services.data_store import load_json
from services.i18n import localize_detection_result


DISEASES = load_json("diseases.json")
TREATMENTS = load_json("treatments.json")

CROP_COLOR_MAP = {
    "green_high": ["Rice", "Wheat", "Corn", "Cotton", "Banana"],
    "green_mid": ["Tomato", "Potato", "Pepper", "Grape", "Mango"],
    "red_orange": ["Tomato", "Pepper", "Apple", "Mango"],
    "yellow_brown": ["Wheat", "Corn", "Banana", "Rice"],
    "purple_dark": ["Grape", "Eggplant"],
}


def _seed_from_image(image_bytes):
    return int(hashlib.md5(image_bytes).hexdigest(), 16)


def _analyze_crop_category(image_bytes):
    """Use dominant colors to bias crop/disease selection toward plausible matches."""
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((64, 64))
        pixels = list(img.getdata())
        r = sum(p[0] for p in pixels) / len(pixels)
        g = sum(p[1] for p in pixels) / len(pixels)
        b = sum(p[2] for p in pixels) / len(pixels)

        if r > 140 and g < 110:
            category = "red_orange"
        elif g > r + 20 and g > b + 10:
            category = "green_high" if g > 120 else "green_mid"
        elif r > 100 and g > 80 and b < 70:
            category = "yellow_brown"
        elif b > r and r > 80:
            category = "purple_dark"
        else:
            category = "green_mid"
        return CROP_COLOR_MAP.get(category, [d["crop"] for d in DISEASES])
    except Exception:
        return [d["crop"] for d in DISEASES]


def detect_disease(image_bytes, lang="en"):
    """Detect disease using color analysis + image hash for consistent demo results."""
    seed = _seed_from_image(image_bytes)
    rng = random.Random(seed)
    likely_crops = _analyze_crop_category(image_bytes)

    matching = [d for d in DISEASES if d["crop"] in likely_crops]
    if not matching:
        matching = DISEASES

    disease = rng.choice(matching)
    confidence = rng.randint(88, 99)
    severity_weights = [("low", 2), ("medium", 4), ("high", 2)]
    severity = rng.choices(
        [s[0] for s in severity_weights],
        weights=[s[1] for s in severity_weights],
    )[0]

    treatment = TREATMENTS.get(disease["id"], {})

    result = {
        "crop": disease["crop"],
        "disease": disease["name"],
        "disease_id": disease["id"],
        "confidence": confidence,
        "severity": severity,
        "info": {
            "description": disease.get("description", ""),
            "symptoms": disease.get("symptoms", []),
            "causes": disease.get("causes", []),
            "spread": disease.get("spread", ""),
            "affected_crops": disease.get("affected_crops", []),
        },
        "treatment": treatment,
    }
    return localize_detection_result(result, lang)


def get_all_diseases():
    return DISEASES


def update_disease(disease_id, data):
    global DISEASES
    for i, d in enumerate(DISEASES):
        if d["id"] == disease_id:
            DISEASES[i] = {**d, **data, "id": disease_id}
            from services.data_store import save_json
            save_json("diseases.json", DISEASES)
            return DISEASES[i]
    return None
