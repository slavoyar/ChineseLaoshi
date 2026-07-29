# Agent instructions

## Skills to use

When relevant, **read and follow** these skills before implementing. Do not only mention them — apply their workflows.

### Feature-Sliced Design (`feature-sliced-design`)

Use for frontend architecture: layer placement (`app` / `pages` / `features` / `entities` / `shared`), import direction, public APIs, extractions, and refactors of `frontend/src`.

- Skill path: user skill `feature-sliced-design` (global: `~/.agents/skills/feature-sliced-design`)
- Prefer pages-first; extract to `features` / `entities` only when reused in 2+ places
- Import only downward: `app → pages → widgets → features → entities → shared`
- No cross-imports between slices on the same layer; no `entities → features`
- This project already uses `widgets/`; do not expand it for new UI — prefer `pages`, `features`, `shared`, or `app`
- Read skill references only when the specific situation applies (structure, cross-imports, entities, assets, migration)

### Impeccable (`impeccable`)

Use for frontend design and UI work: layout, typography, color, spacing, motion, accessibility, UX copy, polish, and visual quality of pages/components.

- Skill path: user skill `impeccable` (`~/.agents/skills/impeccable` or Cursor skills)
- Follow its design and anti-pattern guidance when changing UI
- Respect this app’s existing visual language when editing established screens; do not invent a new theme unless asked

## Frontend stack notes

- Vite + React + React Router + Zustand + axios (not Next.js)
- Path aliases: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`
