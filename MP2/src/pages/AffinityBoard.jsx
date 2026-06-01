import { useEffect, useState } from 'react'
import StickyNote from '../components/StickyNote.jsx'
import { useAffinity } from '../hooks/useAffinity.js'
import { generateThemes } from '../lib/claude.js'
import { applyThemeRanking } from '../lib/themes.js'

const NOTES_STORAGE_KEY = 'mp2_session_notes'

const ghostButtonClass =
  'rounded-lg border border-gray-300 bg-transparent px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-white'

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

  useEffect(() => {
    console.log('themes state changed:', themes)
  }, [themes])

  const sortedThemes = applyThemeRanking(themes)

  const handleGenerateThemes = async () => {
    setLoading(true)
    setError(null)

    const sessionNotes = localStorage.getItem('mp2_session_notes') || ''
    const notes =
      inputMode === 'paste' ? pastedNotes : sessionNotes

    if (!notes.trim()) {
      setError('Please type notes or complete an interview session first.')
      setLoading(false)
      return
    }

    try {
      console.log('Notes from localStorage:', sessionNotes)
      console.log('Notes used for generation:', notes)
      const result = await generateThemes(notes)
      console.log('Result from generateThemes:', result)
      console.log('Is array?', Array.isArray(result))
      replaceThemes(result)
      console.log('replaceThemes called')
    } catch (err) {
      console.error('Generate themes error:', err)
      setError('Failed to generate themes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewSession = () => {
    clearThemes()
    localStorage.removeItem(NOTES_STORAGE_KEY)
    onNavigate('setup')
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <div className="mx-auto max-w-5xl px-8 pt-12">
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('interview')}
            className={ghostButtonClass}
          >
            ← Back to Interview
          </button>
          <button
            type="button"
            onClick={handleNewSession}
            className={ghostButtonClass}
          >
            Start New Session
          </button>
        </div>

        <header className="mb-8">
          <p className="font-mono text-sm text-gray-400">03 — Affinity Board</p>
          <h1 className="mt-2 font-mono text-4xl font-normal text-gray-800">
            Theme Analysis
          </h1>
          <p className="mt-3 text-gray-600">
            Generate and organize research themes from your interview data
          </p>
        </header>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-bold text-gray-800">Input Source</span>

            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setInputMode('paste')}
                className={`rounded-md px-4 py-2 text-sm transition-colors ${
                  inputMode === 'paste'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'bg-transparent text-gray-600'
                }`}
              >
                📄 Paste Notes
              </button>
              <button
                type="button"
                onClick={() => setInputMode('session')}
                className={`rounded-md px-4 py-2 text-sm transition-colors ${
                  inputMode === 'session'
                    ? 'bg-white text-gray-800 shadow-sm'
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
              className="mb-6 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
            />
          )}

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handleGenerateThemes}
            disabled={loading}
            className="w-full rounded-lg bg-[#4A5568] py-3 text-white transition-colors hover:bg-[#3d4654] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Generating...' : '✦ Generate Themes'}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {console.log('Rendering themes:', sortedThemes)}
          {sortedThemes.map((theme, index) => (
            <StickyNote
              key={theme.id}
              theme={theme}
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
          className="mt-8 rounded-xl bg-white px-6 py-4 text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
        >
          + Add Theme
        </button>
      </div>
    </div>
  )
}
