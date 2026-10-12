import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect } from 'react'
import WeddingEnvironment from './WeddingEnvironment.jsx'
import { BUDGET } from '../lib/capabilities.js'
import { disposeMats } from './materials.js'
import { disposeGlow } from './parts.jsx'

/** The single WebGL canvas. All readable content stays in HTML above it. */
export default function Scene({ tier, onReady, ...props }) {
  const budget = BUDGET[tier] || BUDGET.mid

  useEffect(
    () => () => {
      disposeMats()
      disposeGlow()
    },
    [],
  )

  return (
    <Canvas
      aria-hidden="true"
      className="scene-canvas"
      dpr={budget.dpr}
      shadows={budget.shadows ? 'soft' : false}
      camera={{ fov: 48, near: 0.1, far: 140, position: [0, 2.7, 16] }}
      gl={{
        antialias: budget.antialias,
        powerPreference: 'high-performance',
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        onReady?.()
      }}
    >
      <WeddingEnvironment tier={tier} {...props} />
    </Canvas>
  )
}
