import { useState } from 'react'
import { generateQuestions } from '../lib/claude.js'

const QUESTIONS_STORAGE_KEY = 'mp2_generated_questions'

export default function Setup({ onNavigate }) {
  const [topic, setTopic] = useState('')
  const [starterQuestions, setStarterQuestions] = useState('')
  const [questions, setQuestions] = useState([])
  const [showQuestions, setShowQuestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await generateQuestions(topic, starterQuestions)
      setQuestions(result)
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(result))
      setShowQuestions(true)
    } catch {
      setError('Failed to generate questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <div className="mx-auto max-w-2xl px-6 pt-12">
        <header className="mb-8">
          <p className="font-mono text-sm text-gray-400">01 — Setup</p>
          <h1 className="mt-2 font-mono text-4xl font-normal text-gray-800">
            Research Setup
          </h1>
          <p className="mt-3 text-gray-600">
            Define your research topic and generate interview questions
          </p>
        </header>

        <div className="rounded-xl bg-white p-8 shadow-sm">
          <label
            htmlFor="research-topic"
            className="mb-2 block font-bold text-gray-800"
          >
            Research Topic
          </label>
          <input
            id="research-topic"
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Exploring user friction in TikTok Shop"
            className="mb-6 w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />

          <label
            htmlFor="starter-questions"
            className="mb-2 block font-bold text-gray-800"
          >
            Starter Questions{' '}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="starter-questions"
            rows={4}
            value={starterQuestions}
            onChange={(event) => setStarterQuestions(event.target.value)}
            className="mb-6 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />

          {error && (
            <p className="mb-4 text-sm text-red-600">{error}</p>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-lg bg-[#4A5568] py-3 text-white transition-colors hover:bg-[#3d4654] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Generating...'
              : '✦ Generate Interview Goal and Follow-up Questions'}
          </button>
        </div>

        {showQuestions && questions.length > 0 && (
          <div className="mt-6 rounded-xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-mono text-xl font-normal text-gray-800">
              Generated Questions
            </h2>

            <ul className="divide-y divide-gray-200">
              {questions.map((question, index) => (
                <li
                  key={`${index}-${question}`}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="shrink-0 font-mono text-sm text-gray-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-gray-800">{question}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => onNavigate('interview')}
              className="mt-8 w-full rounded-lg bg-[#4A5568] py-3 text-white transition-colors hover:bg-[#3d4654]"
            >
              Start Interview →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
