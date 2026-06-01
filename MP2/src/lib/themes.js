export const RANK_COLORS = ['#FEF9C3', '#DBEAFE', '#DCFCE7', '#FCE7F3']

export const INITIAL_THEMES = [
  {
    id: '1',
    label: 'Tool Fragmentation',
    color: '#FEF9C3',
    count: 4,
    quotes: [
      'I spend too much time switching between different tools',
      'It would be great to have everything in one place',
    ],
  },
  {
    id: '2',
    label: 'Workflow Inefficiency',
    color: '#DBEAFE',
    count: 3,
    quotes: [
      'The current process takes way too long',
      'I often forget steps because they\'re not connected',
    ],
  },
  {
    id: '3',
    label: 'Collaboration Gaps',
    color: '#DCFCE7',
    count: 2,
    quotes: [
      'Hard to share insights with the team',
      'We lose context when handing off research',
    ],
  },
  {
    id: '4',
    label: 'Analysis Bottleneck',
    color: '#FCE7F3',
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
    color: RANK_COLORS[Math.min(index, RANK_COLORS.length - 1)],
  }))
}
