import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

assert.ok(existsSync('index.html'), 'index.html must exist');
assert.ok(existsSync('tomtom.html'), 'tomtom.html must exist');
assert.ok(existsSync('mobility.html'), 'mobility.html must exist');

const root = readFileSync('index.html', 'utf8');
const traffic = readFileSync('tomtom.html', 'utf8');
const workspace = readFileSync('mobility.html', 'utf8');

// Ensure the public root enters the light traffic application without exposing
// the retired browser-side authentication surface.
assert.match(root, /Uganda Traffic Intelligence \| Data Science Trials/i, 'index.html must use the approved Data Science Trials title');
assert.match(root, /url=\.\/tomtom\.html/i, 'index.html must redirect to the traffic application');
assert.match(traffic, /<div id="root"><\/div>/, 'tomtom.html must mount the production application');
assert.match(traffic, /assets\/index-[^" ]+\.js/, 'tomtom.html must load the production app bundle');
assert.match(traffic, /apple-system\.css/, 'tomtom.html must load the shared light theme');
assert.doesNotMatch(traffic, /<title>[^<]*TomTom/i, 'public title must not use third-party branding');

// Ensure no Ministry branding on Data Science Trials public site
assert.doesNotMatch(root, /Ministry of Works/i, 'index.html must not mention Ministry of Works');
assert.doesNotMatch(root, /Department of National Roads/i, 'index.html must not mention Department of National Roads');
assert.doesNotMatch(traffic, /Ministry of Works/i, 'tomtom.html must not mention Ministry of Works');
assert.doesNotMatch(traffic, /Department of National Roads/i, 'tomtom.html must not mention Department of National Roads');
assert.doesNotMatch(workspace, /Ministry of Works/i, 'mobility.html must not mention Ministry of Works');
assert.doesNotMatch(workspace, /Department of National Roads/i, 'mobility.html must not mention Department of National Roads');

console.log('Data Science Trials traffic entry checks passed.');
