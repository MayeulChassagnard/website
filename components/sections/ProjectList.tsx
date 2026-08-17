'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

export interface ProjectRow {
  title: string
  client: string
  year: string
  category: string
  imageUrl?: string
}

/**
 * Editorial project index. Hovering a row surfaces a preview that trails the
 * cursor.
 *
 * The preview is purely decorative (aria-hidden, pointer-events-none) and
 * every row stays fully legible without it, so touch and keyboard users lose
 * nothing. It is skipped entirely under reduced motion.
 */
export default function ProjectList({ projects }: { projects: ProjectRow[] }) {
  const [active, setActive] = useState<number | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const handleMove = (e: React.MouseEvent) => {
    if (reducedMotion) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const activeProject = active !== null ? projects[active] : undefined

  return (
    <div ref={containerRef} className="relative" onMouseMove={handleMove}>
      <ul className="border-t border-line">
        {projects.map((project, i) => (
          <li key={project.title}>
            <div
              className="group grid cursor-default grid-cols-12 items-baseline gap-4 border-b border-line px-6 py-7 transition-colors duration-300 hover:bg-ink-soft"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="eyebrow col-span-2 text-paper-faint md:col-span-1">{project.year}</span>
              <h3 className="display-md col-span-10 md:col-span-6 transition-transform duration-300 group-hover:translate-x-2">
                {project.title}
              </h3>
              <span className="col-span-6 hidden text-sm text-paper-dim md:col-span-3 md:block">
                {project.client}
              </span>
              <span className="eyebrow col-span-12 text-accent md:col-span-2 md:text-right">
                {project.category}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {!reducedMotion && activeProject?.imageUrl && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-20 hidden md:block"
          style={{
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -50%)',
            transition: 'left 220ms cubic-bezier(0.22,1,0.36,1), top 220ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <Image
            src={activeProject.imageUrl}
            alt=""
            width={340}
            height={420}
            className="h-[300px] w-[240px] object-cover shadow-2xl"
          />
        </div>
      )}
    </div>
  )
}
