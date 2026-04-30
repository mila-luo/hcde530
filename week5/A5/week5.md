# Week 5 — A5 (HCDE 530)

## What this folder contains

- **`fetch_bread_recipes.py`** — Calls Spoonacular **complexSearch** for healthy-oriented bread recipes, normalizes fields, writes **`healthy_bread_recipes.csv`**. API key lives in **`.env`** (`SPOONACULAR_API_KEY`), loaded with **python-dotenv**; `.env` stays out of git via the repo **`.gitignore`**.
- **`analysis.py`** — Loads the CSV with **pandas**, prints **shape**, **numeric summaries** (`describe`), **missing-value counts**, and the **top five recipes by `health_score`** so I can sanity-check the pull before any deeper modeling or viz.
- **`requirements.txt`** — `python-dotenv`, `requests`, `pandas` (requests is available for future refactors; the fetch script currently uses **`urllib`** from the standard library).

## Competency note

I can **repeat the Week 4 pattern** on a different API and domain: **authenticate from environment**, **request JSON over HTTPS**, **flatten nested nutrition into columns**, and **persist a table to CSV**. The analysis step mirrors how I would treat any hand-off file in practice: **load → describe → spot gaps** (for example empty `prep_minutes` / `cook_minutes` or ingredient lists when the bulk search payload is thinner than a single-recipe call).

## HCD angle (short)

Bread search results are **labeled for healthiness**, but numbers like **calories and sugar per serving** are what support real tradeoffs for eaters (energy, blood sugar, satiety). Pulling both **scores** and **macros** into one sheet is a small version of “**API richness → human decision slice**”: designers and analysts still have to choose **which columns** become UI or policy, and **which gaps** (missing prep times, sparse ingredients) get follow-up or disclaimers instead of silent trust in the row count alone.
