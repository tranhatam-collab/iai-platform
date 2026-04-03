# IAI Platform Machine Sync Baseline

Date: 2026-03-27  
Repository: `tranhatam-collab/iai-platform`  
Remote: `git@github.com:tranhatam-collab/iai-platform.git`

## Purpose

This file records the first synchronization baseline between the local machine workspaces and the `iai-platform` research repository.

## Local Machine Workspace Snapshot

Detected under local path `Documents/New project`:

- `app.iai.one`
- `cios.iai.one`
- `docs.iai.one`
- `flow.iai.one`
- `flow.iai.one.clean`
- `flow.iai.one.clean.latest`
- `home.iai.one`
- `iai-platform-worktree`
- `nft.iai.one`
- `noos.iai.one`
- `muonnoi-ai`
- `muonnoi-ai-machine`
- `muonnoi-app`
- `noos-codebase`
- `thanhtamfoundation.com-v1`
- `vetuonglai-system`

## Current `iai-platform` Scope

Top-level modules currently in this repository:

- `apps/` (web app)
- `workers/` (API runtime)
- `packages/` (database schema/migrations/seeds)
- `n8n-flows/` (automation flows)
- `infrastructure/` (mail server infra)
- `scripts/` (setup/deploy scripts)

## Sync Interpretation

- `iai-platform` is currently a consolidated platform workspace.
- It is not yet a literal mirror of every local `*.iai.one` repository.
- This baseline is the control point for upcoming sync waves.

## Next Sync Wave Plan

1. Define which local repos are source-of-truth for import.
2. Map each source repo to target folders inside `iai-platform`.
3. Import docs/research first, then selected runtime modules.
4. Track each sync wave with a dated file in `research/`.

## Notes

- This commit is docs-only and intentionally does not change runtime code.
- Existing in-progress local changes in the current branch remain untouched.
