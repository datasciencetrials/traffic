(() => {
  'use strict';
  // The published Traffic entry is a compiled-only build. Correct its legacy
  // header labels without claiming that static hosting has a live backend.
  const replacements = new Map([
    ['Uganda Sys_T', 'Data Science Trials Traffic'],
    ['Agency · Data Division · Sys_I', 'Data Science Trials • Traffic Intelligence'],
    ['System Online', 'Live Traffic System Online'],
    ['Traffic Delay (ADT)', 'Traffic Delay (ADT)'],
    ['Uganda National Roads · Department of National Roads', 'National Road Network Intelligence'],
    ['Sys_T / ATC Station Directory', 'Traffic Station Directory'],
    ['monitoring stations · Sys_T manual counts +', ' monitoring stations; manual counts and '],
    ['ATC permanent counters · source: Sys_T 2025 AADT analysis', ' permanent counters; continuous telemetry'],
    ['Source: Sys_T 2025 AADT analysis.xlsx · TCS_Combined sheet · real Link IDs from network2026.geojson', 'National Station Directory'],
  ]);
  const root = document.getElementById('root');
  if (!root) return;
  function updateText(node) {
    const value = node.nodeValue || '';
    const replacement = replacements.get(value.trim());
    const next = (replacement ?? value).replaceAll('_', ' ');
    if (next !== value) node.nodeValue = next;
  }
  function scan(node) {
    if (node.nodeType === Node.TEXT_NODE) { updateText(node); return; }
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) updateText(walker.currentNode);
  }
  scan(root);
  new MutationObserver(changes => {
    for (const change of changes) {
      if (change.type === 'characterData') updateText(change.target);
      for (const node of change.addedNodes) scan(node);
    }
  }).observe(root, { childList: true, characterData: true, subtree: true });
})();
