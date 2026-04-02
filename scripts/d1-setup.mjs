import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const rawTarget = process.argv[2]
const target = ['local', 'preview', 'prod'].includes(rawTarget) ? rawTarget : 'local'
const skipSeed = process.argv.includes('--skip-seed')
const isLocal = target === 'local'
const dbModeFlag = isLocal ? ['--local'] : ['--remote']
const envFlag = isLocal ? ['--env', 'dev'] : []
const commandEnv = process.env
const dbName = target === 'preview'
  ? (process.env.D1_PREVIEW_DB_NAME || 'iai-db')
  : (target === 'prod' ? (process.env.D1_PROD_DB_NAME || 'iai-db') : 'iai-db')

const files = [
  'packages/database/schema.sql',
  'packages/database/migration_v2.sql',
  skipSeed ? null : 'packages/database/seeds/phase2-social-community.sql',
].filter(Boolean)

for (const file of files) {
  console.log(`\n==> D1 ${target} (${dbName}): ${file}`)
  await run('wrangler', [
    'd1', 'execute', dbName,
    ...envFlag,
    ...dbModeFlag,
    '--file', file,
    '--config', 'workers/api/wrangler.toml',
  ])
}

async function run(cmd, args) {
  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(cmd, args, {
      cwd: root,
      stdio: 'inherit',
      env: commandEnv,
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
