CROP_RULES = {
    "Kharif": {
        "Alluvial": {"High": ("Rice", "high"), "Medium": ("Cotton", "medium"), "Low": ("Maize", "medium")},
        "Black": {"High": ("Cotton", "medium"), "Medium": ("Soybean", "low"), "Low": ("Maize", "medium")},
        "Red": {"High": ("Rice", "medium"), "Medium": ("Groundnut", "low"), "Low": ("Millet", "low")},
        "Laterite": {"High": ("Rice", "medium"), "Medium": ("Maize", "low"), "Low": ("Pulses", "low")},
        "Sandy": {"High": ("Rice", "high"), "Medium": ("Maize", "medium"), "Low": ("Bajra", "low")},
    },
    "Rabi": {
        "Alluvial": {"High": ("Wheat", "low"), "Medium": ("Mustard", "low"), "Low": ("Barley", "low")},
        "Black": {"High": ("Wheat", "low"), "Medium": ("Chickpea", "low"), "Low": ("Mustard", "medium")},
        "Red": {"High": ("Wheat", "medium"), "Medium": ("Mustard", "low"), "Low": ("Chickpea", "medium")},
        "Laterite": {"High": ("Wheat", "medium"), "Medium": ("Mustard", "medium"), "Low": ("Lentil", "low")},
        "Sandy": {"High": ("Wheat", "medium"), "Medium": ("Mustard", "medium"), "Low": ("Barley", "low")},
    },
    "Zaid": {
        "Alluvial": {"High": ("Watermelon", "low"), "Medium": ("Cucumber", "low"), "Low": ("Fodder", "low")},
        "Black": {"High": ("Muskmelon", "low"), "Medium": ("Vegetables", "low"), "Low": ("Fodder", "low")},
        "Red": {"High": ("Vegetables", "low"), "Medium": ("Moong", "low"), "Low": ("Fodder", "low")},
        "Laterite": {"High": ("Vegetables", "medium"), "Medium": ("Moong", "low"), "Low": ("Fodder", "low")},
        "Sandy": {"High": ("Vegetables", "medium"), "Medium": ("Moong", "medium"), "Low": ("Fodder", "low")},
    },
}

YIELD_MAP = {
    "Rice": "25-30 quintals/hectare",
    "Wheat": "40-45 quintals/hectare",
    "Cotton": "15-20 quintals/hectare",
    "Maize": "35-40 quintals/hectare",
    "Mustard": "12-15 quintals/hectare",
    "Tomato": "300-400 quintals/hectare",
    "Soybean": "15-18 quintals/hectare",
    "Groundnut": "20-25 quintals/hectare",
    "Millet": "10-12 quintals/hectare",
    "Pulses": "8-12 quintals/hectare",
    "Bajra": "12-15 quintals/hectare",
    "Barley": "30-35 quintals/hectare",
    "Chickpea": "15-18 quintals/hectare",
    "Lentil": "8-10 quintals/hectare",
    "Watermelon": "200-250 quintals/hectare",
    "Muskmelon": "150-200 quintals/hectare",
    "Cucumber": "100-120 quintals/hectare",
    "Vegetables": "150-200 quintals/hectare",
    "Moong": "8-10 quintals/hectare",
    "Fodder": "400-500 quintals/hectare",
}

PROFIT_MAP = {
    "low": "₹40,000 - ₹60,000 per hectare",
    "medium": "₹60,000 - ₹90,000 per hectare",
    "high": "₹90,000 - ₹1,20,000 per hectare",
}


def recommend_crop(location, season, soil_type, water_availability):
    season_rules = CROP_RULES.get(season, CROP_RULES["Kharif"])
    soil_rules = season_rules.get(soil_type, season_rules["Alluvial"])
    crop, risk = soil_rules.get(water_availability, ("Maize", "medium"))

    return {
        "best_crop": crop,
        "expected_yield": YIELD_MAP.get(crop, "15-20 quintals/hectare"),
        "expected_profitability": PROFIT_MAP.get(risk, PROFIT_MAP["medium"]),
        "risk_level": risk,
        "reasoning": (
            f"Based on {location}, {season} season, {soil_type} soil, and {water_availability} water availability, "
            f"{crop} is well-suited for your conditions. Ensure proper seed selection and follow regional "
            f"agricultural department guidelines for best results."
        ),
    }
