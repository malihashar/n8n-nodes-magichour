#!/usr/bin/env node
/**
 * Fail CI when Magic Hour ships an endpoint we do not expose — same job as
 * `make coverage` in magic-hour-channels.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const catalog = JSON.parse(
	fs.readFileSync(path.join(root, 'catalog/operations.json'), 'utf8'),
);
const opsSource = fs.readFileSync(
	path.join(root, 'nodes/MagicHour/operations.ts'),
	'utf8',
);

const slugs = [...opsSource.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const catalogSlugs = Object.keys(catalog).sort();
const nodeSlugs = [...new Set(slugs)].sort();

const missing = catalogSlugs.filter((s) => !nodeSlugs.includes(s));
const extra = nodeSlugs.filter((s) => !catalogSlugs.includes(s));

if (missing.length || extra.length) {
	console.error('n8n endpoint coverage failed');
	if (missing.length) console.error('  missing in node:', missing.join(', '));
	if (extra.length) console.error('  extra in node:', extra.join(', '));
	process.exit(1);
}

console.log(`coverage OK — ${nodeSlugs.length}/${catalogSlugs.length} endpoints`);
