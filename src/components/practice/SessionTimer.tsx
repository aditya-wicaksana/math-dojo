import { useEffect, useState } from 'react'

interface SessionTimerProps {
  running: boolean
}

export function SessionTimer({ running }: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')
  return (
    <span className="font-mono font-bold text-gray-500 text-sm">
      {mm}:{ss}
    </span>
  )
}
