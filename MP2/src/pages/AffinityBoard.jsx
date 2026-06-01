import { useState } from 'react'
import StickyNote from '../components/StickyNote.jsx'
import { useAffinity } from '../hooks/useAffinity.js'
import { generateThemes } from '../lib/claude.js'

const NOTES_STORAGE_KEY = 'mp2_session_notes'

export default function AffinityBoard({ onNavigate }) {
  void onNavigate

  const {
    themes,
    addTheme,
    deleteTheme,
    updateThemeLabel,
    updateThemeQuote,
    replaceThemes,
  } = useAffinity()
  const [inputSource, setInputSource] = useState('paste')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerateThemes = async () => {
    const notes = localStorage.getItem(NOTES_STORAGE_KEY) ?? ''

    setLoading(true)
    setError('')

    try {
      const result = await generateThemes(notes)
      replaceThemes(result)
    } catch {
      setError('Failed to generate themes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <div className="mx-auto max-w-5xl px-8 pt-12">
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
                onClick={() => setInputSource('paste')}
                className={`rounded-md px-4 py-2 text-sm transition-colors ${
                  inputSource === 'paste'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'bg-transparent text-gray-600'
                }`}
              >
                📄 Paste Notes
              </button>
              <button
                type="button"
                onClick={() => setInputSource('upload')}
                className={`rounded-md px-4 py-2 text-sm transition-colors ${
                  inputSource === 'upload'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'bg-transparent text-gray-600'
                }`}
              >
                ⬆ Upload Audio
              </button>
            </div>
          </div>

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
          {themes.map((theme) => (
            <StickyNote
              key={theme.id}
              theme={theme}
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
