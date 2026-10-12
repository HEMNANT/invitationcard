import { useEffect, useRef, useState } from 'react'
import { pickSrc } from '../lib/media.js'

/**
 * Lightweight HTML rendering of the couple's real media. Used when WebGL isn't available or the
 * device is low-power, so guests still see the actual photographs and films.
 */
export default function FallbackMedia({ item, playing = true, eager = false, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(eager)
  const src = pickSrc(item.src)
  const poster = pickSrc(item.poster)
  const aspect = item.aspect || 0.8

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const video = useRef(null)
  useEffect(() => {
    const v = video.current
    if (!v) return
    if (visible && playing) v.play().catch(() => {})
    else v.pause()
  }, [visible, playing, src])

  return (
    <figure ref={ref} className={`fmedia ${className}`} style={{ aspectRatio: String(aspect) }}>
      {!src && (
        <div className="fmedia__ph" role="img" aria-label={item.alt}>
          <span>{item.type === 'video' ? 'Couple video here' : 'Couple photo here'}</span>
          <small>{item.caption}</small>
        </div>
      )}
      {src && item.type !== 'video' && visible && (
        <img src={src} alt={item.alt || ''} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      )}
      {src && item.type === 'video' && (
        <video
          ref={video}
          src={visible ? src : undefined}
          poster={poster || undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-label={item.alt}
        />
      )}
    </figure>
  )
}
