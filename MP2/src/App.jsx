import { useState } from 'react'
import Setup from './pages/Setup.jsx'
import Interview from './pages/Interview.jsx'
import AffinityBoard from './pages/AffinityBoard.jsx'

function App() {
  const [page, setPage] = useState('setup')
  const [affinityFreshSession, setAffinityFreshSession] = useState(false)

  const handleNavigate = (nextPage, options = {}) => {
    setAffinityFreshSession(nextPage === 'affinity' && options.fromInterview === true)
    setPage(nextPage)
  }

  if (page === 'interview') {
    return <Interview onNavigate={handleNavigate} />
  }

  if (page === 'affinity') {
    return (
      <AffinityBoard
        onNavigate={handleNavigate}
        freshSession={affinityFreshSession}
      />
    )
  }

  return <Setup onNavigate={handleNavigate} />
}

export default App
