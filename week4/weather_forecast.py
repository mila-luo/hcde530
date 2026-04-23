"""Fetch a 5-day / 3-hour Seattle forecast from OpenWeather and print a simple table.

Also writes ``forecast_output.csv`` in the same folder as this script (UTF-8, five columns).

Requires: pip install python-dotenv
Copy .env.example to .env and set OPENWEATHER_API_KEY to your real key.

How to run (macOS often has no ``python`` command — use ``python3``):
  From repo root:  python3 week4/weather_forecast.py
  From week4/:     python3 weather_forecast.py
"""

import csv
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
    # Endpoint: OpenWeather “2.5/forecast” returns JSON with ~40 forecast steps (every
    # three hours for about five days) for one location, plus extras (city id, sunrise,
    # coordinate bounds, etc.). Each step is one object inside the top-level "list"
    # array; that is what we parse below—not the whole payload, only what people care
    # about for planning and comparison.
    base = "https://api.openweathermap.org/data/2.5/forecast"
    query = urllib.parse.urlencode(
        {
            # q: free-text city (and optional country code); the API geocodes it server-side.
            "q": "Seattle",
            # appid: your OpenWeather API key; required so the server can authorize the request.
            "appid": api_key,
            # units: "imperial" → Fahrenheit for temps and US-style wind; "metric" would be °C.
            "units": "imperial",
        }
    )
    url = f"{base}?{query}"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60, context=_ssl_context()) as resp:
        raw = resp.read().decode("utf-8")

    # --- Turn the response body into Python dicts/lists -------------------------
    # Same JSON the browser would get: one dict with keys like "cod", "message", "cnt",
    # "city", and "list". We only iterate "list"; each element has nested "main",
    # "weather", "wind", "clouds", etc. We skip unused keys to keep outputs small and
    # aligned with what a human reader or spreadsheet needs.
    data = json.loads(raw)

    # --- Walk each forecast time slot; build one flat dict per row for print + CSV --
    rows = []
    for entry in data.get("list") or []:
        # entry["main"]: object with temps, pressure, humidity for this time step.
        main = entry.get("main") or {}
        # entry["weather"]: list of {id, main, description, icon}; API may send more than one tag.
        weather_list = entry.get("weather") or []
        first_weather = weather_list[0] if weather_list else {}
        rows.append(
            {
                # entry["dt_txt"]: local-style date/time string for this step (no Unix math in CSV).
                # Chosen so users see *when* each number applies—trust and sorting in spreadsheets.
                "date_time": entry.get("dt_txt", ""),
                # main["temp"]: dry-bulb air temperature (°F here). Chosen as the headline number
                # people compare across hours; column name temp_f states the unit in the file header.
                "temp_f": main.get("temp"),
                # main["feels_like"]: apparent temperature (wind/humidity). Chosen because lived
                # comfort often diverges from raw temp—better match for clothing and outdoor plans.
                "feels_like_f": main.get("feels_like"),
                # weather[0]["description"]: short English phrase for conditions. Chosen over raw
                # codes because humans scan words faster; first list item is the primary condition.
                "description": first_weather.get("description", ""),
                # main["humidity"]: relative humidity %. Chosen as a second comfort signal beside temp.
                "humidity": main.get("humidity"),
            }
        )

    # --- Save the same rows to CSV (same folder as this script) -------------------
    # DictWriter quotes fields that contain commas (e.g. long descriptions) automatically.
    _week4_dir = Path(__file__).resolve().parent
    csv_path = _week4_dir / "forecast_output.csv"
    _csv_fields = ["date_time", "temp_f", "feels_like_f", "description", "humidity"]
    with csv_path.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=_csv_fields)
        writer.writeheader()
        writer.writerows(rows)

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
        when = str(r["date_time"])
        temp = r["temp_f"]
        feels = r["feels_like_f"]
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
