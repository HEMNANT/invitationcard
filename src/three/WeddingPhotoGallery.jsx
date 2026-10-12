import { useCallback } from 'react'
import config from '../config/wedding.config.js'
import CoupleVideoFrame from './CoupleVideoFrame.jsx'
import { world } from '../lib/world.js'

/** Where each story frame hangs in the corridor behind the mandap. */
export function galleryLayout(count) {
  return Array.from({ length: count }, (_, i) => {
    const side = i % 2 === 0 ? -1 : 1
    return {
      position: [side * 1.75, 2.3 + (i % 3 === 1 ? 0.15 : 0), -8 - i * 3.6],
      rotation: [0, -side * 0.3, 0],
    }
  })
}

/**
 * The couple's story as framed photographs and film, staggered in depth.
 * Photos load once the section is near; videos only load for the focused frame and its neighbours.
 */
export default function WeddingPhotoGallery({ near, visible, activeIndex, playing, shadows }) {
  const items = config.media.gallery
  const layout = galleryLayout(items.length)

  return (
    <group>
      {items.map((item, i) => {
        const isVideo = item.type === 'video'
        const adjacent = Math.abs(i - activeIndex) <= 1
        const load = near && (isVideo ? adjacent : true)
        const play = isVideo && playing && visible && i === activeIndex
        const L = layout[i]
        return (
          <GalleryFrame
            key={i}
            index={i}
            item={item}
            layout={L}
            load={load}
            play={play}
            shadows={shadows}
          />
        )
      })}
    </group>
  )
}

function GalleryFrame({ index, item, layout, load, play, shadows }) {
  const onDims = useCallback((d) => {
    world.frames[index] = d
  }, [index])
  return (
    <CoupleVideoFrame
      item={item}
      position={layout.position}
      rotation={layout.rotation}
      maxW={item.type === 'video' ? 2.6 : 2.3}
      maxH={item.type === 'video' ? 3.3 : 3.0}
      load={load}
      play={play}
      phase={index * 1.7}
      shadows={shadows}
      onDims={onDims}
    />
  )
}
