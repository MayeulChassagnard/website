import { CORRIDOR_STILL, PHOTOS, VIDEOS, photoIndexOf, type Photo } from './media'

export type Medium =
  | 'PHOTOGRAPHY'
  | 'FILM'
  | '3D / CGI'
  | 'PHOTOMONTAGE'
  | 'EXPERIMENTAL'
  | 'ART DIRECTION'

/** A block in a project's media sequence. Order is the exhibition's rhythm. */
export type Block =
  | { kind: 'text'; body: string }
  | { kind: 'photo'; photoIndex: number; scale: 'inset' | 'full' | 'bleed' }
  | { kind: 'pair'; photoIndexes: [number, number] }
  | { kind: 'video'; videoId: string; caption?: string }
  | { kind: 'clip'; clipId: string; caption?: string }
  | { kind: 'sculpture'; caption?: string }
  | { kind: 'mosaic'; caption?: string }
  | { kind: 'stack'; caption?: string }
  | {
      kind: 'compare'
      /** The finished image. */
      photoIndex: number
      /**
       * The state it was assembled from, when that is a separate file. Left
       * out for a grading comparison, which has one source by definition and
       * is shown de-graded against itself.
       */
      beforePlateId?: string
      beforeLabel?: string
      afterLabel?: string
      caption?: string
    }

