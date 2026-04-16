import csv
from collections import Counter

# --- Settings -----------------------------------------------------------------
# File with a column listing each respondent's role (one row per person/response).
INPUT_FILE = "demo_responses.csv"
ROLE_COLUMN = "role"


# --- Count how often each role appears ----------------------------------------
def main():
    # Group case-insensitively: "UX Designer" and "ux designer" share one bucket.
    # We keep the first spelling we see as the label in the printout.
    counts = Counter()
    label_for_key = {}

    with open(INPUT_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames or ROLE_COLUMN not in reader.fieldnames:
            raise SystemExit(
                f"Need a {ROLE_COLUMN!r} column. This file has: {reader.fieldnames}"
            )

        for row in reader:
            raw = row.get(ROLE_COLUMN, "") or ""
            role = raw.strip()
            if not role:
                continue
            key = role.casefold()
            if key not in label_for_key:
                label_for_key[key] = role
            counts[key] += 1

    # --- Print results: highest count first, then alphabetical among ties -------
    print(f"Role counts (from {INPUT_FILE!r})\n")
    total = sum(counts.values())
    for key, n in sorted(counts.items(), key=lambda item: (-item[1], label_for_key[item[0]].lower())):
        print(f"  {label_for_key[key]}: {n}")

    print(f"\n  Total rows counted: {total}")


if __name__ == "__main__":
    main()
