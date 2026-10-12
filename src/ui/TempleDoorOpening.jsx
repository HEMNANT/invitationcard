import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * TempleDoorOpening
 * Plays the temple door opening animation from G:\haarikaMar\templteDoor
 * (using /media/temple-doors.mp4 with fallback to /media/temple-doors/f-%03d.jpg).
 *
 * Requirements:
 * 1. Door opening animation starts after the first animation (open card) completes.
 * 2. Frames 1 to 113: The ornate temple doors swing open in high definition.
 * 3. At Frame 113: Triggers onFrame113 to make the hero content visible.
 * 4. Frames 114 to 300: Continue playing in the background behind the content,
 *    and loop the open-courtyard ambient sequence.
 */
export default function TempleDoorOpening({ active = true, onFrame113 }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [useCanvas, setUseCanvas] = useState(false)
  const [frame113Reached, setFrame113Reached] = useState(false)
  const hasTriggeredRef = useRef(false)

  // 300 frames encoded at 30fps = 10.0s
  // Frame 113 / 300 = 37.66% = 3.766s
  const FRAME_113_TIME = 3.766
  const TOTAL_FRAMES = 300

  // Trigger frame 113 content reveal
  const triggerReveal = useCallback(() => {
    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true
      setFrame113Reached(true)
      onFrame113?.()
    }
  }, [onFrame113])

  // Track video playback
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.duration) return

    const t = video.currentTime

    if (t >= FRAME_113_TIME) {
      triggerReveal()
    }

    // When reaching the end of all 300 frames (~10s), loop back to frame 114 (3.77s)
    // so the doors remain wide open with the courtyard moving gently as the background
    if (t >= video.duration - 0.12) {
      video.currentTime = FRAME_113_TIME
      video.play().catch(() => {})
    }
  }, [triggerReveal])

  const handleEnded = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = FRAME_113_TIME
    video.play().catch(() => {})
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (active) {
      hasTriggeredRef.current = false
      setFrame113Reached(false)
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to canvas if video autoplay is blocked
          setUseCanvas(true)
        })
      }
    } else {
      video.pause()
      video.currentTime = 0
      hasTriggeredRef.current = false
      setFrame113Reached(false)
    }
  }, [active])

  // Safety fallback: reveal content after 4.0s even if timeupdate events are throttled
  useEffect(() => {
    if (!active) return
    const timer = setTimeout(() => {
      triggerReveal()
    }, 4000)
    return () => clearTimeout(timer)
  }, [active, triggerReveal])

  // Canvas fallback frame animator (if video ever fails)
  useEffect(() => {
    if (!useCanvas) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    if (!active) {
      // Draw closed doors (Frame 1)
      const img = new Image()
      img.src = '/media/temple-doors/f-001.jpg'
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      return
    }

    let current = 1
    let animId = null

    const step = () => {
      const img = new Image()
      const pad = String(current).padStart(3, '0')
      img.src = `/media/temple-doors/f-${pad}.jpg`
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }

      if (current >= 113) {
        triggerReveal()
      }

      current++
      if (current > TOTAL_FRAMES) {
        current = 114 // loop open courtyard frames
      }

      animId = setTimeout(step, 33) // ~30 fps
    }

    step()

    return () => {
      if (animId) clearTimeout(animId)
    }
  }, [useCanvas, active, triggerReveal])

  return (
    <div className="temple-door-wrap" aria-hidden="true">
      {!useCanvas ? (
        <video
          ref={videoRef}
          className="temple-door-video"
          src="/media/temple-doors.mp4"
          playsInline
          muted
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={() => setUseCanvas(true)}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="temple-door-canvas"
          width={1080}
          height={1920}
        />
      )}
    </div>
  )
}
