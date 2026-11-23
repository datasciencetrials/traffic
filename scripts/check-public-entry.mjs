import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

assert.ok(existsSync('index.html'), 'index.html must exist');
assert.ok(!existsSync('tomtom.html'), 'tomtom.html must not exist');
assert.ok(existsSync('mobility.html'), 'mobility.html must exist');

const root = readFileSync('index.html', 'utf8');
const entryMatch = root.match(/assets\/(index-[^" ]+\.js)/);
assert.ok(entryMatch, 'index.html must load the production National Traffic Index bundle');

const entryBundle = readFileSync(`assets/${entryMatch[1]}`, 'utf8');
const bridgeSummary = JSON.parse(readFileSync('data/bridges_summary.json', 'utf8'));

assert.match(root, /<div id="root"><\/div>/, 'index.html must mount the production application');
assert.match(root, /#F5F5F7/, 'index.html must use Apple HIG Light Theme background');
assert.doesNotMatch(root, /TomTom/i, 'index.html must not mention TomTom');
assert.doesNotMatch(entryBundle, /LoginPage/i, 'entry bundle must not include login gate');
assert.match(entryBundle, /World_Imagery/, 'entry bundle must use Esri World Imagery');
assert.match(entryBundle, /World_Boundaries_and_Places/, 'entry bundle must use Esri Hybrid Reference labels');
assert.match(entryBundle, /Platform Documentation/, 'entry bundle must expose Platform Documentation');
assert.match(entryBundle, /Mind Map/, 'entry bundle must expose Mind Map');
assert.match(entryBundle, /21,284\.02/, 'entry bundle must display authoritative 21,284.02 km network total');
assert.equal(bridgeSummary.total_bridges, 552, 'governed bridge total must remain 552');

console.log('Traffic public entry checks passed.');
