# MP1 Competency Claim

## C3 — Data Cleaning and File Handling
I accessed data programmatically through the Spoonacular API, handled authentication securely using a `.env` file, and saved the results as a structured CSV. During analysis I identified and handled missing values in `prep_minutes`, `cook_minutes`, and `ingredients` columns — documenting what was missing and why it limited certain analyses.

## C5 — Data Analysis with Pandas
I used pandas to answer three specific analytical questions about 100 healthy bread recipes: groupby to compare health scores across fast vs. slow recipes, filtering and sorting to rank recipes by sugar content, and a calculated column (carb-to-fiber ratio) to apply a nutritional standard from outside the dataset. Each result includes a plain-English interpretation of what it means about bread, not just what the code did.

## C6 — Data Visualization
I created a horizontal bar chart using Plotly Express showing sugar content across the lowest-sugar recipes in the dataset. I chose the chart type deliberately — horizontal bars make recipe names readable — and wrote the title as a finding rather than a label. The color scale encodes the data a second way so the pattern is visible at a glance.

## C7 — Critical Evaluation and Professional Judgment
I identified a meaningful gap between the API's health score and measurable nutritional standards like the carb-to-fiber ratio. The conclusions section explains what the analysis cannot conclude — that the findings describe Spoonacular's categorization rather than objective nutrition — and identifies what additional data (ingredient-level detail) would be needed to go further. This kind of limitation acknowledgment is what separates analysis from advocacy.
