import { memo } from 'react'

/**
 * TreeBranches
 * Royal botanical tree branches & floating leaves with scroll-reactive animations.
 * Frames T. Haarika & B. Manoj's portrait with lush temple garden foliage (Kalpavriksha aesthetic).
 */

export const TreeBranchLeft = memo(function TreeBranchLeft({ progress = 0 }) {
  // Gentle scroll-driven sway: tilts and glides as guest scrolls
  const translateY = (progress - 0.5) * 28
  const rotate = (progress - 0.5) * 6

  return (
    <div
      className="tree-branch tree-branch--left"
      style={{
        transform: `translate3d(0, ${translateY}px, 0) rotate(${rotate}deg)`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="tree-branch__svg"
      >
        <defs>
          <linearGradient id="leafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a7c59" />
            <stop offset="60%" stopColor="#2c5539" />
            <stop offset="100%" stopColor="#1e3a27" />
          </linearGradient>
          <linearGradient id="goldLeafLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fae08c" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9a7b1c" />
          </linearGradient>
          <linearGradient id="barkGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8c6a2c" />
            <stop offset="100%" stopColor="#4a3415" />
          </linearGradient>
        </defs>

        {/* Main curved tree branch trunk */}
        <path
          d="M -10 10 Q 50 60 70 120 T 95 210 Q 100 260 85 310"
          stroke="url(#barkGradLeft)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Secondary branch 1 */}
        <path
          d="M 50 60 Q 110 50 145 95"
          stroke="url(#barkGradLeft)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Secondary branch 2 */}
        <path
          d="M 70 120 Q 130 140 160 190"
          stroke="url(#barkGradLeft)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Secondary branch 3 */}
        <path
          d="M 95 210 Q 135 235 155 270"
          stroke="url(#barkGradLeft)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Leaves along branch 1 */}
        <path
          d="M 145 95 C 160 80 185 85 190 105 C 175 115 155 110 145 95 Z"
          fill="url(#leafGradLeft)"
          className="tree-leaf tree-leaf--sway1"
        />
        <path
          d="M 115 65 C 130 45 155 50 160 68 C 145 78 125 75 115 65 Z"
          fill="url(#goldLeafLeft)"
          className="tree-leaf tree-leaf--sway2"
        />
        <path
          d="M 80 50 C 95 30 120 35 125 52 C 110 62 90 60 80 50 Z"
          fill="url(#leafGradLeft)"
          className="tree-leaf tree-leaf--sway3"
        />

        {/* Leaves along branch 2 */}
        <path
          d="M 160 190 C 180 180 198 195 195 215 C 175 220 160 205 160 190 Z"
          fill="url(#leafGradLeft)"
          className="tree-leaf tree-leaf--sway2"
        />
        <path
          d="M 125 140 C 145 125 165 135 165 155 C 145 160 130 150 125 140 Z"
          fill="url(#goldLeafLeft)"
          className="tree-leaf tree-leaf--sway1"
        />
        <path
          d="M 100 130 C 120 115 138 122 140 140 C 122 145 108 138 100 130 Z"
          fill="url(#leafGradLeft)"
          className="tree-leaf tree-leaf--sway3"
        />

        {/* Leaves along branch 3 */}
        <path
          d="M 155 270 C 175 260 190 275 185 295 C 168 298 155 285 155 270 Z"
          fill="url(#leafGradLeft)"
          className="tree-leaf tree-leaf--sway1"
        />
        <path
          d="M 120 225 C 140 210 158 220 155 238 C 138 245 125 235 120 225 Z"
          fill="url(#goldLeafLeft)"
          className="tree-leaf tree-leaf--sway2"
        />

        {/* Golden blossoms / jasmine flowers */}
        <circle cx="145" cy="95" r="4" fill="#ffffff" stroke="#d4af37" strokeWidth="1.5" />
        <circle cx="160" cy="190" r="4.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1.5" />
        <circle cx="155" cy="270" r="3.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1.5" />
        <circle cx="95" cy="70" r="3" fill="#fae08c" />
        <circle cx="130" cy="165" r="3" fill="#fae08c" />
      </svg>
    </div>
  )
})

export const TreeBranchRight = memo(function TreeBranchRight({ progress = 0 }) {
  // Synchronous counter-sway
  const translateY = (progress - 0.5) * -24
  const rotate = (progress - 0.5) * -5

  return (
    <div
      className="tree-branch tree-branch--right"
      style={{
        transform: `translate3d(0, ${translateY}px, 0) rotate(${rotate}deg)`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="tree-branch__svg"
      >
        <defs>
          <linearGradient id="leafGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a7c59" />
            <stop offset="60%" stopColor="#2c5539" />
            <stop offset="100%" stopColor="#1e3a27" />
          </linearGradient>
          <linearGradient id="goldLeafRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fae08c" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9a7b1c" />
          </linearGradient>
          <linearGradient id="barkGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8c6a2c" />
            <stop offset="100%" stopColor="#4a3415" />
          </linearGradient>
        </defs>

        {/* Main branch trunk curving from top-right */}
        <path
          d="M 210 10 Q 150 60 130 120 T 105 210 Q 100 260 115 310"
          stroke="url(#barkGradRight)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Secondary branch 1 */}
        <path
          d="M 150 60 Q 90 50 55 95"
          stroke="url(#barkGradRight)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Secondary branch 2 */}
        <path
          d="M 130 120 Q 70 140 40 190"
          stroke="url(#barkGradRight)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Secondary branch 3 */}
        <path
          d="M 105 210 Q 65 235 45 270"
          stroke="url(#barkGradRight)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Leaves along branch 1 */}
        <path
          d="M 55 95 C 40 80 15 85 10 105 C 25 115 45 110 55 95 Z"
          fill="url(#leafGradRight)"
          className="tree-leaf tree-leaf--sway1"
        />
        <path
          d="M 85 65 C 70 45 45 50 40 68 C 55 78 75 75 85 65 Z"
          fill="url(#goldLeafRight)"
          className="tree-leaf tree-leaf--sway2"
        />
        <path
          d="M 120 50 C 105 30 80 35 75 52 C 90 62 110 60 120 50 Z"
          fill="url(#leafGradRight)"
          className="tree-leaf tree-leaf--sway3"
        />

        {/* Leaves along branch 2 */}
        <path
          d="M 40 190 C 20 180 2 195 5 215 C 25 220 40 205 40 190 Z"
          fill="url(#leafGradRight)"
          className="tree-leaf tree-leaf--sway2"
        />
        <path
          d="M 75 140 C 55 125 35 135 35 155 C 55 160 70 150 75 140 Z"
          fill="url(#goldLeafRight)"
          className="tree-leaf tree-leaf--sway1"
        />
        <path
          d="M 100 130 C 80 115 62 122 60 140 C 78 145 92 138 100 130 Z"
          fill="url(#leafGradRight)"
          className="tree-leaf tree-leaf--sway3"
        />

        {/* Leaves along branch 3 */}
        <path
          d="M 45 270 C 25 260 10 275 15 295 C 32 298 45 285 45 270 Z"
          fill="url(#leafGradRight)"
          className="tree-leaf tree-leaf--sway1"
        />
        <path
          d="M 80 225 C 60 210 42 220 45 238 C 62 245 75 235 80 225 Z"
          fill="url(#goldLeafRight)"
          className="tree-leaf tree-leaf--sway2"
        />

        {/* Golden blossoms / jasmine flowers */}
        <circle cx="55" cy="95" r="4" fill="#ffffff" stroke="#d4af37" strokeWidth="1.5" />
        <circle cx="40" cy="190" r="4.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1.5" />
        <circle cx="45" cy="270" r="3.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1.5" />
        <circle cx="105" cy="70" r="3" fill="#fae08c" />
        <circle cx="70" cy="165" r="3" fill="#fae08c" />
      </svg>
    </div>
  )
})

export const FloatingLeaves = memo(function FloatingLeaves({ progress = 0 }) {
  // Drifting golden leaves & jasmine petals responsive to scroll
  const offset = progress * 60

  return (
    <div className="floating-leaves-wrap" aria-hidden="true">
      <span
        className="drift-leaf drift-leaf--1"
        style={{ transform: `translate3d(0, ${offset * 1.2}px, 0)` }}
      />
      <span
        className="drift-leaf drift-leaf--2"
        style={{ transform: `translate3d(0, ${offset * 0.8}px, 0)` }}
      />
      <span
        className="drift-leaf drift-leaf--3"
        style={{ transform: `translate3d(0, ${offset * 1.5}px, 0)` }}
      />
      <span
        className="drift-petal drift-petal--1"
        style={{ transform: `translate3d(0, ${offset * 1.1}px, 0)` }}
      />
      <span
        className="drift-petal drift-petal--2"
        style={{ transform: `translate3d(0, ${offset * 0.9}px, 0)` }}
      />
    </div>
  )
})
