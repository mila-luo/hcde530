"""Fetch healthy bread recipes from Spoonacular and write a CSV."""

import csv
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from dotenv import load_dotenv

_BASE_DIR = Path(__file__).resolve().parent
load_dotenv(_BASE_DIR / ".env")
API_KEY = os.environ.get("SPOONACULAR_API_KEY", "").strip()

SPOONACULAR_SEARCH = "https://api.spoonacular.com/recipes/complexSearch"
OUTPUT_CSV = _BASE_DIR / "healthy_bread_recipes.csv"

FIELDNAMES = [
    "title",
    "ready_in_minutes",
    "prep_minutes",
    "cook_minutes",
    "servings",
    "health_score",
    "calories",
    "carbs_g",
    "fiber_g",
    "sugar_g",
    "protein_g",
    "fat_g",
    "ingredient_count",
    "ingredients",
]


def _nutrient_amount(nutrients: list, name: str):
    for n in nutrients or []:
        if n.get("name") == name:
            return n.get("amount")
    return ""


def _ingredients_csv_list(recipe: dict) -> tuple[int, str]:
    items = recipe.get("extendedIngredients") or []
    names = []
    for ing in items:
        label = (ing.get("original") or ing.get("originalName") or ing.get("name") or "").strip()
        if label:
            names.append(label)
    return len(items), ", ".join(names)


def recipe_to_row(recipe: dict) -> dict:
    nutrition = recipe.get("nutrition") or {}
    nutrients = nutrition.get("nutrients") or []

    ing_count, ing_list = _ingredients_csv_list(recipe)

    return {
        "title": recipe.get("title") or "",
        "ready_in_minutes": recipe.get("readyInMinutes") if recipe.get("readyInMinutes") is not None else "",
        "prep_minutes": recipe.get("preparationMinutes") if recipe.get("preparationMinutes") is not None else "",
        "cook_minutes": recipe.get("cookingMinutes") if recipe.get("cookingMinutes") is not None else "",
        "servings": recipe.get("servings") if recipe.get("servings") is not None else "",
        "health_score": recipe.get("healthScore") if recipe.get("healthScore") is not None else "",
        "calories": _nutrient_amount(nutrients, "Calories"),
        "carbs_g": _nutrient_amount(nutrients, "Carbohydrates"),
        "fiber_g": _nutrient_amount(nutrients, "Fiber"),
        "sugar_g": _nutrient_amount(nutrients, "Sugar"),
        "protein_g": _nutrient_amount(nutrients, "Protein"),
        "fat_g": _nutrient_amount(nutrients, "Fat"),
        "ingredient_count": ing_count,
        "ingredients": ing_list,
    }


def fetch_recipes(api_key: str, number: int = 100) -> list[dict]:
    params = {
        "query": "bread",
        "number": str(number),
        "addRecipeNutrition": "true",
        "sort": "healthiness",
        "sortDirection": "desc",
        "apiKey": api_key,
    }
    url = f"{SPOONACULAR_SEARCH}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "hcde530-fetch_bread_recipes/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        payload = json.load(resp)
    return payload.get("results") or []


def main() -> None:
    if not API_KEY:
        print(
            "Missing Spoonacular key. Add SPOONACULAR_API_KEY to .env next to this script (see python-dotenv).",
            file=sys.stderr,
        )
        sys.exit(1)

    try:
        recipes = fetch_recipes(API_KEY, number=100)
    except urllib.error.HTTPError as e:
        print(f"HTTP error {e.code}: {e.read().decode(errors='replace')[:500]}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"Request failed: {e.reason}", file=sys.stderr)
        sys.exit(1)

    rows = [recipe_to_row(r) for r in recipes]

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} recipes to {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
