import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mats } from './materials.js'
import { Flame, lathe } from './parts.jsx'
import { world } from '../lib/world.js'

const BOWL = [
  [0, 0], [0.22, 0], [0.3, 0.03], [0.4, 0.09], [0.47, 0.17], [0.5, 0.24], [0.46, 0.27], [0.4, 0.22], [0.28, 0.16], [0.0, 0.14],
]

/** A realistic brass diya on a carved plinth with a living flame and a warm point light. */
export default function BrassDiya({ position = [0, 0, 0], scale = 1, light = true }) {
  const bowl = useMemo(() => lathe(BOWL, 28), [])
  const plinth = useMemo(() => lathe([[0, 0], [0.7, 0], [0.7, 0.1], [0.55, 0.18], [0.5, 0.5], [0.62, 0.58], [0.62, 0.68], [0, 0.68]], 28), [])
  useEffect(() => () => { bowl.dispose(); plinth.dispose() }, [bowl, plinth])
  const lightRef = useRef()
  const m = mats()

  useFrame(({ clock }) => {
    if (!lightRef.current) return
    const t = clock.elapsedTime * 9
    lightRef.current.intensity = (7 + Math.sin(t) * 0.9 + Math.sin(t * 2.7) * 0.5) * (1.2 - world.light * 0.6)
  })

  return (
    <group position={position} scale={scale}>
      <mesh geometry={plinth} material={m.stone} castShadow receiveShadow />
      <mesh position={[0, 0.68, 0]} rotation={[0, 0, 0]} material={m.gold}>
        <torusGeometry args={[0.6, 0.02, 8, 36]} />
      </mesh>
      <group position={[0, 0.69, 0]}>
        <mesh geometry={bowl} material={m.brass} castShadow />
        {/* pointed spout that holds the wick */}
        <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -Math.PI / 2 + 0.25]} material={m.brass}>
          <coneGeometry args={[0.1, 0.34, 14]} />
        </mesh>
        <mesh position={[0.66, 0.255, 0]} material={m.antiqueGold}>
          <sphereGeometry args={[0.035, 10, 8]} />
        </mesh>
        {/* oil */}
        <mesh position={[0, 0.215, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.36, 24]} />
          <meshStandardMaterial color="#8a5a12" roughness={0.15} metalness={0.2} />
        </mesh>
        <group position={[0.66, 0.285, 0]}>
          <Flame scale={1.7} seed={scale} glow={1.4} />
        </group>
      </group>
      {light && (
        <pointLight ref={lightRef} position={[0.5, 1.4, 0.8]} color="#ffb766" intensity={7} distance={16} decay={2} />
      )}
    </group>
  )
}