export interface Project {
  slug: string
  title: string
  year: string
  medium: Medium
  role: string
  concept: string
  /**
   * The index-page cover: a photograph, a film's poster frame, or a baked
   * still for work that is a running scene rather than a picture.
   */
  cover:
    | { kind: 'photo'; photoIndex: number }
    | { kind: 'video'; videoId: string }
    | { kind: 'still'; url: string; width: number; height: number }
  /** Layout weight on the asymmetric work index. */
  format: 'tall' | 'wide' | 'square' | 'hero'
  blocks: Block[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'alexis-jessica',
    title: 'Alexis & Jessica',
    year: '2022',
    medium: 'FILM',
    role: 'Réalisation, image, montage',
    concept:
      "Un mariage filmé sans aucun plan posé. Le film est monté comme un souvenir: fragments désordonnés, sons conservés bruts, aucune voix off. Ce qui reste n'est pas la cérémonie mais son atmosphère.",
    cover: { kind: 'video', videoId: 'GWQr1e8WlIw' },
    format: 'hero',
    blocks: [
      { kind: 'video', videoId: 'GWQr1e8WlIw', caption: 'Alexis & Jessica, film, 2022' },
      {
        kind: 'text',
        body: 'Une seule caméra, une seule optique, aucune lumière ajoutée. Rester invisible est le principal travail de la journée.',
      },
      { kind: 'pair', photoIndexes: [0, 1] },
      { kind: 'stack', caption: 'Planches contact' },
    ],
  },
  {
    slug: 'farwest-france',
    title: 'Farwest France',
    year: '2021',
    medium: 'FILM',
    role: 'Réalisation, image, étalonnage',
    concept:
      "Une ville française vidée par la crise sanitaire, filmée comme un western crépusculaire. Les rues désertes ne sont pas tristes, elles sont disponibles: il suffit de les traiter comme des décors pour que la fiction remonte.",
    cover: { kind: 'video', videoId: 'OnT7Wmx-vqs' },
    format: 'wide',
    blocks: [
      { kind: 'video', videoId: 'OnT7Wmx-vqs', caption: 'Farwest France, film, 2021' },
      {
        kind: 'text',
        body: "Le parti pris tient en une règle: aucun plan ne doit contenir de visage. La ville se raconte par ses surfaces, ses enseignes éteintes, ses angles morts.",
      },
      { kind: 'photo', photoIndex: 6, scale: 'full' },
      {
        kind: 'compare',
        photoIndex: 6,
        beforeLabel: 'Brut',
        afterLabel: 'Étalonné',
        caption: "Brut / étalonné: le virage sépia fabrique le western",
      },
      { kind: 'pair', photoIndexes: [18, 7] },
    ],
  },
  {
    slug: 'may-we-meet-again',
    title: 'May We Meet Again',
    year: '2020',
    medium: 'PHOTOMONTAGE',
    role: 'Photomontage, matte painting, étalonnage',
    concept:
      "Un ciel de nuit fabriqué de toutes pièces, en hommage à la série The 100. Cinq plates sans rapport entre elles: une lune, une voie lactée, une vallée survolée de jour, des silhouettes découpées en pleine chute, un logo. Le sujet n'est pas le collage mais le raccord, faire tenir une seule nuit sur des fichiers qui n'ont jamais été pris ensemble.",
    cover: { kind: 'photo', photoIndex: photoIndexOf('49745290406') },
    format: 'tall',
    blocks: [
      {
        kind: 'compare',
        photoIndex: photoIndexOf('49745290406'),
        beforePlateId: '49744746893',
        beforeLabel: 'Plates',
        afterLabel: 'Composite',
        caption: 'May We Meet Again, photomontage, 2020',
      },
      {
        kind: 'text',
        body: "La plate de départ est une vue aérienne prise de jour, sous des nuages gris. Tout le travail consiste à la faire mentir: écraser les hautes lumières, teinter les ombres en cyan, poser la lune assez bas pour qu'elle éclaire les premiers arbres.",
      },
      { kind: 'photo', photoIndex: photoIndexOf('49745290406'), scale: 'full' },
      {
        kind: 'text',
        body: "Les silhouettes tombent sans sol ni échelle, et les braises traversent le cadre à contresens. Elles portent la seule couleur chaude autorisée: sans elles, l'image entière glisserait dans le bleu.",
      },
    ],
  },
  {
    slug: 'sugar',
    title: 'Sugar',
    year: '2024',
    medium: '3D / CGI',
    role: 'Modélisation, matières, rendu temps réel',
    concept:
      "Une nature morte numérique. Un objet trivial, sucré, saturé de détails inutiles, traité avec le sérieux d'un modèle d'atelier: neuf maillages, six cents éléments dispersés à la main, une seule lumière dominante. La 3D employée comme un exercice de plâtre plutôt que comme une démonstration.",
    cover: { kind: 'photo', photoIndex: photoIndexOf('49744745428') },
    format: 'square',
    blocks: [
      { kind: 'sculpture', caption: 'Sugar, du fil de fer au rendu, temps réel WebGL' },
      { kind: 'clip', clipId: 'cgi-coffee', caption: 'CGI Coffee, rendu, 2020' },
      {
        kind: 'text',
        body: "Le défilement rejoue la fabrication dans l'ordre où elle a eu lieu: le maillage nu, puis les matières, puis les lumières colorées qui décident enfin de l'image. Ce qu'on voit à la fin ne tient qu'aux trois sources posées à la main.",
      },
      { kind: 'photo', photoIndex: photoIndexOf('49744745428'), scale: 'inset' },
      {
        kind: 'text',
        body: "Chaque grain est un objet distinct, placé un par un. C'est du temps perdu volontairement, et c'est exactement le sujet: la patience comme matière première.",
      },
    ],
  },
  {
    slug: 'pasta-fresca',
    title: 'Pasta fresca e basta',
    year: '2021',
    medium: 'ART DIRECTION',
    role: 'Direction artistique, image, montage',
    concept:
      "Un film de commande pour une maison de pâtes lyonnaise, traité comme une nature morte en mouvement. Fond noir, lumière rasante, gestes filmés de très près: la matière alimentaire comme sujet plastique.",
    cover: { kind: 'video', videoId: 'tOSGCcXhocA' },
    format: 'wide',
    blocks: [
      { kind: 'video', videoId: 'tOSGCcXhocA', caption: 'Pasta fresca e basta, film de commande, 2021' },
      {
        kind: 'text',
        body: "Tout est tourné sur une table d'un mètre carré, avec une seule source. La contrainte est volontaire: un décor minuscule oblige à travailler la lumière plutôt que le cadre.",
      },
      { kind: 'pair', photoIndexes: [10, 13] },
      { kind: 'photo', photoIndex: 16, scale: 'full' },
    ],
  },
  {
    slug: 'la-malaysia',
    title: 'La Malaysia Por La Mama',
    year: '2019',
    medium: 'PHOTOGRAPHY',
    role: 'Image, film, montage',
    concept:
      "Carnet malaisien: néons, moiteur, marchés de nuit. Une série où la couleur est laissée agressive, presque saturée à l'excès, à l'opposé du reste du travail. Le désordre visuel comme document honnête.",
    cover: { kind: 'video', videoId: 'oxeIgAhvkm8' },
    format: 'tall',
    blocks: [
      { kind: 'photo', photoIndex: 2, scale: 'full' },
      {
        kind: 'text',
        body: "Rien n'a été mis en scène et presque rien n'a été retouché. La série existe pour garder une trace de la façon dont ce pays fatigue et éblouit en même temps.",
      },
      { kind: 'pair', photoIndexes: [8, 14] },
      { kind: 'video', videoId: 'oxeIgAhvkm8', caption: 'La Malaysia Por La Mama, film, 2019' },
      { kind: 'photo', photoIndex: 15, scale: 'bleed' },
    ],
  },
  {
    slug: 'mosaique',
    title: 'Mosaïque',
    year: '2025',
    medium: 'EXPERIMENTAL',
    role: 'Conception, développement, WebGL',
    concept:
      "Une installation web: l'archive photographique entière, éclatée dans l'espace, qui se recompose en grille au fil du défilement puis se laisse traverser. Le geste d'archivage transformé en objet regardable.",
    // The corridor mid-flight: the only honest way to show a piece that only
    // exists while it is being scrolled through.
    cover: { kind: 'still', ...CORRIDOR_STILL },
    format: 'square',
    blocks: [
      { kind: 'mosaic', caption: 'Mosaïque, installation WebGL, 2025' },
      {
        kind: 'text',
        body: "Les fragments sont les photographies elles-mêmes, chargées comme textures. La pièce n'a pas de fin: arrivé au bout, on est à l'intérieur de la grille.",
      },
      { kind: 'photo', photoIndex: 19, scale: 'inset' },
    ],
  },
  {
    slug: 'lapland-twenty-twenty',
    title: 'Lapland Twenty Twenty',
    year: '2020',
    medium: 'FILM',
    role: 'Réalisation, image, montage',
    concept:
      "Huit jours au-dessus du cercle polaire, à filmer une lumière qui ne se lève jamais complètement. Le film refuse le documentaire de voyage: pas de carte, pas de trajet, seulement des états de lumière qui se succèdent jusqu'à la nuit franche.",
    cover: { kind: 'video', videoId: 'F5iFeShjpSs' },
    format: 'wide',
    blocks: [
      { kind: 'video', videoId: 'F5iFeShjpSs', caption: 'Lapland Twenty Twenty, film, 2020' },
      {
        kind: 'text',
        body: "Le soleil se tient sous l'horizon pendant des heures et teint tout d'un bleu qui n'existe pas ailleurs. Il n'y a rien à faire contre: on cadre, on attend, on laisse la lumière décider du plan.",
      },
      { kind: 'photo', photoIndex: photoIndexOf('49744719848'), scale: 'full' },
      { kind: 'pair', photoIndexes: [photoIndexOf('49745258836'), photoIndexOf('49745263011')] },
      {
        kind: 'text',
        body: "Aucune séquence n'a été éclairée. La seule intervention est l'étalonnage, poussé vers le froid jusqu'au point où l'image devient presque monochrome.",
      },
      { kind: 'photo', photoIndex: photoIndexOf('49745264506'), scale: 'bleed' },
    ],
  },
  {
    slug: 'chambery-grenoble',
    title: 'From Chambéry to Grenoble',
    year: '2020',
    medium: 'EXPERIMENTAL',
    role: 'Image, montage',
    concept:
      "Un trajet réduit à ses textures: bitume, vitres, reflets, lignes de fuite. Le paysage alpin traité en abstraction, monté au rythme du déplacement plutôt qu'à celui du récit.",
    cover: { kind: 'video', videoId: 'zUGE2yBJfus' },
    format: 'tall',
    blocks: [
      { kind: 'video', videoId: 'zUGE2yBJfus', caption: 'From Chambéry to Grenoble, film, 2020' },
      { kind: 'photo', photoIndex: 12, scale: 'full' },
      {
        kind: 'text',
        body: 'Le montage suit la vitesse, pas la géographie. On ne sait jamais vraiment où on est, seulement qu\'on avance.',
      },
      { kind: 'pair', photoIndexes: [17, 11] },
    ],
  },
]

