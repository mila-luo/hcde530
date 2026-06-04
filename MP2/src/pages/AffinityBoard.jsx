import { useCallback, useEffect, useRef, useState } from 'react'
import StickyNote from '../components/StickyNote.jsx'
import { useAffinity } from '../hooks/useAffinity.js'
import { generateThemes } from '../lib/claude.js'
import { applyThemeRanking } from '../lib/themes.js'

const NOTES_STORAGE_KEY = 'mp2_session_notes'

const GOOGLE_LOADING_COLORS = ['#4285F4', '#EA4335', '#FBBC05']

function OrganizingLoader() {
  return (
    <div className="card flex flex-col items-center justify-center p-16 text-center">
      <span
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {GOOGLE_LOADING_COLORS.map((color, i) => (
          <span
            key={color}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: color,
              animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </span>
      <p className="mt-6 text-gray-500">Organizing your insights...</p>
    </div>
  )
}

export default function AffinityBoard({ onNavigate, freshSession = false }) {
  const {
    themes,
    addTheme,
    deleteTheme,
    updateThemeLabel,
    updateThemeQuote,
    replaceThemes,
    clearThemes,
  } = useAffinity()
  const [inputMode, setInputMode] = useState('paste')
  const [pastedNotes, setPastedNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const boardRef = useRef(null)
  const autoGenerateStarted = useRef(false)

  const [autoFlow] = useState(
    () =>
      freshSession &&
      Boolean((localStorage.getItem(NOTES_STORAGE_KEY) || '').trim()),
  )

  const runGenerateThemes = useCallback(
    async (notes) => {
      if (!notes.trim()) {
        setError('Please type notes or complete an interview session first.')
        return false
      }

      setLoading(true)
      setError(null)

      try {
        const result = await generateThemes(notes)
        replaceThemes(result)
        return true
      } catch (err) {
        console.error('Generate themes error:', err)
        setError('Failed to generate themes. Please try again.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [replaceThemes],
  )

  const handleGenerateThemes = async () => {
    const sessionNotes = localStorage.getItem(NOTES_STORAGE_KEY) || ''
    const notes = inputMode === 'paste' ? pastedNotes : sessionNotes
    await runGenerateThemes(notes)
  }

  useEffect(() => {
    if (!freshSession || autoGenerateStarted.current) {
      return
    }

    autoGenerateStarted.current = true
    clearThemes()

    const notes = localStorage.getItem(NOTES_STORAGE_KEY) || ''
    if (notes.trim()) {
      runGenerateThemes(notes)
    }
  }, [freshSession, clearThemes, runGenerateThemes])

  useEffect(() => {
    if (autoFlow && themes.length > 0) {
      boardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [autoFlow, themes.length])

  const handleNewSession = () => {
    clearThemes()
    localStorage.removeItem(NOTES_STORAGE_KEY)
    onNavigate('setup')
  }

  const sortedThemes = applyThemeRanking(themes)
  const showInputCard = !autoFlow
  const showAutoLoader = autoFlow && loading

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-8 pt-12">
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('interview')}
            className="btn-ghost"
          >
            ← Back to Interview
          </button>
          <button type="button" onClick={handleNewSession} className="btn-ghost">
            Start New Session
          </button>
        </div>

        <header className="mb-8">
          <p className="text-sm font-medium text-[#4285F4]">03 — Affinity Board</p>
          <h1 className="mt-2 text-4xl font-semibold text-[#202124]">
            Theme Analysis
          </h1>
          <p className="mt-3 text-gray-600">
            Generate and organize research themes from your interview data
          </p>
        </header>

        {showAutoLoader && <OrganizingLoader />}

        {showInputCard && !loading && (
          <div className="card p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-semibold text-[#202124]">Input Source</span>

              <div className="flex rounded-full bg-[#F1F3F4] p-1">
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${
                    inputMode === 'paste'
                      ? 'bg-white text-[#202124] shadow-sm'
                      : 'bg-transparent text-gray-600'
                  }`}
                >
                  📄 Paste Notes
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('session')}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${
                    inputMode === 'session'
                      ? 'bg-white text-[#202124] shadow-sm'
                      : 'bg-transparent text-gray-600'
                  }`}
                >
                  ⬆ Upload Audio
                </button>
              </div>
            </div>

            {inputMode === 'paste' && (
              <textarea
                value={pastedNotes}
                onChange={(event) => setPastedNotes(event.target.value)}
                placeholder="Paste your interview notes here..."
                rows={6}
                className="input-field mb-6 resize-none"
              />
            )}

            {error && <p className="mb-4 text-sm text-[#EA4335]">{error}</p>}

            <button
              type="button"
              onClick={handleGenerateThemes}
              disabled={loading}
              className="btn-primary w-full"
            >
              ✦ Generate Themes
            </button>
          </div>
        )}

        {showInputCard && loading && <OrganizingLoader />}

        {!showInputCard && error && (
          <p className="mb-4 text-sm text-[#EA4335]">{error}</p>
        )}

        <div ref={boardRef} className="mt-8 grid grid-cols-3 gap-4">
          {sortedThemes.map((theme, index) => (
            <StickyNote
              key={theme.id}
              theme={theme}
              animationDelay={index * 0.1}
              className={index === 0 ? 'col-span-2' : ''}
              onDelete={deleteTheme}
              onUpdateLabel={updateThemeLabel}
              onUpdateQuote={updateThemeQuote}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addTheme}
          className="btn-primary mt-8 inline-flex items-center gap-2"
        >
          <span aria-hidden="true">+</span>
          Add Theme
        </button>
      </div>
    </div>
  )
}
