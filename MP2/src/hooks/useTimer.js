import { useEffect, useRef, useState } from 'react'

function formatElapsed(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

export function useTimer({ autoStart = true } = {}) {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current)
      return undefined
    }

    intervalRef.current = setInterval(() => {
      setElapsed((current) => current + 1)
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const togglePause = () => {
    setIsRunning((running) => !running)
  }

  const reset = () => {
    setElapsed(0)
    setIsRunning(false)
  }

  return {
    elapsed,
    formatted: formatElapsed(elapsed),
    isRunning,
    togglePause,
    reset,
  }
}
