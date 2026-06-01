import { useState } from 'react'

export function useAffinity() {
  const [themes, setThemes] = useState([])

  const addTheme = () => {
    setThemes((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        label: 'New Theme',
        color: '#FCE7F3',
        count: 0,
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

  const clearThemes = () => {
    setThemes([])
  }

  return {
    themes,
    addTheme,
    deleteTheme,
    updateThemeLabel,
    updateThemeQuote,
    replaceThemes,
    clearThemes,
  }
}
