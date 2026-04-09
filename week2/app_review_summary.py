import csv

# --- Load data: app reviews from CSV ------------------------------------------------
filename = "app_reviews.csv"
reviews = []

with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        reviews.append(row)


# --- Helper: word count for one review ----------------------------------------------
def count_words(text):
    """Return number of words (split on whitespace) in a string."""
    return len(text.split())


# --- Build list of word counts (same order as rows) ---------------------------------
word_counts = []
for row in reviews:
    text = row["review_text"]
    word_counts.append(count_words(text))

# --- Summary: shortest, longest, average (by word count) ------------------------------
shortest = min(word_counts)
longest = max(word_counts)
average = sum(word_counts) / len(word_counts)

print("App reviews — response length (words)")
print("-" * 45)
print(f"  Number of reviews : {len(word_counts)}")
print(f"  Shortest review   : {shortest} words")
print(f"  Longest review    : {longest} words")
print(f"  Average length    : {average:.1f} words")
print()

# --- Optional: per-review table (id, app, words) ------------------------------------
print(f"{'ID':<4} {'App':<12} {'Words':<6} Review (first 50 chars)")
print("-" * 75)
for row, n in zip(reviews, word_counts):
    rid = row["review_id"]
    app = row["app_name"]
    preview = row["review_text"]
    if len(preview) > 50:
        preview = preview[:50] + "..."
    print(f"{rid:<4} {app:<12} {n:<6} {preview}")
