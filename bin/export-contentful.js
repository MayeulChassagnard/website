#!/usr/bin/env node

/**
 * Archive complète de l'espace Contentful : contenu + fichiers binaires.
 *
 * Volontairement autonome : n'utilise aucune dépendance du projet (les deps
 * Gatsby 4 / sharp 0.31 ne s'installent plus sur Node moderne). Tout passe par
 * `npx contentful-export`, donc une simple installation de Node suffit.
 *
 *   node bin/export-contentful.js
 *
 * Credentials lus depuis l'environnement, sinon demandés en interactif :
 *   CONTENTFUL_SPACE_ID          identifiant de l'espace (12 caractères)
 *   CONTENTFUL_MANAGEMENT_TOKEN  token Content Management (PAS le token delivery)
 *   CONTENTFUL_ENVIRONMENT       optionnel, 'master' par défaut
 *
 * Le token se crée dans app.contentful.com -> Settings -> API keys ->
 * Content management tokens -> Generate personal token.
 */

const { spawnSync } = require('child_process')
const { createInterface } = require('readline')
const { writeFileSync, unlinkSync, mkdirSync } = require('fs')
const os = require('os')
const path = require('path')

const OUT_ROOT = path.resolve(__dirname, '..', 'contentful-backup')

function ask(question, { hidden = false } = {}) {
  return new Promise(resolve => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    })

    // Masque la saisie du token pour qu'il ne reste pas en clair dans le terminal
    if (hidden) {
      rl._writeToOutput = str =>
        rl.output.write(str.includes(question) ? str : '*')
    }

    rl.question(question, answer => {
      rl.close()
      if (hidden) process.stdout.write('\n')
      resolve(answer.trim())
    })
  })
}

async function resolveCredentials() {
  const spaceId =
    process.env.CONTENTFUL_SPACE_ID || (await ask('Space ID : '))

  if (!/^[a-z0-9]{12}$/.test(spaceId)) {
    throw new Error(
      `Space ID invalide : "${spaceId}" (attendu : 12 caractères alphanumériques minuscules)`
    )
  }

  const managementToken =
    process.env.CONTENTFUL_MANAGEMENT_TOKEN ||
    (await ask('Content Management token : ', { hidden: true }))

  if (!managementToken) {
    throw new Error('Token de management manquant.')
  }

  return { spaceId, managementToken }
}

async function main() {
  const { spaceId, managementToken } = await resolveCredentials()

  // Un dossier horodaté par export : les archives successives ne s'écrasent pas
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
  const exportDir = path.join(OUT_ROOT, stamp)
  mkdirSync(exportDir, { recursive: true })

  const config = {
    spaceId,
    managementToken,
    environmentId: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    exportDir,
    contentFile: 'content.json',
    // Le point critique de l'archive : sans ça on n'exporte que des URLs
    // Contentful, qui meurent avec l'espace.
    downloadAssets: true,
    // Brouillons et entrées archivées inclus : c'est une sauvegarde, pas un build
    includeDrafts: true,
    includeArchived: true,
    // Rôles et webhooks demandent des droits niveau organisation et font
    // échouer l'export sur un token personnel. Aucune valeur pour une archive
    // de contenu : on les saute.
    skipRoles: true,
    skipWebhooks: true,
    errorLogFile: path.join(exportDir, 'error-log.json'),
  }

  // Le token passe par un fichier de config plutôt qu'en argument CLI, pour
  // éviter qu'il apparaisse dans la liste des process et l'historique shell.
  const configPath = path.join(
    os.tmpdir(),
    `contentful-export-${process.pid}.json`
  )
  writeFileSync(configPath, JSON.stringify(config, null, 2), { mode: 0o600 })

  console.log(`\nExport de l'espace ${spaceId} vers ${exportDir}\n`)

  try {
    const result = spawnSync(
      'npx',
      ['--yes', 'contentful-export@latest', '--config', configPath],
      { stdio: 'inherit', shell: process.platform === 'win32' }
    )

    if (result.error) throw result.error
    if (result.status !== 0) {
      throw new Error(`contentful-export a échoué (code ${result.status})`)
    }
  } finally {
    try {
      unlinkSync(configPath)
    } catch (e) {
      console.warn(`\nFichier de config temporaire à supprimer : ${configPath}`)
    }
  }

  console.log(`
Archive terminée : ${exportDir}

  content.json              entrées, assets, content types, locales
  images.ctfassets.net/...  fichiers binaires (photos)

Vérifie la taille avant de committer :
  du -sh "${exportDir}"
`)
}

main().catch(error => {
  console.error(`\nÉchec de l'export : ${error.message}`)
  process.exit(1)
})
