# Week 6 — A6 (HCDE 530)

## What this folder contains

- **`generate_charts.py`** — Reads **`../MP1/healthy_bread_recipes.csv`**, builds three Plotly figures, and exports PNGs with Kaleido: `chart1_sugar_content.png`, `chart2_preptime_vs_health.png`, `chart3_carb_fiber_ratio.png`.
- **Chart PNGs** — Static exports for reports or slides; regenerate anytime by running the script from this folder (or with `python week6/A6/generate_charts.py` from the repo root).

## Note on data location

Recipe data lives with **MP1** under `week6/MP1/` so the mini-project notebook and charts share one canonical CSV for that milestone. **A5** keeps its own `healthy_bread_recipes.csv` under `week5/A5/` for the API + cleaning assignment track.

## Running `generate_charts.py`

PNG export needs **Kaleido**. Install deps with `pip install -r requirements.txt` in a virtual environment, or reuse `week5/A5/.venv` if you already created it:

`week5/A5/.venv/bin/python week6/A6/generate_charts.py`

## Chart choices and justifications

1. **`chart1_sugar_content.png` (horizontal bar, lowest-sugar recipes)** — Sugar per serving is easy for eaters to interpret and compare across recipes. Horizontal bars keep long recipe titles readable; color by `health_score` adds a second channel so “low sugar” can be read against the API’s health label in one view.

2. **`chart2_preptime_vs_health.png` (scatter)** — Tests whether more time-intensive recipes align with higher `health_score`. The script uses `prep_minutes` when enough values exist, otherwise **`ready_in_minutes`**, because the CSV often omits prep/cook breakdowns; the scatter still supports a “time vs. scored healthiness” question without dropping most rows.

3. **`chart3_carb_fiber_ratio.png` (histogram + 5:1 guideline)** — Carb-to-fiber ratio is an external nutrition heuristic (often summarized as a **5:1** carbs:fiber target for whole-grain quality). A histogram shows how the “healthy bread” set distributes on that metric; the vertical line marks the guideline so viewers can see how many recipes fall on the “better” side of the cutoff.
