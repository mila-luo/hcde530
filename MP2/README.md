# ResearchFlow

ResearchFlow is a web-based UX research assistant that helps researchers prepare for interviews, stay focused during sessions, and synthesize findings into an editable affinity map — without spending hours on manual note coding.

## What it does

1. **Setup** — Enter a research topic and optional starter questions. The tool generates 6–8 motivation-focused follow-up questions using Claude AI.
2. **Interview** — Run your session with generated questions on the left and a live notes panel on the right. A session timer tracks elapsed time. Notes auto-save to your browser.
3. **Affinity Board** — After the session, paste your notes or upload an audio file. The tool transcribes the audio (via OpenAI Whisper) and clusters findings into themed sticky notes using Claude. You can edit theme labels inline, delete themes, and add new ones manually.

## Who it's for

UX researchers and design students who conduct qualitative interviews and need to move from raw session data to structured themes quickly — without relying on manual affinity mapping or bothering their networks for repeat participation.

## How to run it

### Prerequisites
- Node.js (v18+)
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- An OpenAI API key ([platform.openai.com](https://platform.openai.com)) for audio transcription

### Setup
```bash
git clone https://github.com/[your-username]/MP2.git
cd MP2
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Live URL
[Add your deployment URL here after deploying to Vercel]

## Tech stack
- React + Vite
- Tailwind CSS
- Anthropic Claude API (question generation + theme clustering)
- OpenAI Whisper API (audio transcription)
