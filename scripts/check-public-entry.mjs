import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

assert.ok(existsSync('index.html'), 'index.html must exist');
assert.ok(!existsSync('tomtom.html'), 'tomtom.html must not exist');
assert.ok(existsSync('mobility.html'), 'mobility.html must exist');

const root = readFileSync('index.html', 'utf8');
const entryMatch = root.match(/assets\/(index\.ntis-[^" ]+\.js)/);
assert.ok(entryMatch, 'index.html must load the production NTIS app bundle');

const entryBundle = readFileSync(`assets/${entryMatch[1]}`, 'utf8');
const trafficFile = readdirSync('assets').find((f) => /^TrafficSection-[^.]+\.js$/.test(f));
assert.ok(trafficFile, 'TrafficSection bundle must exist');
const trafficBundle = readFileSync(`assets/${trafficFile}`, 'utf8');

const bridgeSummary = JSON.parse(readFileSync('data/bridges_summary.json', 'utf8'));

assert.match(root, /<div id="root"><\/div>/, 'index.html must mount the production application');
assert.match(root, /#F5F5F7/, 'index.html must use Apple HIG Light Theme background');
assert.doesNotMatch(root, /TomTom/i, 'index.html must not mention TomTom');
assert.doesNotMatch(entryBundle, /TomTom/i, 'entry bundle must not mention TomTom');
assert.doesNotMatch(entryBundle, /LoginPage/i, 'entry bundle must not include login gate');
assert.match(trafficBundle, /Traffic Map/, 'portal must expose Traffic Map');
assert.match(trafficBundle, /Platform Documentation/, 'portal must expose Platform Documentation');
assert.match(trafficBundle, /Mind Map/, 'portal must expose Mind Map');
assert.equal(bridgeSummary.total_bridges, 552, 'governed bridge total must remain 552');

console.log('Traffic public entry checks passed.');
