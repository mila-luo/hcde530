# MP2 Competency Claims

## Specification Engineering
I wrote a structured `.cursorrules` file before writing any code that defined the project scope, file structure, component responsibilities, API integration rules, prompt templates, and explicit constraints (no auth, no database, no live recording). This file served as the working spec for every Cursor prompt I wrote throughout the build. The declaration went through multiple revision cycles based on instructor feedback, each time sharpening the problem statement, platform rationale, and interaction model.

## Prompt Engineering
I designed two Claude prompt chains with structured JSON outputs:
- A question generation prompt that takes a topic and starter questions and returns motivation-focused follow-up questions targeting the "why" behind participant behaviors
- A theme clustering prompt that takes raw notes or a transcript and returns a structured array of theme objects with labels, supporting quotes, and color assignments

Both prompts were iterated on with real examples before being wired into the interface.

## AI Integration
I integrated two external AI APIs into a React frontend:
- Anthropic Claude API for question generation and affinity theme clustering
- OpenAI Whisper API for audio file transcription

All API calls are routed through dedicated utility files (`lib/claude.js`, `lib/whisper.js`) with loading, error, and empty state handling on every call.

## Interface Design
I designed the tool in Figma as mid-fidelity wireframes before writing any code, defining the layout, information hierarchy, and interaction model for all three views. The affinity board includes inline editing, deletion, and manual addition of themes — making the AI output a starting point, not a fixed output.

## HCD Problem Framing
The tool is grounded in a real UX research pain point I experience: the manual, time-consuming process of affinity mapping after qualitative interviews. The scope decisions (typed notes over live recording, upload audio over in-browser capture, single session over multi-participant comparison) were all driven by feasibility within the two-week build window while keeping the core research workflow intact.
