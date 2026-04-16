import csv
import re
from collections import Counter
from pathlib import Path


def prettify_role_label(label):
    """Make role labels readable after messy casing in the CSV.

    str.title() turns UX-style roles into 'Ux ...'; we normalize the acronym to
    'UX'. A plain replace('Ux ', ...) misses a lone 'ux' (becomes 'Ux') because
    there is no following space. Using a whole-word pattern fixes that.
    """
    t = label.strip().title()
    return re.sub(r"\bUx\b", "UX", t)


def parse_experience_years(raw):
    """Return a number of years, or None if missing / not usable."""
    s = (raw or "").strip()
    if not s:
        return None
    try:
        return int(s)
    except ValueError:
        # Messy survey: one row uses a word instead of digits
        spelled = {"fifteen": 15}
        return spelled.get(s.lower())


def write_cleaned_csv(rows, output_path):
    """Write normalized survey rows to a UTF-8 CSV at ``output_path``.

    Reads each row dict from ``rows``, normalizes values (whitespace, role label,
    numeric experience, default name), and writes a new CSV with the same column
    headers as the original survey file. Uses ``csv.DictWriter`` with
    ``newline=""`` and ``encoding="utf-8"`` so line endings and characters round-trip
    cleanly.
    """
    # Decide column order: match the input file header (first row's keys), or the
    # standard survey columns if there are no rows to infer from.
    if rows:
        fieldnames = list(rows[0].keys())
    else:
        fieldnames = [
            "response_id",
            "participant_name",
            "role",
            "department",
            "age_range",
            "experience_years",
            "satisfaction_score",
            "primary_tool",
            "response_text",
        ]

    # Build one normalized dict per input row so we only write cleaned values.
    normalized_rows = []
    for row in rows:
        # Strip leading/trailing whitespace from every field for consistent output.
        out = {}
        for key in fieldnames:
            val = row.get(key, "")
            out[key] = ("" if val is None else str(val)).strip()

        # Make role labels consistent with the rest of the script (e.g. UX casing).
        out["role"] = prettify_role_label(out["role"])

        # Store years as a number when parseable; otherwise leave the cell empty.
        years = parse_experience_years(out["experience_years"])
        out["experience_years"] = "" if years is None else years

        # Never write a blank display name; use a single placeholder instead.
        name = out["participant_name"]
        out["participant_name"] = name if name else "Unknown"

        normalized_rows.append(out)

    # Write the cleaned table to disk for sharing or further analysis.
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(normalized_rows)


def main():
    # --- Load the survey data (CSV sits next to this script) ------------------------
    BASE_DIR = Path(__file__).resolve().parent
    filename = BASE_DIR / "week3_survey_messy.csv"
    rows = []

    with open(filename, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    # --- Count responses by role (same role, different spelling/casing = one bucket) -
    role_counts = Counter()
    role_label = {}

    for row in rows:
        raw_role = (row.get("role") or "").strip()
        if not raw_role:
            continue
        key = raw_role.casefold()
        if key not in role_label:
            role_label[key] = raw_role
        role_counts[key] += 1

    print("Responses by role:")
    for key, count in sorted(role_counts.items(), key=lambda item: (-item[1], role_label[item[0]].lower())):
        print(f"  {prettify_role_label(role_label[key])}: {count}")

    # --- Average years of experience (skip blanks and junk we cannot parse) -------
    total_experience = 0
    experience_count = 0
    for row in rows:
        years = parse_experience_years(row.get("experience_years"))
        if years is None:
            continue
        total_experience += years
        experience_count += 1

    if experience_count:
        avg_experience = total_experience / experience_count
        print(f"\nAverage years of experience: {avg_experience:.1f} (from {experience_count} rows)")
    else:
        print("\nAverage years of experience: (no numeric values found)")

    # --- Top 5 highest satisfaction scores -----------------------------------------
    scored_rows = []
    for row in rows:
        raw_score = (row.get("satisfaction_score") or "").strip()
        if not raw_score:
            continue
        try:
            score = int(raw_score)
        except ValueError:
            continue
        name = (row.get("participant_name") or "").strip() or "Unknown"
        scored_rows.append((name, score))

    scored_rows.sort(key=lambda x: x[1], reverse=True)
    top5 = scored_rows[:5]

    print("\nTop 5 satisfaction scores:")
    for name, score in top5:
        print(f"  {name}: {score}")

    # --- Save a cleaned copy of the survey next to the messy input file ------------
    write_cleaned_csv(rows, BASE_DIR / "week3_survey_cleaned.csv")


if __name__ == "__main__":
    main()
