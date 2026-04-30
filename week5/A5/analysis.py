"""Quick summaries for healthy_bread_recipes.csv (Week 5 A5)."""

from pathlib import Path

import pandas as pd

_BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = _BASE_DIR / "healthy_bread_recipes.csv"


def main() -> None:
    if not CSV_PATH.is_file():
        raise SystemExit(f"Missing {CSV_PATH.name} — run fetch_bread_recipes.py first.")

    df = pd.read_csv(CSV_PATH)

    print(f"Rows: {len(df)}, columns: {len(df.columns)}")
    print()

    numeric = [
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
    ]
    present = [c for c in numeric if c in df.columns]
    print(df[present].describe().round(2).to_string())
    print()

    print("Missing value counts (top columns):")
    na = df.isna().sum().sort_values(ascending=False)
    print(na[na > 0].head(12).to_string())
    print()

    print("Top 5 by health_score:")
    cols_show = ["title", "health_score", "calories", "fiber_g", "sugar_g"]
    cols_show = [c for c in cols_show if c in df.columns]
    top = df.nlargest(5, "health_score")[cols_show] if "health_score" in df.columns else df.head(5)
    print(top.to_string(index=False))


if __name__ == "__main__":
    main()
