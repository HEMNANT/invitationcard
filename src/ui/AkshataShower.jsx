import { useState, useCallback, memo } from 'react'

/**
 * AkshataShower
 * Interactive sacred Hindu & Telugu wedding ritual:
 * Guests shower Akshata (turmeric-coated golden rice) and fragrant rose petals on Haarika & Manoj.
 */
export const AkshataShower = memo(function AkshataShower({ className = '' }) {
  const [particles, setParticles] = useState([])
  const [blessingCount, setBlessingCount] = useState(() => {
    try {
      const saved = localStorage.getItem('wedding_blessing_count')
      return saved ? parseInt(saved, 10) : 51
    } catch {
      return 51
    }
  })
  const [isShowering, setIsShowering] = useState(false)

  const triggerShower = useCallback(() => {
    // Increment blessing count
    setBlessingCount((prev) => {
      const next = prev + 1
      try {
        localStorage.setItem('wedding_blessing_count', String(next))
      } catch {}
      return next
    })

    setIsShowering(true)

    // Generate 45 lightweight festive particles
    const newParticles = []
    const types = ['akshata', 'rose', 'marigold', 'gold-flake']
    const count = 42

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const startX = 10 + Math.random() * 80 // 10% to 90% viewport width
      const startY = -10 - Math.random() * 20 // just above top
      const endX = startX + (Math.random() - 0.5) * 35
      const duration = 2.2 + Math.random() * 1.6
      const delay = Math.random() * 0.4
      const rotate = Math.random() * 720 - 360
      const scale = 0.75 + Math.random() * 0.55

      newParticles.push({
        id: Math.random().toString(36).substring(2, 9),
        type,
        startX,
        startY,
        endX,
        duration,
        delay,
        rotate,
        scale,
      })
    }

    setParticles(newParticles)

    // Cleanup particles after animation finishes
    setTimeout(() => {
      setParticles([])
      setIsShowering(false)
    }, 4200)
  }, [])

  return (
    <div className={`akshata-container ${className}`}>
      <button
        type="button"
        className="btn btn--gold akshata-btn"
        onClick={triggerShower}
        aria-label="Shower Sacred Akshata and Petals on Haarika & Manoj"
      >
        <span className="akshata-btn__icon">🌸</span>
        <span className="akshata-btn__text">
          <strong>ఆశీర్వదించండి · Shower Blessings</strong>
          <small>Tap to shower sacred Akshata &amp; Rose petals</small>
        </span>
        <span className="akshata-btn__count">✨ {blessingCount}</span>
      </button>

      {/* Particle Rain Container */}
      {particles.length > 0 && (
        <div className="akshata-rain" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className={`akshata-particle akshata-particle--${p.type}`}
              style={{
                left: `${p.startX}%`,
                top: `${p.startY}%`,
                '--end-x': `${p.endX - p.startX}vw`,
                '--fall-dur': `${p.duration}s`,
                '--fall-delay': `${p.delay}s`,
                '--rot': `${p.rotate}deg`,
                '--scale': p.scale,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
})

export default AkshataShower
