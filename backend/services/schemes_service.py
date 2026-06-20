from services.data_store import load_json, save_json

_schemes_cache = None


def get_schemes():
    global _schemes_cache
    if _schemes_cache is None:
        _schemes_cache = load_json("schemes.json")
    return _schemes_cache


def update_scheme(scheme_id, data):
    schemes = get_schemes()
    for i, s in enumerate(schemes):
        if s["id"] == scheme_id:
            schemes[i] = {**s, **data, "id": scheme_id}
            save_json("schemes.json", schemes)
            return schemes[i]
    return None
