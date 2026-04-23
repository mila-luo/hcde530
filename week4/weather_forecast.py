"""Fetch a 5-day / 3-hour Seattle forecast from OpenWeather and print a simple table.

Requires: pip install python-dotenv
Copy .env.example to .env and set OPENWEATHER_API_KEY to your real key.

How to run (macOS often has no ``python`` command — use ``python3``):
  From repo root:  python3 week4/weather_forecast.py
  From week4/:     python3 weather_forecast.py
"""

import json
import os
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from dotenv import load_dotenv


# --- Load secrets from .env (not committed to Git) ------------------------------
# Read OPENWEATHER_API_KEY from a local file so we never hard-code the key in source.
# The path is next to this script so running from repo root or from week4/ still works.
_dotenv_path = Path(__file__).resolve().parent / ".env"
# override=True: if your shell already has OPENWEATHER_API_KEY (even empty), still use .env.
load_dotenv(dotenv_path=_dotenv_path, override=True)


# --- HTTPS helper (optional certifi bundle) -------------------------------------
# Same idea as the Week 4 reviews script: some Mac Python builds need extra CA certs.
def _ssl_context() -> ssl.SSLContext:
    try:
        import certifi

        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


def main() -> None:
    # --- Read the OpenWeather API key from the environment ----------------------
    # load_dotenv() already merged .env into os.environ; .get returns None if unset.
    api_key = os.environ.get("OPENWEATHER_API_KEY")
    if not api_key or api_key.strip() == "your_api_key_here":
        print("Set OPENWEATHER_API_KEY in week4/.env (see .env.example).")
        sys.exit(1)

    # --- Build the forecast URL and download JSON -------------------------------
    # The URL points at OpenWeather’s “5 day / 3 hour forecast” service. That means:
    # you get many small forecasts (one every three hours) for roughly the next five
    # days for the place you name. We pass the city as q=Seattle, your key as appid,
    # and units=imperial so temperatures come back in Fahrenheit (not Celsius).
    base = "https://api.openweathermap.org/data/2.5/forecast"
    query = urllib.parse.urlencode(
        {
            "q": "Seattle",
            "appid": api_key,
            "units": "imperial",
        }
    )
    url = f"{base}?{query}"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60, context=_ssl_context()) as resp:
        raw = resp.read().decode("utf-8")

    # --- Turn the response body into Python dicts/lists -------------------------
    # The API returns one big JSON object. Besides metadata (city name, country,
    # coordinates, etc.), the important part is "list": an array where each item
    # is one three-hour step—timestamp, air temperature, conditions text, and so on.
    data = json.loads(raw)

    # --- Walk each forecast time slot in the API payload ------------------------
    # We only need a handful of values per step to print a readable table (and to
    # match what the assignment asks for). OpenWeather nests some of those values.
    rows = []
    for entry in data.get("list") or []:
        # "main" holds bulk numbers for that moment (temp, feels-like, humidity, …).
        main = entry.get("main") or {}
        # "weather" is a list of condition objects; we use the first one’s short text.
        weather_list = entry.get("weather") or []
        first_weather = weather_list[0] if weather_list else {}
        rows.append(
            {
                # When this step applies, as a plain string (e.g. "2025-04-23 12:00:00").
                "dt_txt": entry.get("dt_txt", ""),
                # Actual air temperature in °F (because we asked for imperial units).
                "temp": main.get("temp"),
                # “Feels like” temperature—wind/humidity adjusted for human comfort.
                "feels_like": main.get("feels_like"),
                # Short phrase for sky/conditions (e.g. “light rain”, “clear sky”).
                "description": first_weather.get("description", ""),
                # Relative humidity as a percentage (0–100).
                "humidity": main.get("humidity"),
            }
        )

    # --- Print a fixed-width table in the terminal --------------------------------
    # Pad each column to a fixed width so times, numbers, and text line up in the shell.
    col_when = 19
    col_temp = 8
    col_feels = 9
    col_desc = 28
    col_hum = 12
    header = (
        f"{'Date & time':<{col_when}}"
        f"{'Temp °F':>{col_temp}}"
        f"{'Feels °F':>{col_feels}}"
        f"{'Description':<{col_desc}}"
        f"{'Humidity %':>{col_hum}}"
    )
    print(header)
    print("-" * len(header))
    for r in rows:
        when = str(r["dt_txt"])
        temp = r["temp"]
        feels = r["feels_like"]
        desc = str(r["description"])
        hum = r["humidity"]
        temp_s = f"{temp:.1f}" if isinstance(temp, (int, float)) else str(temp)
        feels_s = f"{feels:.1f}" if isinstance(feels, (int, float)) else str(feels)
        hum_s = str(hum) if hum is not None else ""
        print(
            f"{when:<{col_when}}"
            f"{temp_s:>{col_temp}}"
            f"{feels_s:>{col_feels}}"
            f"{desc:<{col_desc}}"
            f"{hum_s:>{col_hum}}"
        )


# --- Script entry point ---------------------------------------------------------
# Running this file directly calls main(); HTTP errors print a short hint first.
if __name__ == "__main__":
    try:
        main()
    except urllib.error.HTTPError as e:
        print(f"HTTP error: {e.code} {e.reason}")
        if e.fp is not None:
            body = e.fp.read().decode("utf-8", errors="replace")
            if body:
                print(body[:500])
        raise
    except urllib.error.URLError as e:
        print(f"Network error: {e.reason}")
        raise
