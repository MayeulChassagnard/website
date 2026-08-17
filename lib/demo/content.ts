/**
 * DEMO CONTENT, NOT REAL.
 *
 * Placeholder copy written to show what a photographer/videomaker showcase
 * could read like. It lives in the repo rather than in Contentful on
 * purpose: the live site pulls from the same Contentful space, so seeding
 * fake entries there could surface them publicly on the next build.
 *
 * When the direction is approved, copy the text into Contentful and swap
 * these sections over to real queries. `imageTitle` values reference real
 * Contentful asset titles so the demo renders with actual photographs.
 */

export const DEMO_TAGLINE = 'Photographe et vidéaste'

export const DEMO_INTRO =
  "Je fabrique des images qui tiennent debout sans légende. Photo, film, prises de vue aériennes, et tout le travail de couleur qui vient après."

export const DISCIPLINES = [
  'Portrait',
  'Reportage',
  'Film de mariage',
  'Prise de vue drone',
  'Étalonnage',
  'Direction artistique',
  'Photo de rue',
  'Paysage',
  'Montage',
] as const

export interface DemoService {
  index: string
  title: string
  body: string
  bullets: string[]
}

export const SERVICES: DemoService[] = [
  {
    index: '01',
    title: 'Photographie',
    body: 'Portraits, reportages et séries personnelles. Lumière naturelle privilégiée, intervention minimale, un regard qui laisse la scène respirer.',
    bullets: ['Portrait studio et extérieur', 'Reportage documentaire', 'Séries éditoriales'],
  },
  {
    index: '02',
    title: 'Vidéo',
    body: "Du film de mariage au format court de marque. Tournage léger, souvent seul, pour rester mobile et discret là où ça compte.",
    bullets: ['Films de mariage', 'Formats courts de marque', 'Captation live'],
  },
  {
    index: '03',
    title: 'Aérien',
    body: 'Prises de vue drone pour ouvrir un plan ou replacer un lieu dans son paysage. Vols préparés, cadres pensés en amont.',
    bullets: ['Photo et vidéo aérienne', 'Repérage et préparation de vol', 'Plans de situation'],
  },
  {
    index: '04',
    title: 'Post-production',
    body: "L'étape où l'image devient une intention. Étalonnage, retouche, cohérence colorimétrique sur toute une série.",
    bullets: ['Étalonnage couleur', 'Retouche haute fidélité', 'Montage et sound design'],
  },
]

export interface DemoProject {
  title: string
  client: string
  year: string
  category: string
  imageTitle: string
}

export const PROJECTS: DemoProject[] = [
  {
    title: 'Brume sur les hauteurs',
    client: 'Série personnelle',
    year: '2024',
    category: 'Paysage',
    imageTitle: 'MistyMountain',
  },
  {
    title: 'Vue aérienne, cérémonie',
    client: 'Camille & Théo',
    year: '2024',
    category: 'Mariage · Drone',
    imageTitle: 'drone_wedding',
  },
  {
    title: 'Lumières de Kuala Lumpur',
    client: 'Série personnelle',
    year: '2023',
    category: 'Photo de rue',
    imageTitle: 'MalaysiaStreetLight',
  },
  {
    title: 'Murs peints',
    client: 'Revue Fracas',
    year: '2023',
    category: 'Éditorial',
    imageTitle: 'StreetArt',
  },
  {
    title: 'Contre-jour',
    client: 'Série personnelle',
    year: '2023',
    category: 'Portrait',
    imageTitle: 'sunsetGirl',
  },
  {
    title: 'Vitesse en ville',
    client: 'Atelier Roule',
    year: '2022',
    category: 'Sport · Vidéo',
    imageTitle: 'RollerBlade',
  },
]

export interface DemoStat {
  value: string
  label: string
}

export const STATS: DemoStat[] = [
  { value: '120+', label: 'projets livrés' },
  { value: '9', label: 'pays traversés' },
  { value: '40k', label: 'images archivées' },
  { value: '2015', label: 'première commande' },
]

export interface DemoProcessStep {
  step: string
  title: string
  body: string
}

export const PROCESS: DemoProcessStep[] = [
  {
    step: 'Préparation',
    title: 'On cadre avant de cadrer',
    body: "Repérage, references visuelles, contraintes de lumière et de lieu. Le jour J ne devrait rien inventer.",
  },
  {
    step: 'Tournage',
    title: 'Discret, mobile, réactif',
    body: 'Équipe légère et matériel réduit au nécessaire. Moins de logistique, plus de moments qui arrivent tout seuls.',
  },
  {
    step: 'Post-production',
    title: "Là où l'image se décide",
    body: 'Sélection sévère, étalonnage cohérent sur toute la série, allers-retours jusqu’à ce que ce soit juste.',
  },
  {
    step: 'Livraison',
    title: 'Prêt à publier',
    body: 'Fichiers déclinés par usage: web, impression, réseaux. Archivage conservé et récupérable des années après.',
  },
]

export interface DemoTestimonial {
  quote: string
  author: string
  role: string
}

export const TESTIMONIALS: DemoTestimonial[] = [
  {
    quote:
      "Il a passé la journée avec nous sans qu'on le remarque, et pourtant tout y est. On revoit la journée telle qu'on l'a vécue, pas telle qu'on l'aurait posée.",
    author: 'Camille & Théo',
    role: 'Mariage, Bretagne 2024',
  },
  {
    quote:
      "On avait un brief flou et un budget serré. Il est revenu avec une direction artistique claire et des images qu'on utilise encore deux ans après.",
    author: 'Léa Marchand',
    role: 'Directrice artistique, Atelier Roule',
  },
]

/** Titles of the assets that are actually Mayeul's work, used to seed visual sections. */
export const SHOWCASE_IMAGE_TITLES = [
  'MistyMountain',
  'drone_wedding',
  'MalaysiaStreetLight',
  'StreetArt',
  'sunsetGirl',
  'RollerBlade',
  'SuperWomen',
  'longueVue',
  'EasterEgg',
  'a-walk-in-the-park',
] as const
