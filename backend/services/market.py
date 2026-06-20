import random
from services.data_store import load_json


def get_market_prices():
    crops = ["Wheat", "Rice", "Tomato", "Potato", "Cotton", "Maize", "Mustard"]
    mandis = ["Azadpur Delhi", "Nashik APMC", "Indore Mandi", "Karnal Mandi", "Ahmedabad APMC"]
    prices = []

    for crop in crops:
        today = random.randint(1800, 4500)
        change = random.randint(-200, 200)
        yesterday = today - change
        if change > 50:
            trend = "up"
        elif change < -50:
            trend = "down"
        else:
            trend = "stable"
        prices.append({
            "crop": crop,
            "today": today,
            "yesterday": yesterday,
            "trend": trend,
            "mandi": random.choice(mandis),
        })

    return {"prices": prices, "updated": "today"}
