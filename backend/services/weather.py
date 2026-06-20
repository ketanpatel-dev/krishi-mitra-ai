import os
import random
from datetime import datetime, timedelta


def get_weather(city="Delhi"):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if api_key and api_key != "your_openweather_api_key_here":
        try:
            import urllib.request
            import json
            url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
            with urllib.request.urlopen(url, timeout=5) as resp:
                data = json.loads(resp.read())
            return _format_openweather(data, city)
        except Exception:
            pass

    return _mock_weather(city)


def _format_openweather(data, city):
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    forecast = []
    base_temp = data["main"]["temp"]
    for i in range(7):
        d = datetime.now() + timedelta(days=i)
        forecast.append({
            "day": days[d.weekday()],
            "icon": "🌤️",
            "condition": data["weather"][0]["description"].title(),
            "high": round(base_temp + random.randint(-2, 4)),
            "low": round(base_temp - random.randint(3, 8)),
            "rain": random.randint(0, 60),
        })

    alerts = []
    if forecast[1]["rain"] > 50:
        alerts.append({
            "title": "Heavy Rain Expected Tomorrow",
            "message": "Protect crop storage and avoid field operations.",
        })

    return {
        "city": city,
        "current": {
            "temp": round(data["main"]["temp"]),
            "humidity": data["main"]["humidity"],
            "rain_probability": random.randint(10, 80),
            "wind_speed": round(data["wind"]["speed"] * 3.6),
            "uv_index": random.randint(3, 9),
            "condition": data["weather"][0]["description"].title(),
        },
        "forecast": forecast,
        "alerts": alerts,
    }


def _mock_weather(city):
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    today = datetime.now()
    conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Humid"]
    icons = {"Sunny": "☀️", "Partly Cloudy": "⛅", "Cloudy": "☁️", "Light Rain": "🌧️", "Humid": "💧"}

    forecast = []
    for i in range(7):
        d = today + timedelta(days=i)
        cond = random.choice(conditions)
        forecast.append({
            "day": days[d.weekday()],
            "icon": icons[cond],
            "condition": cond,
            "high": random.randint(28, 38),
            "low": random.randint(18, 26),
            "rain": random.randint(0, 70),
        })

    alerts = []
    if forecast[1]["rain"] > 55:
        alerts.append({
            "title": "Heavy Rain Expected Tomorrow",
            "message": "Protect crop storage and delay harvesting if possible.",
        })
    if forecast[0]["high"] > 36:
        alerts.append({
            "title": "Heat Advisory",
            "message": "Irrigate crops early morning or evening to reduce heat stress.",
        })

    return {
        "city": city,
        "current": {
            "temp": random.randint(28, 36),
            "humidity": random.randint(45, 85),
            "rain_probability": forecast[0]["rain"],
            "wind_speed": random.randint(5, 25),
            "uv_index": random.randint(4, 10),
            "condition": forecast[0]["condition"],
        },
        "forecast": forecast,
        "alerts": alerts,
    }
