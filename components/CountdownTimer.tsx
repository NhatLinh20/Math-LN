import React, { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  initialSeconds: number
  onTimeUp: () => void
  onAutoSave?: () => void
}

export default function CountdownTimer({ initialSeconds, onTimeUp, onAutoSave }: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [secondsLeft, onTimeUp])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!onAutoSave) return

    const saveTimer = setInterval(() => {
      onAutoSave()
    }, 30000)

    return () => clearInterval(saveTimer)
  }, [onAutoSave])

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const isDanger = secondsLeft <= 300 // Less than 5 minutes

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold shadow-sm border ${
      isDanger 
        ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' 
        : 'bg-white text-gray-800 border-gray-200'
    }`}>
      <Clock className={`w-5 h-5 ${isDanger ? 'text-red-500' : 'text-blue-500'}`} />
      <span>{formatTime(secondsLeft)}</span>
    </div>
  )
}
