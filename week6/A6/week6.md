# Week 6 — A6 (HCDE 530)

## Competency Claims

### C6 — Data Visualization

I built a reproducible visualization pipeline in **`generate_charts.py`** using **Plotly Express** and **Kaleido** to export three publication-ready PNGs from the MP1 recipe CSV. Each chart type matches the analytical question: a **horizontal bar chart** for comparing sugar across named recipes (readable titles, color by `health_score`), a **scatter plot** for time vs. healthiness, and a **histogram** with a **5:1 reference line** for carb-to-fiber ratio. Titles state findings (“Even ‘healthy’ bread varies widely in sugar…”) rather than axis labels alone, and hover fields (`calories`, `sugar_g`, `fiber_g`, `title`) support inspection without cluttering the main view.

### C5 — Data Analysis with Pandas

Before plotting, I load **`../MP1/healthy_bread_recipes.csv`**, coerce nutrition and time columns with **`pd.to_numeric(..., errors="coerce")`**, and subset with **`dropna`** so each figure answers one question with defensible rows: top 15 lowest-sugar recipes, rows with both time and `health_score`, and recipes with positive fiber for a derived **`carb_fiber_ratio`** column. The script encodes the same three analyses described in MP1—ranking sugar, relating time to score, and applying an external ratio standard—but packages them as callable functions that can be re-run whenever the CSV updates.

### C7 — Critical Evaluation and Professional Judgment

I documented and implemented tradeoffs instead of hiding them in the charts. For **chart 2**, the script prefers **`prep_minutes`** only when enough values exist; otherwise it uses **`ready_in_minutes`**, with axis labels that say which time measure is shown so viewers are not misled by sparse prep data. For **chart 3**, the dashed **5:1** line is labeled as a **common guideline**, not a claim baked into Spoonacular’s `health_score`—the histogram shows distribution against an external nutrition heuristic so audiences can see how many “healthy bread” API results meet a standard the score alone does not encode.

## HCD angle

Chart choices prioritize what eaters and designers need for decisions, not every column in the API payload: **sugar per serving** for quick comparison, **time vs. score** for feasibility vs. labeled healthiness, and **carb:fiber ratio** for a whole-grain quality heuristic. That mirrors a typical HCD move—selecting a small, meaningful slice of nested API data for humans who must compare tradeoffs (energy, blood sugar, effort) rather than trusting a single health label.

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
