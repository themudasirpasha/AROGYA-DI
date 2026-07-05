"""
Live Air Quality lookup for AROGYA-DI using Google's Air Quality API.
Supplements the static Kaggle dataset with real-time AQI for a given location.
"""

import requests
import os

API_KEY = os.environ.get("AIR_QUALITY_API_KEY")


def get_live_air_quality(latitude: float, longitude: float) -> dict:
    """Fetches real-time air quality index for a given lat/long location."""
    url = f"https://airquality.googleapis.com/v1/currentConditions:lookup?key={API_KEY}"
    payload = {
        "location": {
            "latitude": latitude,
            "longitude": longitude
        }
    }
    response = requests.post(url, json=payload)
    if response.status_code != 200:
        return {"error": f"API error: {response.status_code}", "details": response.text}
    return response.json()


if __name__ == "__main__":
    result = get_live_air_quality(23.0225, 72.5714)  # Ahmedabad
    print(result)