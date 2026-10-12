import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react'

/**
 * TempleDoorOpening
 * Plays the temple door opening animation once (single-time, no loop).
 * - Frames 1 to 113 (~3.77s): Ornate temple doors swing open in high definition.
 * - Frame 113: Triggers onFrame113 to smoothly reveal hero content.
 * - Frames 114 to 300 (up to 10s): Camera travels into the open courtyard.
 * - Frame 300: Pauses on the final frame (no loop, stays open permanently).
 */
const TempleDoorOpening = forwardRef(function TempleDoorOpening({ active = false, onFrame113 }, ref) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [useCanvas, setUseCanvas] = useState(false)
  const hasTriggeredRef = useRef(false)
  const isPlayingRef = useRef(false)

  // 300 frames encoded at 30fps = 10.0s
  // Reveal content as doors part wide open (~1.9s)
  const REVEAL_TIME = 1.9
  const TOTAL_FRAMES = 300

  const triggerReveal = useCallback(() => {
    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true
      onFrame113?.()
    }
  }, [onFrame113])

  const playVideo = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.defaultMuted = true
    video.playbackRate = 1.2
    video.currentTime = 0
    isPlayingRef.current = true

    video.play().catch((err) => {
      console.warn('Door video playback notice:', err)
      setUseCanvas(true)
    })
  }, [])

  // Expose start() imperative handle for direct synchronous trigger from tap handler
  useImperativeHandle(ref, () => ({
    start: () => {
      playVideo()
    },
    stop: () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    },
  }), [playVideo])

  // Track video playback
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.duration) return

    const t = video.currentTime

    if (t >= REVEAL_TIME) {
      triggerReveal()
    }

    // Single-time animation: when reaching the end, pause on final open frame (NO LOOP)
    if (t >= video.duration - 0.08) {
      video.pause()
      isPlayingRef.current = false
    }
  }, [triggerReveal])

  // When video naturally ends: pause on final open frame (NO LOOP)
  const handleEnded = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    isPlayingRef.current = false
  }, [])

  // Ensure video properties on mount and preload
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.load()
  }, [])

  // Respond to active prop
  useEffect(() => {
    if (active) {
      playVideo()
    }
  }, [active, playVideo])

  // Safety fallback: reveal content after 2.2s even if video events are throttled
  useEffect(() => {
    if (!active) return
    const timer = setTimeout(() => {
      triggerReveal()
    }, 2200)
    return () => clearTimeout(timer)
  }, [active, triggerReveal])

  // Canvas fallback frame animator (if video ever fails on ancient devices)
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
        // Single time, NO LOOP: stay on final frame
        return
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
          autoPlay={false}
          loop={false}
          preload="auto"
          poster="/media/temple-doors/f-001.jpg"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
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
})

export default TempleDoorOpening
