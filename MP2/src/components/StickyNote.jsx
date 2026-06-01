import { useEffect, useRef, useState } from 'react'

function resizeTextarea(textarea) {
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

export default function StickyNote({
  theme,
  onDelete,
  onUpdateLabel,
  onUpdateQuote,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftLabel, setDraftLabel] = useState(theme.label)
  const [editingQuotes, setEditingQuotes] = useState(() =>
    theme.quotes.map(() => false),
  )
  const [draftQuotes, setDraftQuotes] = useState(() => [...theme.quotes])
  const quoteRefs = useRef([])

  useEffect(() => {
    setDraftLabel(theme.label)
  }, [theme.label])

  useEffect(() => {
    setDraftQuotes([...theme.quotes])
    setEditingQuotes(theme.quotes.map(() => false))
  }, [theme.quotes])

  useEffect(() => {
    editingQuotes.forEach((isEditingQuote, index) => {
      if (isEditingQuote && quoteRefs.current[index]) {
        resizeTextarea(quoteRefs.current[index])
      }
    })
  }, [editingQuotes, draftQuotes])

  const saveLabel = () => {
    setIsEditing(false)
    onUpdateLabel(theme.id, draftLabel.trim() || 'New Theme')
  }

  const startEditingQuote = (quoteIndex) => {
    setEditingQuotes((current) =>
      current.map((isEditingQuote, index) => index === quoteIndex),
    )
  }

  const saveQuote = (quoteIndex) => {
    setEditingQuotes((current) =>
      current.map((isEditingQuote, index) =>
        index === quoteIndex ? false : isEditingQuote,
      ),
    )
    onUpdateQuote(theme.id, quoteIndex, draftQuotes[quoteIndex].trim())
  }

  return (
    <article
      className="rounded-xl p-5"
      style={{ backgroundColor: theme.color }}
    >
      <div className="flex items-start justify-between gap-3">
        {isEditing ? (
          <input
            type="text"
            value={draftLabel}
            onChange={(event) => setDraftLabel(event.target.value)}
            onBlur={saveLabel}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                saveLabel()
              }
            }}
            autoFocus
            className="min-w-0 w-full flex-1 border-none bg-transparent p-0 font-mono text-sm font-medium text-gray-800 outline-none focus:outline-none focus:ring-0"
          />
        ) : (
          <span
            role="button"
            tabIndex={0}
            onClick={() => setIsEditing(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setIsEditing(true)
              }
            }}
            className="min-w-0 flex-1 cursor-pointer font-mono text-sm font-medium text-gray-800"
          >
            {theme.label}
          </span>
        )}

        <button
          type="button"
          onClick={() => onDelete(theme.id)}
          aria-label={`Delete ${theme.label}`}
          className="shrink-0 rounded p-1 text-gray-500 transition-colors hover:bg-white/60 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      <div className="my-3 border-t border-gray-400/30" />

      <div className="space-y-2 text-sm font-normal text-gray-700">
        {theme.quotes.map((quote, quoteIndex) =>
          editingQuotes[quoteIndex] ? (
            <textarea
              key={`${theme.id}-quote-${quoteIndex}`}
              ref={(element) => {
                quoteRefs.current[quoteIndex] = element
              }}
              value={draftQuotes[quoteIndex] ?? ''}
              onChange={(event) => {
                const nextValue = event.target.value
                setDraftQuotes((current) => {
                  const next = [...current]
                  next[quoteIndex] = nextValue
                  return next
                })
                resizeTextarea(event.target)
              }}
              onBlur={() => saveQuote(quoteIndex)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  saveQuote(quoteIndex)
                }
              }}
              autoFocus
              rows={1}
              className="block w-full resize-none overflow-hidden border-none bg-transparent p-0 text-sm font-normal text-gray-700 outline-none focus:outline-none focus:ring-0"
            />
          ) : (
            <span
              key={`${theme.id}-quote-${quoteIndex}`}
              role="button"
              tabIndex={0}
              onClick={() => startEditingQuote(quoteIndex)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  startEditingQuote(quoteIndex)
                }
              }}
              className="block w-full cursor-pointer"
            >
              {quote}
            </span>
          ),
        )}
      </div>
    </article>
  )
}
