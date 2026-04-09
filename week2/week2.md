# Week 2 — Competency 2: Code literacy & documentation

Reflections for HCDE 530 — Week 2.

*For **A2**, the instructor asked for a `week2.md` in the repo; a shorter, assignment-shaped version is at the **repository root** as `week2.md` (same folder as `README.md` if you opened the whole `hcde530code` project). If you submit only the nested **`week2` GitHub repo**, put your submission `week2.md` at the **root of that repo**—this file already is.*

## What “competency 2” means to me (in this class)

For this competency (**code literacy and documentation**), I’m framing it around being able to:

- **Read a script** — follow what the code is doing line by line (or block by block), not just run it.
- **Explain it in words** — translate the logic into plain language someone else could follow.
- **Comment code** — leave notes that make the file easier for me (and others) to scan later.
- **Use Git** — track changes, commit work, and connect the project to a remote like GitHub when it’s time to share or submit.

## What I did this week (evidence)

- **`demo_word_count.py`** — practice reading, running, and documenting a small CSV workflow.
- **`app_review_summary.py`** — second script: load app-review data, compute word-count stats, print a clear summary.
- **CSVs** — `demo_responses.csv`, `app_reviews.csv`: sample data to analyze in plain Python.
- **`PROJECT_CONTEXT.md`** — written context for the project (who it’s for, constraints, how I want help), so documentation isn’t only inside the code.
- **Git** — commits over time as the folder evolved.
- **GitHub** — publishing / pushing the repo (or `week2` repo) so the work lives somewhere shareable beyond my laptop.

## What I can do now that I couldn’t before (or do more confidently)

A concrete step forward this week was **getting a clearer picture of what Git vs GitHub actually are**—version control on my machine versus a remote place to store and share the repo—and **starting to connect that workflow to Cursor** (editing, committing, and thinking about the project as something that can be tracked and published, not just a loose folder of files).

## Documentation: what I practiced or decided

This week I tried to touch **several layers** of documentation, not just “code that runs”:

- **Section-style comments in Python** — short headers above major blocks so I can scan a file and see load → helper → output → summary at a glance.
- **`PROJECT_CONTEXT.md`** — who the project is for, constraints, and how I want collaborators/AI to help, so intent lives outside the scripts too.
- **Folder layout** — keeping weekly work in `week2/` with data next to scripts where it’s easy to run and review.
- **Git / commits** — treating history as part of documentation (what changed and when), even while I’m still building the habit of clear commit messages.

Some of this still feels new; I’m treating it as a practice to repeat, not something I’ve fully nailed yet.

## Gaps or next steps

**Still fuzzy or frustrating**

- **When to commit** — I don’t yet have a reliable instinct for the right cadence (too many tiny commits vs too few big ones, what “counts” as a logical save point).
- **Structure and folders** — I want to understand **how the repo should be organized** and **how to create folders in a way that stays consistent** as the class adds more weeks or files.
- **Rules for annotating** — I’m not fully settled on **what to comment**, how much is enough, and any **course or team norms** for notes in code (vs README / context files).
- **Communicating results** — making sure **output and takeaways** are understandable **outside the script** (for critique, portfolio, or a teammate)—not only “it printed in the terminal.”

**Next week I might try**

- A simple **commit habit** (e.g. after each working feature or end of session) and one-line messages that describe *what* changed.
- A **small folder convention** I stick to (e.g. `weekN/` + data + script) and ask the instructor or brief if unsure.
- Clarifying **annotation expectations** from the syllabus or rubric, and applying them in one new script.

## One line for a portfolio or critique

**Draft (my words, lightly edited for clarity):**  
I’m building confidence **editing code in Cursor with AI as support**, and I’m **documenting the work by keeping it in Git and putting the project on GitHub** so it isn’t only on my laptop.

*Original note to self:* “I can use Cursor to edit code confidently with AI and I documented it by saving it to GitHub.”
