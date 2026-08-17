'use client'

import { Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollProgress } from '@/lib/motion/scrollProgress'

const COLS = 6
const ROWS = 3
const SPACING = 1.5
const CELL_SIZE = 1.3
// Mirrors the CSS palette in globals.css (paper, dim, accent, raised).
const PALETTE = ['#f5efe0', '#a39b8b', '#e8b44a', '#1e1b16']

interface HeroSceneProps {
  images: string[]
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t))
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/**
 * Deterministic pseudo-random in [0, 1), seeded by index. Scatter positions
 * only need to look random, not be random. Math.random() during render
 * (even inside useMemo) trips React's purity rule, since the memo callback
 * is expected to be idempotent for the same inputs.
 */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

interface Piece {
  scattered: THREE.Vector3
  scatteredRotation: THREE.Euler
  assembled: THREE.Vector3
  color: string
}

function useGrid(): Piece[] {
  return useMemo(() => {
    const pieces: Piece[] = []
    let i = 0
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const seed = i * 7.1301
        pieces.push({
          assembled: new THREE.Vector3(
            (col - (COLS - 1) / 2) * SPACING,
            (row - (ROWS - 1) / 2) * SPACING,
            0
          ),
          scattered: new THREE.Vector3(
            (seededRandom(seed + 0.1) - 0.5) * 16,
            (seededRandom(seed + 0.2) - 0.5) * 12,
            -8 - seededRandom(seed + 0.3) * 14
          ),
          scatteredRotation: new THREE.Euler(
            (seededRandom(seed + 0.4) - 0.5) * Math.PI,
            (seededRandom(seed + 0.5) - 0.5) * Math.PI,
            (seededRandom(seed + 0.6) - 0.5) * Math.PI
          ),
          color: PALETTE[i % PALETTE.length],
        })
        i++
      }
    }
    return pieces
  }, [])
}

/** Assembles from scattered to grid over the first 40% of scroll progress, GSAP/ScrollTrigger writes progress, this reads it directly rather than through React state. */
function useAssemble(ref: React.RefObject<THREE.Mesh | null>, piece: Piece) {
  useFrame(() => {
    if (!ref.current) return
    const progress = useScrollProgress.getState().progress
    const t = easeInOutCubic(clamp01(progress / 0.4))

    ref.current.position.lerpVectors(piece.scattered, piece.assembled, t)
    ref.current.rotation.set(
      lerp(piece.scatteredRotation.x, 0, t),
      lerp(piece.scatteredRotation.y, 0, t),
      lerp(piece.scatteredRotation.z, 0, t)
    )
  })
}

function ColorPiece({ piece }: { piece: Piece }) {
  const ref = useRef<THREE.Mesh>(null)
  useAssemble(ref, piece)

  return (
    <mesh ref={ref}>
      <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
      <meshBasicMaterial color={piece.color} side={THREE.DoubleSide} />
    </mesh>
  )
}

function TexturedPiece({ piece, imageUrl }: { piece: Piece; imageUrl: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const texture = useTexture(imageUrl)
  useAssemble(ref, piece)

  const image = texture.image as { width: number; height: number } | undefined
  const aspect = image ? image.width / image.height : 1
  const [w, h] = aspect >= 1 ? [CELL_SIZE, CELL_SIZE / aspect] : [CELL_SIZE * aspect, CELL_SIZE]

  return (
    <mesh ref={ref} scale={[w, h, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

/** Dollies through the assembled grid over the remaining 60% of scroll progress. */
function CameraRig() {
  useFrame(({ camera }) => {
    const progress = useScrollProgress.getState().progress
    const t = easeInOutCubic(clamp01((progress - 0.4) / 0.6))
    camera.position.z = lerp(11, 1.2, t)
    camera.position.x = Math.sin(t * Math.PI) * 0.6
  })
  return null
}

export default function HeroScene({ images }: HeroSceneProps) {
  const pieces = useGrid()

  return (
    <>
      <CameraRig />
      <Suspense fallback={null}>
        {pieces.map((piece, i) =>
          images.length > 0 ? (
            <TexturedPiece key={i} piece={piece} imageUrl={images[i % images.length]} />
          ) : (
            <ColorPiece key={i} piece={piece} />
          )
        )}
      </Suspense>
    </>
  )
}
