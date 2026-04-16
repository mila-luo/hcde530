import csv

# --- Settings: file names and column names --------------------------------------
INPUT_FILE = "responses.csv"
OUTPUT_FILE = "responses_cleaned.csv"
NAME_COLUMN = "name"
# Values in this column are stripped and title-cased (see CAPITALIZE below).
ROW_COLUMN = "row"


# --- Load rows, filter empty names, clean the target column ----------------------
def main():
    cleaned = []

    with open(INPUT_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        if not fieldnames:
            raise SystemExit(f"{INPUT_FILE!r} has no header row.")
        if NAME_COLUMN not in fieldnames or ROW_COLUMN not in fieldnames:
            raise SystemExit(
                f"Expected columns {NAME_COLUMN!r} and {ROW_COLUMN!r}. "
                f"Found: {list(fieldnames)}"
            )

        for row in reader:
            # Skip rows where name is missing or only whitespace
            raw_name = row.get(NAME_COLUMN, "") or ""
            if not raw_name.strip():
                continue

            # Clean the "row" column: trim spaces, then title-case each word
            raw_cell = row.get(ROW_COLUMN, "") or ""
            row[ROW_COLUMN] = raw_cell.strip().title()

            cleaned.append(row)

    # --- Write all kept rows to the new CSV --------------------------------------
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(cleaned)

    print(f"Wrote {len(cleaned)} rows to {OUTPUT_FILE!r}")


if __name__ == "__main__":
    main()
