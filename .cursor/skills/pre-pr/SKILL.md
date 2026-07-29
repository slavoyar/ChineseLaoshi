---
name: pre-pr
description: >-
  Run pre-push / pre-PR local gates for ChineseLaoshi: FSD import checks,
  frontend build, Bugbot review, fix findings in a loop, then stop for human
  review before push. Use when the user says pre-pr, /pre-pr, pre-push checks,
  ready to push, gate before PR, or asks to loop until review is clean before
  pushing.
disable-model-invocation: true
---

# Pre-PR gate

Local quality loop **before** push/PR. Do not push until the user explicitly approves after the summary.

**Base branch:** `production` (this repo).  
**Scope:** current branch changes only. Do not expand into unrelated refactors.

## Progress checklist

Copy and update as you go:

```text
Pre-PR:
- [ ] 1. Context (branch, base, dirty tree)
- [ ] 2. FSD import check (scripts/fsd-import-check.mjs)
- [ ] 3. Frontend build
- [ ] 4. Bugbot review
- [ ] 5. Fix valid findings + re-run failed steps
- [ ] 6. Summary for human — STOP (no push)
- [ ] 7. User: push | fix … | re-run
```

## Workflow

### 1. Context

- Confirm git repo root and current branch.
- Diff against `production` (`git log production..HEAD --oneline`, short `git diff --stat production...HEAD`).
- Note uncommitted changes; include them in checks (they will ship if pushed).

### 2. FSD import check

From repo root:

```bash
node .cursor/skills/pre-pr/scripts/fsd-import-check.mjs
```

Exit `0` = clean. Exit `1` = violations printed by category.

Fix every reported violation (use `feature-sliced-design` for placement/Strategy C). Re-run until exit `0`.

Optional (not required): `npx steiger frontend/src` if already installed; do not add Steiger as a hard gate unless the user asks.

### 3. Frontend build

```bash
cd frontend && npm run build
```

Fix compile errors; re-run until success.

### 4. Bugbot

Follow the `review-bugbot` skill. Launch exactly one `bugbot` subagent (`run_in_background: false`) with:

```text
Full Repository Path: <absolute repo root>
Diff: branch changes
Base Branch: production
```

Only add `Custom Instructions` if the user gave review constraints.

If Bugbot fails because the diff could not be computed, retry once with `Diff: natural language` and a file-by-file `Change Description` (see `review-bugbot`).

### 5. Fix loop

For each Bugbot finding:

- **Valid and in scope** → fix, then re-run steps 2–4 as needed (at least FSD check + build after code changes; re-run Bugbot after substantive fixes).
- **Invalid / out of scope / unsure** → do not change code; list it in the summary with a one-line reason.

Cap: after **3** full fix+recheck cycles still failing, stop and ask the user how to proceed.

Do **not** commit unless the user asks. Prefer leaving fixes uncommitted or committing only if the user already requested commits in this session.

### 6. Summary — STOP

Present a short report, then **wait**:

```markdown
## Pre-PR summary
- Branch: …
- Base: production
- FSD import check: pass | fail (counts)
- Frontend build: pass | fail
- Bugbot: N findings fixed, M deferred/disputed
- Deferred: …
- Uncommitted changes: yes/no

Ready for your review. Reply:
- **push** — push branch to origin (and create PR only if you also ask)
- **fix &lt;issue&gt;** — I fix, then restart from step 2
- **re-run** — run the full gate again without new fixes
```

**Never push in this step.**

### 7. After human review

| User says | Action |
|-----------|--------|
| push / push it / ship | `git push -u origin HEAD` if no upstream; otherwise `git push`. Do not create a PR unless asked. |
| fix … | Apply requested fixes, then **restart from step 2**. |
| re-run / run again | Restart from step 2 with no new intentional edits. |
| also security | Run `review-security` once, fold findings into the same fix loop, then re-summarize. |

## Hard rules

- No push without explicit user approval after a summary.
- No force-push; no `--no-verify`.
- No CI workflow edits just to go green.
- No new `widgets/` slices; no UI redesign unless the user asked.
- Prefer Strategy C over `@x` for entity/feature coupling (see FSD skill).

## Script reference

- [scripts/fsd-import-check.mjs](scripts/fsd-import-check.mjs) — counts FSD import violations under `frontend/src` (upward imports, entity cross-imports, deep public-API bypasses).
