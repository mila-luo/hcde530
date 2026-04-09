import csv

# --- Load survey data ---------------------------------------------------------
# We need every row from the class demo file so we can measure how long each
# written response is. "utf-8" avoids garbled text if anyone used punctuation
# or special characters.
filename = "demo_responses.csv"
responses = []

with open(filename, newline="", encoding="utf-8") as f:
    # DictReader uses the first row as column names, so each row is easy to
    # read by field name (participant_id, role, response) instead of position.
    reader = csv.DictReader(f)
    for row in reader:
        responses.append(row)


# --- Count words in one piece of text -----------------------------------------
def count_words(response):
    """Count the number of words in a response string.

    Takes a string, splits it on whitespace, and returns the word count.
    Used to measure response length across all participants.
    """
    # Splitting on whitespace gives a list of words; len() tells us how many.
    return len(response.split())


# --- Print a table: who said what, and how long each answer is ----------------
print(f"{'ID':<6} {'Role':<22} {'Words':<6} {'Response (first 60 chars)'}")
print("-" * 75)

word_counts = []

# Go through each survey response one at a time
for row in responses:
    participant = row["participant_id"]
    role = row["role"]
    response = row["response"]

    # Count the words by splitting on spaces and counting the pieces
    count = count_words(response)
    word_counts.append(count)

    # Long answers would make the table messy, so we only show the start here
    if len(response) > 60:
        preview = response[:60] + "..."
    else:
        preview = response

    print(f"{participant:<6} {role:<22} {count:<6} {preview}")

# --- Summary: shortest, longest, and typical length -----------------------------
# These three numbers help us compare responses at a glance without re-reading
# every row in the table above.
print()
print("── Summary ─────────────────────────────────")
print(f"  Total responses : {len(word_counts)}")
print(f"  Shortest        : {min(word_counts)} words")
print(f"  Longest         : {max(word_counts)} words")
print(f"  Average         : {sum(word_counts) / len(word_counts):.1f} words")
