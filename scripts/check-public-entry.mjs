import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

assert.ok(existsSync('index.html'), 'index.html must exist');
assert.ok(existsSync('tomtom.html'), 'tomtom.html must exist');
assert.ok(existsSync('mobility.html'), 'mobility.html must exist');

const root = readFileSync('index.html', 'utf8');
const workspace = readFileSync('mobility.html', 'utf8');

// Ensure root is the full TomTom Live Traffic application
assert.match(root, /TomTom Traffic Intelligence/i, 'index.html must be TomTom Live Traffic Intelligence');
assert.match(root, /<div id="root"><\/div>/, 'index.html must mount React app in root div');
assert.match(root, /assets\/index-[^" ]+\.js/, 'index.html must load production app bundle');

// Ensure no Ministry branding on Data Science Trials public site
assert.doesNotMatch(root, /Ministry of Works/i, 'index.html must not mention Ministry of Works');
assert.doesNotMatch(root, /Department of National Roads/i, 'index.html must not mention Department of National Roads');
assert.doesNotMatch(workspace, /Ministry of Works/i, 'mobility.html must not mention Ministry of Works');
assert.doesNotMatch(workspace, /Department of National Roads/i, 'mobility.html must not mention Department of National Roads');

console.log('Data Science Trials traffic entry checks passed.');
