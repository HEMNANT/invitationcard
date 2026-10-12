import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getGlow } from './parts.jsx'
import { world } from '../lib/world.js'

const PETAL_COLORS = ['#ffffff', '#ffffff', '#fffbf2', '#fbf5e8', '#f8eccd', '#d4af37']

/**
 * Drifting marigold / rose petals and tiny gold dust, kept in a volume that follows the camera
 * so there is always atmosphere in frame without simulating the whole world.
 */
export default function FloatingPetals({ petals = 60, dust = 100, animate = true }) {
  const group = useRef()
  const mesh = useRef()
  const points = useRef()
  const camera = useThree((s) => s.camera)

  const BOX = useMemo(() => new THREE.Vector3(9, 6, 14), [])
  const state = useMemo(() => {
    const rnd = (a, b) => a + Math.random() * (b - a)
    return Array.from({ length: petals }, () => ({
      x: rnd(-BOX.x / 2, BOX.x / 2),
      y: rnd(0, BOX.y),
      z: rnd(-BOX.z, 0),
      vy: rnd(0.06, 0.16),
      sway: rnd(0.3, 0.8),
      ph: rnd(0, 6.28),
      rs: rnd(0.2, 0.7),
      s: rnd(0.05, 0.1),
    }))
  }, [petals, BOX])

  const dustData = useMemo(() => {
    const pos = new Float32Array(dust * 3)
    for (let i = 0; i < dust; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOX.x
      pos[i * 3 + 1] = Math.random() * BOX.y
      pos[i * 3 + 2] = -Math.random() * BOX.z
    }
    return pos
  }, [dust, BOX])

  const petalGeo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, -1)
    s.quadraticCurveTo(0.9, -0.2, 0, 1)
    s.quadraticCurveTo(-0.9, -0.2, 0, -1)
    const g = new THREE.ShapeGeometry(s, 6)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) p.setZ(i, Math.abs(p.getX(i)) * 0.35) // gentle cup
    g.computeVertexNormals()
    return g
  }, [])
  useEffect(() => () => petalGeo.dispose(), [petalGeo])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    const im = mesh.current
    if (!im) return
    const c = new THREE.Color()
    state.forEach((p, i) => {
      c.set(PETAL_COLORS[i % PETAL_COLORS.length])
      im.setColorAt(i, c)
      dummy.position.set(p.x, p.y, p.z)
      dummy.scale.setScalar(p.s)
      dummy.updateMatrix()
      im.setMatrixAt(i, dummy.matrix)
    })
    im.instanceMatrix.needsUpdate = true
    if (im.instanceColor) im.instanceColor.needsUpdate = true
  }, [state, dummy])

  useFrame(({ clock }, dt) => {
    // The volume trails the camera, looking down its forward axis.
    if (group.current) {
      group.current.position.copy(camera.position)
      group.current.quaternion.copy(camera.quaternion)
      group.current.translateX(0)
      group.current.position.y = Math.max(0, camera.position.y - 2.6)
    }
    if (!animate || world.reduced) return
    const im = mesh.current
    if (!im) return
    const t = clock.elapsedTime
    const d = Math.min(dt, 0.05)
    for (let i = 0; i < state.length; i++) {
      const p = state[i]
      p.y -= p.vy * d
      if (p.y < -0.5) p.y = BOX.y
      dummy.position.set(p.x + Math.sin(t * 0.6 * p.sway + p.ph) * 0.5, p.y, p.z)
      dummy.rotation.set(t * p.rs + p.ph, t * p.rs * 0.7, t * 0.4 * p.rs)
      dummy.scale.setScalar(p.s)
      dummy.updateMatrix()
      im.setMatrixAt(i, dummy.matrix)
    }
    im.instanceMatrix.needsUpdate = true

    const pa = points.current?.geometry.attributes.position
    if (pa) {
      for (let i = 0; i < dust; i++) {
        let y = pa.getY(i) + d * 0.05
        if (y > BOX.y) y = 0
        pa.setY(i, y)
        pa.setX(i, pa.getX(i) + Math.sin(t * 0.3 + i) * d * 0.02)
      }
      pa.needsUpdate = true
    }
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, petals]} geometry={petalGeo} frustumCulled={false}>
        <meshStandardMaterial side={THREE.DoubleSide} roughness={0.7} emissive="#331400" emissiveIntensity={0.6} />
      </instancedMesh>
      <points ref={points} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustData, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={getGlow()}
          color="#ffd88a"
          size={0.06}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  )
}
