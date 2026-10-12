import { Icon } from './Ornaments.jsx'

/**
 * Floating controls:
 * Mute option removed as requested.
 * Shows video play/pause control if videos exist in the gallery.
 */
export default function Controls({ videosPlaying, onVideos, hasVideo }) {
  if (!hasVideo) return null
  return (
    <div className="controls" role="group" aria-label="Invitation controls">
      <button
        type="button"
        className="round round--solid"
        onClick={onVideos}
        aria-pressed={videosPlaying}
        aria-label={videosPlaying ? 'Pause videos' : 'Play videos'}
      >
        {videosPlaying ? <Icon.Pause /> : <Icon.Play />}
      </button>
    </div>
  )
}
