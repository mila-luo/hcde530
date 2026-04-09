# Project context — HCDE 530 coursework (`hcde530code` / `week2`)

Use this file so collaborators and coding assistants align with how Mila works and what this repo is for. Update it when goals or course rules change.

## Who’s building this

- **Background:** Human-centered design practitioner; **UX design** focus, not a software engineer.
- **Python comfort:** Getting comfortable—can **edit small scripts with guidance**; prefers clarity over cleverness.

## What this repo is for

- **Primary:** University coursework (**HCDE 530**-style code exercises).
- **Aspiration:** **Portfolio-ready** material over time—enough that hiring managers and other designers can skim and see credible, thoughtful work.

## Audience (how the repo should “read”)

1. **Hiring managers / recruiters** — quick, scannable evidence of competence.
2. **Other designers** — craft and judgment, not just “it runs.”

**Headline story:** *I can partner credibly with engineers*—especially around turning messy qualitative inputs into structured, inspectable workflows.

## Intended use of code (near term)

- **Main goal:** **Clean and explore** survey or interview-style data (e.g. **CSV**, later possibly transcripts).
- Not the primary focus right now: heavy automation pipelines, large web apps, or production systems.

## Data and ethics (defaults for *this* repo)

- Treat included data as **public, synthetic, or classroom demo** unless stated otherwise.
- If that changes (real participants, PII), **stop** and treat the repo as **private**, add `.gitignore` rules for raw exports, and update this section.

## Course / tooling constraints

- **How code is run:** **Cursor / VS Code** (Run or integrated terminal)—not Colab-first or notebook-first unless an assignment requires it.
- **Libraries:** Prefer the **Python standard library** (`csv`, `json`, `pathlib`, etc.) **by default**. Only add third-party packages (e.g. **pandas**) when the **assignment allows or asks** for them.
- **Instructor-aligned habit:** Add **short comments above each major section** in scripts so the file is easy to scan in critique or review.

## Working style with AI / assistants

- **Depth:** Explain **why** in **plain language**, stay **practical** (not one-line-only, not a long lecture).
- **“Done enough” for a week:** Script **runs locally**, **output is sensible**, and Mila could **explain the logic in critique**. Polished READMEs and case-study narrative can come later.

## What to avoid (unless explicitly requested)

- **A)** No **big frameworks** or **heavy dependencies** “just because”—stay small and readable.
- Prefer **small, targeted edits** over rewriting entire files when a local fix is enough.
- Do **not** assume sensitive real-user data in repo files; default is **demo/class** data.

## Repo layout (high level)

- **`week2/`** (this folder) — scripts, sample CSVs, `.cursorrules`, and this `PROJECT_CONTEXT.md`.
- Parent **`hcde530code/`** may hold a top-level `README.md` only or other week folders later.
- **`week2/`** may be a **nested Git repository**; confirm which root you’re committing to before pushing.

## Open items to fill in later

- Syllabus specifics: exact **submission format**, **late policy**, **citation / AI-use** rules if any.
- Optional upgrade path: short **per-week README** stubs when moving toward portfolio polish.
