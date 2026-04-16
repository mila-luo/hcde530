# Week 3 — Competency reflection (HCDE 530)

Reflections for HCDE 530 — Week 3. *UX practitioner perspective; not a software engineer.*

## What this week’s work was for

Practice working with **messy survey-style data in Python**: read a CSV, summarize it in the terminal, and **export a cleaned CSV** that is easier to reuse or hand off. The point is to get comfortable with **reading errors, understanding what Python is asking for, and fixing the script** with help from documentation and tools like Cursor—not to ship production software.

## What I did this week (evidence)

- **`week3_analysis_buggy.py`** — load `week3_survey_messy.csv`, print role counts, average years of experience, top satisfaction scores, then write `week3_survey_cleaned.csv` via `write_cleaned_csv`.
- **`week3_survey_messy.csv` / `week3_survey_cleaned.csv`** — input data and cleaned output for comparison.
- **Comments in the script** — plain-English `#` notes at the top and around the main loops and cleaning step (same spirit as Week 2: scan the file and see load → summaries → export).

## Debugging workflow I used (my words)

This week we were able to **locate the error**, **ask Cursor to explain the error message**, **ask what Python patterns handle that kind of problem**, and **then fix it**. That sequence matters to me: I’m not memorizing every edge case—I’m building a repeatable way to **narrow down what broke**, **translate the traceback into normal language**, and **apply a small pattern** (often something the standard library already gives you, like how to open CSVs or handle missing values).

## What I can do now that I couldn’t before (or do more confidently)

I’m getting more comfortable treating an error as **information to act on** instead of a dead end: read the message, map it to a line or idea, ask what idiomatic Python looks like for that situation, change one thing, run again.

## Gaps or next steps

- **Remembering patterns** — I still lean on prompts and search; I want a few “go-to” moves (e.g. empty strings vs `None`, CSV `newline=""`) to stick without looking every time.
- **Knowing when the data is wrong vs the code** — some rows are messy on purpose; I want to separate “bug in script” from “bad or missing field in the survey.”

## One line for a portfolio or critique

**Draft:** I can **work through Python errors systematically**—find where they point, **use Cursor to interpret the message and suggest patterns**, and **verify the fix** by re-running the script and checking the output files.

---

*Interview notes (for future edits): audience, constraints, and “how I want code to look” can be added in the next pass.*
