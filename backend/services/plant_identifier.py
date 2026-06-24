"""Orchestrator for plant identification and disease detection using Gemini Vision.

Returns response in the format expected by the frontend DiseaseDetection page:
{
  "crop": "Tomato",
  "disease": "Early Blight",
  "disease_id": "tomato_early_blight",
  "confidence": 92,
  "severity": "medium",
  "info": {
    "description": "...",
    "symptoms": [...],
    "causes": [...],
    "spread": "...",
    "affected_crops": [...]
  },
  "treatment": {
    "pesticides": [...],
    "organic": [...],
    "preventive": [...],
    "fertilizer": [...],
    "water": "...",
    "recovery_time": "..."
  }
}
"""

import random as _random

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


def _estimate_severity(disease_name, confidence):
    """Estimate severity level based on disease name and confidence."""
    severe_diseases = ["late blight", "wheat rust", "rice blast", "anthracnose", "black sigatoka"]
    if disease_name:
        n = disease_name.lower()
        for sd in severe_diseases:
            if sd in n:
                if confidence >= 90:
                    return "high"
                return "medium"
    # Default heuristic
    if confidence >= 95:
        return "high"
    elif confidence >= 80:
        return "medium"
    return "low"


def identify_plant(image_bytes):
    """Identify plant and detect disease from image bytes using Gemini Vision AI.
    
    Returns a dict matching the frontend API contract (see module docstring),
    or dict with "error" key on failure.
    """
    # Step 1: Call Gemini Vision for analysis
    analysis = analyze_image(image_bytes)
    
    # Step 2: Handle errors from Gemini
    if "error" in analysis:
        return analysis
    
    # Step 3: Extract fields from Gemini response
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
    
    # Step 5: Look up disease info and treatment
    disease_info = _lookup_disease_info(disease_name) if disease_name else None
    treatment = _lookup_treatment(disease_name) if disease_name else {}
    
    # Step 6: Build the complete response matching frontend format
    result = {
        "crop": plant_name,
        "disease": disease_name if health_status == "Diseased" and disease_name else "No disease detected",
        "disease_id": disease_info["id"] if disease_info else None,
        "confidence": confidence,
        "severity": _estimate_severity(disease_name, confidence) if health_status == "Diseased" else "low",
    }
    
    # Build info block with merged data from Gemini + disease database
    info = {}
    
    if disease_info:
        info["description"] = description or disease_info.get("description", "")
        info["symptoms"] = symptoms if symptoms else disease_info.get("symptoms", [])
        info["causes"] = causes if causes else disease_info.get("causes", [])
        info["spread"] = disease_info.get("spread", "")
        info["affected_crops"] = disease_info.get("affected_crops", [])
    else:
        info["description"] = description
        info["symptoms"] = symptoms
        info["causes"] = causes
        info["spread"] = ""
        info["affected_crops"] = []
    
    result["info"] = info
    
    # Treatment block
    if treatment:
        result["treatment"] = treatment
    else:
        result["treatment"] = {
            "pesticides": [],
            "organic": [],
            "preventive": [],
            "fertilizer": [],
            "water": "",
            "recovery_time": ""
        }
    
    return result