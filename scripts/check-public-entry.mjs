import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = readFileSync('index.html', 'utf8');
const workspace = readFileSync('mobility.html', 'utf8');

assert.match(root, /<meta name="robots" content="noindex, nofollow">/);
assert.match(root, /location\.replace\(new URL\('mobility\.html'/);
assert.match(root, /personal learning site, not an official Ministry product/i);
assert.doesNotMatch(root, /TomTom Traffic Intelligence|Live Traffic Map|assets\/index-[^" ]+\.js/i);

assert.match(workspace, /<meta name="robots" content="noindex, nofollow">/);
assert.match(workspace, /Personal learning site, not an official Ministry product/);
assert.match(workspace, /This is not a live traffic feed\./);
assert.doesNotMatch(workspace, /Independent measurements are verified|annual surveys using MOBICAP/i);

console.log('Public entry accuracy checks passed.');
