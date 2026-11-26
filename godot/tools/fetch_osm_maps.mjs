import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const citiesPath = path.join(__dirname, '..', 'data', 'cities.json');
const outDir = path.join(__dirname, '..', 'data', 'maps');
fs.mkdirSync(outDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
const cities = data.cities;

const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter'
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function project(lon, lat, cLon, cLat, cosLat) {
  const x = (lon - cLon) * 111320 * cosLat;
  const z = -(lat - cLat) * 111320;
  return [Math.round(x * 10) / 10, Math.round(z * 10) / 10];
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function parseHeight(tags) {
  if (!tags) return 11.0;
  if (tags.height) {
    const m = parseFloat(String(tags.height).replace(',', '.'));
    if (!Number.isNaN(m) && m >= 3 && m <= 120) return Math.round(m * 10) / 10;
  }
  if (tags['building:levels']) {
    const lv = parseFloat(String(tags['building:levels']).replace(',', '.'));
    if (!Number.isNaN(lv) && lv >= 1 && lv <= 40) return Math.round(lv * 3.4 * 10) / 10;
  }
  return 0; // CityBuilder assigns deterministic height 9-18m
}

function roadWidth(hw) {
  switch (hw) {
    case 'motorway':
    case 'trunk':
    case 'primary':
      return 12.0;
    case 'secondary':
      return 9.5;
    case 'tertiary':
      return 7.5;
    case 'residential':
    case 'unclassified':
    case 'living_street':
      return 6.0;
    case 'pedestrian':
      return 5.5;
    default:
      return 3.5;
  }
}

async function queryOverpass(query) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const url = MIRRORS[attempt % MIRRORS.length];
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Accept': 'application/json',
          'User-Agent': 'Globetrotter3DMapBuilder/1.0 (https://github.com/Pontus86/globetrotter)'
        },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(40000)
      });
      if (res.ok) {
        return await res.json();
      }
      console.warn(`  Mirror ${url} HTTP ${res.status}, retrying...`);
    } catch (err) {
      console.warn(`  Mirror ${url} failed (${err.message}), retrying...`);
    }
    await sleep(3000 + attempt * 2000);
  }
  throw new Error('All Overpass mirrors failed');
}

function nearestRoadPoint(target, roads) {
  let best = target;
  let bestD = Infinity;
  for (const r of roads) {
    for (const pt of r.pts) {
      const dx = pt[0] - target[0];
      const dz = pt[1] - target[1];
      const d = dx * dx + dz * dz;
      if (d < bestD) {
        bestD = d;
        best = pt;
      }
    }
  }
  return best;
}

