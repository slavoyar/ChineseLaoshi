# Agent instructions

## Delivery pipeline

**Mandatory for every implementation** (features, fixes, refactors). Read and follow `.cursor/skills/delivery` for the full procedure.

1. **Plan first** — write a plan and wait for user approval. Do not implement until approved.
2. **Implement** — create a branch off `production` using the naming convention (`feat/…`, `fix/…`, etc.; see delivery skill).
3. **Pre-PR** — run `.cursor/skills/pre-pr` (FSD import check, frontend build, Bugbot). Do not push here.
4. **Local preview** — start backend + frontend dev servers; user reviews in browser at http://localhost:5173.
5. **Ship** — when the user says **done**: commit, push to GitHub, create PR targeting `production`.
6. **Watch and stop** — poll GitHub until the PR is merged or closed, then kill local dev servers.

If the user asks only for a plan, stop after step 1. If pre-PR gates fail after 3 fix cycles, stop and ask — do not start servers or open a PR.

## Skills to use

When relevant, **read and follow** these skills before implementing. Do not only mention them — apply their workflows.

### Delivery (`delivery`)

Use for every implementation task. Orchestrates plan → implement → pre-PR → local servers → ship → PR watcher.

- Skill path: project skill `.cursor/skills/delivery`
- Do not push or create a PR until the user says **done** after browser review
- After PR is created, start the background watcher so servers stay up until the PR closes

### Feature-Sliced Design (`feature-sliced-design`)

Use for frontend architecture: layer placement (`app` / `pages` / `features` / `entities` / `shared`), import direction, public APIs, extractions, and refactors of `frontend/src`.

- Skill path: user skill `feature-sliced-design` (global: `~/.agents/skills/feature-sliced-design`)
- Prefer pages-first; extract to `features` / `entities` only when reused in 2+ places
- Import only downward: `app → pages → widgets → features → entities → shared`
- No cross-imports between slices on the same layer; no `entities → features`
- This project already uses `widgets/` (`groups`, `study-modes`, `header`, `prescription-practice`); keep them, but do not expand the layer — new UI composition goes to `pages`, `features`, `shared`, or `app`. Collapse a widget into its destination only when next editing that screen.
- Read skill references only when the specific situation applies (structure, cross-imports, entities, assets, migration)

### Impeccable (`impeccable`)

Use for frontend design and UI work: layout, typography, color, spacing, motion, accessibility, UX copy, polish, and visual quality of pages/components.

- Skill path: user skill `impeccable` (`~/.agents/skills/impeccable` or Cursor skills)
- Follow its design and anti-pattern guidance when changing UI
- Respect this app’s existing visual language when editing established screens; do not invent a new theme unless asked

### Pre-PR (`pre-pr`)

Step 3 of the delivery pipeline. Also runs standalone when the user asks for pre-pr, `/pre-pr`, or pre-push checks.

- Skill path: project skill `.cursor/skills/pre-pr`
- Runs FSD import check + frontend build + Bugbot, fixes in a loop
- After a clean gate, continue to local preview (delivery step 4) — do not wait for **push**
- Never push inside the pre-PR gate

## Frontend stack notes

- Vite + React + React Router + Zustand + axios (not Next.js)
- Path aliases: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`
