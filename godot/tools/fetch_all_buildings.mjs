import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const citiesPath = path.join(__dirname, '..', 'data', 'cities.json');
const mapsDir = path.join(__dirname, '..', 'data', 'maps');

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

function parseHeight(tags) {
  if (!tags) return 0;
  if (tags.height) {
    const m = parseFloat(String(tags.height).replace(',', '.'));
    if (!Number.isNaN(m) && m >= 2 && m <= 350) return Math.round(m * 10) / 10;
  }
  if (tags['building:levels']) {
    const lv = parseFloat(String(tags['building:levels']).replace(',', '.'));
    if (!Number.isNaN(lv) && lv >= 1 && lv <= 80) return Math.round(lv * 3.4 * 10) / 10;
  }
  return 0;
}

function parseMinHeight(tags) {
  if (!tags) return 0;
  if (tags.min_height) {
    const m = parseFloat(String(tags.min_height).replace(',', '.'));
    if (!Number.isNaN(m) && m > 0 && m <= 320) return Math.round(m * 10) / 10;
  }
  if (tags['building:min_level']) {
    const lv = parseFloat(String(tags['building:min_level']).replace(',', '.'));
    if (!Number.isNaN(lv) && lv > 0 && lv <= 70) return Math.round(lv * 3.4 * 10) / 10;
  }
  return 0;
}

// Knyter ihop flera OSM outer-ways i en multipolygon-relation till hela slutna ringar
function stitchWays(wayNodeArrays) {
  const remaining = wayNodeArrays.filter((a) => a && a.length >= 2).map((a) => a.slice());
  const rings = [];
  while (remaining.length > 0) {
    let ring = remaining.shift();
    let changed = true;
    while (changed && ring[0] !== ring[ring.length - 1]) {
      changed = false;
      const tail = ring[ring.length - 1];
      for (let i = 0; i < remaining.length; i++) {
        const seg = remaining[i];
        if (seg[0] === tail) {
          ring = ring.concat(seg.slice(1));
          remaining.splice(i, 1);
          changed = true;
          break;
        } else if (seg[seg.length - 1] === tail) {
          ring = ring.concat(seg.slice(0, -1).reverse());
          remaining.splice(i, 1);
          changed = true;
          break;
        }
      }
    }
    if (ring.length >= 4 && ring[0] === ring[ring.length - 1]) {
      ring.pop();
    }
    if (ring.length >= 3) rings.push(ring);
  }
  return rings;
}

// Förenkla mycket stora polygoner (>90 noder) så triangulering & kollision alltid är blixtsnabba
function simplifyPts(pts, maxPts = 90) {
  if (pts.length <= maxPts) return pts;
  const step = pts.length / maxPts;
  const out = [];
  for (let i = 0; i < maxPts; i++) {
    out.push(pts[Math.floor(i * step)]);
  }
  return out;
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
          'User-Agent': 'Globetrotter3DRealMonuments/1.0'
        },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(50000)
      });
      if (res.ok) return await res.json();
      console.warn(`  Mirror ${url} HTTP ${res.status}, retrying...`);
    } catch (err) {
      console.warn(`  Mirror ${url} failed (${err.message}), retrying...`);
    }
    await sleep(3000 + attempt * 2000);
  }
  throw new Error('All Overpass mirrors failed');
}

