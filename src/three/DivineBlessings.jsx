import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mats } from './materials.js'
import { getGlow } from './parts.jsx'

/**
 * 3D Divine Blessings Sanctum of Sri Sita Rama Kalyanam
 * Floating golden Prabhavali shrine arch with radiant divine halo,
 * sacred portraits of Sri Sita Rama, gentle levitation animation, and warm blessings glow.
 */
export default function DivineBlessings({
  position = [0, 4.3, -2.6],
  rotation = [0, 0, 0],
  scale = 1,
  portrait = '/media/rama-sita-devotional.png',
  width = 2.4,
  height = 3.4,
}) {
  const m = mats()
  const shrineRef = useRef()
  const haloRef = useRef()
  const raysRef = useRef()
  const [texture, setTexture] = [useMemo(() => {
    const l = new THREE.TextureLoader()
    const t = l.load(portrait)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [portrait])]

  useEffect(() => () => texture.dispose(), [texture])

  // Sunburst Prabhavali Arch Geometry
  const archRays = useMemo(() => {
    const count = 28
    const rays = []
    const radius = width * 0.72
    for (let i = 0; i < count; i++) {
      const angle = (i / (count - 1)) * Math.PI
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      rays.push({ x, y, rot: angle - Math.PI / 2, len: i % 2 === 0 ? 0.35 : 0.22 })
    }
    return rays
  }, [width])

  useFrame(({ clock }) => {
    if (!shrineRef.current) return
    const t = clock.elapsedTime
    // Gentle divine floating levitation
    shrineRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.08
    shrineRef.current.rotation.y = rotation[1] + Math.sin(t * 0.4) * 0.03
    shrineRef.current.rotation.z = Math.cos(t * 0.5) * 0.015

    // Pulsing divine halo
    if (haloRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.08
      haloRef.current.scale.set(width * 2.8 * pulse, height * 2.4 * pulse, 1)
      haloRef.current.material.opacity = 0.38 + Math.sin(t * 1.5) * 0.08
    }

    // Shimmering divine rays
    if (raysRef.current) {
      raysRef.current.rotation.z = t * 0.1
    }
  })

  const border = 0.14
  const depth = 0.08

  return (
    <group ref={shrineRef} position={position} rotation={rotation} scale={scale}>
      {/* Divine golden halo aura backdrop */}
      <sprite ref={haloRef} position={[0, 0.2, -0.25]} scale={[width * 2.8, height * 2.4, 1]}>
        <spriteMaterial
          map={getGlow()}
          color="#ffca6b"
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

      <sprite position={[0, 0.2, -0.15]} scale={[width * 1.8, height * 1.6, 1]}>
        <spriteMaterial
          map={getGlow()}
          color="#fff5cc"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

      {/* Rotating celestial sun rays behind the arch */}
      <group ref={raysRef} position={[0, height * 0.25, -0.1]}>
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 16) * Math.PI * 2]}>
            <coneGeometry args={[0.06, width * 1.6, 3]} />
            <meshBasicMaterial
              color="#ffd980"
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Ornate Golden Prabhavali Arch Header */}
      <group position={[0, height * 0.48, 0]}>
        <mesh material={m.gold}>
          <torusGeometry args={[width * 0.58, 0.08, 12, 32, Math.PI]} />
        </mesh>
        <mesh material={m.antiqueGold} position={[0, 0, 0.02]}>
          <torusGeometry args={[width * 0.52, 0.04, 10, 32, Math.PI]} />
        </mesh>

        {/* Crown Kalash Finial atop Prabhavali */}
        <group position={[0, width * 0.62, 0.04]}>
          <mesh material={m.gold}>
            <sphereGeometry args={[0.18, 16, 16]} />
          </mesh>
          <mesh position={[0, 0.22, 0]} material={m.antiqueGold}>
            <coneGeometry args={[0.12, 0.35, 12]} />
          </mesh>
          <mesh position={[0, 0.44, 0]} material={m.gold}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
        </group>

        {/* Radiating sunburst spikes along the prabhavali arch */}
        {archRays.map((r, i) => (
          <group key={i} position={[r.x, r.y, 0.02]} rotation={[0, 0, r.rot]}>
            <mesh material={m.gold}>
              <coneGeometry args={[0.04, r.len, 6]} />
            </mesh>
            <mesh position={[0, r.len / 2, 0]} material={m.antiqueGold}>
              <sphereGeometry args={[0.035, 8, 8]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Frame backing in pure white marble with gold border */}
      <mesh position={[0, 0, -0.04]} material={m.marble || m.ivory}>
        <boxGeometry args={[width + border * 2.2, height + border * 2.2, 0.06]} />
      </mesh>

      {/* Divine Portrait Plane */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Outer Golden Bevelled Frame */}
      <mesh material={m.gold} position={[0, 0, 0.04]}>
        <boxGeometry args={[width + border * 2, border, depth]} />
      </mesh>
      <mesh material={m.gold} position={[0, height / 2 + border / 2, 0.04]}>
        <boxGeometry args={[width + border * 2, border, depth]} />
      </mesh>
      <mesh material={m.gold} position={[0, -height / 2 - border / 2, 0.04]}>
        <boxGeometry args={[width + border * 2, border, depth]} />
      </mesh>
      <mesh material={m.gold} position={[-width / 2 - border / 2, 0, 0.04]}>
        <boxGeometry args={[border, height, depth]} />
      </mesh>
      <mesh material={m.gold} position={[width / 2 + border / 2, 0, 0.04]}>
        <boxGeometry args={[border, height, depth]} />
      </mesh>

      {/* Lotus Pedestal Base */}
      <group position={[0, -height / 2 - border - 0.22, 0.05]}>
        <mesh material={m.gold}>
          <cylinderGeometry args={[width * 0.65, width * 0.75, 0.22, 24]} />
        </mesh>
        <mesh position={[0, -0.16, 0]} material={m.marble || m.ivory}>
          <cylinderGeometry args={[width * 0.78, width * 0.85, 0.14, 24]} />
        </mesh>
      </group>

      {/* Divine warmth point light */}
      <pointLight position={[0, 0, 0.8]} color="#ffdda1" distance={8} decay={1.8} intensity={4} />
    </group>
  )
}
