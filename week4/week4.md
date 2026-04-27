# Week 4 — Web API & human-centered data

## A. Competency claim

I can integrate a **real web API in Python** end to end: I build the request URL with query parameters, send an HTTPS GET with the standard library (`urllib`), and handle the response safely (including SSL context when needed). I **load my API key from a `.env` file** using `python-dotenv`, resolve the path next to the script so the program works from different working directories, and keep secrets out of version control. I **parse JSON** from the response body with `json.loads` and treat the result as nested Python structures. I can **extract specific fields from nested data**—for example walking `data["list"]`, then for each forecast step reading top-level keys like `dt_txt`, nested objects such as `main` for `temp`, `feels_like`, and `humidity`, and the first element of the `weather` array for a human-readable `description`—so downstream code (like printing a table) only sees the slice of the payload that matters.

Before I wrote `weather_forecast.py`, I read OpenWeather’s official **5 Day / 3 Hour Forecast** documentation at [https://openweathermap.org/forecast5](https://openweathermap.org/forecast5) to confirm the `https://api.openweathermap.org/data/2.5/forecast` endpoint, which query parameters are required or optional (`q`, `appid`, `units`, and others listed there), and how the JSON response is laid out—especially the `list` array of forecast objects and the nested `main` and `weather` structures—so my URL, parsing, and field choices aligned with the published contract instead of guesswork.

---

## B. HCD reflection

### Why OpenWeatherMap’s 5-day forecast API

I chose the **OpenWeatherMap 5-day / 3-hour forecast** endpoint because it returns **structured, time-stamped forecasts** over a horizon people actually use when planning—not a single snapshot, but a sequence of steps. That matches how people think about weather (“this afternoon,” “tomorrow morning,” “over the weekend”) instead of one abstract number. The API is **documented**, widely used, and **free-tier friendly** for learning, which lowers friction while still behaving like production integrations. For human-centered design work, having **real nested JSON** (metadata plus a `list` of moments) is a realistic analogue to consumer products: messy, hierarchical, and requiring clear decisions about what to show users and what to hide.

### Why these five fields matter for human-centered design

- **Date and time (`dt_txt`)** — People anchor decisions in **when** something applies. Without an explicit, readable time, numbers float without context and erode **trust** and **accessibility** (especially across time zones or for screen-reader users who need a coherent sentence of meaning).

- **Temperature** — This is the headline metric many people expect; it supports **quick scanning** and comparison across intervals. It is also a baseline for any UI that charts or summarizes “how hot or cold” it will be.

- **Feels-like temperature** — Air temperature alone often **mismatches lived experience** (wind, humidity). Showing feels-like supports **inclusive, body-centered** framing: commuting on foot, dressing children, outdoor work, or health sensitivity. That is a small example of designing for **actual human sensation**, not only raw sensor-style data.

- **Weather description** — Short natural-language phrases (“light rain,” “clear sky”) support **recognition over recall**: users grasp conditions faster than from codes or icons alone, and copy can be adapted for **plain language** and localization—core HCD concerns.

- **Humidity** — Humidity affects **comfort, activity choices, and some health contexts** (e.g. respiratory comfort). Including it reminds us that **useful dashboards combine a few complementary dimensions** instead of overloading people with every field the API returns—an intentional slice of nested data is itself a design act.

### How this connects to my practice (B2C UX)

I mainly work on **business-to-consumer** experiences, where expectations are set by everyday apps: fast answers, honest labeling, and data that maps to **decisions** (go / stay / dress / reschedule), not raw feeds. This exercise mirrors the collaboration between design and engineering: agreeing which fields support **clarity, trust, and task completion**, then implementing extraction and presentation with **security** (keys in `.env`) and **maintainability** (clear parsing boundaries) in mind.

---

## C. Personal design context (from interview)

This write-up supports my **HCDE 530** course work: I need to show I can work with real data pipelines in a disciplined way, not only sketches or research notes. I also picture **professional scenarios** where the same habits matter: **processing large volumes of reviews or files**, **building or evaluating models** that turn messy text or logs into insight, and **calling APIs** to enrich or validate what we have in-house. In those situations, the pattern from this week—**authenticate safely, fetch structured data, parse JSON, and deliberately select fields**—scales from a weather table to review sentiment, moderation queues, or feature stores. The weather exercise is a controlled rehearsal for “nested payload → human-meaningful slice,” which is the same design move I would make when deciding **which model outputs or API fields** end users or internal teams should actually see.

For the term project, I am **leaning toward user reviews** as the main kind of data—not final yet, but that direction fits how I already think about B2C experiences: star ratings, free text, votes, timestamps, and product metadata often arrive as **nested or joined fields** where designers and analysts must choose what to surface so people can compare products or spot issues without drowning in raw text.

I do **not have a ranked list of constraints yet** (e.g. public-only data vs. licensed APIs, PII, language coverage, calendar pressure). Once I commit to a **specific review source and workflow**, I expect the real constraints—terms of use, ethics, and what it is safe to store or display—to become obvious; until then I am keeping the door open rather than pretending I have already optimized for one bottleneck.
