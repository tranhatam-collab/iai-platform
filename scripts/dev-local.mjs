import { spawn } from 'node:child_process'
import { copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const devVars = resolve(root, 'workers/api/.dev.vars')
const devVarsExample = resolve(root, 'workers/api/.dev.vars.example')

if (!existsSync(devVars) && existsSync(devVarsExample)) {
  copyFileSync(devVarsExample, devVars)
  console.log('Created workers/api/.dev.vars from .dev.vars.example')
}

await run('node', ['scripts/d1-setup.mjs', 'local'])

const api = spawn('npm', ['run', 'dev:api'], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
})

const web = spawn('npm', ['run', 'dev:web'], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
})

const children = [api, web]
let shuttingDown = false

const stopChildren = signal => {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) {
    if (!child.killed) child.kill(signal)
  }
}

process.on('SIGINT', () => stopChildren('SIGINT'))
process.on('SIGTERM', () => stopChildren('SIGTERM'))

await Promise.race(children.map(child => new Promise(resolvePromise => {
  child.on('exit', code => resolvePromise(code ?? 0))
})))

stopChildren('SIGTERM')

async function run(cmd, args) {
  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(cmd, args, {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
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
