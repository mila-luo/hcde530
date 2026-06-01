# MP2 Competency Claims

## 1. Specification Engineering
I wrote a structured `.cursorrules` file before writing any code that defined the project scope, file structure, component responsibilities, API integration rules, prompt templates, and explicit constraints (no auth, no database, no live recording). This file served as the working spec for every Cursor prompt throughout the build. The declaration went through multiple revision cycles based on instructor feedback, each time sharpening the problem statement, platform rationale, and interaction model. The three-page app (Setup → Interview → Affinity Board) was fully scoped before a single component was written.

## 2. Prompt Engineering
I designed two AI prompt chains with structured JSON outputs:
- A **question generation prompt** that takes a topic and starter questions and returns 8 motivation-focused follow-up questions targeting the "why" behind participant behaviors — not yes/no questions, not surface-level
- A **theme clustering prompt** that takes raw interview notes and returns a structured array of theme objects with labels, supporting quotes, and color assignments

Both prompts explicitly instruct the model to return only valid JSON with no markdown or explanation, and both include a cleanup step (`replace(/```json|```/g, '')`) to handle model variance. The quality of generated questions — specific, motivation-focused, contextually relevant to the research topic — reflects deliberate prompt iteration.

## 3. AI Integration
I integrated an external AI API (OpenRouter, routing to free models) into a React frontend through a single utility file (`src/lib/claude.js`). The integration handles two distinct use cases from one shared `callAI()` function. All API calls include loading states, error boundaries, and try/catch handling. The API key is managed via environment variables (`VITE_OPENROUTER_API_KEY`) and never exposed in client code. I debugged multiple model availability and rate limit issues, iterating through model IDs until finding a stable free-tier option.

## 4. Interface Design
I designed the tool in Figma as mid-fidelity wireframes before writing any code, defining layout, information hierarchy, and interaction model for all three views. The Cursor build followed the Figma spec directly. The affinity board includes inline editing of both theme labels and quotes, deletion, and manual addition — making the AI output a starting point for researcher judgment, not a fixed result. The two-panel Interview layout, session timer, and localStorage persistence for notes all reflect deliberate interaction design decisions.

## 5. HCD Problem Framing
The tool addresses a real pain point: the time and social cost of manual affinity mapping after qualitative interviews. Every scope decision was grounded in research workflow reality — typed notes over live recording (reliability), file upload over in-browser capture (complexity), single session over multi-participant comparison (feasibility). The affinity board's edit/delete/add interactions reflect the HCD principle that AI output should support human judgment, not replace it.
