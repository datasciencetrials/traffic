(() => {
  'use strict';
  // The published Traffic entry is a compiled-only build. Correct its legacy
  // header labels without claiming that static hosting has a live backend.
  const replacements = new Map([
    ['Uganda Sys_T', 'Data Science Trials Traffic'],
    ['Agency · Data Division · Sys_I', 'Personal learning site, not an official Ministry product'],
    ['System Online', 'Published data view'],
    ['LIVE', 'Not live traffic'],
    ['Traffic Delay (ADT)', 'Traffic volume (AADT)'],
  ]);
  const root = document.getElementById('root');
  if (!root) return;
  function updateText(node) {
    const replacement = replacements.get(node.nodeValue?.trim());
    if (replacement) node.nodeValue = replacement;
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
