import { execFileSync, spawn } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const appDir = resolve(root, 'apps/home')
const target = process.argv[2]
const wranglerBin = resolveWranglerBin()
const cloudflareEnv = {
  ...process.env,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || '93112cc89181e75335cbd7ef7e392ba3',
}
const pagesProject = process.env.CF_PAGES_HOME_PROJECT_NAME || 'iai-home'

if (!['preview', 'prod'].includes(target)) {
  console.error('Usage: node scripts/deploy-home.mjs <preview|prod>')
  process.exit(1)
}

const isProd = target === 'prod'
const commitHash = git(['rev-parse', 'HEAD']) || 'local'
const commitMessage = git(['log', '-1', '--pretty=%s']) || `codex ${target} deploy home`
const branch = isProd ? 'main' : 'preview'

const appEnv = {
  ...cloudflareEnv,
  NEXT_PUBLIC_IAI_ENV: isProd ? 'production' : 'preview',
  NEXT_PUBLIC_SITE_URL: isProd ? 'https://home.iai.one' : 'https://preview.home.iai.one',
}

const outDir = resolve(appDir, 'out')
if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true })
}

await run('npm', ['run', 'build'], { cwd: appDir, env: appEnv })
await run(wranglerBin, [
  'pages', 'deploy', 'out',
  '--project-name', pagesProject,
  '--branch', branch,
  '--commit-dirty=true',
  '--commit-hash', commitHash,
  '--commit-message', commitMessage,
], { cwd: appDir, env: appEnv })

console.log(`\n${target.toUpperCase()} home deploy complete.`)

function resolveWranglerBin() {
  const globalCandidates = [
    `${process.env.HOME || ''}/.npm-global/bin/wrangler`,
    `${process.env.HOME || ''}/.volta/bin/wrangler`,
    '/opt/homebrew/bin/wrangler',
    '/usr/local/bin/wrangler',
    '/usr/bin/wrangler',
  ].filter(Boolean)

  for (const candidate of globalCandidates) {
    if (existsSync(candidate)) return candidate
  }

  return 'wrangler'
}

function git(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

async function run(cmd, args, options = {}) {
  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(cmd, args, {
      cwd: options.cwd || root,
      stdio: 'inherit',
      env: options.env || cloudflareEnv,
    })

    child.on('exit', code => {
      if (code === 0) {
        resolvePromise()
        return
      }
      rejectPromise(new Error(`${cmd} ${args.join(' ')} exited with code ${code ?? 1}`))
    })
  })
}
