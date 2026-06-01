import { useState } from 'react'
import Setup from './pages/Setup.jsx'
import Interview from './pages/Interview.jsx'
import AffinityBoard from './pages/AffinityBoard.jsx'

function App() {
  const [page, setPage] = useState('setup')

  if (page === 'interview') {
    return <Interview onNavigate={setPage} />
  }

  if (page === 'affinity') {
    return <AffinityBoard onNavigate={setPage} />
  }

  return <Setup onNavigate={setPage} />
}

export default App
