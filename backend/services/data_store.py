import json
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def load_json(filename):
    path = DATA_DIR / filename
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(filename, data):
    path = DATA_DIR / filename
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