export const projectBySlug = (slug: string) => PROJECTS.find(p => p.slug === slug)

/**
 * The shortlist shown on the front page, in the order it is shown there.
 *
 * An ordered list of its own rather than the first few of PROJECTS, so the
 * front page can be curated without dragging the work index along with it.
 */
const SELECTED_SLUGS = [
  'alexis-jessica',
  'farwest-france',
  'may-we-meet-again',
  'sugar',
  'pasta-fresca',
] as const

export const SELECTED_WORK: Project[] = SELECTED_SLUGS.map(slug => {
  const project = projectBySlug(slug)
  if (!project) throw new Error(`Unknown project slug in SELECTED_SLUGS: ${slug}`)
  return project
})

export function photoAt(index: number): Photo {
  return PHOTOS[index % PHOTOS.length]
}

export function coverMedia(project: Project) {
  const cover = project.cover

  if (cover.kind === 'video') {
    const video = VIDEOS.find(v => v.id === cover.videoId)
    return { url: video?.poster ?? '', width: 1280, height: 720, isVideo: true }
  }

  if (cover.kind === 'still') {
    return { url: cover.url, width: cover.width, height: cover.height, isVideo: false }
  }

  const photo = photoAt(cover.photoIndex)
  return { url: photo.url, width: photo.width, height: photo.height, isVideo: false }
}
