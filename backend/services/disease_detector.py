import hashlib
import random
from services.data_store import load_json


DISEASES = load_json("diseases.json")
TREATMENTS = load_json("treatments.json")


def _seed_from_image(image_bytes):
    return int(hashlib.md5(image_bytes).hexdigest(), 16)


def detect_disease(image_bytes):
    """Simulate CNN-based disease detection using image hash for consistent demo results."""
    seed = _seed_from_image(image_bytes)
    rng = random.Random(seed)
    disease = rng.choice(DISEASES)
    confidence = rng.randint(85, 99)
    severity = rng.choice(["low", "medium", "high"])

    treatment = TREATMENTS.get(disease["id"], {})

    return {
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
