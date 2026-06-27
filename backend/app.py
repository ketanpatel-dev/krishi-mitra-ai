import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from services.plant_identifier import identify_plant
from services.disease_detector import get_all_diseases, update_disease
from services.chatbot import chat
from services.weather import get_weather
from services.market import get_market_prices
from services.schemes_service import get_schemes, update_scheme
from services.crop_recommender import recommend_crop
from services.data_store import load_json
from services.i18n import (
    localize_scheme,
    localize_weather,
    localize_crop_name,
    localize_disaster,
)

load_dotenv()

app = Flask(__name__)
CORS(app)


def get_lang():
    return request.args.get("lang") or (request.get_json(silent=True) or {}).get("lang", "en")


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "app": "Krishi Mitra AI"})


@app.route("/api/detect-disease", methods=["POST"])
def api_detect_disease():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    file = request.files["image"]
    if not file.filename:
        return jsonify({"error": "Empty file"}), 400
    image_bytes = file.read()
    if len(image_bytes) == 0:
        return jsonify({"error": "Empty image"}), 400
    lang = request.form.get("lang", "en")
    
    try:
        # Use real AI Gemini Vision-based plant identification (pass language for localized response)
        result = identify_plant(image_bytes, lang=lang)
        
        # If Gemini returned an error, return proper HTTP error
        if "error" in result:
            return jsonify(result), 503
        
        # Apply localization for Hindi if needed
        if lang == "hi":
            from services.i18n import localize_detection_result
            result = localize_detection_result(result, lang)
        
        return jsonify(result)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Analysis failed. Please try again with a clearer image."
        }), 500


@app.route("/api/disease/<disease_id>")
def api_disease_info(disease_id):
    diseases = get_all_diseases()
    for d in diseases:
        if d["id"] == disease_id:
            return jsonify(d)
    return jsonify({"error": "Disease not found"}), 404


@app.route("/api/treatment/<disease_id>")
def api_treatment(disease_id):
    treatments = load_json("treatments.json")
    if disease_id in treatments:
        return jsonify(treatments[disease_id])
    return jsonify({"error": "Treatment not found"}), 404


@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "Message required"}), 400
    history = data.get("history", [])
    lang = data.get("lang", "en")
    return jsonify(chat(message, history, lang))


@app.route("/api/weather")
def api_weather():
    city = request.args.get("city", "Delhi")
    lang = get_lang()
    data = get_weather(city)
    return jsonify(localize_weather(data, lang))


@app.route("/api/market-prices")
def api_market_prices():
    lang = get_lang()
    data = get_market_prices()
    if lang == "hi":
        for p in data["prices"]:
            p["crop"] = localize_crop_name(p["crop"], lang)
    return jsonify(data)


@app.route("/api/schemes")
def api_schemes():
    lang = get_lang()
    schemes = [localize_scheme(s, lang) for s in get_schemes()]
    return jsonify({"schemes": schemes})


@app.route("/api/insurance")
def api_insurance():
    lang = get_lang()
    data = load_json("insurance.json")
    if lang == "hi":
        try:
            hi = load_json("hi/insurance.json")
            data = {**data, **hi}
        except FileNotFoundError:
            pass
    return jsonify(data)


@app.route("/api/emergency")
def api_emergency():
    return jsonify(load_json("emergency.json"))


@app.route("/api/disasters")
def api_disasters():
    lang = get_lang()
    data = load_json("disasters.json")
    return jsonify(localize_disaster(data, lang))


@app.route("/api/education")
def api_education():
    return jsonify(load_json("education.json"))


@app.route("/api/crop-recommendation", methods=["POST"])
def api_crop_recommendation():
    data = request.get_json() or {}
    location = data.get("location", "India")
    season = data.get("season", "Kharif")
    soil_type = data.get("soil_type", "Alluvial")
    water = data.get("water_availability", "Medium")
    lang = data.get("lang", "en")
    result = recommend_crop(location, season, soil_type, water)
    if lang == "hi":
        hi = load_json("hi/crop_recommendation.json")
        crop_map = hi.get("crops", {})
        en_crop = result["best_crop"]
        result["best_crop"] = crop_map.get(en_crop, en_crop)
        result["reasoning"] = result["reasoning"].replace(en_crop, result["best_crop"])
    return jsonify(result)


@app.route("/api/admin/diseases")
def api_admin_diseases():
    return jsonify({"diseases": get_all_diseases()})


@app.route("/api/admin/diseases/<disease_id>", methods=["PUT"])
def api_admin_update_disease(disease_id):
    data = request.get_json() or {}
    result = update_disease(disease_id, data)
    if result:
        return jsonify(result)
    return jsonify({"error": "Disease not found"}), 404


@app.route("/api/admin/schemes")
def api_admin_schemes():
    return jsonify({"schemes": get_schemes()})


@app.route("/api/admin/schemes/<scheme_id>", methods=["PUT"])
def api_admin_update_scheme(scheme_id):
    data = request.get_json() or {}
    result = update_scheme(scheme_id, data)
    if result:
        return jsonify(result)
    return jsonify({"error": "Scheme not found"}), 404


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
