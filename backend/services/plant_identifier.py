"""Orchestrator for plant identification and disease detection using Gemini Vision."""

from services.data_store import load_json
from services.gemini_vision import analyze_image


TREATMENTS = load_json("treatments.json")
DISEASES = load_json("diseases.json")


def _normalize_disease_name(name):
    """Normalize disease name for treatment lookup."""
    if not name:
        return None
    n = name.lower().strip()
    
    # Map common disease names to treatment keys
    mapping = {
        "early blight": "tomato_early_blight",
        "late blight": "tomato_late_blight",
        "wheat rust": "wheat_rust",
        "rust": "wheat_rust",
        "rice blast": "rice_blast",
        "blast": "rice_blast",
        "gray leaf spot": "corn_gray_leaf_spot",
        "grey leaf spot": "corn_gray_leaf_spot",
        "bollworm": "cotton_bollworm",
        "bacterial spot": "pepper_bacterial_spot",
        "powdery mildew": "grape_powdery_mildew",
        "apple scab": "apple_scab",
        "anthracnose": "mango_anthracnose",
        "sigatoka": "banana_sigatoka",
        "sigatoka leaf spot": "banana_sigatoka",
        "black sigatoka": "banana_sigatoka",
        "mosaic virus": "tomato_early_blight",
        "leaf curl": "tomato_early_blight",
        "leaf spot": "tomato_early_blight",
        "wilt": "potato_early_blight",
        "bacterial leaf blight": "rice_blast",
        "sheath blight": "rice_blast",
    }
    
    # Check exact mapping
    for key_pattern, treatment_id in mapping.items():
        if key_pattern in n:
            return treatment_id
    
    # Fallback: search through diseases.json for matching disease name
    for disease in DISEASES:
        if disease["name"].lower() in n or n in disease["name"].lower():
            return disease["id"]
    
    return None


def _lookup_treatment(disease_name):
    """Look up treatment data for a given disease name."""
    treatment_id = _normalize_disease_name(disease_name)
    if treatment_id and treatment_id in TREATMENTS:
        return TREATMENTS[treatment_id]
    return {}


def _lookup_disease_info(disease_name):
    """Look up disease info from diseases.json for a given disease name."""
    treatment_id = _normalize_disease_name(disease_name)
    if treatment_id:
        for disease in DISEASES:
            if disease["id"] == treatment_id:
                return disease
    return None


def identify_plant(image_bytes):
    """Identify plant and detect disease from image bytes.
    
    Args:
        image_bytes: Raw image file bytes.
    
    Returns:
        dict matching the frontend API contract:
        {
            "plant_name": str,
            "health_status": str ("Healthy", "Diseased", or "Unclear"),
            "disease_name": str or None,
            "confidence": int,
            "description": str,
            "symptoms": list,
            "causes": list,
            "treatment": dict (from treatments.json)
        }
        or dict with "error" key.
    """
    # Step 1: Call Gemini Vision for analysis
    analysis = analyze_image(image_bytes)
    
    # Step 2: Handle errors from Gemini
    if "error" in analysis:
        return analysis
    
    # Step 3: Extract fields
    plant_name = analysis.get("plant_name", "").strip()
    is_plant = analysis.get("is_plant", False)
    health_status = analysis.get("health_status", "Unclear")
    disease_name = analysis.get("disease_name")
    confidence = analysis.get("confidence", 0)
    description = analysis.get("description", "")
    symptoms = analysis.get("symptoms", [])
    causes = analysis.get("causes", [])
    
    # Step 4: If confidence < 70 or not a plant, return unclear error
    if not is_plant or confidence < 70:
        return {
            "error": "Unable to identify plant clearly. Please upload a clearer image."
        }
    
    # Step 5: If healthy
    if health_status == "Healthy":
        return {
            "plant_name": plant_name,
            "health_status": "Healthy",
            "disease_name": None,
            "confidence": confidence,
            "description": description,
            "symptoms": [],
            "causes": [],
            "treatment": {}
        }
    
    # Step 6: If diseased — look up treatment
    if health_status == "Diseased" and disease_name:
        treatment = _lookup_treatment(disease_name)
        disease_info = _lookup_disease_info(disease_name)
        
        # Merge gemini symptoms with disease data for fuller info
        info_symptoms = symptoms
        info_causes = causes
        
        if disease_info:
            if not info_symptoms and disease_info.get("symptoms"):
                info_symptoms = disease_info["symptoms"]
            if not info_causes and disease_info.get("causes"):
                info_causes = disease_info["causes"]
            if not description:
                description = disease_info.get("description", "")
        
        return {
            "plant_name": plant_name,
            "health_status": "Diseased",
            "disease_name": disease_name,
            "confidence": confidence,
            "description": description,
            "symptoms": info_symptoms,
            "causes": info_causes,
            "treatment": treatment
        }
    
    # Step 7: Unclear case
    return {
        "error": "Unable to identify plant clearly. Please upload a clearer image."
    }