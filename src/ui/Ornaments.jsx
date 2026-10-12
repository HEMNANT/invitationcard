/** Small decorative SVG motifs used across the invitation (all inherit `currentColor`). */

export function Divider({ className = '' }) {
  return (
    <svg className={`divider ${className}`} viewBox="0 0 240 24" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M4 12h92M144 12h92" />
        <path d="M120 3c4 4 4 14 0 18-4-4-4-14 0-18z" fill="currentColor" fillOpacity=".25" />
        <path d="M110 12c4-3 6-3 10 0M120 12c4-3 6-3 10 0" />
        <circle cx="100" cy="12" r="2" fill="currentColor" />
        <circle cx="140" cy="12" r="2" fill="currentColor" />
      </g>
    </svg>
  )
}

export function Corner({ className = '' }) {
  return (
    <svg className={`corner ${className}`} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M4 76V30C4 14 14 4 30 4h46" />
        <path d="M14 76V34c0-12 8-20 20-20h42" opacity=".55" />
        <path d="M24 24c6 0 12 4 12 12 0 6-5 10-10 10s-8-4-8-8 3-6 6-6" />
        <path d="M36 12c3 5 3 10 0 14M12 36c5 3 10 3 14 0" />
        <circle cx="44" cy="44" r="2.2" fill="currentColor" />
        <circle cx="58" cy="10" r="1.6" fill="currentColor" />
        <circle cx="10" cy="58" r="1.6" fill="currentColor" />
      </g>
    </svg>
  )
}

export function Diya({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false" width="22" height="22">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 24c0 6 6 10 14 10s14-4 14-10H6z" />
        <path d="M34 24c3-1 4-3 5-5" />
        <path d="M20 22c-4-4-3-9 0-14 3 5 4 10 0 14z" fill="currentColor" fillOpacity=".3" />
      </g>
    </svg>
  )
}

export function Lotus({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false" width="22" height="22">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 8c5 5 5 13 0 20-5-7-5-15 0-20z" fill="currentColor" fillOpacity=".25" />
        <path d="M8 14c8 0 12 6 12 14C12 28 8 22 8 14zM32 14c-8 0-12 6-12 14 8 0 12-6 12-14z" />
        <path d="M4 30c8 4 24 4 32 0" />
      </g>
    </svg>
  )
}

export const Icon = {
  Sound: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" />
    </svg>
  ),
  Muted: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M17 9l5 6M22 9l-5 6" />
    </svg>
  ),
  Play: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  ),
  Pause: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
    </svg>
  ),
  Prev: () => (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  ),
  Next: () => (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
}
