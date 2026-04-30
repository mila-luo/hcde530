# Week 3 — Competency reflection (HCDE 530)

*HCDE 530 — UX practitioner perspective, not a software engineer.*

## What this week was for

Read a **messy survey CSV** in Python, print summaries in the terminal, **export a cleaned CSV**, and practice **reading tracebacks**, looking up fixes, and re-running—not shipping production code.

## Evidence

- **`week3_analysis_buggy.py`** — load `week3_survey_messy.csv`; role counts, average experience, top satisfaction scores; `write_cleaned_csv` → `week3_survey_cleaned.csv`.
- **`week3_survey_messy.csv` / `week3_survey_cleaned.csv`** — input vs cleaned output.
- **`#` comments** in the script — load → summaries → export, same spirit as Week 2.

## Debugging: three bugs

**Names:** (1) **`ValueError` / `"fifteen"`** in `experience_years`. (2) **Top-5 satisfaction** — default ascending sort + first five rows = **lowest** scores; fixed with **`reverse=True`**. (3) **`Ux` vs `UX`** — `str.title()` plus a **`replace` that depended on a trailing space**; fixed with **`re.sub(r"\bUx\b", "UX", ...)`**.

**Habit:** Read the traceback or wrong output → tie it to **one line or one value** → **one change** → re-run.

### 1. `ValueError` when averaging experience

`int()` on `experience_years` crashed on `'fifteen'` (`ValueError: invalid literal for int() with base 10: 'fifteen'`). **`int()` does not parse English words**—only digit-style strings—so parsing belongs in **`try` / `except ValueError`**, with a small map for `"fifteen"` → `15` and **`None`** for anything else so bad rows skip the average instead of killing the script. I also set that CSV cell to **`15`** for a cleaner handoff; the code still handles the word if it comes back.

### 2. “Top 5” showed the wrong scores

I sorted scores **ascending** (default) and took **`[:5]`**, so the script printed the **five lowest** satisfactions. **Fix:** sort with **`reverse=True`** (or take the last five if sorted low-to-high), then re-check against the CSV.

### 3. Role labels: `Ux Designer` instead of `UX Designer`

**Logic bug, not a traceback.** `str.title()` made **`Ux`**; **`replace("Ux ", "UX ")`** only matched when a **space followed** `Ux`. **`str.replace` is literal** and does not know “UX” is an acronym. **`re.sub(r"\bUx\b", "UX", ...)`** fixes every standalone **`Ux`** regardless of what comes after.

## What improved

Errors feel more like **signal than failure**: map the message to a line, pick a small idiomatic fix (`int` guard, **sort direction**, **word-boundary regex**), verify by re-running and diffing output.

## Gaps

- **Memory for patterns** — e.g. empty string vs `None`, CSV **`newline=""`** — still often from docs or prompts.
- **Data vs code** — messy rows on purpose; I want a faster read on whether the bug is my script or the field.

## One line (portfolio / critique)

**Draft:** I can **step through Python errors**—trace where they point, **use Cursor for patterns and docs**, and **confirm** by re-running and checking exported files.

---

*Interview notes: add audience, constraints, “how I want code to look” when useful.*
