import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

assert.ok(existsSync('index.html'), 'index.html must exist');
assert.ok(!existsSync('tomtom.html'), 'tomtom.html must not exist');
assert.ok(existsSync('mobility.html'), 'mobility.html must exist');

const root = readFileSync('index.html', 'utf8');
const bundle = readFileSync('assets/index-DjDNm05t.js', 'utf8');
const bridgeSummary = JSON.parse(readFileSync('data/bridges_summary.json', 'utf8'));

assert.match(root, /<div id="root"><\/div>/, 'index.html must mount the production application');
assert.match(root, /assets\/index-[^" ]+\.js/, 'index.html must load the production app bundle');
assert.match(root, /apple-system\.css/, 'index.html must load the shared light theme');
assert.doesNotMatch(root, /TomTom/i, 'index.html must not mention TomTom');
assert.doesNotMatch(bundle, /TomTom/i, 'bundle must not mention TomTom');

assert.match(bundle, /label:`Network Map`/, 'portal must expose the governed network map');
assert.match(bundle, /label:`Recorded Speed`/, 'portal must label speed observations accurately');
assert.equal(bridgeSummary.total_bridges, 552, 'governed bridge total must remain 552');

console.log('Traffic public entry checks passed.');
