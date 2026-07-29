#!/usr/bin/env node
/**
 * FSD import violation check for ChineseLaoshi frontend.
 * Exit 0 = clean, 1 = violations found.
 *
 * Usage (from repo root):
 *   node .cursor/skills/pre-pr/scripts/fsd-import-check.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../..');
const srcRoot = path.join(repoRoot, 'frontend', 'src');

const CHECKS = [
  {
    id: 'entities-to-features',
    label: 'entities → features (upward)',
    root: path.join(srcRoot, 'entities'),
    pattern: /@features\//,
  },
  {
    id: 'group-to-card',
    label: 'entities/group → entities/card (cross-slice)',
    root: path.join(srcRoot, 'entities', 'group'),
    pattern: /@entities\/card\b/,
  },
  {
    id: 'shared-to-widgets',
    label: 'shared → widgets (upward)',
    root: path.join(srcRoot, 'shared'),
    pattern: /@widgets\//,
  },
  {
    id: 'deep-shared',
    label: 'Deep shared path bypasses',
    root: srcRoot,
    pattern:
      /@shared\/(ui\/tile-grid|api\/base-service|api\/generated|api\/auth|stores\/auth-store|types\/auth|config\/study|icons\/pen-write)\b/,
  },
  {
    id: 'deep-entity',
    label: 'Deep entity path bypasses',
    root: srcRoot,
    pattern: /@entities\/(group\/lib|card\/utils|card\/api)\b/,
  },
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walk(full, out);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function rel(file) {
  return path.relative(repoRoot, file).split(path.sep).join('/');
}

function runCheck(check) {
  const matches = [];
  for (const file of walk(check.root)) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (check.pattern.test(line)) {
        matches.push({ file: rel(file), line: i + 1, text: line.trim() });
      }
    });
  }
  return matches;
}

if (!fs.existsSync(srcRoot)) {
  console.error(`Missing frontend src at ${srcRoot}`);
  process.exit(2);
}

console.log('FSD import check');
console.log(`Root: ${rel(srcRoot)}\n`);

let total = 0;
const summary = [];

for (const check of CHECKS) {
  const matches = runCheck(check);
  total += matches.length;
  summary.push({ label: check.label, count: matches.length });
  console.log(`--- ${check.label}: ${matches.length} ---`);
  for (const m of matches) {
    console.log(`  ${m.file}:${m.line}: ${m.text}`);
  }
  if (matches.length === 0) console.log('  (none)');
  console.log('');
}

console.log('Summary');
for (const row of summary) {
  console.log(`  ${row.count}\t${row.label}`);
}
console.log(`  ${total}\ttotal`);

if (total > 0) {
  console.error('\nFAIL: FSD import violations found');
  process.exit(1);
}

console.log('\nPASS: no FSD import violations');
process.exit(0);
