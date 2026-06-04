import { useRef, useState } from 'react'
import NavWordmark from '../components/NavWordmark.jsx'
import { generateQuestions } from '../lib/claude.js'
import { getGoogleColor } from '../lib/themes.js'

const QUESTIONS_STORAGE_KEY = 'mp2_generated_questions'

const HOW_IT_WORKS = [
  {
    emoji: '🎯',
    title: 'Generate Questions',
    description:
      'Enter your topic and get motivation-focused interview questions instantly',
  },
  {
    emoji: '📝',
    title: 'Run Your Interview',
    description: 'Use your questions as a guide while taking live session notes',
  },
  {
    emoji: '🗺️',
    title: 'Map Your Themes',
    description: 'AI clusters your notes into an editable affinity map automatically',
  },
]

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

function QuestionRow({ index, children }) {
  return (
    <li
      className="flex items-center gap-4 border-b border-[#E0E0E0] py-4 pl-4 last:border-b-0"
      style={{ borderLeft: `3px solid ${getGoogleColor(index)}` }}
    >
      <span className="shrink-0 text-sm font-medium text-gray-400">
        {String(index + 1).padStart(2, '0')}
      </span>
      {children}
    </li>
  )
}

export default function Setup({ onNavigate }) {
  const setupRef = useRef(null)
  const [topic, setTopic] = useState('')
  const [starterQuestions, setStarterQuestions] = useState('')
  const [questions, setQuestions] = useState([])
  const [manualQuestions, setManualQuestions] = useState([])
  const [showQuestions, setShowQuestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await generateQuestions(topic, starterQuestions)
      setQuestions(result)
      setShowQuestions(true)
    } catch {
      setError('Failed to generate questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const scrollToSetup = () => {
    setupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const addManualQuestion = () => {
    setManualQuestions((current) => [
      ...current,
      { id: crypto.randomUUID(), text: '' },
    ])
  }

  const updateManualQuestion = (id, text) => {
    setManualQuestions((current) =>
      current.map((item) => (item.id === id ? { ...item, text } : item)),
    )
  }

  const removeManualQuestion = (id) => {
    setManualQuestions((current) => current.filter((item) => item.id !== id))
  }

  const handleStartInterview = () => {
    const manualTexts = manualQuestions
      .map((item) => item.text.trim())
      .filter(Boolean)

    const allQuestions = [...questions, ...manualTexts]
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(allQuestions))
    onNavigate('interview')
  }

  const leftQuestions = questions.slice(0, 4)
  const rightQuestions = questions.slice(4, 8)

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <NavWordmark onNavigate={onNavigate} />

        <section className="pb-10 pt-10 text-center">
          <h1 className="text-3xl font-bold text-[#4285F4]">✦ ResearchFlow</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-gray-600">
            From conversation to clarity — AI-powered interview research
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.title} className="card p-6 text-left">
                <span className="text-2xl" aria-hidden="true">
                  {step.emoji}
                </span>
                <h2 className="mt-3 font-semibold text-[#202124]">{step.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollToSetup}
            className="btn-primary mt-8"
          >
            Start a Session →
          </button>
        </section>

        <div ref={setupRef} className="mx-auto max-w-4xl scroll-mt-6 pb-12">
          <header className="mb-8">
            <p className="text-sm font-medium text-[#4285F4]">01 — Setup</p>
            <h2 className="mt-2 text-4xl font-semibold text-[#202124]">
              Research Setup
            </h2>
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

              <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                <ul>
                  {leftQuestions.map((question, columnIndex) => (
                    <QuestionRow key={`left-${columnIndex}`} index={columnIndex}>
                      <span className="text-[#202124]">{question}</span>
                    </QuestionRow>
                  ))}
                </ul>
                <ul>
                  {rightQuestions.map((question, columnIndex) => (
                    <QuestionRow
                      key={`right-${columnIndex}`}
                      index={columnIndex + 4}
                    >
                      <span className="text-[#202124]">{question}</span>
                    </QuestionRow>
                  ))}
                </ul>
              </div>

              {manualQuestions.length > 0 && (
                <ul className="mt-4 border-t border-[#E0E0E0] pt-4">
                  {manualQuestions.map((item, index) => {
                    const questionIndex = questions.length + index

                    return (
                      <QuestionRow key={item.id} index={questionIndex}>
                        <input
                          type="text"
                          value={item.text}
                          onChange={(event) =>
                            updateManualQuestion(item.id, event.target.value)
                          }
                          placeholder="Type your question..."
                          className="input-field min-w-0 flex-1 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => removeManualQuestion(item.id)}
                          aria-label="Remove question"
                          className="shrink-0 rounded-full px-2 text-xl leading-none text-gray-400 transition-colors hover:text-[#EA4335]"
                        >
                          ×
                        </button>
                      </QuestionRow>
                    )
                  })}
                </ul>
              )}

              <button
                type="button"
                onClick={addManualQuestion}
                className="btn-ghost mt-6"
              >
                + Add Question
              </button>

              <button
                type="button"
                onClick={handleStartInterview}
                className="btn-primary mt-6 w-full"
              >
                Start Interview →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
