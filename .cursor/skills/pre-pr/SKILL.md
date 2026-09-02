---
name: pre-pr
description: >-
  Run pre-push / pre-PR local gates for ChineseLaoshi: FSD import checks,
  frontend build, Bugbot review, fix findings in a loop, then continue to
  local preview (delivery step 4). Use when the user says pre-pr, /pre-pr,
  pre-push checks, or as step 3 of the delivery pipeline.
disable-model-invocation: true
---

# Pre-PR gate

Local quality loop **before** push/PR. Do not push inside this skill.

When part of the **delivery pipeline**, a clean gate hands off to delivery step 4 (local dev servers). When run standalone (`/pre-pr`), also continue to local preview after a clean gate — do not wait for **push**.

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
- [ ] 6. Summary — continue to local preview (no push)
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

### 6. Summary — continue to local preview

Present a short report, then **continue to delivery step 4** (start local dev servers):

```markdown
## Pre-PR summary
- Branch: …
- Base: production
- FSD import check: pass | fail (counts)
- Frontend build: pass | fail
- Bugbot: N findings fixed, M deferred/disputed
- Deferred: …
- Uncommitted changes: yes/no

Gate passed. Starting local preview…
```

**Never push in this step.**

If gates did not pass, stop here and ask the user — do not start servers.

## After summary (during delivery or standalone pre-pr)

| User says | Action |
|-----------|--------|
| *(gate passed — automatic)* | Continue to delivery step 4: start dev servers, wait for browser review. |
| fix … | Apply requested fixes, then **restart from step 2**. |
| re-run / run again | Restart from step 2 with no new intentional edits. |
| also security | Run `review-security` once, fold findings into the same fix loop, then re-summarize. |
| done | Handled by delivery step 5 (commit/push/PR) — not by pre-pr. |

When run **outside** the delivery pipeline and the user only wanted checks (no full delivery), still offer local preview after a clean gate. Push and PR creation happen only when the user says **done** in the delivery workflow.

## Hard rules

- No push inside the pre-PR gate.
- No force-push; no `--no-verify`.
- No CI workflow edits just to go green.
- No new `widgets/` slices; no UI redesign unless the user asked.
- Prefer Strategy C over `@x` for entity/feature coupling (see FSD skill).

## Script reference

- [scripts/fsd-import-check.mjs](scripts/fsd-import-check.mjs) — counts FSD import violations under `frontend/src` (upward imports, entity cross-imports, deep public-API bypasses).
