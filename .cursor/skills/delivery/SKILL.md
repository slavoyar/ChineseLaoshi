---
name: delivery
description: >-
  Mandatory implementation pipeline for ChineseLaoshi: plan first, implement
  after approval, pre-PR gates, local dev servers for browser review, then on
  user "done" commit/push/GitHub PR and watch until PR closes to kill servers.
  Use for every implementation task (features, fixes, refactors).
disable-model-invocation: true
---

# Delivery pipeline

End-to-end workflow for shipping changes. **Base branch:** `production`. **Remote:** GitHub (`gh`).

## Progress checklist

```text
Delivery:
- [ ] 1. Plan (wait for approval)
- [ ] 2. Implement on typed branch off production (feat/, fix/, …)
- [ ] 3. Pre-PR gate (.cursor/skills/pre-pr)
- [ ] 4. Local dev servers + browser review
- [ ] 5. User says done → commit, push, create PR
- [ ] 6. Start PR watcher (background)
```

## 1. Plan

- Switch to Plan mode or write a structured plan.
- **Do not write implementation code** until the user approves the plan.
- If the user asked only for a plan, stop here.

## 2. Implement

- Branch off `production`. If currently on `production`, create a typed branch first (see naming below).
- Apply domain skills as needed (`feature-sliced-design`, `impeccable`).
- Do not commit unless the user asks during implementation.

### Branch naming

Format: `<type>/<short-kebab-description>`

Use lowercase kebab-case. Keep the slug short (2–5 words). Optional issue prefix: `<type>/<issue>-<short-kebab-description>` (e.g. `fix/42-login-redirect`).

| Type | Prefix | When to use |
|------|--------|-------------|
| Feature | `feat/` | New functionality or user-facing capability |
| Bug fix | `fix/` | Bug fixes (non-urgent) |
| Hotfix | `hotfix/` | Urgent production fix (still PRs to `production`) |
| Refactor | `refactor/` | Code restructuring with no intended behavior change |
| Chore | `chore/` | Tooling, deps, CI, config, maintenance |
| Docs | `docs/` | Documentation-only changes |
| Test | `test/` | Tests-only changes |

Examples:

```text
feat/study-mode-timer
fix/card-flip-animation
hotfix/session-cookie-expiry
refactor/extract-group-hooks
chore/update-eslint
docs/local-dev-setup
test/prescription-practice-e2e
```

Create the branch before writing code:

```bash
git fetch origin production
git checkout -b feat/my-change origin/production
```

Pick the type from the plan/task. When unsure between `fix` and `feat`, use `fix` if correcting broken behavior, `feat` if adding new behavior.

## 3. Pre-PR

Follow [`.cursor/skills/pre-pr/SKILL.md`](../pre-pr/SKILL.md) in full (steps 1–5).

When the gate is clean, **do not wait for push**. Continue immediately to step 4 below.

If gates fail after 3 fix cycles, stop and ask the user. Do not start servers or open a PR.

## 4. Local preview

Start dev servers from repo root if not already listening:

| Service    | Command               | URL                          |
|------------|-----------------------|------------------------------|
| Backend    | `npm run dev:backend` | http://localhost:3000        |
| Study app  | `npm run dev:frontend`| http://localhost:5173/app    |
| Marketing  | `npm run dev:web`     | http://localhost:3001        |

**Do not start duplicates.** Before launching, check whether ports **5173**, **3001**, and **3000** are already in LISTENING state. If all three are up, reuse them.

Run each server in a **background terminal** (`block_until_ms: 0`). See [DEV.md](../../../DEV.md) for env setup.

Tell the user:

```markdown
## Local preview ready
- Study app: http://localhost:5173/app
- Marketing: http://localhost:3001
- Backend API: http://localhost:3000

Review in your browser. Reply **done** when ready to ship, or **fix …** to request changes.
```

Verify UI changes in the browser when browser tools are available (behavior, not just a screenshot).

## 5. Ship (user says **done**)

Only after the user explicitly says **done** (or equivalent: "ship it", "looks good", "ready to merge"):

1. **Commit** any uncommitted work — conventional commit message, reference GitLab/GitHub issues if applicable. No Cursor co-author trailers.
2. **Push:** `git push -u origin HEAD` (or `git push` if upstream exists).
3. **Create PR** targeting `production`:

```bash
gh pr create --base production --title "<conventional title>" --body "$(cat <<'EOF'
## Summary
<1-3 bullets>

## Test plan
- [ ] Manual browser review (local)
- [ ] CI — Frontend / check
- [ ] CI — Frontend / e2e (if applicable)
- [ ] CI — Backend (if backend changed)

EOF
)"
```

Use [.github/pull_request_template.md](../../../.github/pull_request_template.md) as a guide. Capture the PR number and URL from `gh pr create` output.

If there is nothing to commit, still push (if needed) and create the PR.

**Never push or create a PR before the user says done.**

## 6. Watch and stop

Start the background watcher so servers stay up until the PR is merged or closed:

```bash
node .cursor/skills/delivery/scripts/watch-pr-and-stop-dev.mjs <PR_NUMBER_OR_URL>
```

Run with `block_until_ms: 0` (background). The script polls GitHub every ~60s and kills process trees on ports **5173**, **3001**, and **3000** when the PR state is `MERGED` or `CLOSED`.

Tell the user:

```markdown
## Shipped
- PR: <url>
- Local servers stay running until the PR is merged or closed, then stop automatically.
```

## After ship

| User says | Action |
|-----------|--------|
| fix … | Apply fixes, restart from pre-PR step 3 (or step 2 if large changes). |
| re-run pre-pr | Run pre-PR gate again, then local preview. |

## Hard rules

- Plan before code. No implementation until plan is approved.
- Create a typed branch (`feat/`, `fix/`, etc.) before writing code — never commit directly on `production`.
- No push or PR before user says **done** after browser review.
- No force-push; no `--no-verify`.
- GitHub only (`gh`). PR base is always `production`.
- Do not kill dev servers manually after starting the watcher — let the script handle it when the PR closes.

## Script reference

- [scripts/watch-pr-and-stop-dev.mjs](scripts/watch-pr-and-stop-dev.mjs) — polls `gh pr view` until MERGED/CLOSED, then kills dev server process trees on ports 5173, 3001, and 3000.
