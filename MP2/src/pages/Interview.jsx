import { useEffect, useState } from 'react'
import NavWordmark from '../components/NavWordmark.jsx'
import { useTimer } from '../hooks/useTimer.js'
import { GENERATED_QUESTIONS } from '../lib/questions.js'
import { getGoogleColor } from '../lib/themes.js'

const NOTES_STORAGE_KEY = 'mp2_session_notes'
const QUESTIONS_STORAGE_KEY = 'mp2_generated_questions'
const AUDIO_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/m4a']

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

function isAudioFile(file) {
  if (AUDIO_TYPES.includes(file.type)) {
    return true
  }

  return /\.(mp3|m4a)$/i.test(file.name)
}

function QuestionBadge({ index }) {
  const color = getGoogleColor(index)

  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {index + 1}
    </span>
  )
}

export default function Interview({ onNavigate }) {
  const { formatted, isRunning, togglePause, reset } = useTimer({ autoStart: true })
  const [questions] = useState(loadQuestions)
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(NOTES_STORAGE_KEY) ?? ''
  })
  const [isDragging, setIsDragging] = useState(false)
  const [droppedFileName, setDroppedFileName] = useState('')

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, notes)
  }, [notes])

  const hasNotes = notes.trim().length > 0

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file && isAudioFile(file)) {
      setDroppedFileName(file.name)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="border-b border-[#E0E0E0] px-8 py-3">
        <NavWordmark onNavigate={onNavigate} />
      </div>

      <header className="flex flex-row items-center justify-between px-8 py-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('setup')}
            className="btn-ghost mb-2"
          >
            ← Back to Setup
          </button>
          <p className="text-sm font-medium text-[#4285F4]">02 — Interview</p>
          <h1 className="text-xl font-semibold text-[#202124]">Active Session</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl font-semibold text-[#4285F4]">{formatted}</span>

          <button
            type="button"
            onClick={togglePause}
            aria-label={isRunning ? 'Pause timer' : 'Resume timer'}
            className="rounded-full p-2 text-[#4285F4] transition-all hover:bg-[#E8F0FE]"
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
            className="rounded-full p-2 text-[#4285F4] transition-all hover:bg-[#E8F0FE]"
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

      <div className="flex min-h-0 flex-1 border-t border-[#E0E0E0]">
        <section className="w-[40%] overflow-y-auto border-r border-[#E0E0E0] px-8 py-6">
          <h2 className="mb-4 text-lg font-semibold text-[#202124]">
            Interview Questions
          </h2>

          <ul className="space-y-1">
            {questions.map((question, index) => (
              <li
                key={question}
                className="flex items-start gap-3 border-b border-[#E0E0E0] py-4"
              >
                <QuestionBadge index={index} />
                <span className="pt-1 text-[#202124]">{question}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex w-[60%] flex-col px-8 py-6">
          <h2 className="text-lg font-semibold text-[#202124]">Session Notes</h2>
          <p className="mt-1 text-sm text-gray-600">
            Capture observations, quotes, and insights from the interview
          </p>

          <p className="mt-4 text-sm text-gray-600">
            Type anything — raw observations, direct quotes, or messy notes. The
            AI will organize it.
          </p>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={`Start typing your notes here...\n\nExample format:\n• Quote: "I wasn't sure if the seller was legit"\n• Observation: Hesitated at checkout`}
            className="input-field mt-3 min-h-0 flex-1 resize-none"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-3 rounded-2xl border-2 border-dashed px-4 py-3 text-sm text-gray-500 transition-colors ${
              isDragging
                ? 'border-[#4285F4] bg-[#E8F0FE]'
                : 'border-[#E0E0E0] bg-transparent'
            }`}
          >
            <p>
              You can also drag and drop an audio recording (.mp3, .m4a) here to
              transcribe it automatically.
            </p>
            {droppedFileName && (
              <div className="mt-2 text-[#202124]">
                <p className="font-medium">{droppedFileName}</p>
                <p className="mt-1 text-gray-500">
                  Audio transcription coming soon — paste notes manually for now
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <button
        type="button"
        disabled={!hasNotes}
        onClick={() => onNavigate('affinity', { fromInterview: true })}
        className="btn-primary w-full rounded-none py-4 disabled:opacity-40"
      >
        Finish Interview & Generate Themes →
      </button>
    </div>
  )
}
