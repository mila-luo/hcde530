import { buildThemeClusteringPrompt } from './prompts.js'

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

async function callAI(prompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'ResearchFlow',
    },
    body: JSON.stringify({
      model: 'openrouter/auto',
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await response.json()
  console.log('OpenRouter response:', JSON.stringify(data, null, 2))
  const text = data.choices[0].message.content
  return text.replace(/```json|```/g, '').trim()
}

export async function generateQuestions(topic, starterQuestions) {
  const prompt = `You are a UX research expert. Generate 8 follow-up interview questions that uncover participant motivations and the "why" behind behaviors. Avoid yes/no questions. Return ONLY a valid JSON array of 8 strings, no markdown, no explanation. Topic: "${topic}". Starter questions: "${starterQuestions}"`
  const text = await callAI(prompt)
  return JSON.parse(text)
}

export async function generateThemes(notes) {
  const text = await callAI(buildThemeClusteringPrompt(notes))
  return JSON.parse(text)
}