async function fetchCity(cid, city) {
  const outFile = path.join(outDir, `${cid}.json`);
  if (fs.existsSync(outFile) && !process.argv.includes('--force')) {
    console.log(`[SKIP] ${cid} already exists`);
    return;
  }

  const [cLon, cLat] = city.center;
  const cosLat = Math.max(0.25, Math.cos((cLat * Math.PI) / 180));

  // Compute local positions of landmark, hub, precinct (clamped within 750m so map stays tight & fast)
  const rawPts = [
    [0, 0],
    project(city.landmark.coords[0], city.landmark.coords[1], cLon, cLat, cosLat),
    project(city.hub.coords[0], city.hub.coords[1], cLon, cLat, cosLat),
    project(city.precinct.coords[0], city.precinct.coords[1], cLon, cLat, cosLat)
  ];

  let minX = -380, maxX = 380, minZ = -380, maxZ = 380;
  for (const [px, pz] of rawPts) {
    const cx = clamp(px, -620, 620);
    const cz = clamp(pz, -620, 620);
    minX = Math.min(minX, cx - 180);
    maxX = Math.max(maxX, cx + 180);
    minZ = Math.min(minZ, cz - 180);
    maxZ = Math.max(maxZ, cz + 180);
  }
  minX = clamp(minX, -750, -350);
  maxX = clamp(maxX, 350, 750);
  minZ = clamp(minZ, -750, -350);
  maxZ = clamp(maxZ, 350, 750);

  // Convert back to lat/lon bbox (south, west, north, east)
  const south = cLat - maxZ / 111320;
  const north = cLat - minZ / 111320;
  const west = cLon + minX / (111320 * cosLat);
  const east = cLon + maxX / (111320 * cosLat);
  const bbox = `${south.toFixed(5)},${west.toFixed(5)},${north.toFixed(5)},${east.toFixed(5)}`;

  console.log(`[FETCH] ${cid} (${city.name}) bbox=${bbox}...`);

  const q = `[out:json][timeout:30];
(
  way["building"](${bbox});
  way["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street|pedestrian)$"](${bbox});
  way["natural"="water"](${bbox});
  way["waterway"~"^(riverbank|river|canal)$"](${bbox});
  way["leisure"~"^(park|garden)$"](${bbox});
);
out body;
>;
out skel qt;`;

  const json = await queryOverpass(q);
  const nodes = new Map();
  for (const el of json.elements) {
    if (el.type === 'node') {
      nodes.set(el.id, project(el.lon, el.lat, cLon, cLat, cosLat));
    }
  }

  const buildings = [];
  const roads = [];
  const waters = [];
  const parks = [];

  for (const el of json.elements) {
    if (el.type !== 'way' || !el.nodes || el.nodes.length < 2) continue;
    const pts = [];
    for (const nid of el.nodes) {
      const p = nodes.get(nid);
      if (p) pts.push(p);
    }
    if (pts.length < 2) continue;
    const tags = el.tags || {};

    if (tags.building) {
      // Closed polygon, remove duplicate last point
      if (pts.length >= 4 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) {
        pts.pop();
      }
      if (pts.length >= 3 && pts.length <= 120) {
        // Skip buildings outside our bounds
        const [fx, fz] = pts[0];
        if (fx >= minX - 40 && fx <= maxX + 40 && fz >= minZ - 40 && fz <= maxZ + 40) {
          buildings.push({ h: parseHeight(tags), pts });
        }
      }
    } else if (tags.highway) {
      roads.push({
        w: roadWidth(tags.highway),
        b: tags.bridge === 'yes' ? 1 : 0,
        n: tags.name || '',
        pts
      });
    } else if (tags.natural === 'water' || tags.waterway === 'riverbank') {
      if (pts.length >= 4 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) {
        pts.pop();
      }
      if (pts.length >= 3) waters.push(pts);
    } else if (tags.waterway === 'river' || tags.waterway === 'canal') {
      roads.push({ w: 22.0, b: 2, n: tags.name || '', pts }); // b=2 means river strip
    } else if (tags.leisure || tags.landuse) {
      if (pts.length >= 4 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) {
        pts.pop();
      }
      if (pts.length >= 3) parks.push(pts);
    }
  }

  // Preserve existing tile_bounds so re-fetching buildings keeps exact map alignment!
  let existingTileBounds = null;
  if (fs.existsSync(outFile)) {
    try {
      const prev = JSON.parse(fs.readFileSync(outFile, 'utf8'));
      if (prev.tile_bounds) existingTileBounds = prev.tile_bounds;
    } catch {}
  }

  // Cap buildings to max 8000 (chunk streaming handles thousands of buildings at 144 FPS!)
  if (buildings.length > 8000) {
    buildings.sort((a, b) => {
      const da = a.pts[0][0] * a.pts[0][0] + a.pts[0][1] * a.pts[0][1];
      const db = b.pts[0][0] * b.pts[0][0] + b.pts[0][1] * b.pts[0][1];
      return da - db;
    });
    buildings.length = 8000;
  }

  // Compute real POI locations snapped to actual roads so player/police never spawn inside a building!
  const lmRaw = project(city.landmark.coords[0], city.landmark.coords[1], cLon, cLat, cosLat);
  const hubRaw = project(city.hub.coords[0], city.hub.coords[1], cLon, cLat, cosLat);
  const precRaw = project(city.precinct.coords[0], city.precinct.coords[1], cLon, cLat, cosLat);

  const lmPt = nearestRoadPoint([clamp(lmRaw[0], minX + 40, maxX - 40), clamp(lmRaw[1], minZ + 40, maxZ - 40)], roads);
  const hubPt = nearestRoadPoint([clamp(hubRaw[0], minX + 40, maxX - 40), clamp(hubRaw[1], minZ + 40, maxZ - 40)], roads);
  const precPt = nearestRoadPoint([clamp(precRaw[0], minX + 40, maxX - 40), clamp(precRaw[1], minZ + 40, maxZ - 40)], roads);
  const hotelPt = nearestRoadPoint([clamp(minX * 0.45, -240, 240), clamp(minZ * 0.45, -240, 240)], roads);
  const marketPt = nearestRoadPoint([clamp(maxX * 0.45, -240, 240), clamp(maxZ * 0.45, -240, 240)], roads);
  const libraryPt = nearestRoadPoint([clamp(minX * 0.40, -220, 220), clamp(maxZ * 0.45, -220, 220)], roads);

  const out = {
    id: cid,
    bounds: [Math.round(minX), Math.round(maxX), Math.round(minZ), Math.round(maxZ)],
    ...(existingTileBounds ? { tile_bounds: existingTileBounds } : {}),
    pois: {
      landmark: lmPt,
      hub: hubPt,
      precinct: precPt,
      hotel: hotelPt,
      market: marketPt,
      library: libraryPt
    },
    buildings,
    roads,
    waters,
    parks
  };

  fs.writeFileSync(outFile, JSON.stringify(out));
  const kb = Math.round(fs.statSync(outFile).size / 1024);
  console.log(`  -> Saved ${cid}.json (${kb} KB | ${buildings.length} buildings, ${roads.length} roads, ${waters.length} waters, ${parks.length} parks)`);
}

async function main() {
  const ids = Object.keys(cities);
  const failed = [];
  for (let i = 0; i < ids.length; i++) {
    const cid = ids[i];
    try {
      await fetchCity(cid, cities[cid]);
    } catch (err) {
      console.error(`[FAIL] ${cid}: ${err.message}`);
      failed.push(cid);
    }
    if (i < ids.length - 1) await sleep(3000);
  }
  if (failed.length > 0) {
    console.log('FAILED CITIES:', failed.join(', '));
    process.exit(1);
  }
  console.log('ALL 18 CITIES DOWNLOADED!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
