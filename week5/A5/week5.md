# Week 5 — A5 (HCDE 530)

**Layout:** This folder is **`week5/A5/`** — API fetch, CSV export, and quick pandas checks. **MP1** (notebook + competency write-up) lives under **`week6/MP1/`**; **A6** chart exports live under **`week6/A6/`**.

## Competency Claims

### C3 — Data Collection and Access

I accessed live recipe data programmatically using the Spoonacular API. Authentication is handled securely through a .env file loaded with python-dotenv so the API key never appears in code or git history. fetch_bread_recipes.py sends an HTTPS request, parses the JSON response, flattens nested nutrition fields into columns, and writes the result to healthy_bread_recipes.csv.

### C4 — Data Cleaning and Preparation

I identified and documented missing values in prep_minutes, cook_minutes, and ingredients — columns that are sparse in Spoonacular's bulk search payload. analysis.py loads the CSV, prints shape, runs describe(), and counts nulls with isnull().sum() so any analyst picking up this file knows exactly where the gaps are before doing any deeper work.

### C5 — Data Analysis with Pandas

analysis.py answers three specific questions about the dataset: which recipes have the highest health scores, where the missing values are, and what the distribution of key nutrition columns looks like. Each operation is commented in plain English explaining what it tells us about the data — not just what the code does.

### C6 — Connecting Data to HCD Practice

Bread recipes are labeled "healthy" by the API, but labels alone don't support real user decisions. Pulling both health scores and macros (calories, sugar, fiber) into one table mirrors a common HCD research step: making API richness actionable for people who need to compare tradeoffs — energy, blood sugar, satiety — rather than trusting a single score.

## HCD angle

Bread search results are **labeled for healthiness**, but numbers like **calories and sugar per serving** are what support real tradeoffs for eaters (energy, blood sugar, satiety). Pulling both **scores** and **macros** into one sheet is a small version of "API richness → human decision slice": designers and analysts still have to choose **which columns** become UI or policy, and **which gaps** (missing prep times, sparse ingredients) get follow-up or disclaimers instead of silent trust in the row count alone.

## Code Documentation

Each function and key block in fetch_bread_recipes.py and analysis.py includes inline # comments explaining what the code is doing and why — for example, why nutrition fields need to be extracted from a nested list rather than read as top-level keys, and what a missing prep_minutes value means for downstream analysis.
