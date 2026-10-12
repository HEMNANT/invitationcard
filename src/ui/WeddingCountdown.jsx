import { useEffect, useState } from 'react'
import { mainEvent, startOf } from '../lib/format.js'

const pad = (n) => String(n).padStart(2, '0')

/** Live countdown to the main ceremony (venue-local time from the configured UTC offset). */
export default function WeddingCountdown() {
  const target = startOf(mainEvent())
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!target) return undefined
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!target) {
    return (
      <div className="countdown countdown--empty" role="status">
        <p>The countdown begins once the wedding date is set.</p>
      </div>
    )
  }

  const diff = target.getTime() - now
  if (diff <= 0) {
    return (
      <div className="countdown countdown--done" role="status">
        <p>The celebrations have begun. Thank you for your blessings.</p>
      </div>
    )
  }
  const s = Math.floor(diff / 1000)
  const parts = [
    ['Days', Math.floor(s / 86400)],
    ['Hours', Math.floor((s % 86400) / 3600)],
    ['Minutes', Math.floor((s % 3600) / 60)],
    ['Seconds', s % 60],
  ]
  return (
    <div className="countdown" role="timer" aria-label="Time until the wedding">
      {parts.map(([label, v]) => (
        <div key={label} className="countdown__cell">
          <span className="countdown__num">{label === 'Days' ? v : pad(v)}</span>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  )
}
