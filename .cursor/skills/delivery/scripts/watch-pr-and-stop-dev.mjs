#!/usr/bin/env node
/**
 * Poll a GitHub PR until MERGED or CLOSED, then kill local dev servers.
 *
 * Usage (from repo root):
 *   node .cursor/skills/delivery/scripts/watch-pr-and-stop-dev.mjs <PR_NUMBER_OR_URL>
 *
 * Kills process trees listening on ports 5173 (Vite) and 3000 (Go API + embedded PG).
 */
import { execSync, spawnSync } from 'node:child_process';
import { platform } from 'node:os';

const POLL_INTERVAL_MS = 60_000;
const PORTS = [5173, 3000];
const TERMINAL_STATES = new Set(['MERGED', 'CLOSED']);

function parsePrNumber(arg) {
  if (!arg) {
    console.error('Usage: watch-pr-and-stop-dev.mjs <PR_NUMBER_OR_URL>');
    process.exit(1);
  }
  const trimmed = String(arg).trim();
  const urlMatch = trimmed.match(/\/pull\/(\d+)/);
  if (urlMatch) return urlMatch[1];
  if (/^\d+$/.test(trimmed)) return trimmed;
  console.error(`Could not parse PR number from: ${trimmed}`);
  process.exit(1);
}

function ghPrState(prNumber) {
  const result = spawnSync(
    'gh',
    ['pr', 'view', prNumber, '--json', 'state,url,title'],
    { encoding: 'utf8', shell: platform() === 'win32' },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || `gh pr view ${prNumber} failed`);
  }
  return JSON.parse(result.stdout);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function localPortFromAddress(address) {
  const match = address.match(/:(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : null;
}

function getPidsOnPort(port) {
  const isWin = platform() === 'win32';
  const pids = new Set();

  if (isWin) {
    try {
      const out = execSync('netstat -ano', {
        encoding: 'utf8',
        shell: true,
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      for (const line of out.split(/\r?\n/)) {
        if (!line.includes('LISTENING')) continue;
        const parts = line.trim().split(/\s+/);
        if (parts.length < 5) continue;
        const localPort = localPortFromAddress(parts[1]);
        if (localPort !== port) continue;
        const pid = Number.parseInt(parts[parts.length - 1], 10);
        if (Number.isFinite(pid) && pid > 0) pids.add(pid);
      }
    } catch {
      // no listeners or netstat failed
    }
  } else {
    try {
      const out = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      for (const line of out.split(/\r?\n/)) {
        const pid = Number.parseInt(line.trim(), 10);
        if (Number.isFinite(pid) && pid > 0) pids.add(pid);
      }
    } catch {
      // no listeners
    }
  }

  return [...pids];
}

function killProcessTree(pid) {
  const isWin = platform() === 'win32';
  try {
    if (isWin) {
      execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore', shell: true });
    } else {
      execSync(`kill -TERM -${pid} 2>/dev/null || kill -TERM ${pid}`, {
        stdio: 'ignore',
        shell: true,
      });
    }
    return true;
  } catch {
    return false;
  }
}

function killDevServers() {
  const killed = [];
  for (const port of PORTS) {
    const pids = getPidsOnPort(port);
    for (const pid of pids) {
      if (killProcessTree(pid)) {
        killed.push({ port, pid });
        console.log(`Killed PID ${pid} (port ${port})`);
      }
    }
  }
  if (killed.length === 0) {
    console.log('No dev server processes found on ports 5173 or 3000.');
  }
  return killed;
}

async function main() {
  const prNumber = parsePrNumber(process.argv[2]);
  console.log(`Watching PR #${prNumber} — will stop dev servers when MERGED or CLOSED.`);
  console.log(`Polling every ${POLL_INTERVAL_MS / 1000}s. Press Ctrl+C to cancel.\n`);

  while (true) {
    let pr;
    try {
      pr = ghPrState(prNumber);
    } catch (err) {
      console.error(`Poll failed: ${err.message}. Retrying in ${POLL_INTERVAL_MS / 1000}s…`);
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    const ts = new Date().toISOString();
    console.log(`[${ts}] PR #${prNumber} — ${pr.state} — ${pr.url}`);

    if (TERMINAL_STATES.has(pr.state)) {
      console.log(`\nPR is ${pr.state}. Stopping local dev servers…`);
      killDevServers();
      console.log('Done.');
      process.exit(0);
    }

    await sleep(POLL_INTERVAL_MS);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
