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
    if (!Number.isNaN(m) && m >= 3 && m <= 120) return Math.round(m * 10) / 10;
  }
  if (tags['building:levels']) {
    const lv = parseFloat(String(tags['building:levels']).replace(',', '.'));
    if (!Number.isNaN(lv) && lv >= 1 && lv <= 40) return Math.round(lv * 3.4 * 10) / 10;
  }
  return 0;
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
          'User-Agent': 'Globetrotter3DFullBuildings/1.0'
        },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(45000)
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
  if (osm.full_buildings && !process.argv.includes('--force')) {
    console.log(`[SKIP] ${cid} already has full buildings (${osm.buildings.length})`);
    return;
  }

  const [cLon, cLat] = city.center;
  const cosLat = Math.max(0.25, Math.cos((cLat * Math.PI) / 180));

  // Använd hela kartbildens tile_bounds (med liten marginal så hela staden fylls med hus!)
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

  console.log(`[FULL BUILDINGS] ${cid} (${city.name}) bbox=${bbox}...`);
  // Bara byggnader (snabbt & kompakt!)
  const q = `[out:json][timeout:35];(way["building"](${bbox}););out body;>;out skel qt;`;
  const json = await queryOverpass(q);

  const nodes = new Map();
  for (const el of json.elements) {
    if (el.type === 'node') {
      nodes.set(el.id, project(el.lon, el.lat, cLon, cLat, cosLat));
    }
  }

  const buildings = [];
  for (const el of json.elements) {
    if (el.type !== 'way' || !el.nodes || el.nodes.length < 3) continue;
    const pts = [];
    for (const nid of el.nodes) {
      const p = nodes.get(nid);
      if (p) pts.push(p);
    }
    if (pts.length >= 4 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) {
      pts.pop();
    }
    if (pts.length >= 3 && pts.length <= 120) {
      buildings.push({ h: parseHeight(el.tags), pts });
    }
  }

  // Om en stad har >7500 hus, behåll 7500 närmast centrum
  if (buildings.length > 7500) {
    buildings.sort((a, b) => (a.pts[0][0] ** 2 + a.pts[0][1] ** 2) - (b.pts[0][0] ** 2 + b.pts[0][1] ** 2));
    buildings.length = 7500;
  }

  osm.buildings = buildings;
  osm.full_buildings = true;
  // Rensa tunga onödiga vektor-parker/vatten som nu finns i kartbilden så JSON laddar blixtsnabbt!
  osm.parks = [];
  osm.waters = [];
  fs.writeFileSync(mapFile, JSON.stringify(osm));
  const kb = Math.round(fs.statSync(mapFile).size / 1024);
  console.log(`  -> Updated ${cid}.json: ${buildings.length} buildings (${kb} KB)`);
}

async function main() {
  // Börja med Bryssel & Stockholm så användaren direkt ser skillnaden!
  const allIds = Object.keys(cities);
  const priority = ['brussels', 'stockholm', 'paris', 'london', 'rome'];
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
  console.log('ALL 18 CITIES NOW HAVE FULL BUILDINGS!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
