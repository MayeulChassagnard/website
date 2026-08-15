'use client'

import { Canvas } from '@react-three/fiber'
import HeroScene from './HeroScene'

/**
 * Everything that touches three.js lives in this one file so the dynamic
 * import in AssemblyHero keeps the whole R3F/three bundle out of every
 * route that doesn't render the hero (blog, galleries, contact).
 */
export default function HeroCanvas({ images }: { images: string[] }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 50 }}
      dpr={[1, 2]}
      className="h-full w-full"
    >
      <HeroScene images={images} />
    </Canvas>
  )
}
