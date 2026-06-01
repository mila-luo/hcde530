import { useEffect, useState } from 'react'
import { useTimer } from '../hooks/useTimer.js'
import { GENERATED_QUESTIONS } from '../lib/questions.js'

const NOTES_STORAGE_KEY = 'mp2_session_notes'
const QUESTIONS_STORAGE_KEY = 'mp2_generated_questions'

function loadQuestions() {
  try {
    const stored = localStorage.getItem(QUESTIONS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // fall back to defaults
  }

  return GENERATED_QUESTIONS
}

export default function Interview({ onNavigate }) {
  const { formatted, isRunning, togglePause, reset } = useTimer({ autoStart: true })
  const [questions] = useState(loadQuestions)
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(NOTES_STORAGE_KEY) ?? ''
  })

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, notes)
  }, [notes])

  const hasNotes = notes.trim().length > 0

  return (
    <div className="flex h-screen flex-col bg-[#F5F4F0]">
      <header className="flex flex-row items-center justify-between px-8 py-4">
        <div>
          <p className="font-mono text-sm text-gray-400">02 — Interview</p>
          <h1 className="font-mono text-xl font-bold text-gray-800">
            Active Session
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-3xl text-gray-800">{formatted}</span>

          <button
            type="button"
            onClick={togglePause}
            aria-label={isRunning ? 'Pause timer' : 'Resume timer'}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
          >
            {isRunning ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={reset}
            aria-label="Reset timer"
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 border-t border-gray-200">
        <section className="w-[40%] overflow-y-auto border-r border-gray-200 px-8 py-6">
          <h2 className="mb-4 font-mono text-lg font-bold text-gray-800">
            Interview Questions
          </h2>

          <ul>
            {questions.map((question, index) => (
              <li
                key={question}
                className="flex gap-4 border-b border-gray-200 py-3"
              >
                <span className="shrink-0 font-mono text-sm text-gray-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-gray-800">{question}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex w-[60%] flex-col px-8 py-6">
          <h2 className="font-mono text-lg font-bold text-gray-800">
            Session Notes
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Capture observations, quotes, and insights from the interview
          </p>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={`Start typing your notes here...\n\nExample format:\n• Quote: "I wasn't sure if the seller was legit"\n• Observation: Hesitated at checkout`}
            className="mt-4 min-h-0 flex-1 resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />
        </section>
      </div>

      <button
        type="button"
        disabled={!hasNotes}
        onClick={() => onNavigate('affinity')}
        className="w-full bg-[#4A5568] py-4 text-white transition-colors enabled:hover:bg-[#3d4654] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Finish Interview & Generate Themes →
      </button>
    </div>
  )
}
