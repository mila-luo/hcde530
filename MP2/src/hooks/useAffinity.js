import { useState } from 'react'
import { INITIAL_THEMES } from '../lib/themes.js'

export function useAffinity() {
  const [themes, setThemes] = useState(INITIAL_THEMES)

  const addTheme = () => {
    setThemes((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        label: 'New Theme',
        color: '#FEF9C3',
        quotes: [],
      },
    ])
  }

  const deleteTheme = (id) => {
    setThemes((current) => current.filter((theme) => theme.id !== id))
  }

  const updateThemeLabel = (id, newLabel) => {
    setThemes((current) =>
      current.map((theme) =>
        theme.id === id ? { ...theme, label: newLabel } : theme,
      ),
    )
  }

  const updateThemeQuote = (id, quoteIndex, newValue) => {
    setThemes((current) =>
      current.map((theme) => {
        if (theme.id !== id) {
          return theme
        }

        const quotes = [...theme.quotes]
        quotes[quoteIndex] = newValue

        return { ...theme, quotes }
      }),
    )
  }

  const replaceThemes = (newThemes) => {
    setThemes(newThemes)
  }

  return {
    themes,
    addTheme,
    deleteTheme,
    updateThemeLabel,
    updateThemeQuote,
    replaceThemes,
  }
}
