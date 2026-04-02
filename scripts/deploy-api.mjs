import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const wranglerCli = resolve(root, 'node_modules/wrangler/wrangler-dist/cli.js')
const env = {
  ...process.env,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || '93112cc89181e75335cbd7ef7e392ba3',
}

if (!existsSync(wranglerCli)) {
  throw new Error(`Wrangler CLI not found at ${wranglerCli}. Run npm install first.`)
}

await run(process.execPath, [wranglerCli, 'deploy', '--env', 'production', '--config', 'workers/api/wrangler.toml', '--keep-vars'])

async function run(cmd, args) {
  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(cmd, args, {
      cwd: root,
      stdio: 'inherit',
      env,
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
