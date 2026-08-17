'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollProgress } from '@/lib/motion/scrollProgress'

const COLS = 6
const ROWS = 3
const SPACING = 1.5
const CELL = 1.3

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Deterministic pseudo-random in [0,1) from an index. The scatter only needs
 * to look arbitrary, and Math.random() during render would break React's
 * purity rule (useMemo must be idempotent for the same inputs).
 */
function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

interface Piece {
  scattered: THREE.Vector3
  scatteredRotation: THREE.Euler
  assembled: THREE.Vector3
}

function useGrid(): Piece[] {
  return useMemo(() => {
    const pieces: Piece[] = []
    let i = 0
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const s = i * 7.1301
        pieces.push({
          assembled: new THREE.Vector3(
            (col - (COLS - 1) / 2) * SPACING,
            (row - (ROWS - 1) / 2) * SPACING,
            0
          ),
          scattered: new THREE.Vector3(
            (seeded(s + 0.1) - 0.5) * 17,
            (seeded(s + 0.2) - 0.5) * 13,
            -9 - seeded(s + 0.3) * 15
          ),
          scatteredRotation: new THREE.Euler(
            (seeded(s + 0.4) - 0.5) * Math.PI,
            (seeded(s + 0.5) - 0.5) * Math.PI,
            (seeded(s + 0.6) - 0.5) * Math.PI
          ),
        })
        i++
      }
    }
    return pieces
  }, [])
}

/** Reads scroll progress straight from the store in useFrame, so GSAP's and R3F's loops stay decoupled. */
function useAssemble(ref: React.RefObject<THREE.Mesh | null>, piece: Piece) {
  useFrame(() => {
    if (!ref.current) return
    const t = easeInOut(clamp01(useScrollProgress.getState().progress / 0.45))
    ref.current.position.lerpVectors(piece.scattered, piece.assembled, t)
    ref.current.rotation.set(
      lerp(piece.scatteredRotation.x, 0, t),
      lerp(piece.scatteredRotation.y, 0, t),
      lerp(piece.scatteredRotation.z, 0, t)
    )
  })
}

function Fragment({ piece, url }: { piece: Piece; url: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const texture = useTexture(url)
  useAssemble(ref, piece)

  const image = texture.image as { width: number; height: number } | undefined
  const aspect = image ? image.width / image.height : 1
  const [w, h] = aspect >= 1 ? [CELL, CELL / aspect] : [CELL * aspect, CELL]

  return (
    <mesh ref={ref} scale={[w, h, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

function CameraRig() {
  useFrame(({ camera }) => {
    const progress = useScrollProgress.getState().progress
    const t = easeInOut(clamp01((progress - 0.45) / 0.55))
    camera.position.z = lerp(11.5, 1, t)
    camera.position.x = Math.sin(t * Math.PI) * 0.5
  })
  return null
}

export default function MosaicScene({ images }: { images: string[] }) {
  const pieces = useGrid()

  return (
    <Canvas camera={{ position: [0, 0, 11.5], fov: 50 }} dpr={[1, 1.75]} className="h-full w-full">
      <color attach="background" args={['#000000']} />
      <CameraRig />
      <Suspense fallback={null}>
        {pieces.map((piece, i) => (
          <Fragment key={i} piece={piece} url={images[i % images.length]} />
        ))}
      </Suspense>
    </Canvas>
  )
}
