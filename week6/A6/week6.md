# Week 6 — A6 (HCDE 530)

## What this folder contains

- **`generate_charts.py`** — Reads **`../MP1/healthy_bread_recipes.csv`**, builds three Plotly figures, and exports PNGs with Kaleido: `chart1_sugar_content.png`, `chart2_preptime_vs_health.png`, `chart3_carb_fiber_ratio.png`.
- **Chart PNGs** — Static exports for reports or slides; regenerate anytime by running the script from this folder (or with `python week6/A6/generate_charts.py` from the repo root).

## Note on data location

Recipe data lives with **MP1** under `week6/MP1/` so the mini-project notebook and charts share one canonical CSV for that milestone. **A5** keeps its own `healthy_bread_recipes.csv` under `week5/A5/` for the API + cleaning assignment track.

## Running `generate_charts.py`

PNG export needs **Kaleido**. Install deps with `pip install -r requirements.txt` in a virtual environment, or reuse `week5/A5/.venv` if you already created it:

`week5/A5/.venv/bin/python week6/A6/generate_charts.py`
