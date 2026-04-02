import { execFileSync, spawn } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const webDir = resolve(root, 'apps/web')
const target = process.argv[2]
const wranglerBin = resolveWranglerBin()
const nextOnPagesCli = resolve(root, 'node_modules/@cloudflare/next-on-pages/bin/index.js')
const cloudflareEnv = {
  ...process.env,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || '93112cc89181e75335cbd7ef7e392ba3',
  WRANGLER_BIN: wranglerBin,
}
const pagesProject = process.env.CF_PAGES_PROJECT_NAME || 'iai-web'

if (!['preview', 'prod'].includes(target)) {
  console.error('Usage: node scripts/deploy.mjs <preview|prod>')
  process.exit(1)
}

const isProd = target === 'prod'

await run('node', ['scripts/d1-setup.mjs', isProd ? 'prod' : 'preview'])

const apiEnv = isProd ? 'production' : 'preview'
const apiArgs = ['deploy', '--env', apiEnv, '--config', 'workers/api/wrangler.toml', '--keep-vars']

const apiOutput = await runCapture(wranglerBin, apiArgs)
const previewApiUrl = process.env.PREVIEW_API_URL || extractWorkersDevUrl(apiOutput)
const apiUrl = isProd ? 'https://api.iai.one' : previewApiUrl

if (!apiUrl) {
  throw new Error('Could not determine preview API URL. Re-run with PREVIEW_API_URL set.')
}

const commitHash = git(['rev-parse', 'HEAD']) || 'local'
const commitMessage = git(['log', '-1', '--pretty=%s']) || `codex ${target} deploy`
const branch = isProd ? 'main' : 'preview'

const webEnv = {
  ...cloudflareEnv,
  NEXT_PUBLIC_API_URL: apiUrl,
  NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.iai.one',
  NEXT_PUBLIC_IAI_ENV: isProd ? 'production' : 'preview',
  NEXT_PUBLIC_SITE_URL: isProd
    ? 'https://app.iai.one'
    : (process.env.PREVIEW_SITE_URL || 'https://preview.app.iai.one'),
}

const vercelDir = resolve(webDir, '.vercel')
if (existsSync(vercelDir)) {
  rmSync(vercelDir, { recursive: true, force: true })
}

await run(process.execPath, [nextOnPagesCli], { cwd: webDir, env: webEnv })
await run(wranglerBin, [
  'pages', 'deploy', '.vercel/output/static',
  '--project-name', pagesProject,
  '--branch', branch,
  '--commit-dirty=true',
  '--commit-hash', commitHash,
  '--commit-message', commitMessage,
], { cwd: webDir, env: webEnv })

console.log(`\n${target.toUpperCase()} deploy complete.`)
console.log(`API URL: ${apiUrl}`)

function extractWorkersDevUrl(output) {
  const matches = output.match(/https:\/\/[^\s]+workers\.dev/g)
  return matches?.at(-1) || ''
}

function resolveWranglerBin() {
  if (process.env.WRANGLER_BIN) return process.env.WRANGLER_BIN

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

async function runCapture(cmd, args, options = {}) {
  let output = ''

  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(cmd, args, {
      cwd: options.cwd || root,
      env: options.env || cloudflareEnv,
      stdio: ['inherit', 'pipe', 'pipe'],
    })

    child.stdout.on('data', chunk => {
      const text = chunk.toString()
      output += text
      process.stdout.write(text)
    })

    child.stderr.on('data', chunk => {
      const text = chunk.toString()
      output += text
      process.stderr.write(text)
    })

    child.on('exit', code => {
      if (code === 0) {
        resolvePromise()
        return
      }
      rejectPromise(new Error(`${cmd} ${args.join(' ')} exited with code ${code ?? 1}`))
    })
  })

  return output
}
