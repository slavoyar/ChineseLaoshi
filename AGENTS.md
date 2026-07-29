# Agent instructions

## Skills to use

When relevant, **read and follow** these skills before implementing. Do not only mention them — apply their workflows.

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

Use before push/PR when the user asks for pre-pr, `/pre-pr`, pre-push checks, or a gate before opening a PR.

- Skill path: project skill `.cursor/skills/pre-pr`
- Runs FSD import check + frontend build + Bugbot, fixes in a loop, then **stops for human review** — does not push until approved
- After user says “fix …”, re-run the gate; after “push”, push only (create PR only if asked)

## Frontend stack notes

- Vite + React + React Router + Zustand + axios (not Next.js)
- Path aliases: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`
