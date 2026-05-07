"""Generate charts for the healthy bread recipes dataset (A6).

Reads `healthy_bread_recipes.csv` from `week6/MP1/` (sibling folder) and writes three PNGs here:
- chart1_sugar_content.png
- chart2_preptime_vs_health.png
- chart3_carb_fiber_ratio.png
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.express as px

BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR.parent / "MP1" / "healthy_bread_recipes.csv"

OUT_CHART1 = BASE_DIR / "chart1_sugar_content.png"
OUT_CHART2 = BASE_DIR / "chart2_preptime_vs_health.png"
OUT_CHART3 = BASE_DIR / "chart3_carb_fiber_ratio.png"


def _to_numeric(df: pd.DataFrame, cols: list[str]) -> None:
    for c in cols:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")


def chart1_sugar_content(df: pd.DataFrame) -> None:
    # Lowest sugar recipes (per-serving sugar_g)
    if "sugar_g" not in df.columns:
        raise ValueError("Missing column: sugar_g")

    sub = df.dropna(subset=["sugar_g"]).copy()
    sub = sub.sort_values("sugar_g", ascending=True).head(15)

    fig = px.bar(
        sub,
        x="sugar_g",
        y="title",
        orientation="h",
        color="health_score" if "health_score" in sub.columns else None,
        labels={"sugar_g": "Sugar per serving (g)", "title": "Recipe"},
        title="Even “healthy” bread varies widely in sugar (15 lowest-sugar recipes)",
        hover_data={
            "health_score": True if "health_score" in sub.columns else False,
            "calories": True if "calories" in sub.columns else False,
        },
    )
    fig.update_layout(yaxis={"categoryorder": "total ascending"})
    fig.write_image(str(OUT_CHART1), scale=2)


def chart2_preptime_vs_health(df: pd.DataFrame) -> None:
    # Many rows have missing prep_minutes; fall back to ready_in_minutes.
    time_col = "prep_minutes" if df.get("prep_minutes").notna().sum() > 0 else "ready_in_minutes"

    needed = [time_col, "health_score"]
    for c in needed:
        if c not in df.columns:
            raise ValueError(f"Missing column: {c}")

    sub = df.dropna(subset=needed).copy()

    fig = px.scatter(
        sub,
        x=time_col,
        y="health_score",
        labels={time_col: "Prep time (minutes)" if time_col == "prep_minutes" else "Total time (minutes)"},
        title="Time vs health score (prep time if available; else total ready time)",
        hover_data=["title", "calories", "sugar_g", "fiber_g"],
    )
    fig.write_image(str(OUT_CHART2), scale=2)


def chart3_carb_fiber_ratio(df: pd.DataFrame) -> None:
    # Carb-to-fiber ratio: lower is better (5:1 guideline).
    for c in ["carbs_g", "fiber_g"]:
        if c not in df.columns:
            raise ValueError(f"Missing column: {c}")

    sub = df.dropna(subset=["carbs_g", "fiber_g"]).copy()
    sub = sub[sub["fiber_g"] > 0].copy()
    sub["carb_fiber_ratio"] = sub["carbs_g"] / sub["fiber_g"]

    fig = px.histogram(
        sub,
        x="carb_fiber_ratio",
        nbins=30,
        title="Carb-to-fiber ratio distribution (lower is better; 5:1 is a common guideline)",
        labels={"carb_fiber_ratio": "Carbs (g) / Fiber (g)"},
    )
    fig.add_vline(x=5, line_dash="dash", line_color="black", annotation_text="5:1 guideline", annotation_position="top")
    fig.write_image(str(OUT_CHART3), scale=2)


def main() -> None:
    if not CSV_PATH.is_file():
        raise SystemExit(f"Missing {CSV_PATH.name} in {BASE_DIR}")

    df = pd.read_csv(CSV_PATH)
    _to_numeric(
        df,
        [
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
        ],
    )

    chart1_sugar_content(df)
    chart2_preptime_vs_health(df)
    chart3_carb_fiber_ratio(df)

    print("Saved:")
    print(f"- {OUT_CHART1.name}")
    print(f"- {OUT_CHART2.name}")
    print(f"- {OUT_CHART3.name}")


if __name__ == "__main__":
    main()

