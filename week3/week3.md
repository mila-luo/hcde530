# Week 3 — Competency reflection (HCDE 530)

Reflections for HCDE 530 — Week 3. *UX practitioner perspective; not a software engineer.*

## What this week’s work was for

Practice working with **messy survey-style data in Python**: read a CSV, summarize it in the terminal, and **export a cleaned CSV** that is easier to reuse or hand off. The point is to get comfortable with **reading errors, understanding what Python is asking for, and fixing the script** with help from documentation and tools like Cursor—not to ship production software.

## What I did this week (evidence)

- **`week3_analysis_buggy.py`** — load `week3_survey_messy.csv`, print role counts, average years of experience, top satisfaction scores, then write `week3_survey_cleaned.csv` via `write_cleaned_csv`.
- **`week3_survey_messy.csv` / `week3_survey_cleaned.csv`** — input data and cleaned output for comparison.
- **Comments in the script** — plain-English `#` notes at the top and around the main loops and cleaning step (same spirit as Week 2: scan the file and see load → summaries → export).

## Debugging: two real bugs (not just a workflow)

I still follow the same habit—**read the traceback or wrong output**, **map it to one line or one value**, **change one thing**, **re-run**—but these are two concrete failures I hit while getting `week3_analysis_buggy.py` to match the messy survey.

### Bug 1 — `ValueError` when averaging years of experience

**What it was.** I called `int()` on the `experience_years` column so I could sum and divide for an average. One row in the messy survey used a **word** instead of digits.

**What I saw.** Python stopped with a traceback whose bottom line looked like:

`ValueError: invalid literal for int() with base 10: 'fifteen'`

So the data had `"fifteen"` where `int()` expected a string of digits like `"15"`.

**What that showed me about Python.** `int()` only knows how to parse numeric text in the usual digit form (plus optional sign, etc.). It does **not** guess English words; a non-matching string is a hard error, not a silent `None`. That is why a lot of data-cleaning code wraps parsing in `try` / `except` or checks the string before converting.

**How I fixed it.** I wrapped the conversion in `try` / `except ValueError`. In the `except` branch I mapped the one known typo-style answer (`"fifteen"` → `15`) with a small dictionary lookup, and returned `None` for anything else I still could not parse so those rows are skipped in the average instead of crashing the whole script.

**What I did with the source file.** After I understood the bug, I also **manually edited the messy CSV** so that row’s `experience_years` cell reads **`15`** instead of the word **`fifteen`**. I mention that on purpose: the **debugging story** is about what broke when the cell was still text, and the **code** still defends against that case, but the **CSV I submit** is a little cleaner so graders (or future me) do not have to trip the error just to open the file. The important artifact for the assignment is the script’s behavior, not leaving a landmine in the data forever.

### Bug 2 — wrong role labels after “prettifying” casing (`Ux` instead of `UX`)

**What it was.** A **logic / string-handling bug**, not a traceback. I used `str.title()` so messy roles like `ux designer` would look like titles, then tried to fix the acronym with a simple string replace.

**What I saw.** The terminal summary grouped counts correctly, but the printed label for some roles looked wrong—for example **`Ux Designer`** (capital U, lowercase x) instead of **`UX Designer`**. That came from `str.title()` turning `ux` into `Ux`, and my first fix (`replace("Ux ", "UX ")`) only worked when there was a **space after** `Ux`, so a lone token like `Ux` at the end of a label never got corrected.

**What that showed me about Python.** `str.title()` applies a mechanical rule (word boundaries and capitalization); it has no idea that **“UX” is a special acronym**. And `str.replace` is literal: it only changes the exact substring you give it, so partial fixes that depend on spaces or word order break as soon as the data shape changes.

**How I fixed it.** I switched to a **whole-word** pattern with `re.sub(r"\bUx\b", "UX", ...)` so every standalone `Ux` becomes `UX` whether or not there is a space after it. That matches how I actually want to think about the problem: “find this word as a word,” not “find this exact slice of characters.”

### How this fits my overall debugging habit

Even with named bugs, the loop is the same: **locate the error or wrong output**, **use Cursor or the docs to translate it into plain language**, **apply a small, testable fix** (guard `int()`, or use a regex), then **re-run and diff the cleaned CSV** so I know the script and the data both behave.

## What I can do now that I couldn’t before (or do more confidently)

I’m getting more comfortable treating an error as **information to act on** instead of a dead end: read the message, map it to a line or idea, ask what idiomatic Python looks like for that situation, change one thing, run again.

## Gaps or next steps

- **Remembering patterns** — I still lean on prompts and search; I want a few “go-to” moves (e.g. empty strings vs `None`, CSV `newline=""`) to stick without looking every time.
- **Knowing when the data is wrong vs the code** — some rows are messy on purpose; I want to separate “bug in script” from “bad or missing field in the survey.”

## One line for a portfolio or critique

**Draft:** I can **work through Python errors systematically**—find where they point, **use Cursor to interpret the message and suggest patterns**, and **verify the fix** by re-running the script and checking the output files.

---

*Interview notes (for future edits): audience, constraints, and “how I want code to look” can be added in the next pass.*
