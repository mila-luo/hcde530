import csv
import re
from collections import Counter
from pathlib import Path

# --- Load the survey data (CSV sits next to this script) ------------------------
BASE_DIR = Path(__file__).resolve().parent
filename = BASE_DIR / "week3_survey_messy.csv"
rows = []

with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(row)


# --- Count responses by role (same role, different spelling/casing = one bucket) -
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
