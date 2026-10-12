import { useCallback, useEffect, useRef, useState } from 'react'
import config from '../config/wedding.config.js'

/**
 * useMusic
 * Background audio manager for wedding BGM (backgroundSong.wav).
 * - Loops continuously
 * - Volume set to a gentle, lowered level (0.28)
 * - Starts seamlessly when invitation is opened via user gesture
 * - Includes fallback listener for any first interaction
 * - Pauses politely when tab is hidden and resumes when visible
 */
export function useMusic(opened = false) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const targetVolume = typeof config.music?.volume === 'number' ? config.music?.volume : 0.28

  const getAudio = useCallback(() => {
    if (!audioRef.current && config.music?.src) {
      const audio = new Audio(config.music.src)
      audio.loop = true
      audio.volume = targetVolume
      audioRef.current = audio
    }
    return audioRef.current
  }, [targetVolume])

  const play = useCallback(async () => {
    const audio = getAudio()
    if (!audio) return false
    try {
      audio.volume = targetVolume
      await audio.play()
      setIsPlaying(true)
      return true
    } catch {
      // Autoplay blocked until user gesture
      setIsPlaying(false)
      return false
    }
  }, [getAudio, targetVolume])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  // Start playing as soon as invitation is opened
  useEffect(() => {
    if (!opened) return

    play()

    // Fallback: in case browser required an additional user gesture
    const resumeOnInteraction = () => {
      play()
    }

    window.addEventListener('pointerdown', resumeOnInteraction, { once: true })
    window.addEventListener('keydown', resumeOnInteraction, { once: true })

    return () => {
      window.removeEventListener('pointerdown', resumeOnInteraction)
      window.removeEventListener('keydown', resumeOnInteraction)
    }
  }, [opened, play])

  // Pause when tab is minimized/hidden, resume when returned
  useEffect(() => {
    const onVisibility = () => {
      if (!audioRef.current) return
      if (document.hidden) {
        audioRef.current.pause()
      } else if (opened) {
        audioRef.current.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [opened])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return { isPlaying, play, stop }
}
