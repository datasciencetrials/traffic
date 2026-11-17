import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

assert.ok(existsSync('index.html'), 'index.html must exist');
assert.ok(existsSync('tomtom.html'), 'tomtom.html must exist');
assert.ok(existsSync('mobility.html'), 'mobility.html must exist');

const root = readFileSync('index.html', 'utf8');
const traffic = readFileSync('tomtom.html', 'utf8');
const workspace = readFileSync('mobility.html', 'utf8');
const bundle = readFileSync('assets/index-DjDNm05t.js', 'utf8');
const identityGuard = readFileSync('identity-guard.js', 'utf8');
const bridgeSummary = JSON.parse(readFileSync('data/bridges_summary.json', 'utf8'));

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

// Do not expose unsupported live, routing, congestion, or origin-destination
// workflows. The published data is a set of dated observations.
assert.doesNotMatch(bundle, /`Route Planner`/, 'synthetic route planner must not be exposed');
assert.doesNotMatch(bundle, /label:`Traffic Index`/, 'synthetic traffic index must not be in navigation');
assert.doesNotMatch(bundle, /label:`OD Matrix`/, 'unverified OD matrix must not be in navigation');
assert.doesNotMatch(bundle, /Real-Time Operating Speeds/, 'recorded ATC observations must not be called real time');
assert.doesNotMatch(bundle, /`LIVE • `|` Go Live`|Projected to the second/, 'historical and projected views must not be presented as live traffic');
assert.doesNotMatch(bundle, /National Road Links \(1,017\)/, 'public copy must report road kilometres, not a link count');
assert.match(bundle, /label:`Network Map`/, 'portal must expose the governed network map');
assert.match(bundle, /label:`Recorded Speed`/, 'portal must label speed observations accurately');
assert.doesNotMatch(workspace, /Live Traffic Map|Traffic Index/i, 'workspace navigation must not claim unsupported live or index data');
assert.doesNotMatch(workspace, /project data through the years to the second/i, 'workspace must not claim continuous projections');
assert.doesNotMatch(identityGuard, /Live Traffic System Online|continuous telemetry/i, 'identity guard must not introduce live-data claims');

// Preserve the governed major-structures baseline and the corrected Rwizi ID.
assert.equal(bridgeSummary.total_bridges, 552, 'governed bridge total must remain 552');
const rwizi = bridgeSummary.critical_structures.find(item => /rwizi/i.test(item.name));
assert.equal(rwizi?.id, 'B005', 'Rwizi Bridge must retain corrected identifier B005');

console.log('Data Science Trials traffic entry checks passed.');
