export function buildThemeClusteringPrompt(notes) {
  return `You are a UX researcher doing affinity mapping. Cluster these interview notes into 3-5 themes. Return ONLY a valid JSON array, no markdown, no explanation. Each item: { "id": "unique string", "label": "Theme Name", "quotes": ["quote1", "quote2"], "count": integer representing how many distinct quotes or moments from the notes support this theme }. Notes: "${notes}"`
}
