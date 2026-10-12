import * as THREE from 'three'

let cache = null

const std = (o) => new THREE.MeshStandardMaterial(o)

/** Shared physically-based materials. */
export function mats() {
  if (cache) return cache
  cache = {
    gold: std({ color: '#D4AF37', metalness: 0.95, roughness: 0.22, envMapIntensity: 1.6 }),
    antiqueGold: std({ color: '#B8860B', metalness: 0.92, roughness: 0.35, envMapIntensity: 1.3 }),
    brass: std({ color: '#D9A74A', metalness: 0.95, roughness: 0.28, envMapIntensity: 1.4 }),
    maroon: std({ color: '#FFFFFF', roughness: 0.55, metalness: 0.05 }), // Royal white canopy & accents
    maroonDeep: std({ color: '#F7F2E8', roughness: 0.65, metalness: 0.04 }), // Pearl ivory trims
    wood: std({ color: '#E8DFD3', roughness: 0.55, metalness: 0.05 }), // White sandalwood / teak
    temple: std({ color: '#FAF7F2', roughness: 0.3, metalness: 0.04 }), // Carved Makrana white marble
    stone: std({ color: '#F4ECE1', roughness: 0.28, metalness: 0.05 }), // Polished white marble floor & base
    marble: std({ color: '#FFFFFF', roughness: 0.22, metalness: 0.06, envMapIntensity: 1.4 }),
    ivory: std({ color: '#FFFFFF', roughness: 0.5 }),
    banana: std({ color: '#458530', roughness: 0.6, side: THREE.DoubleSide }),
    stem: std({ color: '#3f6828', roughness: 0.8 }),
    marigold: std({ color: '#ffffff', roughness: 0.65 }),
    jasmine: std({ color: '#ffffff', roughness: 0.5 }),
  }
  return cache
}

export function disposeMats() {
  if (!cache) return
  Object.values(cache).forEach((m) => m.dispose())
  cache = null
}

export const MARIGOLD_COLORS = ['#ffffff', '#fff9e6', '#f6c12e', '#e8901c']
export const JASMINE_COLORS = ['#ffffff', '#fdfbf7', '#fff8ec']
