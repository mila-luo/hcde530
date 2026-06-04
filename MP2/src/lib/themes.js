export const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853']

export const STICKY_TINTS = ['#E8F0FE', '#FCE8E6', '#FEF7E0', '#E6F4EA']

export const RANK_COLORS = STICKY_TINTS

export const STICKY_LABEL_COLORS = {
  '#E8F0FE': '#1967D2',
  '#FCE8E6': '#C5221F',
  '#FEF7E0': '#B06000',
  '#E6F4EA': '#137333',
}

export function getGoogleColor(index) {
  return GOOGLE_COLORS[index % GOOGLE_COLORS.length]
}

export function getStickyTint(index) {
  return STICKY_TINTS[index % STICKY_TINTS.length]
}

export function getLabelColor(bgColor) {
  return STICKY_LABEL_COLORS[bgColor] ?? '#202124'
}

export const INITIAL_THEMES = [
  {
    id: '1',
    label: 'Tool Fragmentation',
    color: '#E8F0FE',
    count: 4,
    quotes: [
      'I spend too much time switching between different tools',
      'It would be great to have everything in one place',
    ],
  },
  {
    id: '2',
    label: 'Workflow Inefficiency',
    color: '#FCE8E6',
    count: 3,
    quotes: [
      'The current process takes way too long',
      "I often forget steps because they're not connected",
    ],
  },
  {
    id: '3',
    label: 'Collaboration Gaps',
    color: '#FEF7E0',
    count: 2,
    quotes: [
      'Hard to share insights with the team',
      'We lose context when handing off research',
    ],
  },
  {
    id: '4',
    label: 'Analysis Bottleneck',
    color: '#E6F4EA',
    count: 1,
    quotes: [
      'Synthesizing themes manually is time-consuming',
      'I wish there was AI to help spot patterns',
    ],
  },
]

export function applyThemeRanking(themes) {
  const sorted = [...themes].sort(
    (a, b) => (b.count ?? b.quotes?.length ?? 0) - (a.count ?? a.quotes?.length ?? 0),
  )

  return sorted.map((theme, index) => ({
    ...theme,
    count: theme.count ?? theme.quotes?.length ?? 0,
    color: STICKY_TINTS[Math.min(index, STICKY_TINTS.length - 1)],
  }))
}
