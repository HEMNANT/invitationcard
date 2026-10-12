import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import config from './config/wedding.config.js'
import { detect } from './lib/capabilities.js'
import { useMusic } from './hooks/useMusic.js'
import PreInvitationCard from './ui/PreInvitationCard.jsx'
import TempleDoorOpening from './ui/TempleDoorOpening.jsx'
import Hero from './ui/Hero.jsx'
import InvitationCard from './ui/InvitationCard.jsx'
import Story from './ui/Story.jsx'
import CeremonyTimeline from './ui/CeremonyTimeline.jsx'
import CoupleInviteReveal from './ui/CoupleInviteReveal.jsx'
import Controls from './ui/Controls.jsx'

gsap.registerPlugin(ScrollTrigger)

const hasVideo = config.media.hero.type === 'video' || config.media.gallery.some((m) => m.type === 'video')

export default function App() {
  const caps = useMemo(() => detect(), [])
  const reduced = caps.reduced

  const [opened, setOpened] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [videosPlaying, setVideosPlaying] = useState(!reduced)
  const [heroContentVisible, setHeroContentVisible] = useState(false)
  const precardRef = useRef(null)
  const music = useMusic(opened)

  useEffect(() => {
    const { bride, groom } = config.couple
    document.title = `${bride.name} & ${groom.name} · ${config.meta.title}`
  }, [])

  // Lock scrolling while viewing the pre-card before opening
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !opened)
  }, [opened])

  const autoScrollRaf = useRef(null)
  const isAutoScrolling = useRef(false)

  const stopAutoScroll = useCallback(() => {
    if (isAutoScrolling.current) {
      isAutoScrolling.current = false
      if (autoScrollRaf.current) {
        cancelAnimationFrame(autoScrollRaf.current)
        autoScrollRaf.current = null
      }
    }
  }, [])

  const startAutoScroll = useCallback((durationMs = 18000) => {
    stopAutoScroll()
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const startY = window.scrollY
    const distance = maxScroll - startY
    if (distance <= 10) return

    isAutoScrolling.current = true
    const startTime = performance.now()

    const step = (now) => {
      if (!isAutoScrolling.current) return
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / durationMs)

      // Calm sine-in-out curve: very slow and serene at top, majestic glide to bottom
      const ease = 0.5 - 0.5 * Math.cos(Math.PI * progress)
      const targetY = startY + distance * ease

      window.scrollTo(0, targetY)

      if (progress < 1) {
        autoScrollRaf.current = requestAnimationFrame(step)
      } else {
        isAutoScrolling.current = false
        autoScrollRaf.current = null
      }
    }

    autoScrollRaf.current = requestAnimationFrame(step)
  }, [stopAutoScroll])

  // Tap pre-card: starts music right there on direct user gesture and begins 300-frame door opening
  const handleOpen = useCallback(() => {
    if (opened) return

    // 1. Start music immediately on this direct user gesture
    music.play()

    // 2. Animate out the clean pre-card
    const el = precardRef.current
    if (el) {
      gsap.to(el, {
        opacity: 0,
        scale: 0.98,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: () => {
          setOpened(true)
        },
      })
    } else {
      setOpened(true)
    }
  }, [opened, music])

  const handleFrame113 = useCallback(() => {
    setHeroContentVisible(true)
  }, [])

  // After doors finish opening and hero sanctum is framed, begin calm 18s slow scroll to bottom
  useEffect(() => {
    if (!opened || reduced) return
    const timer = setTimeout(() => {
      startAutoScroll(18000)
    }, 6000)
    return () => clearTimeout(timer)
  }, [opened, reduced, startAutoScroll])

  // Stop auto-scroll if guest manually touches, wheels, or presses a key
  useEffect(() => {
    if (!opened) return undefined

    const onUserInterrupt = () => {
      stopAutoScroll()
    }

    window.addEventListener('wheel', onUserInterrupt, { passive: true })
    window.addEventListener('touchstart', onUserInterrupt, { passive: true })
    window.addEventListener('pointerdown', onUserInterrupt, { passive: true })
    window.addEventListener('keydown', onUserInterrupt, { passive: true })

    return () => {
      window.removeEventListener('wheel', onUserInterrupt)
      window.removeEventListener('touchstart', onUserInterrupt)
      window.removeEventListener('pointerdown', onUserInterrupt)
      window.removeEventListener('keydown', onUserInterrupt)
      stopAutoScroll()
    }
  }, [opened, stopAutoScroll])

  return (
    <>
      {/* 300-Frame Temple Door Opening Backdrop (Sole, unified background) */}
      <div className="temple-bg-stage" aria-hidden="true">
        <TempleDoorOpening
          active={opened}
          onFrame113={handleFrame113}
        />
      </div>

      {/* Clean luxury pre-card before opening: tap here to start music & open doors */}
      {!opened && (
        <PreInvitationCard
          ref={precardRef}
          onOpen={handleOpen}
        />
      )}

      {/* Main invitation content: reveals smoothly over the opened temple courtyard */}
      <Controls
        videosPlaying={videosPlaying}
        onVideos={() => setVideosPlaying((p) => !p)}
        hasVideo={hasVideo}
      />
      <main
        className="main"
        style={{
          opacity: opened ? 1 : 0,
          pointerEvents: opened ? 'auto' : 'none',
          transition: 'opacity 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <Hero
          reduced={reduced}
          contentVisible={heroContentVisible}
          onScrollTour={() => startAutoScroll(18000)}
        />
        <InvitationCard reduced={reduced} />
        <Story reduced={reduced} />
        <CeremonyTimeline reduced={reduced} />
        <CoupleInviteReveal reduced={reduced} />
      </main>
    </>
  )
}