async function updateCityBuildings(cid, city) {
  const mapFile = path.join(mapsDir, `${cid}.json`);
  if (!fs.existsSync(mapFile)) return;
  const osm = JSON.parse(fs.readFileSync(mapFile, 'utf8').replace(/^\uFEFF/, ''));
  if (osm.has_3d_parts && !process.argv.includes('--force')) {
    console.log(`[SKIP] ${cid} already has building:part + relations (${osm.buildings.length})`);
    return;
  }

  const [cLon, cLat] = city.center;
  const cosLat = Math.max(0.25, Math.cos((cLat * Math.PI) / 180));

  const tb = osm.tile_bounds || osm.bounds;
  const minX = Math.max(-900, tb[0]);
  const maxX = Math.min(900, tb[1]);
  const minZ = Math.max(-900, tb[2]);
  const maxZ = Math.min(900, tb[3]);

  const south = cLat - maxZ / 111320;
  const north = cLat - minZ / 111320;
  const west = cLon + minX / (111320 * cosLat);
  const east = cLon + maxX / (111320 * cosLat);
  const bbox = `${south.toFixed(5)},${west.toFixed(5)},${north.toFixed(5)},${east.toFixed(5)}`;

  console.log(`[3D PARTS + RELS] ${cid} (${city.name}) bbox=${bbox}...`);
  const q = `[out:json][timeout:40];
(
  way["building"](${bbox});
  way["building:part"](${bbox});
  relation["building"](${bbox});
  relation["building:part"](${bbox});
);
out body;
>;
out skel qt;`;
  const json = await queryOverpass(q);

  const nodes = new Map();
  const waysById = new Map();
  for (const el of json.elements) {
    if (el.type === 'node') {
      nodes.set(el.id, project(el.lon, el.lat, cLon, cLat, cosLat));
    } else if (el.type === 'way') {
      waysById.set(el.id, el);
    }
  }

  const buildings = [];
  let partsCount = 0;
  let relsCount = 0;

  // 1. Vanliga way["building"] och detaljerade way["building:part"]
  for (const el of json.elements) {
    if (el.type !== 'way' || !el.nodes || el.nodes.length < 3 || !el.tags) continue;
    const isPart = Boolean(el.tags['building:part']);
    const isBldg = Boolean(el.tags.building);
    if (!isPart && !isBldg) continue;

    const pts = [];
    for (const nid of el.nodes) {
      const p = nodes.get(nid);
      if (p) pts.push(p);
    }
    if (pts.length >= 4 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) {
      pts.pop();
    }
    if (pts.length >= 3) {
      const h = parseHeight(el.tags);
      const mh = parseMinHeight(el.tags);
      const entry = { h, pts: simplifyPts(pts, 90) };
      if (mh > 0) entry.mh = mh;
      if (isPart) {
        entry.p = 1;
        partsCount++;
      }
      buildings.push(entry);
    }
  }

  // 2. Multipolygon-relationer (Colosseum, Stadshuset, Kungliga slottet, innergårdskvarter!)
  for (const el of json.elements) {
    if (el.type !== 'relation' || !el.members || !el.tags) continue;
    if (!el.tags.building && !el.tags['building:part']) continue;

    const outerNodeArrays = [];
    for (const mem of el.members) {
      if (mem.type === 'way' && (mem.role === 'outer' || mem.role === '')) {
        const w = waysById.get(mem.ref);
        if (w && w.nodes && w.nodes.length >= 2) {
          outerNodeArrays.push(w.nodes);
        }
      }
    }
    const rings = stitchWays(outerNodeArrays);
    const h = parseHeight(el.tags);
    const mh = parseMinHeight(el.tags);
    for (const ring of rings) {
      const pts = [];
      for (const nid of ring) {
        const p = nodes.get(nid);
        if (p) pts.push(p);
      }
      if (pts.length >= 3) {
        const entry = { h, pts: simplifyPts(pts, 96) };
        if (mh > 0) entry.mh = mh;
        if (el.tags['building:part']) entry.p = 1;
        buildings.push(entry);
        relsCount++;
      }
    }
  }

  // Behåll max 8500 objekt (prioritera alltid building:part & monument nära centrum!)
  if (buildings.length > 8500) {
    buildings.sort((a, b) => {
      const pa = a.p ? -1e9 : 0;
      const pb = b.p ? -1e9 : 0;
      const da = pa + (a.pts[0][0] ** 2 + a.pts[0][1] ** 2);
      const db = pb + (b.pts[0][0] ** 2 + b.pts[0][1] ** 2);
      return da - db;
    });
    buildings.length = 8500;
  }

  osm.buildings = buildings;
  osm.full_buildings = true;
  osm.has_3d_parts = true;
  osm.parks = [];
  osm.waters = [];
  fs.writeFileSync(mapFile, JSON.stringify(osm));
  const kb = Math.round(fs.statSync(mapFile).size / 1024);
  console.log(`  -> Updated ${cid}.json: ${buildings.length} total (${partsCount} 3D parts, ${relsCount} relations | ${kb} KB)`);
}

async function main() {
  const allIds = Object.keys(cities);
  const priority = ['rome', 'barcelona', 'stockholm', 'milan', 'paris', 'london', 'istanbul'];
  const ordered = [...priority, ...allIds.filter((id) => !priority.includes(id))];
  const failed = [];

  for (let i = 0; i < ordered.length; i++) {
    const cid = ordered[i];
    try {
      await updateCityBuildings(cid, cities[cid]);
    } catch (err) {
      console.error(`[FAIL] ${cid}: ${err.message}`);
      failed.push(cid);
    }
    if (i < ordered.length - 1) await sleep(2500);
  }
  if (failed.length > 0) {
    console.log('FAILED:', failed.join(', '));
    process.exit(1);
  }
  console.log('ALL 18 CITIES NOW HAVE REAL 3D PARTS & RELATIONS!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
