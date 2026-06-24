"""Localization helpers for bilingual API responses."""

from services.data_store import load_json

_hi_diseases = None
_hi_treatments = None
_hi_schemes = None
_hi_crops = None
_hi_weather = None


def _load_hi(name, cache_attr):
    global _hi_diseases, _hi_treatments, _hi_schemes, _hi_crops, _hi_weather
    caches = {
        "diseases": "_hi_diseases",
        "treatments": "_hi_treatments",
        "schemes": "_hi_schemes",
        "crops": "_hi_crops",
        "weather": "_hi_weather",
    }
    current = globals().get(cache_attr)
    if current is None:
        current = load_json(f"hi/{name}.json")
        globals()[cache_attr] = current
    return current


def pick(obj, field, lang):
    if lang == "hi":
        return obj.get(f"{field}_hi") or obj.get(field, "")
    return obj.get(field, "")


def pick_list(obj, field, lang):
    if lang == "hi":
        return obj.get(f"{field}_hi") or obj.get(field, [])
    return obj.get(field, [])


def localize_disease(disease, lang):
    if lang != "hi":
        return disease
    hi = _load_hi("diseases", "_hi_diseases").get(disease["id"], {})
    return {
        **disease,
        "name": hi.get("name", disease["name"]),
        "crop": hi.get("crop", disease["crop"]),
        "description": hi.get("description", disease.get("description", "")),
        "symptoms": hi.get("symptoms", disease.get("symptoms", [])),
        "causes": hi.get("causes", disease.get("causes", [])),
        "spread": hi.get("spread", disease.get("spread", "")),
        "affected_crops": hi.get("affected_crops", disease.get("affected_crops", [])),
    }


def localize_treatment(treatment, disease_id, lang):
    if lang != "hi":
        return treatment
    hi = _load_hi("treatments", "_hi_treatments").get(disease_id, {})
    if not hi:
        return treatment
    return {
        "pesticides": hi.get("pesticides", treatment.get("pesticides", [])),
        "organic": hi.get("organic", treatment.get("organic", [])),
        "preventive": hi.get("preventive", treatment.get("preventive", [])),
        "fertilizer": hi.get("fertilizer", treatment.get("fertilizer", [])),
        "water": hi.get("water", treatment.get("water", "")),
        "recovery_time": hi.get("recovery_time", treatment.get("recovery_time", "")),
    }


def localize_crop_name(crop, lang):
    if lang != "hi":
        return crop
    return _load_hi("crops", "_hi_crops").get(crop, crop)


def localize_detection_result(result, lang):
    """Localize the full detection result including crop name, disease info, and treatment.
    
    This handles both cases:
    1. Known disease (disease_id matches our database)
    2. Unknown/healthy plant (just localize crop name and description if available)
    """
    if lang != "hi":
        return result
    
    result = dict(result)  # Make mutable copy
    
    # Always localize crop name
    crop = result.get("crop", "")
    result["crop"] = localize_crop_name(crop, lang)
    
    disease_id = result.get("disease_id")
    
    # Localize disease info if we have a matching disease_id
    if disease_id:
        hi_d = _load_hi("diseases", "_hi_diseases").get(disease_id, {})
        hi_t = _load_hi("treatments", "_hi_treatments").get(disease_id, {})
        info = result.get("info", {})
        treatment = result.get("treatment", {})
        
        # Localize disease name
        if "disease" in result and disease_id in _load_hi("diseases", "_hi_diseases"):
            hi_disease = _load_hi("diseases", "_hi_diseases")[disease_id]
            result["disease"] = hi_disease.get("name", result["disease"])
        
        # Localize info block
        result["info"] = {
            "description": hi_d.get("description", info.get("description", "")),
            "symptoms": hi_d.get("symptoms", info.get("symptoms", [])),
            "causes": hi_d.get("causes", info.get("causes", [])),
            "spread": hi_d.get("spread", info.get("spread", "")),
            "affected_crops": hi_d.get("affected_crops", info.get("affected_crops", [])),
        }
        
        # Localize treatment
        result["treatment"] = {
            "pesticides": hi_t.get("pesticides", treatment.get("pesticides", [])),
            "organic": hi_t.get("organic", treatment.get("organic", [])),
            "preventive": hi_t.get("preventive", treatment.get("preventive", [])),
            "fertilizer": hi_t.get("fertilizer", treatment.get("fertilizer", [])),
            "water": hi_t.get("water", treatment.get("water", "")),
            "recovery_time": hi_t.get("recovery_time", treatment.get("recovery_time", "")),
        }
    
    # Also localize affected_crops in info if present (even without disease_id)
    info = result.get("info", {})
    if info and info.get("affected_crops"):
        info["affected_crops"] = [localize_crop_name(c, lang) for c in info["affected_crops"]]
    
    # Localize disease name if it's "No disease detected" or similar
    if result.get("disease") == "No disease detected":
        result["disease"] = "कोई रोग नहीं पाया गया"
    elif result.get("disease") == "Unable to identify plant clearly":
        result["disease"] = "पौधे की स्पष्ट पहचान नहीं हो सकी"
    
    return result


def localize_scheme(scheme, lang):
    if lang != "hi":
        return scheme
    hi = _load_hi("schemes", "_hi_schemes").get(scheme["id"], {})
    if not hi:
        return scheme
    return {
        **scheme,
        "name": hi.get("name", scheme.get("name_hi", scheme["name"])),
        "short_description": hi.get("short_description", scheme.get("short_description", "")),
        "benefits": hi.get("benefits", scheme.get("benefits", [])),
        "eligibility": hi.get("eligibility", scheme.get("eligibility", [])),
        "documents": hi.get("documents", scheme.get("documents", [])),
        "application_process": hi.get("application_process", scheme.get("application_process", "")),
    }


def localize_weather(data, lang):
    if lang != "hi":
        return data
    conditions = _load_hi("weather", "_hi_weather")
    current = data.get("current", {})
    if current.get("condition") in conditions:
        current = {**current, "condition": conditions[current["condition"]]}
    forecast = []
    for day in data.get("forecast", []):
        cond = day.get("condition", "")
        forecast.append({**day, "condition": conditions.get(cond, cond)})
    alerts = []
    for alert in data.get("alerts", []):
        title = alert.get("title", "")
        message = alert.get("message", "")
        alerts.append({
            "title": conditions.get(title, title),
            "message": conditions.get(message, message),
        })
    return {**data, "current": current, "forecast": forecast, "alerts": alerts}


def localize_disaster(data, lang):
    if lang != "hi":
        return data
    from services.data_store import load_json
    hi = load_json("hi/disasters.json")
    types = []
    for item in data.get("types", []):
        overlay = hi.get(item["id"], {})
        types.append({**item, **overlay})
    return {**data, "types": types}