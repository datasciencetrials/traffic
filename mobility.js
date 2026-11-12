(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const fmt = new Intl.NumberFormat('en-UG', { maximumFractionDigits: 2 });
  const source = 'data/traffic_dashboard_data.json';
  let dataset, current, filtered = [], classProfile = [], selected, map, markers, tiles, area, areaStart, areaBounds, priorYearRows;
  const palette = ['#64c0cf', '#319db9', '#147ba6', '#075d92'];
  const text = value => value === null || value === undefined || String(value).trim() === '' ? 'Not supplied' : String(value).trim();
  const decodedLink = value => text(value).replaceAll('_', ' ').replace(/\bLink(\d+)\b/gi, 'Link $1');
  const regionName = value => ({ North: 'Northern', South: 'Southern', East: 'Eastern', West: 'Western' })[value] || text(value);
  const surfaceName = value => /unsealed|unpaved|gravel|earth/i.test(text(value)) ? 'Unpaved' : /bituminous|concrete|paved/i.test(text(value)) ? 'Paved' : 'Not supplied';
  const number = value => value === null || value === undefined || String(value).trim() === '' ? null : Number.isFinite(Number(value)) ? Number(value) : null;
  const coordinates = row => {
    const first = number(row.Latitude), second = number(row.Longitude);
    if (first >= 29 && first <= 36 && second >= -2 && second <= 5) return [first, second];
    if (second >= 29 && second <= 36 && first >= -2 && first <= 5) return [second, first];
    return null;
  };
  const stationKey = row => text(row.Section_ID) !== 'Not supplied' ? decodedLink(row.Section_ID) : decodedLink(row.Link_ID);
  const matchKey = row => stationKey(row).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const linkKey = row => decodedLink(row.Link_ID).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const matchingStation = (rows, row) => {
    if (!rows) return null;
    const sameLink = candidate => linkKey(candidate) === linkKey(row);
    const exact = rows.filter(candidate => stationKey(candidate) === stationKey(row) && sameLink(candidate));
    if (exact.length === 1) return exact[0];
    const normalised = rows.filter(candidate => matchKey(candidate) === matchKey(row) && sameLink(candidate));
    return normalised.length === 1 ? normalised[0] : null;
  };
  const repeatsAgainst2023 = row => {
    const prior = matchingStation(priorYearRows, row);
    if (!prior) return false;
    const value = number(row.ADT_including_motorbikes);
    return value !== null && value === number(prior.ADT_including_motorbikes);
  };
  const repeats2023 = row => current.summary.year === 2024 && repeatsAgainst2023(row);
  const status = row => repeats2023(row)
    ? 'Source-reported; same AADT as 2023; independent 2024 count unverified'
    : Number(row.Observed_Days) <= 0 ? 'Source-reported; count days unverified'
      : current.summary.year === 2024 ? 'Source-reported; independent 2024 count unverified' : 'Source-reported';
  const values = rows => rows.map(row => number(row[$('metric').value])).filter(value => value !== null && value >= 0);
  const mean = array => array.length ? array.reduce((sum, n) => sum + n, 0) / array.length : null;
  function setPane(name) {
    document.querySelectorAll('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== name; });
    document.querySelectorAll('[data-pane]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.pane === name)));
  }
  function setView(name, focus = false) {
    const tabs = [...document.querySelectorAll('[data-view]')];
    if (!tabs.some(tab => tab.dataset.view === name)) return;
    for (const tab of tabs) {
      const active = tab.dataset.view === name;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      $(tab.getAttribute('aria-controls')).hidden = !active;
      if (active && focus) tab.focus();
    }
    const activeTab = tabs.find(tab => tab.dataset.view === name);
    const tablist = activeTab?.parentElement;
    if (tablist && tablist.scrollWidth > tablist.clientWidth) {
      tablist.scrollLeft = activeTab.offsetLeft - tablist.offsetLeft - (tablist.clientWidth - activeTab.offsetWidth) / 2;
    }
    if (name === 'map' && map) requestAnimationFrame(() => map.invalidateSize());
    refreshShareLink();
  }
  function shareUrl() {
    const url = new URL(window.location.pathname, window.location.origin);
    const params = url.searchParams;
    if ($('year').value && $('year').value !== String(dataset.latestObservedYear)) params.set('year', $('year').value);
    if ($('metric').selectedIndex > 0) params.set('measure', String($('metric').selectedIndex));
    if ($('region').value) params.set('region', $('region').value);
    if ($('surface').value) params.set('surface', $('surface').value);
    if ($('search').value.trim()) params.set('q', $('search').value.trim());
    const view = document.querySelector('[data-view][aria-selected="true"]')?.dataset.view;
    if (view && view !== 'map') params.set('view', view);
    return url.toString();
  }
  function refreshShareLink() {
    if (dataset && !$('share-link-row').hidden) $('share-link').value = shareUrl();
  }
  function restoreSharedView() {
    const params = new URLSearchParams(window.location.search);
    const year = params.get('year');
    if (year && [...$('year').options].some(option => option.value === year)) $('year').value = year;
    changeYear();
    const measure = params.get('measure');
    if (measure && /^\d+$/.test(measure) && Number(measure) < $('metric').options.length) $('metric').selectedIndex = Number(measure);
    for (const [key, id] of [['region', 'region'], ['surface', 'surface']]) {
      const value = params.get(key);
      if (value && [...$(id).options].some(option => option.value === value)) $(id).value = value;
    }
    $('search').value = (params.get('q') || '').slice(0, 80);
    render();
    setView(params.get('view') || 'map');
  }
  function download(content, filename, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }
  const csvCell = value => {
    const raw = text(value) === 'Not supplied' ? '' : String(value);
    const safe = /^[=+@\-\t\r]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  function publicRecord(row) {
    const xy = coordinates(row);
    return {
      'Source year': current.summary.year,
      'Station ID': stationKey(row),
      'Road link': decodedLink(row.Link_ID),
      'Road name': text(row.Link_Name),
      'Sub-region': regionName(row.Region),
      'Surface type': surfaceName(row.Surface_Type),
      'AADT including motorcycles': number(row.ADT_including_motorbikes),
      [dataset.metricDefinitions.find(item => item.key === $('metric').value)?.label || 'Selected measure']: number(row[$('metric').value]),
      'Observed days': number(row.Observed_Days),
      'Value status': status(row),
      'Longitude (X)': xy?.[0] ?? null,
      'Latitude (Y)': xy?.[1] ?? null,
    };
  }
  function renderDetails(row, showPane = true) {
    selected = row;
    const target = $('station-details'); target.replaceChildren();
    if (!row) { target.textContent = 'Select a station on the map or in the table.'; renderSeries(); return; }
    const formatValue = value => value === null ? 'Not supplied' : fmt.format(value);
    const entries = [['Station', stationKey(row)], ['Road', text(row.Link_Name)], ['Road link', decodedLink(row.Link_ID)], ['Sub-region', regionName(row.Region)], ['Surface', surfaceName(row.Surface_Type)], ['Source year', current.summary.year], ['AADT', formatValue(number(row.ADT_including_motorbikes))], ['Selected measure', formatValue(number(row[$('metric').value]))], ['Status', status(row)]];
    const list = document.createElement('dl'); list.className = 'details-list';
    for (const [label, value] of entries) { const dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; list.append(dt, dd); }
    target.append(list); if (showPane) setPane('details'); renderSeries();
  }
  function renderSeries() {
    const target = $('station-series'); target.replaceChildren();
    if (!selected) { target.textContent = 'Select a station.'; target.className = 'chart-empty'; return; }
    target.className = '';
    const metric = $('metric').value;
    const points = dataset.observedYears.map(year => ({ year: year.summary.year, row: matchingStation(year.stations, selected) })).filter(item => item.row && number(item.row[metric]) !== null);
    if (!points.length) { target.textContent = 'No reported values for this station.'; return; }
    const maximum = Math.max(...points.map(item => number(item.row[metric]) || 0), 1);
    for (const point of points) {
      const line = document.createElement('div'); line.className = 'bar-row';
      const label = document.createElement('span'); label.textContent = String(point.year);
      if (point.year === 2024 && repeatsAgainst2023(point.row)) {
        line.title = '2024 source AADT exactly matches 2023 for this station. This is not proof of an independent 2024 count.';
      }
      const track = document.createElement('div'); track.className = 'bar-track';
      const fill = document.createElement('span'); fill.className = 'bar-fill'; fill.style.width = `${Math.max(2, (number(point.row[metric]) || 0) / maximum * 100)}%`; track.append(fill);
      const value = document.createElement('strong'); value.textContent = fmt.format(number(point.row[metric]) || 0);
      line.append(label, track, value); target.append(line);
    }
  }
  function renderRegions() {
    const target = $('region-bars'); target.replaceChildren();
    const groups = new Map();
    for (const row of filtered) { const name = regionName(row.Region); if (!groups.has(name)) groups.set(name, []); groups.get(name).push(row); }
    const entries = [...groups].map(([name, rows]) => [name, mean(values(rows)), rows.length]).sort((a, b) => (b[1] ?? -1) - (a[1] ?? -1));
    const maximum = Math.max(...entries.map(item => item[1] ?? 0), 1);
    for (const [name, average, count] of entries) {
      const line = document.createElement('div'); line.className = 'bar-row'; line.title = `${count} mapped stations`;
      const label = document.createElement('span'); label.textContent = name;
      const track = document.createElement('div'); track.className = 'bar-track';
      if (average !== null) { const fill = document.createElement('span'); fill.className = 'bar-fill'; fill.style.width = `${Math.max(2, average / maximum * 100)}%`; track.append(fill); }
      const value = document.createElement('strong'); value.textContent = average === null ? 'Not supplied' : fmt.format(average);
      line.append(label, track, value); target.append(line);
    }
    if (!entries.length) target.textContent = 'No stations match these filters.';
  }
  function renderMonthly() {
    const target = $('monthly-bars'); target.replaceChildren();
    const months = (current.monthlyTrend || []).filter(item => Number.isFinite(Number(item.Observed_Roads)));
    const maximum = Math.max(...months.map(item => Number(item.Observed_Roads)), 1);
    for (const month of months) {
      const line = document.createElement('div'); line.className = 'bar-row';
      const label = document.createElement('span'); label.textContent = text(month.Month);
      const track = document.createElement('div'); track.className = 'bar-track';
      const fill = document.createElement('span'); fill.className = 'bar-fill'; fill.style.width = `${Math.max(2, Number(month.Observed_Roads) / maximum * 100)}%`; track.append(fill);
      const value = document.createElement('strong'); value.textContent = fmt.format(Number(month.Observed_Roads));
      line.append(label, track, value); target.append(line);
    }
    if (!months.length) target.textContent = 'No monthly survey coverage supplied.';
  }
  function coverageRow(label, count, total, kind = '', showRatio = true) {
    const row = document.createElement('div'); row.className = 'coverage-row';
    const name = document.createElement('span'); name.textContent = label;
    const track = document.createElement('div'); track.className = 'coverage-track';
    if (count > 0 && total > 0) {
      const fill = document.createElement('span'); fill.className = `coverage-fill ${kind}`;
      fill.style.width = `${Math.max(2, Math.min(100, count / total * 100))}%`;
      track.append(fill);
    }
    const value = document.createElement('strong');
    value.textContent = !showRatio ? `${fmt.format(count)} records` : total === 0 ? 'No matching records' : `${fmt.format(count)} of ${fmt.format(total)} (${Math.round(count / total * 100)}%)`;
    row.append(name, track, value);
    return row;
  }
  function renderCoverage() {
    const yearTarget = $('year-coverage'), surfaceTarget = $('surface-coverage'), measureTarget = $('measure-coverage');
    yearTarget.replaceChildren(); surfaceTarget.replaceChildren(); measureTarget.replaceChildren();
    const years = dataset.observedYears;
    const largestYear = Math.max(...years.map(item => item.stations.length), 1);
    for (const item of years) yearTarget.append(coverageRow(String(item.summary.year), item.stations.length, largestYear, '', false));
    const surfaceCounts = new Map();
    for (const row of filtered) {
      const name = surfaceName(row.Surface_Type);
      surfaceCounts.set(name, (surfaceCounts.get(name) || 0) + 1);
    }
    for (const name of ['Paved', 'Unpaved', 'Not supplied']) {
      if (surfaceCounts.has(name)) surfaceTarget.append(coverageRow(name, surfaceCounts.get(name), filtered.length, name === 'Not supplied' ? 'missing' : ''));
    }
    if (!filtered.length) surfaceTarget.textContent = 'No stations match the current filters.';
    for (const item of dataset.metricDefinitions) {
      const supplied = filtered.filter(row => { const value = number(row[item.key]); return value !== null && value >= 0; }).length;
      measureTarget.append(coverageRow(item.label, supplied, filtered.length, supplied === 0 ? 'missing' : ''));
    }
  }
  function renderClasses() {
    const target = $('class-profile'); target.replaceChildren();
    classProfile = dataset.classOrder.map(label => {
      const supplied = filtered.map(row => number(row[label])).filter(value => value !== null && value >= 0);
      return { label, mean: mean(supplied), supplied: supplied.length };
    });
    const maximum = Math.max(...classProfile.map(item => item.mean ?? 0), 1);
    for (const item of classProfile) {
      const row = document.createElement('div'); row.className = 'class-row';
      const label = document.createElement('span'); label.textContent = item.label;
      const track = document.createElement('div'); track.className = 'class-track';
      if (item.mean !== null && item.mean > 0) {
        const fill = document.createElement('span'); fill.className = 'class-fill';
        fill.style.width = `${Math.max(2, Math.min(100, item.mean / maximum * 100))}%`;
        track.append(fill);
      }
      const value = document.createElement('strong'); value.textContent = item.mean === null ? 'Not supplied' : fmt.format(item.mean);
      const coverage = document.createElement('small'); coverage.textContent = `${fmt.format(item.supplied)} of ${fmt.format(filtered.length)} stations supplied`;
      row.append(label, track, value, coverage); target.append(row);
    }
    $('classes-status').textContent = `${current.summary.year} source-reported class values for ${fmt.format(filtered.length)} matching station records. Each mean uses only stations with that class supplied; the bars do not represent a network total. ${current.summary.year === 2024 ? 'Independent 2024 counts remain unverified.' : ''}`;
    $('export-classes').disabled = !filtered.length;
  }
  function renderRows() {
    const body = document.createDocumentFragment(), metric = $('metric').value;
    $('measure-heading').textContent = dataset.metricDefinitions.find(item => item.key === metric)?.label || 'Selected measure';
    const range = values(filtered), min = Math.min(...range), max = Math.max(...range);
    const aadtValues = filtered.map(row => number(row.ADT_including_motorbikes)).filter(value => value !== null && value >= 0);
    const aadtMin = Math.min(...aadtValues), aadtMax = Math.max(...aadtValues);
    const shade = (cell, value, lower, upper) => {
      if (value === null || !Number.isFinite(lower) || !Number.isFinite(upper)) return;
      const ratio = upper === lower ? 0.5 : Math.max(0, Math.min(1, (value - lower) / (upper - lower)));
      cell.classList.add('value-cell');
      cell.style.backgroundColor = `rgba(36,151,181,${(.06 + ratio * .22).toFixed(3)})`;
      cell.title = 'Relative magnitude within the current filtered station set';
    };
    for (const row of filtered) {
      const tr = document.createElement('tr'); tr.tabIndex = 0;
      const aadt = number(row.ADT_including_motorbikes), magnitude = number(row[metric]);
      const surface = surfaceName(row.Surface_Type);
      const fields = [stationKey(row), text(row.Link_Name), regionName(row.Region), surface, aadt === null ? 'Not supplied' : fmt.format(aadt), magnitude === null ? 'Not supplied' : fmt.format(magnitude)];
      for (const value of fields) { const td = document.createElement('td'); td.textContent = value; tr.append(td); }
      const surfacePill = document.createElement('span'); surfacePill.className = `surface-pill ${surface.toLowerCase().replace(' ', '-')}`; surfacePill.textContent = surface;
      tr.children[3].replaceChildren(surfacePill);
      shade(tr.children[4], aadt, aadtMin, aadtMax);
      shade(tr.children[5], magnitude, min, max);
      const td = document.createElement('td'), pill = document.createElement('span'); pill.className = `status-pill ${Number(row.Observed_Days) <= 0 || current.summary.year === 2024 ? 'unverified' : 'reported'}`; pill.textContent = status(row); td.append(pill); tr.append(td);
      tr.addEventListener('click', () => { renderDetails(row); setView('map'); const xy = coordinates(row); if (map && xy) map.setView([xy[1], xy[0]], Math.max(map.getZoom(), 9)); });
      tr.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); tr.click(); } });
      body.append(tr);
    }
    $('station-rows').replaceChildren(body);
    $('table-note').textContent = `${fmt.format(filtered.length)} matching station records. Station values retain up to two source decimals; AADT is not a network total. Blue cell shading compares values within the filtered rows; surface and status labels show categories. Colours are not engineering thresholds.`;
  }
  function pinColour(value, maximum) {
    const ratio = maximum ? value / maximum : 0;
    return palette[Math.min(palette.length - 1, Math.floor(Math.max(0, ratio) * palette.length))];
  }
  function pinIcon(colour, needsReview) {
    const centre = needsReview ? '#b85d00' : '#137a59', symbol = needsReview ? '!' : '✓';
    const html = `<span class="pin-art" aria-hidden="true"><svg viewBox="0 0 38 48" width="34" height="43"><path d="M19 2 34 10 34 26 19 45 4 26 4 10Z" fill="#0b476d"/><path d="M19 2 34 10 19 18 4 10Z" fill="${colour}"/><path d="M4 10 19 18 19 45 4 26Z" fill="#167ba2"/><path d="M34 10 19 18 19 45 34 26Z" fill="#0b6089"/><circle cx="19" cy="12" r="6" fill="${centre}" stroke="#fff" stroke-width="1.5"/><text x="19" y="15" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="10">${symbol}</text></svg></span>`;
    return L.divIcon({ className: 'station-pin', html, iconSize: [34, 43], iconAnchor: [17, 42] });
  }
  function groupIcon(colour, needsReview, count) {
    const centre = needsReview ? '#b85d00' : '#137a59';
    const symbol = needsReview ? '!' : '✓';
    const html = `<span class="pin-art" aria-hidden="true"><svg viewBox="0 0 54 58" width="48" height="52"><path d="M27 2 51 14 51 42 27 56 3 42 3 14Z" fill="#0b476d"/><path d="M27 2 51 14 27 26 3 14Z" fill="${colour}"/><path d="M3 14 27 26 27 56 3 42Z" fill="#167ba2"/><path d="M51 14 27 26 27 56 51 42Z" fill="#0b6089"/><text x="27" y="20" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="15">${count}</text><circle cx="43" cy="9" r="7" fill="${centre}" stroke="#fff" stroke-width="2"/><text x="43" y="12" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="10">${symbol}</text></svg></span>`;
    return L.divIcon({ className: 'station-pin', html, iconSize: [48, 52], iconAnchor: [24, 50] });
  }
  function renderMap(fit = false) {
    if (!map || !current) return;
    markers.clearLayers();
    if (!$('show-stations').checked) { $('map-status').textContent = 'Station layer hidden'; return; }
    const metricValues = values(filtered), maximum = Math.max(...metricValues, 1), bounds = [];
    const zoom = map.getZoom(), cellSize = zoom <= 7 ? 56 : zoom <= 9 ? 42 : 0;
    const groups = new Map();
    $('value-legend').textContent = `${metricValues.length ? 'Point colour shows lower to higher selected values.' : 'No selected measure is supplied. Grey markers indicate missing values.'} Numbered symbols group nearby stations at wider views; zoom in to inspect each. Amber ! means verification needed; green check means source-reported.`;
    for (const [index, row] of filtered.entries()) {
      const xy = coordinates(row); if (!xy) continue;
      const [lon, lat] = xy;
      const point = cellSize ? map.project([lat, lon], zoom) : null;
      const key = point ? `${Math.floor(point.x / cellSize)}:${Math.floor(point.y / cellSize)}` : String(index);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ row, lat, lon });
      bounds.push([lat, lon]);
    }
    for (const group of groups.values()) {
      if (group.length === 1) {
        const { row, lat, lon } = group[0], value = number(row[$('metric').value]), rowStatus = status(row);
        const marker = L.marker([lat, lon], { icon: pinIcon(value === null ? '#8798a1' : pinColour(value, maximum), rowStatus !== 'Source-reported'), title: `${stationKey(row)}, ${text(row.Link_Name)}. Selected measure: ${value === null ? 'Not supplied' : fmt.format(value)}. ${rowStatus}` });
        marker.on('click', () => renderDetails(row)); marker.addTo(markers);
        continue;
      }
      const lat = mean(group.map(item => item.lat)), lon = mean(group.map(item => item.lon));
      const groupValues = values(group.map(item => item.row));
      const needsReview = group.some(item => status(item.row) !== 'Source-reported');
      const marker = L.marker([lat, lon], { icon: groupIcon(groupValues.length ? pinColour(mean(groupValues), maximum) : '#8798a1', needsReview, group.length), title: `${group.length} nearby stations. ${needsReview ? 'Some values need verification.' : 'Source-reported values.'} Zoom in to inspect individual stations.` });
      marker.on('click', () => map.setView([lat, lon], Math.min(zoom + 2, 12)));
      marker.addTo(markers);
    }
    $('map-status').textContent = `${bounds.length} source-reported station points in ${groups.size} map symbols for ${current.summary.year}. ${metricValues.length ? `${metricValues.length} selected values supplied.` : 'Selected measure not supplied.'} Select area uses two map clicks.`;
    if (fit && bounds.length) map.fitBounds(bounds, { padding: [22, 22], maxZoom: 9 });
  }
  function render(fit = false) {
    if (!current) return;
    const query = $('search').value.trim().toLowerCase(), region = $('region').value, surface = $('surface').value;
    filtered = current.stations.filter(row => (!region || regionName(row.Region) === region) && (!surface || surfaceName(row.Surface_Type) === surface) && (!query || [stationKey(row), text(row.Link_Name), decodedLink(row.Link_ID), text(row.Station)].some(value => value.toLowerCase().includes(query))) && (!areaBounds || (coordinates(row) && areaBounds.contains([coordinates(row)[1], coordinates(row)[0]]))));
    $('station-count').textContent = fmt.format(filtered.length);
    const aadtMean = mean(filtered.map(row => number(row.ADT_including_motorbikes)).filter(n => n !== null));
    $('mean-aadt').textContent = aadtMean === null ? 'Not supplied' : fmt.format(aadtMean);
    const metricMean = mean(values(filtered)); $('measure-total').textContent = metricMean === null ? 'Not supplied' : fmt.format(metricMean);
    $('catalogue-count').textContent = `${fmt.format(current.stations.length)} records`;
    $('data-status').textContent = `${current.summary.year} source-reported station data. ${fmt.format(current.stations.length)} records available.`;
    renderRows(); renderRegions(); renderMonthly(); renderCoverage(); renderClasses(); renderMap(fit);
    refreshShareLink();
    if (selected && !filtered.includes(selected)) renderDetails(null, false);
    else if (selected) renderDetails(selected, false);
    else renderSeries();
  }
  function changeYear() {
    current = dataset.observedYears.find(item => String(item.summary.year) === $('year').value);
    selected = null; renderDetails(null, false);
    const regions = [...new Set(current.stations.map(row => regionName(row.Region)))].sort();
    $('region').replaceChildren(new Option('All sub-regions', ''));
    for (const name of regions) $('region').add(new Option(name, name));
    $('surface').replaceChildren(new Option('All surfaces', ''));
    for (const name of [...new Set(current.stations.map(row => surfaceName(row.Surface_Type)))].sort()) $('surface').add(new Option(name, name));
    $('search').value = ''; areaBounds = null; areaStart = null; $('draw-area').setAttribute('aria-pressed', 'false'); if (area) { area.remove(); area = null; }
    render(true);
  }
  let roadLayer = null;
  function roadStyle(feature) {
    const p = feature.properties || {};
    const isPaved = String(p.surface || '').toLowerCase() === 'bituminous' || String(p.surface || '').toLowerCase() === 'paved';
    const z = map ? map.getZoom() : 7;
    const roadScale = z <= 7 ? 1.0 : Math.min(3.2, 1.0 + Math.max(0, z - 7) * 0.35);
    return {
      color: isPaved ? '#041525' : '#e65100',
      weight: (isPaved ? 2.8 : 1.4) * roadScale,
      opacity: isPaved ? 0.95 : 0.85,
    };
  }
  function updateZoomScale() {
    if (!map) return;
    const z = map.getZoom();
    const scale = z <= 7 ? 0.25 : Math.min(1.25, 0.25 + Math.pow(Math.max(0, z - 7), 1.25) * 0.14);
    const roadScale = z <= 7 ? 1.0 : Math.min(3.2, 1.0 + Math.max(0, z - 7) * 0.35);
    document.documentElement.style.setProperty('--pin-zoom-scale', scale.toFixed(3));
    const container = map.getContainer();
    if (container) {
      container.style.setProperty('--pin-zoom-scale', scale.toFixed(3));
      container.style.setProperty('--road-scale', roadScale.toFixed(2));
    }
    if (roadLayer) {
      roadLayer.setStyle(roadStyle);
    }
  }
  function initMap() {
    if (!window.L) { $('map-status').textContent = 'Map library unavailable. Filters, charts and exports remain available.'; return; }
    map = L.map('map', { preferCanvas: true, zoomControl: true }).setView([1.35, 32.3], 7);
    tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    fetch('road_network.geojson').then(r => r.json()).then(data => {
      roadLayer = L.geoJSON(data, {
        style: roadStyle,
        onEachFeature: (feature, layer) => {
          const p = feature.properties || {};
          layer.bindPopup(`<strong>${p.link_name || p.road || 'Road Link'}</strong><br>${p.surface || 'Paved'} &bull; ${p.length_km ? Number(p.length_km).toFixed(1) + ' km' : ''}`);
        }
      }).addTo(map);
      roadLayer.bringToBack();
      if (tiles) tiles.bringToBack();
    }).catch(err => console.warn('Road network layer load skipped', err));
    markers = L.layerGroup().addTo(map);
    map.on('zoom', updateZoomScale);
    map.on('zoomend', () => { updateZoomScale(); renderMap(); });
    updateZoomScale();
    map.on('click', event => {
      if ($('draw-area').getAttribute('aria-pressed') !== 'true') return;
      if (!areaStart) { areaStart = event.latlng; $('map-status').textContent = 'Select the opposite corner of the area.'; return; }
      areaBounds = L.latLngBounds(areaStart, event.latlng); areaStart = null;
      if (area) area.remove(); area = L.rectangle(areaBounds, { color: '#087c9a', weight: 2, fillOpacity: .08 }).addTo(map);
      $('draw-area').setAttribute('aria-pressed', 'false'); render();
    });
  }
  document.querySelectorAll('[data-pane]').forEach(button => button.addEventListener('click', () => setPane(button.dataset.pane)));
  document.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => setView(button.dataset.view));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const tabs = [...document.querySelectorAll('[data-view]')];
      const index = tabs.indexOf(button);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      setView(tabs[next].dataset.view, true);
    });
  });
  document.querySelectorAll('[data-base]').forEach(button => button.addEventListener('click', () => {
    const plain = button.dataset.base === 'plain'; $('map').classList.toggle('plain', plain);
    document.querySelectorAll('[data-base]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  $('draw-area').addEventListener('click', event => { const pressed = event.currentTarget.getAttribute('aria-pressed') === 'true'; event.currentTarget.setAttribute('aria-pressed', String(!pressed)); areaStart = null; $('map-status').textContent = pressed ? 'Area selection cancelled.' : 'Select two corners on the map.'; });
  $('clear-area').addEventListener('click', () => { areaBounds = null; areaStart = null; $('draw-area').setAttribute('aria-pressed', 'false'); if (area) { area.remove(); area = null; } render(); });
  $('fit').addEventListener('click', () => renderMap(true));
  $('catalogue-stations').addEventListener('click', () => setPane('contents'));
  $('show-stations').addEventListener('change', () => renderMap());
  for (const id of ['metric', 'region', 'surface', 'search']) $(id).addEventListener(id === 'search' ? 'input' : 'change', () => render());
  $('year').addEventListener('change', changeYear);
  $('reset').addEventListener('click', () => { if (!dataset) return; $('year').value = String(dataset.latestObservedYear); $('metric').value = 'ADT_including_motorbikes'; changeYear(); });
  $('share-view').addEventListener('click', async () => {
    if (!dataset) return;
    $('share-link-row').hidden = false;
    refreshShareLink();
    $('share-link').focus(); $('share-link').select();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText($('share-link').value);
      $('share-status').textContent = 'Link copied';
    } catch (_) { $('share-status').textContent = 'Select and copy the link'; }
  });
  $('export-csv').addEventListener('click', () => {
    if (!filtered.length) return;
    const records = filtered.map(publicRecord), headers = Object.keys(records[0]);
    const rows = [headers.map(csvCell).join(','), ...records.map(row => headers.map(header => csvCell(row[header])).join(','))];
    download('\uFEFF' + rows.join('\r\n'), `traffic-stations-${current.summary.year}.csv`, 'text/csv;charset=utf-8');
  });
  $('export-geojson').addEventListener('click', () => {
    const features = filtered.filter(row => coordinates(row)).map(row => ({ type: 'Feature', geometry: { type: 'Point', coordinates: coordinates(row) }, properties: publicRecord(row) }));
    download(JSON.stringify({ type: 'FeatureCollection', features }), `traffic-stations-${current.summary.year}.geojson`, 'application/geo+json');
  });
  $('export-classes').addEventListener('click', () => {
    if (!filtered.length) return;
    const rows = [['Source year', 'Vehicle class', 'Mean station daily value', 'Stations supplied', 'Filtered stations'], ...classProfile.map(item => [current.summary.year, item.label, item.mean === null ? '' : Number(item.mean.toFixed(2)), item.supplied, filtered.length])];
    download('\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n'), `traffic-vehicle-classes-${current.summary.year}.csv`, 'text/csv;charset=utf-8');
  });
  initMap();
  fetch(source).then(response => { if (!response.ok) throw new Error(`Data request returned ${response.status}`); return response.json(); }).then(data => {
    if (!Array.isArray(data.observedYears) || !data.observedYears.every(item => Array.isArray(item.stations) && Number.isInteger(item.summary?.year))) throw new Error('Published station schema is invalid');
    dataset = data;
    priorYearRows = data.observedYears.find(item => item.summary.year === 2023)?.stations || [];
    for (const item of data.observedYears) $('year').add(new Option(`${item.summary.year} source-reported`, item.summary.year));
    $('year').value = String(data.latestObservedYear);
    const metricKeys = new Set(data.observedYears.flatMap(item => Object.keys(item.stations[0] || {})));
    for (const item of data.metricDefinitions.filter(item => metricKeys.has(item.key))) $('metric').add(new Option(item.label, item.key));
    $('metric').value = 'ADT_including_motorbikes'; restoreSharedView();
  }).catch(error => { $('data-status').textContent = 'Published station data unavailable'; $('map-status').textContent = 'Data could not be loaded. Please try again later.'; console.error('Traffic mobility data unavailable', error); });
})();
