#!/usr/bin/env node
/* ============================================================================
 * Pre-submission check.
 *
 *   node scripts/check-config.mjs
 *
 * Reads config.js and reports anything still unfilled, plus a short checklist
 * of what App Store Connect will ask you for. Exits non-zero if the site is
 * not ready to submit, so you can wire it into a deploy step if you want to.
 * No dependencies.
 * ==========================================================================*/

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* config.js assigns to `window`, so give it one and run it. */
const source = readFileSync(join(root, 'config.js'), 'utf8');
const sandbox = { window: {} };
new Function('window', source)(sandbox.window);
const cfg = sandbox.window.TUTUR ?? {};

const RED = '\x1b[31m', GREEN = '\x1b[32m', YELLOW = '\x1b[33m';
const DIM = '\x1b[2m', BOLD = '\x1b[1m', OFF = '\x1b[0m';

/* Keys that must be filled in before the site is submittable, and why. */
const required = {
  legalName:    'named in both legal documents and in Apple\'s required EULA terms',
  supportEmail: 'Apple\'s reviewer uses this; the support route must be real',
  privacyEmail: 'the contact point for privacy requests',
  siteUrl:      'canonical and social-preview URLs'
};

/* Keys that are fine to leave empty, with a note on what empty means. */
const optional = {
  appStoreUrl: 'download buttons stay in their "coming soon" state — correct before launch',
  twitterUrl:  'link hidden',
  githubUrl:   'link hidden'
};

let problems = 0;

console.log(`\n${BOLD}Tutur Notes — config check${OFF}\n`);

console.log(`${BOLD}Required${OFF}`);
for (const [key, why] of Object.entries(required)) {
  const value = String(cfg[key] ?? '').trim();
  const unfilled = value === '' || value.includes('REPLACE_ME');
  if (unfilled) {
    problems++;
    console.log(`  ${RED}✗${OFF} ${key.padEnd(14)} ${RED}${value || '(empty)'}${OFF}`);
    console.log(`    ${DIM}${why}${OFF}`);
  } else {
    console.log(`  ${GREEN}✓${OFF} ${key.padEnd(14)} ${DIM}${value}${OFF}`);
  }
}

console.log(`\n${BOLD}Optional${OFF}`);
for (const [key, note] of Object.entries(optional)) {
  const value = String(cfg[key] ?? '').trim();
  if (value === '' || value.includes('REPLACE_ME')) {
    console.log(`  ${YELLOW}·${OFF} ${key.padEnd(14)} ${DIM}not set — ${note}${OFF}`);
  } else {
    console.log(`  ${GREEN}✓${OFF} ${key.padEnd(14)} ${DIM}${value}${OFF}`);
  }
}

/* A stale date is easy to miss and looks careless on a legal page. */
console.log(`\n${BOLD}Dates${OFF}`);
console.log(`  ${DIM}effective ${cfg.effectiveDate} · updated ${cfg.lastUpdated}${OFF}`);
console.log(`  ${DIM}Bump lastUpdated whenever you materially change a policy.${OFF}`);

/* Catch a REPLACE_ME that was pasted into a page instead of into config.js. */
const pages = readdirSync(root).filter((f) => f.endsWith('.html'));
const leaked = pages.filter((f) => readFileSync(join(root, f), 'utf8').includes('REPLACE_ME'));
if (leaked.length) {
  problems++;
  console.log(`\n${RED}✗ REPLACE_ME found inside ${leaked.join(', ')}${OFF}`);
  console.log(`  ${DIM}Placeholders belong in config.js only.${OFF}`);
}

console.log(`\n${BOLD}Before you submit to App Store Connect${OFF}`);
for (const line of [
  'Deploy this site and open all four pages over HTTPS on a phone.',
  'Privacy Policy URL  →  <your domain>/privacy.html',
  'Support URL         →  <your domain>/support.html',
  'Marketing URL       →  <your domain>/  (optional field)',
  'Send a test email to your support address and confirm it arrives.',
  'Answer App Privacy in App Store Connect as "Data Not Collected".',
  'Add a link to the privacy policy inside the app, which 5.1.1(i) also requires.'
]) {
  console.log(`  ${DIM}·${OFF} ${line}`);
}

if (problems > 0) {
  console.log(`\n${RED}${BOLD}Not ready: ${problems} item(s) need attention.${OFF}\n`);
  process.exit(1);
}

console.log(`\n${GREEN}${BOLD}Config looks complete.${OFF}\n`);
