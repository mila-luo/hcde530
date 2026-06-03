# ResearchFlow

ResearchFlow is a web-based UX research assistant that helps researchers prepare for interviews, stay focused during sessions, and synthesize findings into an editable affinity map — without spending hours on manual note coding.

## What it does

**01 — Setup**
Enter a research topic and optional starter questions. ResearchFlow generates 8 motivation-focused follow-up questions using AI, designed to uncover the "why" behind participant behaviors rather than surface-level responses.

**02 — Interview**
Run your session with AI-generated questions on the left and a live notes panel on the right. A session timer tracks elapsed time. Notes auto-save to your browser so nothing is lost.

**03 — Affinity Board**
After the session, paste your notes or type them in. The tool clusters your findings into themed sticky notes using AI. You can edit theme labels inline, delete themes that don't hold up, and add new ones manually.

## Who it's for

UX researchers and design students who conduct qualitative interviews and need to move from raw session data to structured themes quickly — without manual affinity mapping or relying on the same small network of contacts for every study.

## Live URL

[https://uxresearchagent.vercel.app/](https://uxresearchagent.vercel.app/)

## GitHub Repo

[https://github.com/mila-luo/hcde530](https://github.com/mila-luo/hcde530)

## How to run it locally

### Prerequisites

- Node.js (v18+)
- An OpenRouter API key ([openrouter.ai](https://openrouter.ai)) — free, no credit card required

### Setup

```bash
git clone https://github.com/mila-luo/hcde530.git
cd hcde530/MP2
npm install
cp .env.example .env
# Add your OpenRouter API key to .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech stack

- React + Vite
- Tailwind CSS
- OpenRouter API (free tier) → routes to best available free model
- Designed in Figma (mid-fidelity wireframes) before implementation

