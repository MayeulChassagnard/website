import { PHOTOS, VIDEOS, type Photo } from './media'

export type Medium = 'PHOTOGRAPHY' | 'FILM' | '3D / CGI' | 'EXPERIMENTAL' | 'ART DIRECTION'

/** A block in a project's media sequence. Order is the exhibition's rhythm. */
export type Block =
  | { kind: 'text'; body: string }
  | { kind: 'photo'; photoIndex: number; scale: 'inset' | 'full' | 'bleed' }
  | { kind: 'pair'; photoIndexes: [number, number] }
  | { kind: 'video'; videoId: string; caption?: string }
  | { kind: 'sculpture'; caption?: string }
  | { kind: 'mosaic'; caption?: string }
  | { kind: 'compare'; photoIndex: number; caption?: string }

export interface Project {
  slug: string
  title: string
  year: string
  medium: Medium
  role: string
  concept: string
  /** Index into PHOTOS, or a video id, used for the index-page cover. */
  cover: { kind: 'photo'; photoIndex: number } | { kind: 'video'; videoId: string }
  /** Layout weight on the asymmetric work index. */
  format: 'tall' | 'wide' | 'square' | 'hero'
  blocks: Block[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'lapland-twenty-twenty',
    title: 'Lapland Twenty Twenty',
    year: '2020',
    medium: 'FILM',
    role: 'Réalisation, image, montage',
    concept:
      "Huit jours au-dessus du cercle polaire, à filmer une lumière qui ne se lève jamais complètement. Le film refuse le documentaire de voyage: pas de carte, pas de trajet, seulement des états de lumière qui se succèdent jusqu'à la nuit franche.",
    cover: { kind: 'video', videoId: 'F5iFeShjpSs' },
    format: 'hero',
    blocks: [
      { kind: 'video', videoId: 'F5iFeShjpSs', caption: 'Lapland Twenty Twenty, film, 2020' },
      {
        kind: 'text',
        body: "Le soleil se tient sous l'horizon pendant des heures et teint tout d'un bleu qui n'existe pas ailleurs. Il n'y a rien à faire contre: on cadre, on attend, on laisse la lumière décider du plan.",
      },
      { kind: 'photo', photoIndex: 3, scale: 'full' },
      { kind: 'pair', photoIndexes: [4, 5] },
      {
        kind: 'text',
        body: "Aucune séquence n'a été éclairée. La seule intervention est l'étalonnage, poussé vers le froid jusqu'au point où l'image devient presque monochrome.",
      },
      { kind: 'photo', photoIndex: 9, scale: 'bleed' },
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
      { kind: 'compare', photoIndex: 6, caption: "Brut / étalonné: le virage sépia fabrique le western" },
      { kind: 'pair', photoIndexes: [18, 7] },
    ],
  },
  {
    slug: 'sucre',
    title: 'Sucre',
    year: '2024',
    medium: '3D / CGI',
    role: 'Modélisation, matières, rendu temps réel',
    concept:
      "Une nature morte numérique. Un objet trivial, sucré, saturé de détails inutiles, traité avec le sérieux d'un modèle d'atelier: neuf maillages, six cents éléments dispersés à la main, une seule lumière dominante. La 3D employée comme un exercice de plâtre plutôt que comme une démonstration.",
    cover: { kind: 'photo', photoIndex: 10 },
    format: 'square',
    blocks: [
      { kind: 'sculpture', caption: 'Sucre, rendu temps réel WebGL, modélisation Blender' },
      {
        kind: 'text',
        body: "La pièce tourne d'elle-même, lentement, et suit à peine le regard. L'objet est rendu présent sans être rendu manipulable: on l'observe tourner, on ne le pilote pas.",
      },
      { kind: 'photo', photoIndex: 13, scale: 'inset' },
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
    cover: { kind: 'photo', photoIndex: 2 },
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
    cover: { kind: 'photo', photoIndex: 19 },
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
    slug: 'alexis-jessica',
    title: 'Alexis & Jessica',
    year: '2022',
    medium: 'FILM',
    role: 'Réalisation, image, montage',
    concept:
      "Un mariage filmé sans aucun plan posé. Le film est monté comme un souvenir: fragments désordonnés, sons conservés bruts, aucune voix off. Ce qui reste n'est pas la cérémonie mais son atmosphère.",
    cover: { kind: 'video', videoId: 'GWQr1e8WlIw' },
    format: 'wide',
    blocks: [
      { kind: 'video', videoId: 'GWQr1e8WlIw', caption: 'Alexis & Jessica, film, 2022' },
      {
        kind: 'text',
        body: 'Une seule caméra, une seule optique, aucune lumière ajoutée. Rester invisible est le principal travail de la journée.',
      },
      { kind: 'pair', photoIndexes: [0, 1] },
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
    cover: { kind: 'photo', photoIndex: 12 },
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

export function photoAt(index: number): Photo {
  return PHOTOS[index % PHOTOS.length]
}

export function coverMedia(project: Project) {
  if (project.cover.kind === 'video') {
    const video = VIDEOS.find(v => v.id === (project.cover as { videoId: string }).videoId)
    return { url: video?.poster ?? '', width: 1280, height: 720, isVideo: true }
  }
  const photo = photoAt(project.cover.photoIndex)
  return { url: photo.url, width: photo.width, height: photo.height, isVideo: false }
}
