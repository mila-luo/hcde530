import { useState } from 'react'
import { generateQuestions } from '../lib/claude.js'
import { getGoogleColor } from '../lib/themes.js'

const QUESTIONS_STORAGE_KEY = 'mp2_generated_questions'

function LoadingDots() {
  return (
    <span
      style={{
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'white',
            animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  )
}

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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 pt-12">
        <header className="mb-8">
          <p className="text-sm font-medium text-[#4285F4]">01 — Setup</p>
          <h1 className="mt-2 text-4xl font-semibold text-[#202124]">
            Research Setup
          </h1>
          <p className="mt-3 text-gray-600">
            Define your research topic and generate interview questions
          </p>
        </header>

        <div className="card p-8">
          <label
            htmlFor="research-topic"
            className="mb-2 block font-semibold text-[#202124]"
          >
            Research Topic
          </label>
          <input
            id="research-topic"
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Exploring user friction in TikTok Shop"
            className="input-field mb-6"
          />

          <label
            htmlFor="starter-questions"
            className="mb-2 block font-semibold text-[#202124]"
          >
            Starter Questions{' '}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="starter-questions"
            rows={4}
            value={starterQuestions}
            onChange={(event) => setStarterQuestions(event.target.value)}
            className="input-field mb-6 resize-none"
          />

          {error && <p className="mb-4 text-sm text-[#EA4335]">{error}</p>}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <LoadingDots />
            ) : (
              '✦ Generate Interview Goal and Follow-up Questions'
            )}
          </button>
        </div>

        {showQuestions && questions.length > 0 && (
          <div className="card fade-up mt-6 p-8">
            <h2 className="mb-6 text-xl font-semibold text-[#202124]">
              Generated Questions
            </h2>

            <ul className="space-y-0">
              {questions.map((question, index) => (
                <li
                  key={`${index}-${question}`}
                  className="flex gap-4 border-b border-[#E0E0E0] py-4 pl-4 first:pt-0 last:border-b-0 last:pb-0"
                  style={{ borderLeft: `3px solid ${getGoogleColor(index)}` }}
                >
                  <span className="shrink-0 text-sm font-medium text-gray-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[#202124]">{question}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => onNavigate('interview')}
              className="btn-primary mt-8 w-full"
            >
              Start Interview →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
