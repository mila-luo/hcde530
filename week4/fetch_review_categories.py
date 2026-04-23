"""Fetch app-review data from the HCDE 530 Week 4 API and save category + helpful votes to CSV.

Uses GET /reviews on https://hcde530-week4-api.onrender.com/ (see course API docs). If HTTPS
verification fails on your Mac, install certifi: pip install certifi
"""

import csv
import json
import ssl
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


def _ssl_context() -> ssl.SSLContext:
    try:
        import certifi

        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()

API_BASE = "https://hcde530-week4-api.onrender.com"
REVIEWS_PATH = "/reviews"
OUTPUT_CSV = Path(__file__).resolve().parent / "review_categories_helpful_votes.csv"


def fetch_page(offset: int, limit: int) -> dict:
    """GET one page of reviews; returns parsed JSON (total, returned, offset, limit, reviews)."""
    query = urllib.parse.urlencode({"offset": offset, "limit": limit})
    url = f"{API_BASE}{REVIEWS_PATH}?{query}"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60, context=_ssl_context()) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    limit = 50
    offset = 0
    rows = []

    while True:
        payload = fetch_page(offset, limit)
        reviews = payload.get("reviews") or []  # each item includes category + helpful_votes among other fields
        for review in reviews:
            rows.append(
                {
                    "category": review.get("category", ""),
                    "helpful_votes": review.get("helpful_votes", ""),
                }
            )

        returned = int(payload.get("returned") or 0)
        total = int(payload.get("total") or 0)
        offset = int(payload.get("offset") or 0) + returned
        if offset >= total or returned == 0:
            break

    for row in rows:
        print(f"{row['category']}: {row['helpful_votes']} helpful votes")

    fieldnames = ["category", "helpful_votes"]
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)  # newline="" avoids blank lines on Windows-style CSVs
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nWrote {len(rows)} rows to {OUTPUT_CSV}")


if __name__ == "__main__":
    try:
        main()
    except urllib.error.HTTPError as e:
        print(f"HTTP error: {e.code} {e.reason}")
        raise
    except urllib.error.URLError as e:
        print(f"Network error: {e.reason}")
        raise
