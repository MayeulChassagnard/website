'use client'

import Reveal from '@/components/motion/Reveal'
import ParallaxMedia from '@/components/motion/ParallaxMedia'
import ScaleStage from '@/components/motion/ScaleStage'
import MaskReveal from '@/components/motion/MaskReveal'
import GalleryPhoto from '@/components/media/GalleryPhoto'
import CinemaVideo from '@/components/media/CinemaVideo'
import LoopClip from '@/components/media/LoopClip'
import BeforeAfterSlider from '@/components/motion/BeforeAfterSlider'
import PhotoStack from '@/components/sections/PhotoStack'
import Sculpture from '@/components/three/Sculpture'
import PhotoCorridor from '@/components/three/PhotoCorridor'
import { CORRIDOR_STILL, PHOTOS, clipById, flickrSize, plateById, videoById } from '@/lib/content/media'
import { photoAt, type Block } from '@/lib/content/projects'

/**
 * Renders a project's media sequence.
 *
 * The alternation between full-bleed media and near-empty space is what makes
 * a project read as an exhibition rather than an article, so the vertical
 * rhythm is set per block type here rather than by one uniform container.
 */
export default function ProjectBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'text':
            return (
              <section key={i} className="px-6 py-28 md:px-10 md:py-40">
                <div className="mx-auto max-w-3xl">
                  <MaskReveal text={block.body} as="p" className="body-copy text-xl md:text-2xl" scrub />
                </div>
              </section>
            )

          case 'photo': {
            const photo = photoAt(block.photoIndex)
            const photoIndex = block.photoIndex % PHOTOS.length

            if (block.scale === 'bleed') {
              return (
                <section key={i} className="py-16">
                  <ParallaxMedia className="h-[94svh] w-full" strength={18}>
                    <GalleryPhoto
                      photo={photo}
                      photos={PHOTOS}
                      index={photoIndex}
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
                  <ParallaxMedia className="h-[80svh] w-full" strength={13} mask>
                    <GalleryPhoto
                      photo={photo}
                      photos={PHOTOS}
                      index={photoIndex}
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
                    index={photoIndex}
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
                  <Reveal key={j} delay={j * 0.12} className={j === 1 ? 'md:pt-32' : undefined}>
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

            // Films open from a small print to full bleed, so a video is a
            // staged moment rather than a rectangle dropped into the column.
            return (
              <ScaleStage key={i} label={block.caption}>
                <CinemaVideo videoId={video.id} title={video.title} poster={video.poster} />
              </ScaleStage>
            )
          }

          case 'clip': {
            const clip = clipById(block.clipId)
            if (!clip) return null

            // Staged like the films rather than dropped in at print size: a
            // render is the work here, not an illustration of it.
            return (
              <ScaleStage key={i} label={block.caption}>
                <LoopClip clip={clip} />
              </ScaleStage>
            )
          }

          case 'compare': {
            const after = photoAt(block.photoIndex)
            const before = block.beforePlateId ? plateById(block.beforePlateId) : undefined

            // With no plate to show, the photograph is compared against
            // itself de-graded: a grading has one source file by definition.
            return (
              <BeforeAfterSlider
                key={i}
                beforeSrc={before?.url ?? after.url}
                afterSrc={after.url}
                aspect={after.width / after.height}
                beforeFilter={before ? undefined : 'saturate(0.4) contrast(0.85) brightness(1.1)'}
                beforeLabel={block.beforeLabel}
                afterLabel={block.afterLabel}
                caption={block.caption}
                priority={i === 0}
              />
            )
          }

          case 'sculpture':
            return <Sculpture key={i} caption={block.caption} />

          case 'mosaic':
            return (
              <PhotoCorridor
                key={i}
                images={PHOTOS.map(photo => flickrSize(photo.url, 'c'))}
                stillSrc={CORRIDOR_STILL.url}
                caption={block.caption}
              />
            )

          case 'stack':
            return <PhotoStack key={i} photos={PHOTOS.slice(2, 8)} label={block.caption} />

          default:
            return null
        }
      })}
    </>
  )
}
