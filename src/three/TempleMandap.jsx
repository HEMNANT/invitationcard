import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { mats } from './materials.js'
import { archPanelTexture, kolamTexture } from './textures.js'
import { BananaLeaves, Garlands, Pillar, ShowBetween, StandingLamp } from './parts.jsx'
import BrassDiya from './BrassDiya.jsx'

const HALF = 2.3
const PILLAR_H = 1.12 // pillar height factor → ~4.5 units

/** The grand South Indian mandap: raised platform, four carved pillars, tiered canopy, garlands, banana leaves, lamps. */
export default function TempleMandap({ position = [0, 0, 0], beads = 30, shadows = false, lamps = true }) {
  const m = mats()
  const arch = useMemo(() => archPanelTexture(), [])
  const kolam = useMemo(() => kolamTexture(), [])
  useEffect(() => () => { arch.dispose(); kolam.dispose() }, [arch, kolam])

  const top = 0.45 + 4.45 * PILLAR_H * 0.93
  const garlands = useMemo(() => {
    const y = top - 0.5
    const f = HALF
    return [
      { from: [-f, y, f], to: [f, y, f], sag: 0.55, kind: 'marigold', tassel: true },
      { from: [-f, y - 0.22, f], to: [f, y - 0.22, f], sag: 0.8, kind: 'jasmine' },
      { from: [-f, y, -f], to: [f, y, -f], sag: 0.45, kind: 'marigold' },
      { from: [-f, y, f], to: [-f, y, -f], sag: 0.4, kind: 'jasmine' },
      { from: [f, y, f], to: [f, y, -f], sag: 0.4, kind: 'jasmine' },
      // vertical strands hanging from the front pillars
      { from: [-f, y, f + 0.3], to: [-f, 0.8, f + 0.3], sag: 0, kind: 'marigold' },
      { from: [f, y, f + 0.3], to: [f, 0.8, f + 0.3], sag: 0, kind: 'marigold' },
    ]
  }, [top])

  return (
    <group position={position}>
      {/* platform */}
      <mesh position={[0, 0.09, 0]} material={m.stone} receiveShadow castShadow={shadows}>
        <boxGeometry args={[6.6, 0.18, 6.6]} />
      </mesh>
      <mesh position={[0, 0.3, 0]} material={m.maroon} receiveShadow castShadow={shadows}>
        <boxGeometry args={[5.7, 0.28, 5.7]} />
      </mesh>
      <mesh position={[0, 0.455, 0]} material={m.gold}>
        <boxGeometry args={[5.74, 0.04, 5.74]} />
      </mesh>
      {/* kolam on the front of the stage */}
      <mesh position={[0, 0.48, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 4.4]} />
        <meshBasicMaterial map={kolam} transparent opacity={0.6} depthWrite={false} polygonOffset polygonOffsetFactor={-2} toneMapped={false} />
      </mesh>

      {/* four pillars */}
      {[[-HALF, HALF], [HALF, HALF], [-HALF, -HALF], [HALF, -HALF]].map(([x, z]) => (
        <Pillar key={`${x}${z}`} position={[x, 0.46, z]} height={PILLAR_H} scale={0.93} castShadow={shadows} />
      ))}

      {/* draped ceiling cloth under the canopy */}
      <mesh position={[0, top + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.maroon}>
        <planeGeometry args={[5.9, 5.9]} />
      </mesh>

      {/* tiered canopy */}
      {[0, 1, 2].map((i) => {
        const s = 6.1 - i * 1.5
        return (
          <group key={i} position={[0, top + 0.1 + i * 0.42, 0]}>
            <mesh material={m.maroon}>
              <boxGeometry args={[s, 0.3, s]} />
            </mesh>
            <mesh position={[0, 0.17, 0]} material={m.gold}>
              <boxGeometry args={[s + 0.08, 0.05, s + 0.08]} />
            </mesh>
          </group>
        )
      })}
      <group position={[0, top + 1.55, 0]}>
        <mesh material={m.maroonDeep}>
          <coneGeometry args={[1.5, 0.9, 4]} />
        </mesh>
        <mesh position={[0, 0.62, 0]} material={m.gold}>
          <sphereGeometry args={[0.16, 14, 10]} />
        </mesh>
        <mesh position={[0, 0.85, 0]} material={m.gold}>
          <coneGeometry args={[0.08, 0.3, 10]} />
        </mesh>
      </group>

      {/* ornate backdrop behind the hero frame */}
      <ShowBetween max={1.5}>
        <mesh position={[0, 3.25, -HALF - 0.65]}>
          <planeGeometry args={[4.4, 5.9]} />
          <meshStandardMaterial map={arch} roughness={0.8} metalness={0.05} />
        </mesh>
      </ShowBetween>

      <Garlands specs={garlands} beads={beads} />

      {/* banana leaves + marigold mounds at the front pillars, kalash-style */}
      <BananaLeaves position={[-HALF - 0.55, 0.46, HALF + 0.45]} rotationY={0.25} count={5} />
      <BananaLeaves position={[HALF + 0.55, 0.46, HALF + 0.45]} rotationY={-0.25} count={5} />
      <BananaLeaves position={[-HALF - 0.4, 0.46, -HALF]} rotationY={0.6} count={4} />
      <BananaLeaves position={[HALF + 0.4, 0.46, -HALF]} rotationY={-0.6} count={4} />

      {lamps && (
        <>
          <StandingLamp position={[-HALF - 1.0, 0, HALF + 0.9]} scale={1.15} seed={1} />
          <StandingLamp position={[HALF + 1.0, 0, HALF + 0.9]} scale={1.15} seed={2} />
          <BrassDiya position={[-1.1, 0.46, HALF + 0.9]} scale={0.34} light={false} />
          <BrassDiya position={[1.1, 0.46, HALF + 0.9]} scale={0.34} light={false} />
        </>
      )}
    </group>
  )
}

