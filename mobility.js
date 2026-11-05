(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const fmt = new Intl.NumberFormat('en-UG', { maximumFractionDigits: 0 });
  const source = 'data/traffic_dashboard_data.json';
  let dataset, current, filtered = [], selected, map, markers, tiles, area, areaStart, areaBounds;
  const palette = ['#64c0cf', '#319db9', '#147ba6', '#075d92'];
  const text = value => value === null || value === undefined || String(value).trim() === '' ? 'Not supplied' : String(value).trim();
  const decodedLink = value => text(value).replaceAll('_', ' ').replace(/\bLink(\d+)\b/gi, 'Link $1');
  const regionName = value => ({ North: 'Northern', South: 'Southern', East: 'Eastern', West: 'Western' })[value] || text(value);
  const surfaceName = value => /bituminous|concrete|paved/i.test(text(value)) ? 'Paved' : /gravel|earth|unpaved/i.test(text(value)) ? 'Unpaved' : 'Not supplied';
  const number = value => Number.isFinite(Number(value)) ? Number(value) : null;
  const coordinates = row => {
    const first = number(row.Latitude), second = number(row.Longitude);
    if (first >= 29 && first <= 36 && second >= -2 && second <= 5) return [first, second];
    if (second >= 29 && second <= 36 && first >= -2 && first <= 5) return [second, first];
    return null;
  };
  const stationKey = row => text(row.Section_ID) !== 'Not supplied' ? decodedLink(row.Section_ID) : decodedLink(row.Link_ID);
  const status = row => Number(row.Observed_Days) <= 0
    ? 'Source-reported, count days unverified'
    : current.summary.year === 2024 ? 'Source-reported, repeat audit pending' : 'Source-reported';
  const values = rows => rows.map(row => number(row[$('metric').value])).filter(value => value !== null && value >= 0);
  const mean = array => array.length ? array.reduce((sum, n) => sum + n, 0) / array.length : null;
  function setPane(name) {
    document.querySelectorAll('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== name; });
    document.querySelectorAll('[data-pane]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.pane === name)));
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
  function renderDetails(row) {
    selected = row;
    const target = $('station-details'); target.replaceChildren();
    if (!row) { target.textContent = 'Select a station on the map or in the table.'; return; }
    const entries = [['Station', stationKey(row)], ['Road', text(row.Link_Name)], ['Road link', decodedLink(row.Link_ID)], ['Sub-region', regionName(row.Region)], ['Surface', surfaceName(row.Surface_Type)], ['Source year', current.summary.year], ['AADT', fmt.format(number(row.ADT_including_motorbikes) || 0)], ['Selected measure', fmt.format(number(row[$('metric').value]) || 0)], ['Status', status(row)]];
    const list = document.createElement('dl'); list.className = 'details-list';
    for (const [label, value] of entries) { const dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; list.append(dt, dd); }
    target.append(list); setPane('details'); renderSeries();
  }
  function renderSeries() {
    const target = $('station-series'); target.replaceChildren();
    if (!selected) { target.textContent = 'Select a station.'; target.className = 'chart-empty'; return; }
    target.className = '';
    const key = stationKey(selected), metric = $('metric').value;
    const points = dataset.observedYears.map(year => ({ year: year.summary.year, row: year.stations.find(row => stationKey(row) === key) })).filter(item => item.row && number(item.row[metric]) !== null);
    if (!points.length) { target.textContent = 'No reported values for this station.'; return; }
    const maximum = Math.max(...points.map(item => number(item.row[metric]) || 0), 1);
    for (const point of points) {
      const line = document.createElement('div'); line.className = 'bar-row';
      const label = document.createElement('span'); label.textContent = String(point.year);
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
    const entries = [...groups].map(([name, rows]) => [name, mean(values(rows)) || 0, rows.length]).sort((a, b) => b[1] - a[1]);
    const maximum = Math.max(...entries.map(item => item[1]), 1);
    for (const [name, average, count] of entries) {
      const line = document.createElement('div'); line.className = 'bar-row'; line.title = `${count} mapped stations`;
      const label = document.createElement('span'); label.textContent = name;
      const track = document.createElement('div'); track.className = 'bar-track';
      const fill = document.createElement('span'); fill.className = 'bar-fill'; fill.style.width = `${Math.max(2, average / maximum * 100)}%`; track.append(fill);
      const value = document.createElement('strong'); value.textContent = fmt.format(average);
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
  function renderRows() {
    const body = document.createDocumentFragment(), metric = $('metric').value;
    $('measure-heading').textContent = dataset.metricDefinitions.find(item => item.key === metric)?.label || 'Selected measure';
    const range = values(filtered), min = Math.min(...range), max = Math.max(...range);
    for (const row of filtered) {
      const tr = document.createElement('tr'); tr.tabIndex = 0;
      const fields = [stationKey(row), text(row.Link_Name), regionName(row.Region), surfaceName(row.Surface_Type), fmt.format(number(row.ADT_including_motorbikes) || 0), fmt.format(number(row[metric]) || 0)];
      for (const value of fields) { const td = document.createElement('td'); td.textContent = value; tr.append(td); }
      const magnitude = number(row[metric]);
      if (magnitude !== null && Number.isFinite(min) && Number.isFinite(max)) {
        const ratio = max === min ? 0.5 : Math.max(0, Math.min(1, (magnitude - min) / (max - min)));
        tr.children[5].className = 'value-cell'; tr.children[5].style.backgroundColor = `rgba(36,151,181,${(.06 + ratio * .22).toFixed(3)})`;
        tr.children[5].title = 'Relative magnitude within the current filtered station set';
      }
      const td = document.createElement('td'), pill = document.createElement('span'); pill.className = `status-pill ${Number(row.Observed_Days) <= 0 || current.summary.year === 2024 ? 'unverified' : 'reported'}`; pill.textContent = status(row); td.append(pill); tr.append(td);
      tr.addEventListener('click', () => { renderDetails(row); const xy = coordinates(row); if (map && xy) map.setView([xy[1], xy[0]], Math.max(map.getZoom(), 9)); });
      tr.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); tr.click(); } });
      body.append(tr);
    }
    $('station-rows').replaceChildren(body);
    $('table-note').textContent = `${fmt.format(filtered.length)} matching station records. AADT is a station value, not a network total.`;
  }
  function pinColour(value, maximum) {
    const ratio = maximum ? value / maximum : 0;
    return palette[Math.min(palette.length - 1, Math.floor(Math.max(0, ratio) * palette.length))];
  }
  function pinIcon(colour) {
    const html = `<span class="pin-art" aria-hidden="true"><svg viewBox="0 0 38 48" width="34" height="43"><path d="M19 2 34 10 34 26 19 45 4 26 4 10Z" fill="#0b476d"/><path d="M19 2 34 10 19 18 4 10Z" fill="${colour}"/><path d="M4 10 19 18 19 45 4 26Z" fill="#167ba2"/><path d="M34 10 19 18 19 45 34 26Z" fill="#0b6089"/><circle cx="19" cy="12" r="4" fill="#fff"/></svg></span>`;
    return L.divIcon({ className: 'station-pin', html, iconSize: [34, 43], iconAnchor: [17, 42] });
  }
  function renderMap(fit = false) {
    if (!map) return;
    markers.clearLayers();
    if (!$('show-stations').checked) { $('map-status').textContent = 'Station layer hidden'; return; }
    const maximum = Math.max(...values(filtered), 1), bounds = [];
    for (const row of filtered) {
      const xy = coordinates(row); if (!xy) continue;
      const [lon, lat] = xy;
      const marker = L.marker([lat, lon], { icon: pinIcon(pinColour(number(row[$('metric').value]) || 0, maximum)), title: `${stationKey(row)}, ${text(row.Link_Name)}` });
      marker.on('click', () => renderDetails(row)); marker.addTo(markers); bounds.push([lat, lon]);
    }
    $('map-status').textContent = `${bounds.length} source-reported station points shown for ${current.summary.year}. Select area uses two map clicks.`;
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
    renderRows(); renderRegions(); renderMonthly(); renderMap(fit); renderSeries();
  }
  function changeYear() {
    current = dataset.observedYears.find(item => String(item.summary.year) === $('year').value);
    selected = null; renderDetails(null);
    const regions = [...new Set(current.stations.map(row => regionName(row.Region)))].sort();
    $('region').replaceChildren(new Option('All sub-regions', ''));
    for (const name of regions) $('region').add(new Option(name, name));
    $('surface').replaceChildren(new Option('All surfaces', ''));
    for (const name of [...new Set(current.stations.map(row => surfaceName(row.Surface_Type)))].sort()) $('surface').add(new Option(name, name));
    $('search').value = ''; areaBounds = null; areaStart = null; if (area) { area.remove(); area = null; }
    render(true);
  }
  function initMap() {
    if (!window.L) { $('map-status').textContent = 'Map library unavailable. Filters, charts and exports remain available.'; return; }
    map = L.map('map', { preferCanvas: true, zoomControl: true }).setView([1.35, 32.3], 7);
    tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    markers = L.layerGroup().addTo(map);
    map.on('click', event => {
      if ($('draw-area').getAttribute('aria-pressed') !== 'true') return;
      if (!areaStart) { areaStart = event.latlng; $('map-status').textContent = 'Select the opposite corner of the area.'; return; }
      areaBounds = L.latLngBounds(areaStart, event.latlng); areaStart = null;
      if (area) area.remove(); area = L.rectangle(areaBounds, { color: '#087c9a', weight: 2, fillOpacity: .08 }).addTo(map);
      $('draw-area').setAttribute('aria-pressed', 'false'); render();
    });
  }
  document.querySelectorAll('[data-pane]').forEach(button => button.addEventListener('click', () => setPane(button.dataset.pane)));
  document.querySelectorAll('[data-base]').forEach(button => button.addEventListener('click', () => {
    const plain = button.dataset.base === 'plain'; $('map').classList.toggle('plain', plain);
    document.querySelectorAll('[data-base]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  $('draw-area').addEventListener('click', event => { const pressed = event.currentTarget.getAttribute('aria-pressed') === 'true'; event.currentTarget.setAttribute('aria-pressed', String(!pressed)); areaStart = null; $('map-status').textContent = pressed ? 'Area selection cancelled.' : 'Select two corners on the map.'; });
  $('clear-area').addEventListener('click', () => { areaBounds = null; areaStart = null; if (area) { area.remove(); area = null; } render(); });
  $('fit').addEventListener('click', () => renderMap(true));
  $('catalogue-stations').addEventListener('click', () => setPane('contents'));
  $('show-stations').addEventListener('change', () => renderMap());
  for (const id of ['metric', 'region', 'surface', 'search']) $(id).addEventListener(id === 'search' ? 'input' : 'change', () => render());
  $('year').addEventListener('change', changeYear);
  $('reset').addEventListener('click', () => { $('metric').value = 'ADT_including_motorbikes'; changeYear(); });
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
  initMap();
  fetch(source).then(response => { if (!response.ok) throw new Error(`Data request returned ${response.status}`); return response.json(); }).then(data => {
    if (!Array.isArray(data.observedYears) || !data.observedYears.every(item => Array.isArray(item.stations) && Number.isInteger(item.summary?.year))) throw new Error('Published station schema is invalid');
    dataset = data;
    for (const item of data.observedYears) $('year').add(new Option(`${item.summary.year} source-reported`, item.summary.year));
    $('year').value = String(data.latestObservedYear);
    const metricKeys = new Set(data.observedYears.flatMap(item => Object.keys(item.stations[0] || {})));
    for (const item of data.metricDefinitions.filter(item => metricKeys.has(item.key))) $('metric').add(new Option(item.label, item.key));
    $('metric').value = 'ADT_including_motorbikes'; changeYear();
  }).catch(error => { $('data-status').textContent = 'Published station data unavailable'; $('map-status').textContent = 'Data could not be loaded. Please try again later.'; console.error('Traffic mobility data unavailable', error); });
})();
