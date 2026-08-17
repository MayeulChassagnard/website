'use client'

import Reveal from '@/components/motion/Reveal'
import ParallaxMedia from '@/components/motion/ParallaxMedia'
import GalleryPhoto from '@/components/media/GalleryPhoto'
import VideoWork from '@/components/media/VideoWork'
import BeforeAfterSlider from '@/components/motion/BeforeAfterSlider'
import Sculpture from '@/components/three/Sculpture'
import Mosaic from '@/components/three/Mosaic'
import { PHOTOS, flickrSize, videoById } from '@/lib/content/media'
import { photoAt, type Block } from '@/lib/content/projects'

/**
 * Renders a project's media sequence.
 *
 * The alternation between full-bleed media and near-empty space is what
 * makes a project read as an exhibition rather than an article, so the
 * vertical rhythm lives here per block type rather than in a uniform
 * container.
 */
export default function ProjectBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'text':
            return (
              <section key={i} className="px-6 py-28 md:px-10 md:py-40">
                <Reveal className="mx-auto max-w-3xl">
                  <p className="body-copy">{block.body}</p>
                </Reveal>
              </section>
            )

          case 'photo': {
            const photo = photoAt(block.photoIndex)

            if (block.scale === 'bleed') {
              return (
                <section key={i} className="py-16">
                  <ParallaxMedia className="h-[92svh] w-full" strength={16}>
                    <GalleryPhoto
                      photo={photo}
                      photos={PHOTOS}
                      index={block.photoIndex % PHOTOS.length}
                      sizes="100vw"
                      className="h-full"
                    />
                  </ParallaxMedia>
                </section>
              )
            }

            if (block.scale === 'full') {
              return (
                <section key={i} className="px-6 py-16 md:px-10">
                  <ParallaxMedia className="h-[78svh] w-full" strength={12} mask>
                    <GalleryPhoto
                      photo={photo}
                      photos={PHOTOS}
                      index={block.photoIndex % PHOTOS.length}
                      sizes="100vw"
                      className="h-full"
                    />
                  </ParallaxMedia>
                </section>
              )
            }

            // inset: a single print centred in a lot of air
            return (
              <section key={i} className="flex justify-center px-6 py-28 md:py-40">
                <Reveal className="w-full max-w-xl">
                  <GalleryPhoto
                    photo={photo}
                    photos={PHOTOS}
                    index={block.photoIndex % PHOTOS.length}
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </Reveal>
              </section>
            )
          }

          case 'pair':
            return (
              <section key={i} className="grid grid-cols-1 gap-6 px-6 py-16 md:grid-cols-2 md:px-10">
                {block.photoIndexes.map((photoIndex, j) => (
                  <Reveal key={j} delay={j * 0.12} className={j === 1 ? 'md:pt-28' : undefined}>
                    <GalleryPhoto
                      photo={photoAt(photoIndex)}
                      photos={PHOTOS}
                      index={photoIndex % PHOTOS.length}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </Reveal>
                ))}
              </section>
            )

          case 'video': {
            const video = videoById(block.videoId)
            if (!video) return null
            return (
              <section key={i} className="px-6 py-16 md:px-10">
                <VideoWork
                  videoId={video.id}
                  title={video.title}
                  poster={video.poster}
                  caption={block.caption}
                />
              </section>
            )
          }

          case 'compare': {
            const photo = photoAt(block.photoIndex)
            return (
              <section key={i} className="px-6 py-28 md:px-10 md:py-40">
                <Reveal className="mx-auto max-w-4xl">
                  <BeforeAfterSlider
                    beforeSrc={photo.url}
                    afterSrc={photo.url}
                    beforeFilter="saturate(0.4) contrast(0.85) brightness(1.1)"
                    beforeLabel="Brut"
                    afterLabel="Étalonné"
                  />
                  {block.caption && (
                    <p className="label-sm mt-4 text-bone-faint">{block.caption}</p>
                  )}
                </Reveal>
              </section>
            )
          }

          case 'sculpture':
            return (
              <section key={i} className="py-16">
                <Sculpture caption={block.caption} />
              </section>
            )

          case 'mosaic':
            return (
              <section key={i} className="py-16">
                <Mosaic
                  images={PHOTOS.slice(0, 18).map(p => flickrSize(p.url, 'c'))}
                  stillSrc={PHOTOS[0].url}
                  caption={block.caption}
                />
              </section>
            )

          default:
            return null
        }
      })}
    </>
  )
}
