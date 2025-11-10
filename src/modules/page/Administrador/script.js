// ============================================================================
// HERMOSILLO TREE MAP - APLICACIÃ“N PROFESIONAL (Niveles + Ãrboles + LST)
// ============================================================================
import parseGeoraster from 'georaster';
window.parseGeoraster = parseGeoraster; // tu cÃ³digo espera el global

console.log('ðŸŒ³ Iniciando Hermosillo Tree Map Profesional...');

// ----------------------------------------------------------------------------
// CONFIGURACIÃ“N GLOBAL
// ----------------------------------------------------------------------------
const APP_CONFIG = {
  map: {
    center: [-110.947542, 29.0791825],
    zoom: 13.5,
    maxZoom: 19,
    minZoom: 11.5,
    style: 'mapbox://styles/mapbox/streets-v12'
  },
  data: {
    trees: '/trees_hermosillo.geojson',
    colonias: '/colonias_hermosillo.json'
  },

  // dentro de APP_CONFIG
  lstLegend: {
    caption: 'Ãndice UHI',   // tÃ­tulo arriba (pon lo que quieras o deja vacÃ­o '')
    minLabel: '25Â°',        // lo que quieras al lado izquierdo de la barra
    maxLabel: '38Â°',        // lo que quieras al lado derecho de la barra
    overrideRange: true      // true = usar minLabel/maxLabel; false = usa min/max calculados
  },

  // ðŸ‘‰ Control central de niveles
  levels: {
    cityMaxZoom: 12.9,             // Nivel 1: ciudad hasta aquÃ­
    colonia: { min: 13, max: 16 }, // Nivel 2: colonias en este rango
    treesMinZoom: 17.1             // Nivel 3: puntos desde aquÃ­
  },
  speciesColors: {
    'Madera Amarilla': '#A4C3B2',
    'Mezquite Dulce': '#8B5A3C',
    'Tepeguaje': '#6B4E3D',
    'Guajillo': '#9CAF88',
    'Fresno de Arizona': '#4A7C59',
    'Palo Brea': '#F39C12',
    'Encino Negrito': '#2D5016',
    'Trinquete': '#9B59B6',
    'Jaguarcillo': '#6B9080',
    'Palo Verde': '#9CAF88',
    'default': '#4CAF50'
  },
  speciesPhotos: {
    'Madera Amarilla': 'https://images.unsplash.com/photo-1574263867128-01fd5d7dffdb?w=400&h=300&fit=crop',
    'Mezquite Dulce': 'https://images.unsplash.com/photo-1596906792781-e1b525e28a34?w=400&h=300&fit=crop',
    'Tepeguaje': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
    'Guajillo': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'Fresno de Arizona': 'https://images.unsplash.com/photo-1564417976456-86f72ad3ad3a?w=400&h=300&fit=crop',
    'Palo Brea': 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=300&fit=crop',
    'Encino Negrito': 'https://images.unsplash.com/photo-1567473165131-45c5b3142ff8?w=400&h=300&fit=crop',
    'Trinquete': 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400&h=300&fit=crop',
    'Jaguarcillo': 'https://images.unsplash.com/photo-1609686667015-c0ad91b81b3e?w=400&h=300&fit=crop',
    'Palo Verde': 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&h=300&fit=crop'
  },
  speciesPanoramas: { 'Mezquite Dulce': 'panos/mezquite-dulce-360.jpg' },
  animations: { fast: 150, normal: 250, slow: 350 }
};

// ----------------------------------------------------------------------------
// ESTADO GLOBAL
// ----------------------------------------------------------------------------
const AppState = {
  map: null,
  popup: null,

  treesData: null,
  coloniasData: null,

  treeLayer: 'trees-circle',
  treeHighlightLayer: 'trees-highlight',
  coloniasSource: 'colonias',
  cityFillLayer: 'city-fill',
  coloniasFillLayer: 'colonias-fill',
  coloniasLineLayer: 'colonias-outline',

  selectedTree: null,
  selectedSpecies: null,
  filteredTrees: null,
  coloniaFilterGeom: null,

  currentSection: 'map',
  panelOpen: true,
  searchOpen: false,
  filters: { species: '', size: 'all', health: 'all', search: '' },

  hoveredColoniaId: null
};

// ----------------------------------------------------------------------------
// UTILIDADES
// ----------------------------------------------------------------------------
const Utils = {
  getSpeciesColor(species) {
    const speciesName = species ? species.split('(')[0].trim() : 'default';
    return APP_CONFIG.speciesColors[speciesName] || APP_CONFIG.speciesColors.default;
  },
  getScientificName(species) {
    if (!species) return 'Nombre cientÃ­fico no disponible';
    const match = species.match(/\((.*?)\)/);
    return match ? match[1] : 'Nombre cientÃ­fico no disponible';
  },
  getCommonName(species) { return species ? species.split('(')[0].trim() : 'Especie desconocida'; },
  calculateAge(plantedYear) {
    const currentYear = new Date().getFullYear();
    return plantedYear ? currentYear - plantedYear : 0;
  },
  formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat('es-MX', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num ?? 0);
  },
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount ?? 0);
  },
  uniqueColor(seed) {
    const n = Math.abs(Number(seed ?? 0)) || Math.floor(Math.random() * 1e6);
    const hue = (n * 137.508) % 360;
    return `hsl(${hue}, 70%, 45%)`;
  },
  normalize(str) {
    return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ');
  },
  canonicalSpecies(name) {
    const n = this.normalize(name);
    const alias = { 'palo verde amarillo': 'Palo Verde', 'palo verde azul': 'Palo Verde', 'mezquite dulce': 'Mezquite Dulce', 'palo brea': 'Palo Brea' };
    return alias[n] || this.getCommonName(name);
  },
  colorForSpecies(name) {
    const canon = this.canonicalSpecies(name);
    return APP_CONFIG.speciesColors[canon] || this.uniqueColor(canon);
  },
  debounce(func, wait) {
    let timeout; return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func(...args), wait); };
  },
  getAnyProp(obj, keys = []) { for (const k of keys) { if (obj && obj[k] != null && obj[k] !== '') return obj[k]; } return null; },
  getColoniaName(props = {}) {
    return this.getAnyProp(props, ['name','nombre','NOMBRE','colonia','COLONIA','asentamien','ASENTAMIEN']) || 'Colonia s/n';
  }
};

// ----------------------------------------------------------------------------
// Parser tolerante de colonias
// ----------------------------------------------------------------------------
function tryParseColonias(text) {
  let t = (text || '').replace(/^\uFEFF/, '').trim();
  t = t.replace(/,\s*$/, ''); // coma final
  try { return JSON.parse(t); } catch {}

  if (t.includes('"GeometryCollection"') && t.includes('"geometries"')) {
    let fixed = t;
    const hasClosingArray = /\]\s*\}\s*$/.test(fixed);
    if (!hasClosingArray) {
      if (/\]\s*$/.test(fixed)) fixed += '}';
      else if (/\}\s*$/.test(fixed)) fixed += ']';
      else fixed += ']}';
    }
    try { return JSON.parse(fixed); } catch {}
  }

  const features = [];
  for (const line of t.split(/\r?\n/)) {
    const s = line.trim(); if (!s) continue;
    try {
      const maybe = JSON.parse(s);
      if (maybe.type === 'Feature') features.push(maybe);
      else if (maybe.type) features.push({ type:'Feature', properties:{}, geometry: maybe });
    } catch {}
  }
  if (features.length) return { type:'FeatureCollection', features };
  throw new Error('JSON de colonias invÃ¡lido o truncado');
}

// ----------------------------------------------------------------------------
// Normalizador de colonias
// ----------------------------------------------------------------------------
function normalizeColoniasGeoJSON(input) {
  const EPS = 1e-9;
  const eq = (a,b) => Math.abs(+a - +b) <= EPS;
  const same = (c1,c2) => c1 && c2 && eq(c1[0],c2[0]) && eq(c1[1],c2[1]);

  const closeRing = (ring) => {
    if (!Array.isArray(ring) || ring.length < 3) return ring || [];
    const first = ring[0], last = ring[ring.length-1];
    return same(first, last) ? ring : [...ring, first];
  };

  const maybeSwapped = (c) => {
    const x = Number(c[0]), y = Number(c[1]);
    return isFinite(x) && isFinite(y) && Math.abs(x) <= 90 && Math.abs(y) <= 180;
  };
  const fixCoord = (c) => (maybeSwapped(c) ? [Number(c[1]), Number(c[0])] : [Number(c[0]), Number(c[1])]);

  const fixRing  = (ring)  => closeRing(ring.map(fixCoord));
  const fixPoly  = (poly)  => poly.map(fixRing);
  const fixMulti = (multi) => multi.map(fixPoly);

  let fc;
  switch (input?.type) {
    case 'FeatureCollection': fc = input; break;
    case 'Feature':           fc = { type:'FeatureCollection', features:[input] }; break;
    case 'GeometryCollection':
      fc = { type:'FeatureCollection', features: (input.geometries || []).map((g,i)=>({ type:'Feature', geometry:g, properties:{ _uid:i+1 } })) }; break;
    case 'Polygon':
    case 'MultiPolygon':
      fc = { type:'FeatureCollection', features:[{ type:'Feature', geometry:input, properties:{ _uid:1 } }] }; break;
    default:
      return { type:'FeatureCollection', features:[] };
  }

  const out = { type:'FeatureCollection', features:[] };
  (fc.features || []).forEach((f,i)=>{
    const props = { ...(f.properties||{}), _uid:(f.properties?._uid ?? i+1) };
    const g = f.geometry; if (!g?.type || !g?.coordinates) return;
    if (g.type === 'Polygon') out.features.push({ type:'Feature', properties:props, geometry:{ type:'Polygon', coordinates: fixPoly(g.coordinates) }});
    else if (g.type === 'MultiPolygon') out.features.push({ type:'Feature', properties:props, geometry:{ type:'MultiPolygon', coordinates: fixMulti(g.coordinates) }});
  });
  return out;
}

// ----------------------------------------------------------------------------
async function ensureStyleReady() {
  const m = AppState.map;
  if (!m) return;
  if (m.isStyleLoaded?.() || m.loaded?.()) return;
  await Promise.race([
    new Promise(res => m.once('load', res)),
    new Promise(res => m.once('idle', res)),
    new Promise(res => setTimeout(res, 800))
  ]);
}

// ----------------------------------------------------------------------------
// CÃLCULOS DE BENEFICIOS
// ----------------------------------------------------------------------------
const BenefitsCalculator = {
  calculateTreeBenefits(diameter_cm, height_m, crown_diameter_m) {
    const diameter_inches = diameter_cm * 0.393701;
    const height_feet = height_m * 3.28084;
    const crown_diameter_feet = crown_diameter_m * 3.28084;
    const crown_area_sqft = Math.PI * Math.pow(crown_diameter_feet / 2, 2);

    const stormwater_gallons = crown_area_sqft * 0.623;
    const stormwater_value = stormwater_gallons * 0.01;

    const energy_kwh = crown_area_sqft * 0.84 * (height_feet / 30);
    const energy_value = energy_kwh * 0.126;

    const air_pollutants_lbs = (crown_area_sqft * 0.027) + (diameter_inches * 0.1);
    const air_value = air_pollutants_lbs * 5.15;

    const total_value = stormwater_value + energy_value + air_value;

    return {
      stormwater:     { amount: Math.round(stormwater_gallons), value: +stormwater_value.toFixed(2), unit: 'gallons', formatted: `${Utils.formatNumber(stormwater_gallons)} litros` },
      energy:         { amount: Math.round(energy_kwh),         value: +energy_value.toFixed(2),     unit: 'kWh',     formatted: `${Utils.formatNumber(energy_kwh)} kWh` },
      airPollutants:  { amount: +air_pollutants_lbs.toFixed(1), value: +air_value.toFixed(2),        unit: 'kg',      formatted: `${air_pollutants_lbs.toFixed(1)} kg` },
      totalValue:     { amount: +total_value.toFixed(2),        formatted: Utils.formatCurrency(total_value) }
    };
  },
  calculateAggregateStats(trees) {
    if (!trees || !trees.length) {
      return { totalTrees: 0, speciesCount: {}, totalStormwater: 0, totalEnergy: 0, totalAirPollutants: 0, totalBenefitsValue: 0, avgAge: 0, mostCommonSpecies: 'N/A' };
    }
    const speciesCount = {};
    let totalStormwater = 0, totalEnergy = 0, totalAirPollutants = 0, totalBenefitsValue = 0;
    let totalAge = 0, ageCount = 0;

    trees.forEach(tree => {
      const props = tree.properties || {};
      const speciesName = Utils.getCommonName(props.species);
      speciesCount[speciesName] = (speciesCount[speciesName] || 0) + 1;

      const diameter = props.diameter_cm || 25;
      const height = props.height_m || 6;
      const crownDiameter = props.crown_diameter || (diameter * 0.12);

      const benefits = this.calculateTreeBenefits(diameter, height, crownDiameter);
      totalStormwater += benefits.stormwater.amount;
      totalEnergy += benefits.energy.amount;
      totalAirPollutants += benefits.airPollutants.amount;
      totalBenefitsValue += benefits.totalValue.amount;

      const age = Utils.calculateAge(props.planted_year);
      if (age > 0) { totalAge += age; ageCount++; }
    });

    const avgAge = ageCount ? Math.round(totalAge / ageCount) : 8;
    const mostCommonSpecies = Object.keys(speciesCount).reduce((a,b)=> (speciesCount[a] > speciesCount[b] ? a : b), 'N/A');

    return {
      totalTrees: trees.length,
      speciesCount,
      totalStormwater: Math.round(totalStormwater),
      totalEnergy: Math.round(totalEnergy),
      totalAirPollutants: +totalAirPollutants.toFixed(1),
      totalBenefitsValue: +totalBenefitsValue.toFixed(2),
      avgAge, mostCommonSpecies
    };
  }
};

// ============================================================================
// GESTOR DEL MAPA (Mapbox + niveles + Ã¡rboles + colonias)
// ============================================================================
const MapManager = {
  async init() {
    console.log('ðŸ—ºï¸ Inicializando mapa (Mapbox)...');

    // 1) Crear el mapa
    AppState.map = new mapboxgl.Map({
      container: 'map',
      style: APP_CONFIG.map.style,
      center: APP_CONFIG.map.center,
      zoom: APP_CONFIG.map.zoom,
      minZoom: APP_CONFIG.map.minZoom,
      maxZoom: APP_CONFIG.map.maxZoom
    });

    // 2) Al cargar el estilo, activar 3D y LST control
    AppState.map.on('load', () => this.enable3D());
    AppState.map.on('style.load', () => LSTManager.install(AppState.map));

    // Click en fondo â†’ limpiar selecciÃ³n/filtros y volver a overview
    AppState.map.on('click', (e) => {
      const layersToCheck = [
        AppState.treeLayer,
        AppState.coloniasFillLayer,
        AppState.coloniasLineLayer
      ].filter(id => id && AppState.map.getLayer(id));

      const feats = AppState.map.queryRenderedFeatures(e.point, { layers: layersToCheck });
      if (!feats.length) {
        this.clearColoniaFilter();
        AppState.selectedTree = null;
        UI.clearSpeciesHighlight?.();
        if (AppState.popup) { AppState.popup.remove(); AppState.popup = null; }
        UI.showOverview();
      }
    });

    // ESC â†’ limpiar filtro de colonia
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.clearColoniaFilter(); });

    // refrescar lista especies con vista actual
    AppState.map.on('moveend', () => UI.refreshSpeciesList());

    console.log('âœ… Mapa inicializado');
  },

  async enable3D() {
    await ensureStyleReady();

    // ProyecciÃ³n (opcional)
    try { AppState.map.setProjection('globe'); } catch (e) {}

    // Terreno (DEM)
    if (!AppState.map.getSource('mapbox-dem')) {
      AppState.map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512
      });
      AppState.map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.4 });
    }

    // Cielo
    if (!AppState.map.getLayer('sky')) {
      AppState.map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun-intensity': 12
        }
      });
    }

    // Edificios 3D
    const labelLayerId = AppState.map.getStyle().layers
      .find(l => l.type === 'symbol' && l.layout?.['text-field'])?.id;

    if (!AppState.map.getLayer('3d-buildings')) {
      AppState.map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', ['get', 'extrude'], 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#bfbfbf',
          'fill-extrusion-opacity': 0.6,
          'fill-extrusion-height': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            16, ['coalesce', ['get', 'height'], 10]
          ],
          'fill-extrusion-base': ['coalesce', ['get', 'min_height'], 0]
        }
      }, labelLayerId);
    }

    // InclinaciÃ³n/rotaciÃ³n para â€œsentirâ€ el 3D
    AppState.map.setPitch(60);
    AppState.map.setBearing(-20);
    AppState.map.dragRotate.enable();
    AppState.map.touchZoomRotate.enableRotation();
  },

  // ---------------------------
  // Ãrboles (Nivel 3)
  // ---------------------------
  async loadTrees() {
    try {
      console.log('ðŸŒ³ Cargando datos de Ã¡rboles...');
      await ensureStyleReady();

      const resp = await fetch(APP_CONFIG.data.trees);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      const geojson = await resp.json();
      if (!geojson || !geojson.features || !geojson.features.length) {
        throw new Error('GeoJSON de Ã¡rboles vacÃ­o o invÃ¡lido');
      }

      geojson.features.forEach((f) => {
        const p = f.properties || (f.properties = {});
        p.species_common = Utils.getCommonName(p.species);
        p.color = Utils.colorForSpecies(p.species);
        if (p.id == null) p.id = f.id || Math.random().toString(36).slice(2);
      });

      AppState.treesData = geojson.features;
      AppState.filteredTrees = [...AppState.treesData];

      const TREES_MIN_ZOOM = (APP_CONFIG.levels?.treesMinZoom ?? 16);

      if (!AppState.map.getSource('trees')) {
        AppState.map.addSource('trees', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: AppState.filteredTrees }
        });

        AppState.map.addLayer({
          id: AppState.treeLayer,
          type: 'circle',
          source: 'trees',
          minzoom: TREES_MIN_ZOOM,
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              TREES_MIN_ZOOM, ['max', 3, ['min', ['/', ['coalesce', ['get', 'diameter_cm'], 25], 4], 10]],
              19,             ['max', 6, ['min', ['/', ['coalesce', ['get', 'diameter_cm'], 25], 3], 14]]
            ],
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.9,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 1
          }
        });

        const highlightRadiusExpr = ['*',
          ['max', 4, ['min', ['/', ['coalesce', ['get', 'diameter_cm'], 25], 4], 12]],
          1.6
        ];

        AppState.map.addLayer({
          id: AppState.treeHighlightLayer,
          type: 'circle',
          source: 'trees',
          minzoom: TREES_MIN_ZOOM,
          layout: { visibility: 'none' },
          filter: ['==', ['coalesce', ['get', 'species_common'], ''], ''],
          paint: {
            'circle-radius': highlightRadiusExpr,
            'circle-color': '#000',
            'circle-opacity': 0.95,
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2
          }
        });

        AppState.map.on('mouseenter', AppState.treeLayer, () => { AppState.map.getCanvas().style.cursor = 'pointer'; });
        AppState.map.on('mouseleave', AppState.treeLayer, () => { AppState.map.getCanvas().style.cursor = ''; });
        AppState.map.on('click', AppState.treeLayer, (e) => {
          const f = e.features[0];
          AppState.selectedTree = f;
          const p = f.properties || {};
          UI.showTreeDetails(p.id);
        });
      } else {
        this.renderTrees();
      }

      const stats = BenefitsCalculator.calculateAggregateStats(AppState.treesData);
      UI.updateOverviewStats(stats);
      UI.refreshSpeciesList();
      console.log(`âœ… ${AppState.treesData.length} Ã¡rboles cargados`);
    } catch (err) {
      console.error('âŒ Error cargando Ã¡rboles:', err);
      UI.showError('Error cargando datos de Ã¡rboles');
    }
  },

  // ---------------------------
  // Colonias + Ciudad (Niveles 1 y 2)
  // ---------------------------
  async loadColonias() {
    try {
      console.log('ðŸŸ© Cargando colonias...');
      const url = APP_CONFIG.data.colonias;

      const resp = await fetch(url, { cache: 'no-store' });
      console.log('ðŸ”Ž colonias status:', resp.status, resp.ok, 'from', resp.url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status} al cargar ${url}`);

      const rawText = await resp.text();
      if (rawText.trim().startsWith('<')) {
        console.error('â›”ï¸ RecibÃ­ HTML. Primeros chars:\n', rawText.slice(0, 200));
        throw new Error('El servidor devolviÃ³ HTML en vez de JSON. Verifica la ruta /colonias_hermosillo.json');
      }

      let parsed;
      try { parsed = tryParseColonias(rawText); }
      catch (e) { console.error('â›”ï¸ JSON invÃ¡lido. Preview:\n', rawText.slice(0, 200)); throw e; }

      const coloniasFC = normalizeColoniasGeoJSON(parsed);
      const count = coloniasFC.features?.length || 0;
      console.log('ðŸ§© Colonias normalizadas, count:', count);
      if (!count) throw new Error('No hay polÃ­gonos vÃ¡lidos en colonias');

      // Asigna _uid y colores de semÃ¡foro por colonia (estable por _uid)
      coloniasFC.features.forEach((f, i) => {
        f.properties ||= {};
        if (f.properties._uid == null) f.properties._uid = i + 1;

        const SEMAPHORE = ['#2ecc71', '#f1c40f', '#e74c3c']; // verde, amarillo, rojo

        // aclara un color hex (para hover)
        const brighten = (hex, amt = 28) => {
          let c = hex.replace('#','');
          if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
          const num = parseInt(c, 16);
          const r = Math.min(255, (num >> 16) + amt);
          const g = Math.min(255, ((num >> 8) & 0xff) + amt);
          const b = Math.min(255, (num & 0xff) + amt);
          return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        };

        const id = f.properties._uid;
        const base = SEMAPHORE[id % SEMAPHORE.length];
        f.properties.sem_color = base;            // color base (nivel 2)
        f.properties.sem_hover = brighten(base);  // color resaltado al hover
      });


      await ensureStyleReady();

      // (Opcional) conteo de Ã¡rboles por colonia
      let finalFC = coloniasFC;
      try {
        const treesFC = {
          type:'FeatureCollection',
          features: (AppState.treesData || []).map(pt => {
            pt.properties ||= {}; if (pt.properties.id == null) pt.properties.id = pt.id || Math.random().toString(36).slice(2);
            return pt;
          })
        };
        if (window.turf?.collect) {
          const joined = turf.collect(coloniasFC, treesFC, 'id', 'tree_ids');
          joined.features.forEach(poly => {
            const ids = poly.properties.tree_ids || [];
            poly.properties.tree_count = Array.isArray(ids) ? ids.length : 0;
          });
          finalFC = joined;
        } else if (window.turf?.booleanPointInPolygon) {
          console.warn('turf.collect no disponible; uso booleanPointInPolygon (lento)');
          coloniasFC.features.forEach(poly => {
            let c = 0;
            for (const pt of (AppState.treesData || [])) { try { if (turf.booleanPointInPolygon(pt, poly)) c++; } catch{} }
            poly.properties.tree_count = c;
          });
          finalFC = coloniasFC;
        }
      } catch (e) {
        console.warn('Conteo inside fallÃ³. Motivo:', e);
        finalFC = coloniasFC;
      }

      AppState.coloniasData = finalFC;

      // ---- NIVELES DE ZOOM (usamos la config central)
      const CITY_MAX_ZOOM    = APP_CONFIG.levels.cityMaxZoom;
      const COLONIA_MIN_ZOOM = APP_CONFIG.levels.colonia.min;
      const COLONIA_MAX_ZOOM = APP_CONFIG.levels.colonia.max;

      // Fuente de colonias
      if (!AppState.map.getSource(AppState.coloniasSource)) {
        AppState.map.addSource(AppState.coloniasSource, {
          type: 'geojson',
          data: AppState.coloniasData,
          promoteId: '_uid'
        });
      } else {
        AppState.map.getSource(AppState.coloniasSource).setData(AppState.coloniasData);
      }

      // MÃ¡scara unificada de ciudad (sin bordes internos)
      let cityUnion;
      try {
        if (window.turf?.dissolve) {
          cityUnion = turf.dissolve(AppState.coloniasData);
        } else if (window.turf?.union) {
          cityUnion = AppState.coloniasData.features.reduce((acc, f) => {
            if (!acc) return f;
            return turf.union(acc, f);
          }, null);
        } else {
          const geoms = (AppState.coloniasData.features || [])
            .map(f => f.geometry)
            .filter(Boolean)
            .flatMap(g => g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
          cityUnion = { type:'Feature', properties:{}, geometry:{ type:'MultiPolygon', coordinates: geoms } };
        }
      } catch (e) {
        console.warn('No se pudo unificar ciudad, uso fallback:', e);
        const geoms = (AppState.coloniasData.features || [])
          .map(f => f.geometry)
          .filter(Boolean)
          .flatMap(g => g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
        cityUnion = { type:'Feature', properties:{}, geometry:{ type:'MultiPolygon', coordinates: geoms } };
      }

      // Fuente para la mÃ¡scara de ciudad
      const CITY_MASK_SOURCE = 'city-mask';
      if (!AppState.map.getSource(CITY_MASK_SOURCE)) {
        AppState.map.addSource(CITY_MASK_SOURCE, { type: 'geojson', data: cityUnion });
      } else {
        AppState.map.getSource(CITY_MASK_SOURCE).setData(cityUnion);
      }

      // Insertar por debajo de puntos si ya existen
      const beforeId = AppState.map.getLayer(AppState.treeLayer) ? AppState.treeLayer : undefined;

      // ---------------------------
      // NIVEL 1: "Ciudad pintada" SIN separaciones
      // ---------------------------
      const FILL_CITY_COLOR = '#19f619';

      if (!AppState.map.getLayer(AppState.cityFillLayer)) {
        AppState.map.addLayer({
          id: AppState.cityFillLayer,
          type: 'fill',
          source: CITY_MASK_SOURCE,
          maxzoom: APP_CONFIG.levels.cityMaxZoom,
          paint: {
            'fill-color': FILL_CITY_COLOR,
            'fill-opacity': 0.18,
            'fill-outline-color': FILL_CITY_COLOR,
            'fill-antialias': false
          }
        }, beforeId);
      }

      // ---------------------------
      // NIVEL 2: PolÃ­gonos (colonias) con colores de semÃ¡foro
      // ---------------------------
      const LINE_COLOR       = '#bdbdbd';
      const LINE_COLOR_HOVER = '#44642c';

      if (!AppState.map.getLayer(AppState.coloniasFillLayer)) {
        AppState.map.addLayer({
          id: AppState.coloniasFillLayer,
          type: 'fill',
          source: AppState.coloniasSource,
          minzoom: COLONIA_MIN_ZOOM,
          maxzoom: COLONIA_MAX_ZOOM,
          paint: {
            // usa el color por colonia; en hover usa la versiÃ³n â€œbrightâ€
            'fill-color': [
              'case',
              ['boolean', ['feature-state','hover'], false],
              ['coalesce', ['get','sem_hover'], ['get','sem_color']],
              ['coalesce', ['get','sem_color'], '#c8e6c9']
            ],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state','hover'], false], 0.55,
              0.35
            ]
          }
        }, beforeId);
      }

      if (!AppState.map.getLayer(AppState.coloniasLineLayer)) {
        AppState.map.addLayer({
          id: AppState.coloniasLineLayer,
          type: 'line',
          source: AppState.coloniasSource,
          minzoom: COLONIA_MIN_ZOOM,
          maxzoom: COLONIA_MAX_ZOOM,
          paint: {
            'line-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false], LINE_COLOR_HOVER,
              LINE_COLOR
            ],
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false], 2.0,
              1.0
            ],
            'line-opacity': 0.70
          }
        }, beforeId);
      }


      // Hover handlers para colonias (solo Nivel 2)
      const setHover = (id, hover) => {
        if (id == null) return;
        AppState.map.setFeatureState({ source: AppState.coloniasSource, id }, { hover });
      };
      const onMove = (e) => {
        AppState.map.getCanvas().style.cursor = 'pointer';
        const feat = e.features && e.features[0]; if (!feat) return;
        const id = feat.id ?? feat.properties?._uid;
        if (AppState.hoveredColoniaId !== id) {
          if (AppState.hoveredColoniaId != null) setHover(AppState.hoveredColoniaId, false);
          AppState.hoveredColoniaId = id; setHover(id, true);
        }
      };
      const onLeave = () => {
        AppState.map.getCanvas().style.cursor = '';
        if (AppState.hoveredColoniaId != null) { setHover(AppState.hoveredColoniaId, false); AppState.hoveredColoniaId = null; }
      };

      AppState.map.on('mousemove', AppState.coloniasFillLayer, onMove);
      AppState.map.on('mouseleave', AppState.coloniasFillLayer, onLeave);
      AppState.map.on('mousemove', AppState.coloniasLineLayer, onMove);
      AppState.map.on('mouseleave', AppState.coloniasLineLayer, onLeave);

      // Click handlers (abre panel y filtra por geometrÃ­a)
      AppState.map.off('click', AppState.coloniasFillLayer, this._onColoniaClick);
      AppState.map.off('click', AppState.coloniasLineLayer, this._onColoniaClick);
      AppState.map.on('click', AppState.coloniasFillLayer, this._onColoniaClick.bind(this));
      AppState.map.on('click', AppState.coloniasLineLayer, this._onColoniaClick.bind(this));

      // Fit bounds a todas las colonias
      try {
        const bboxAll = turf.bbox(AppState.coloniasData);
        AppState.map.fitBounds(bboxAll, { padding: 24, duration: 600 });
      } catch (e) {
        console.warn('No pude fitBounds colonias:', e);
      }

      console.log('âœ… Colonias cargadas y pintadas (opacidad fija)');
    } catch (err) {
      console.error('âŒ Error cargando colonias:', err);
      UI.showError('Error cargando colonias: ' + (err?.message || err));
    }
  },

  _onColoniaClick(e) {
    if (!e.features?.length) return;
    const f = e.features[0];

    // Filtro por geometrÃ­a
    AppState.coloniaFilterGeom = f.geometry;
    this.updateTreesWithinFilter?.();

    // Centrar
    try {
      const bbox = turf.bbox(f);
      AppState.map.fitBounds(bbox, { padding: 30, duration: 650 });
    } catch {}

    // Mostrar panel con info de colonia
    UI.showColoniaDetails(f);
  },

  updateTreesWithinFilter() {
    if (!AppState.map.getLayer(AppState.treeLayer)) return;

    if (AppState.coloniaFilterGeom) {
      AppState.map.setFilter(AppState.treeLayer, ['within', AppState.coloniaFilterGeom]);

      if (AppState.map.getLayer(AppState.treeHighlightLayer)) {
        if (AppState.selectedSpecies) {
          AppState.map.setFilter(AppState.treeHighlightLayer, [
            'all',
            ['==', ['get', 'species_common'], AppState.selectedSpecies],
            ['within', AppState.coloniaFilterGeom]
          ]);
        } else {
          AppState.map.setLayoutProperty(AppState.treeHighlightLayer, 'visibility', 'none');
          AppState.map.setFilter(AppState.treeHighlightLayer, ['==', ['get','species_common'], '']);
        }
      }
    } else {
      AppState.map.setFilter(AppState.treeLayer, null);
      if (AppState.map.getLayer(AppState.treeHighlightLayer)) {
        if (AppState.selectedSpecies) {
          AppState.map.setFilter(AppState.treeHighlightLayer, ['==', ['get', 'species_common'], AppState.selectedSpecies]);
          AppState.map.setLayoutProperty(AppState.treeHighlightLayer, 'visibility', 'visible');
        } else {
          AppState.map.setLayoutProperty(AppState.treeHighlightLayer, 'visibility', 'none');
          AppState.map.setFilter(AppState.treeHighlightLayer, ['==', ['get','species_common'], '']);
        }
      }
    }
  },

  clearColoniaFilter() {
    AppState.coloniaFilterGeom = null;
    this.updateTreesWithinFilter();
    if (AppState.popup) { AppState.popup.remove(); AppState.popup = null; }
  },

  renderTrees() {
    if (!AppState.map?.getSource('trees')) return;
    AppState.map.getSource('trees').setData({
      type: 'FeatureCollection',
      features: AppState.filteredTrees
    });
  },

  applyFilters() {
    const { species, size, health, search } = AppState.filters;

    AppState.filteredTrees = (AppState.treesData || []).filter(tree => {
      const props = tree.properties || {};
      if (species && !Utils.getCommonName(props.species).toLowerCase().includes(species.toLowerCase())) return false;

      if (size !== 'all') {
        const h = props.height_m || 6;
        if (size === 'small'  && h >= 5) return false;
        if (size === 'medium' && (h < 5 || h > 10)) return false;
        if (size === 'large'  && h <= 10) return false;
      }

      if (health !== 'all') {
        const th = (props.health || '').toLowerCase();
        if (health === 'excellent' && !th.includes('excelente')) return false;
        if (health === 'good'      && !th.includes('buena'))     return false;
        if (health === 'fair'      && !th.includes('regular'))   return false;
      }

      if (search) {
        const q = search.toLowerCase();
        const common = Utils.getCommonName(props.species).toLowerCase();
        const sci = Utils.getScientificName(props.species).toLowerCase();
        if (!common.includes(q) && !sci.includes(q)) return false;
      }
      return true;
    });

    this.renderTrees();
    const stats = BenefitsCalculator.calculateAggregateStats(AppState.filteredTrees);
    UI.updateOverviewStats(stats);

    if (AppState.selectedSpecies) UI.toggleSpeciesHighlight(AppState.selectedSpecies);
  }
};

// ============================================================================
// UI
// ============================================================================
const UI = {
  init() {
    console.log('ðŸŽ¨ Inicializando interfaz...');
    this.setupNavigation();
    this.setupMapControls();
    this.setupSearch();
    this.setupFilters();
    this.setupPanelControls();
    this.showOverview();
    console.log('âœ… Interfaz inicializada');
  },

  setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section; this.showSection(section);
        navBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
      });
    });
  },

  setupMapControls() {
    // ðŸ”¥ BotÃ³n LST en el header (junto a la lupa)
    const lstBtn = document.querySelector('.lst-btn');
    if (lstBtn) {
      lstBtn.addEventListener('click', async () => {
        try {
          const visible = await LSTManager.toggle(AppState.map, { anchor: AppState.treeLayer });
          lstBtn.classList.toggle('active', visible);
        } catch (e) {
          console.error('LST error:', e);
          this.showError('No se pudo cargar/mostrar la capa LST');
        }
      });
    }

    // Mantengo soporte si decides volver a poner estos botones en HTML:
    const locateBtn = document.querySelector('.locate-btn');
    if (locateBtn) {
      locateBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => { AppState.map.flyTo({ center: [longitude, latitude], zoom: 16 }); },
            (error) => { console.warn('GeolocalizaciÃ³n no disponible:', error); this.showError('No se pudo obtener tu ubicaciÃ³n'); }
          );
        }
      });
    }

    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>'; }
        else { document.exitFullscreen(); fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>'; }
      });
    }

    const panelToggle = document.querySelector('.panel-toggle');
    if (panelToggle) { panelToggle.addEventListener('click', this.togglePanel.bind(this)); }
  },

  setupSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.getElementById('global-search');

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        searchOverlay?.classList.add('active'); AppState.searchOpen = true;
        setTimeout(() => searchInput && searchInput.focus(), 100);
      });
    }
    if (searchClose) { searchClose.addEventListener('click', () => { searchOverlay?.classList.remove('active'); AppState.searchOpen = false; }); }
    if (searchInput) {
      const performSearch = Utils.debounce((query) => this.performGlobalSearch(query), 300);
      searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && AppState.searchOpen) { searchOverlay?.classList.remove('active'); AppState.searchOpen = false; } });
  },

  setupFilters() {
    const speciesSearch = document.getElementById('species-search');
    const sizeFilter    = document.getElementById('size-filter');
    const healthFilter  = document.getElementById('health-filter');

    if (speciesSearch) {
      speciesSearch.addEventListener('input', Utils.debounce((e) => { AppState.filters.species = e.target.value; MapManager.applyFilters(); }, 300));
    }
    if (sizeFilter)   sizeFilter.addEventListener('change', (e) => { AppState.filters.size = e.target.value; MapManager.applyFilters(); });
    if (healthFilter) healthFilter.addEventListener('change', (e) => { AppState.filters.health = e.target.value; MapManager.applyFilters(); });
  },

  setupPanelControls() {
    const closeBtn = document.querySelector('.modal-close'); closeBtn?.addEventListener('click', () => this.hideDetails());
    const handle = document.getElementById('details-handle'); handle?.addEventListener('click', () => this.showDetails());
    const backdrop = document.getElementById('modal-backdrop'); backdrop?.addEventListener('click', () => this.hideDetails());
  },

  showSection(sectionName) {
    AppState.currentSection = sectionName;
    document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`${sectionName}-section`); target?.classList.add('active');

    switch (sectionName) {
      case 'map': setTimeout(() => AppState.map && AppState.map.resize(), 300); break;
      case 'explore': this.populateTreesGrid(); break;
      case 'benefits': this.renderBenefitsCharts(); break;
    }
  },

  showOverview() {
    this.updateElement('panel-title', 'EstadÃ­sticas del Bosque Urbano');
    document.querySelectorAll('.panel-view').forEach(v => v.classList.remove('active'));
    document.getElementById('overview-content')?.classList.add('active');

    if (AppState.treesData) {
      const stats = BenefitsCalculator.calculateAggregateStats(AppState.filteredTrees || AppState.treesData);
      this.updateOverviewStats(stats);
    }
    this.showDetails();
  },

  togglePanel() { if (AppState.panelOpen) this.hideDetails(); else this.showDetails(); },

  showDetails() {
    const modal = document.getElementById('details-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const handle = document.getElementById('details-handle');
    if (!modal) return;
    modal.classList.add('open'); backdrop?.classList.remove('hidden'); handle?.classList.add('hidden'); AppState.panelOpen = true;
  },

  hideDetails() {
    const modal = document.getElementById('details-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const handle = document.getElementById('details-handle');
    if (!modal) return;
    modal.classList.remove('open'); backdrop?.classList.add('hidden'); handle?.classList.remove('hidden'); AppState.panelOpen = false;
  },

  showTreeDetails(treeId) {
    const tree = (AppState.treesData || []).find(t => t.properties.id === treeId); if (!tree) return;

    AppState.selectedTree = tree;
    const p = tree.properties;
    this.updateElement('panel-title', Utils.getCommonName(p.species));

    document.querySelectorAll('.panel-view').forEach(v => v.classList.remove('active'));
    document.getElementById('tree-content')?.classList.add('active');

    this.updateTreeContent(tree);
    this.showDetails();

    if (tree.geometry && Array.isArray(tree.geometry.coordinates)) {
      const [lng, lat] = tree.geometry.coordinates;
      AppState.map?.flyTo({ center: [lng, lat], zoom: Math.max(AppState.map.getZoom() || 17, 18) });
    }
  },

  // NUEVO: Detalles de colonia
  showColoniaDetails(feature) {
    const p = feature?.properties || {};
    theName: {
      // evitar variables sombreadas
    }
    const nombre = Utils.getColoniaName(p);
    const count  = Number(p.tree_count || 0);

    this.updateElement('panel-title', nombre);
    document.querySelectorAll('.panel-view').forEach(v => v.classList.remove('active'));

    const cont = document.getElementById('colonia-content');
    if (cont) {
      cont.innerHTML = `
        <div class="colonia-summary">
          <div class="detail-row"><span class="label">Colonia:</span><span class="value">${nombre}</span></div>
          <div class="detail-row"><span class="label">Ãrboles registrados:</span><span class="value">${Utils.formatNumber(count)}</span></div>
        </div>
        <div class="hint" style="margin-top:.75rem; font-size:.9rem; opacity:.8">
          * Los Ã¡rboles del mapa se filtraron a los que caen dentro de esta colonia.
          Presiona <b>Esc</b> o haz click fuera para limpiar el filtro.
        </div>
      `;
      cont.classList.add('active');
    }
    this.showDetails();
  },

  updateTreeContent(tree) {
    const p = tree.properties;
    const speciesName = Utils.getCommonName(p.species);

    const img = document.getElementById('tree-image');
    const photoUrl = APP_CONFIG.speciesPhotos[speciesName]
      || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop';
    if (img) { img.src = photoUrl; img.alt = `Foto de ${speciesName}`; }

    this.updateElement('tree-id-badge', p.id);
    this.updateElement('tree-species-name', speciesName);
    this.updateElement('tree-scientific-name', Utils.getScientificName(p.species));
    this.updateElement('tree-location', this.generateAddress());
    this.updateElement('tree-diameter', p.diameter_cm ? `${p.diameter_cm} cm` : 'No disponible');
    this.updateElement('tree-height', p.height_m ? `${p.height_m} m` : 'No disponible');
    this.updateElement('tree-crown', p.crown_diameter ? `${p.crown_diameter} m` : 'No disponible');
    this.updateElement('tree-year', p.planted_year || 'No disponible');
    this.updateElement('tree-health', p.health || 'No disponible');

    const container360 = document.getElementById('tree-360-container');
    if (container360) { container360.innerHTML = ''; container360.style.display = 'none'; }

    // Street View (ejemplo solo para Mezquite Dulce)
    try {
      if (container360 && window.google && window.google.maps && tree.geometry && Array.isArray(tree.geometry.coordinates)) {
        const spName = Utils.getCommonName(p.species);
        if (spName.toLowerCase() === 'mezquite dulce') {
          const [lng, lat] = tree.geometry.coordinates;
          container360.style.display = 'block';
          if (!container360.style.height) container360.style.height = '260px';
          new google.maps.StreetViewPanorama(container360, {
            position: { lat, lng },
            pov: { heading: 100, pitch: 0 },
            zoom: 1,
            disableDefaultUI: true,
            linksControl: false,
            panControl: false,
            zoomControl: false,
            addressControl: false,
            fullscreenControl: false
          });
        }
      }
    } catch (e) { console.warn('StreetView no disponible:', e); }

    const diameter = p.diameter_cm || 25;
    const height   = p.height_m    || 6;
    const crown    = p.crown_diameter || (diameter * 0.12);
    const benefits = BenefitsCalculator.calculateTreeBenefits(diameter, height, crown);
    const container = document.getElementById('individual-benefits');
    if (container) {
      container.innerHTML = `
        <div class="tree-benefit-item">
          <span class="tree-benefit-label">Agua interceptada:</span>
          <span class="tree-benefit-value">${benefits.stormwater.formatted} (${Utils.formatCurrency(benefits.stormwater.value)})</span>
        </div>
        <div class="tree-benefit-item">
          <span class="tree-benefit-label">EnergÃ­a ahorrada:</span>
          <span class="tree-benefit-value">${benefits.energy.formatted} (${Utils.formatCurrency(benefits.energy.value)})</span>
        </div>
        <div class="tree-benefit-item">
          <span class="tree-benefit-label">Contaminantes removidos:</span>
          <span class="tree-benefit-value">${benefits.airPollutants.formatted} (${Utils.formatCurrency(benefits.airPollutants.value)})</span>
        </div>
        <div class="tree-benefit-item total">
          <span class="tree-benefit-label"><strong>Valor Anual Total:</strong></span>
          <span class="tree-benefit-value"><strong>${benefits.totalValue.formatted}</strong></span>
        </div>
      `;
    }

    if (tree.geometry && Array.isArray(tree.geometry.coordinates)) {
      const [lng, lat] = tree.geometry.coordinates;
      AppState.map.flyTo({ center: [lng, lat], zoom: Math.max(AppState.map.getZoom() || 17, 18) });
    }
  },

  updateOverviewStats(stats) {
    this.updateElement('total-trees', Utils.formatNumber(stats.totalTrees));
    this.updateElement('total-species', Utils.formatNumber(Object.keys(stats.speciesCount).length));
    this.updateElement('total-benefits', Utils.formatCurrency(stats.totalBenefitsValue));

    this.updateElement('stormwater-total', `${Utils.formatNumber(stats.totalStormwater)} litros`);
    this.updateElement('stormwater-value', Utils.formatCurrency(stats.totalStormwater * 0.01));

    this.updateElement('energy-total', `${Utils.formatNumber(stats.totalEnergy)} kWh`);
    this.updateElement('energy-value', Utils.formatCurrency(stats.totalEnergy * 0.126));

    this.updateElement('air-total', `${stats.totalAirPollutants} kg`);
    this.updateElement('air-value', `${Utils.formatCurrency(stats.totalAirPollutants * 5.15)}`);

    this.updateElement('total-annual-benefits', Utils.formatCurrency(stats.totalBenefitsValue));
    this.updateCommonSpecies(stats.speciesCount);
  },

  updateCommonSpeciesFromMap() {
    try {
      if (AppState?.map && AppState.map.getLayer(AppState.treeLayer)) {
        const feats = AppState.map.queryRenderedFeatures({ layers: [AppState.treeLayer] }) || [];
        const counts = {};
        for (const f of feats) {
          const p = f.properties || {};
          const name = p.species_common || Utils.getCommonName(p.species);
          counts[name] = (counts[name] || 0) + 1;
        }
        this.updateCommonSpecies(counts); return;
      }
      const list = AppState.filteredTrees || AppState.treesData || [];
      const counts = {};
      for (const t of list) {
        const p = t.properties || {};
        const name = p.species_common || Utils.getCommonName(p.species);
        counts[name] = (counts[name] || 0) + 1;
      }
      this.updateCommonSpecies(counts);
    } catch (e) { console.warn('No se pudo actualizar especies desde el mapa:', e); }
  },

  refreshSpeciesList() { requestAnimationFrame(() => this.updateCommonSpeciesFromMap()); },

  updateCommonSpecies(speciesCount) {
    const TOP_N = 5;
    const listEl = document.getElementById('common-species-list');
    const legendEl = document.getElementById('species-color-legend');
    if (!listEl) return;

    const sorted = Object.entries(speciesCount).sort(([,a],[,b]) => b - a);
    const top = sorted.slice(0, TOP_N);
    let others = sorted.slice(TOP_N); if (!others.length) others = sorted;

    listEl.innerHTML = top.map(([species, count]) => {
      const color = Utils.colorForSpecies(species);
      const active = (AppState.selectedSpecies === species) ? ' active' : '';
      return `
        <button class="species-chip${active}" data-species="${species}">
          <span class="dot" style="background:${color}"></span>
          <span class="name">${species}</span>
          <span class="count">${count}</span>
        </button>
      `;
    }).join('');

    listEl.querySelectorAll('.species-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const species = btn.dataset.species;
        if (AppState.selectedSpecies === species) this.clearSpeciesHighlight();
        else this.toggleSpeciesHighlight(species);
      });
    });

    if (legendEl) {
      legendEl.innerHTML = others.map(([species, count]) => {
        const color = Utils.colorForSpecies(species);
        const active = (AppState.selectedSpecies === species) ? ' active' : '';
        return `
          <div class="legend-item${active}" data-species="${species}">
            <span class="legend-color" style="background:${color}"></span>
            <div class="legend-text">
              <span class="legend-species">${species}</span>
              <span class="legend-count">${count} ejemplares</span>
            </div>
          </div>
        `;
      }).join('');

      legendEl.querySelectorAll('.legend-item').forEach(el => {
        el.addEventListener('click', () => {
          const species = el.dataset.species;
          if (AppState.selectedSpecies === species) this.clearSpeciesHighlight();
          else this.toggleSpeciesHighlight(species);
        });
      });
    }
  },

  toggleSpeciesHighlight(species) {
    AppState.selectedSpecies = species;
    const color = Utils.colorForSpecies(species);

    if (AppState.map.getLayer(AppState.treeHighlightLayer)) {
      AppState.map.setLayoutProperty(AppState.treeHighlightLayer, 'visibility', 'visible');
      if (AppState.coloniaFilterGeom) {
        AppState.map.setFilter(AppState.treeHighlightLayer, ['all', ['==', ['get', 'species_common'], species], ['within', AppState.coloniaFilterGeom]]);
      } else {
        AppState.map.setFilter(AppState.treeHighlightLayer, ['==', ['get', 'species_common'], species]);
      }
      AppState.map.setPaintProperty(AppState.treeHighlightLayer, 'circle-color', color);
    }
    if (AppState.map.getLayer(AppState.treeLayer)) {
      AppState.map.setPaintProperty(AppState.treeLayer, 'circle-opacity', ['case', ['==', ['get', 'species_common'], species], 0.95, 0.22]);
    }
  },

  clearSpeciesHighlight() {
    AppState.selectedSpecies = null;
    if (AppState.map.getLayer(AppState.treeHighlightLayer)) {
      AppState.map.setLayoutProperty(AppState.treeHighlightLayer, 'visibility', 'none');
      AppState.map.setFilter(AppState.treeHighlightLayer, ['==', ['get','species_common'], '']);
    }
    if (AppState.map.getLayer(AppState.treeLayer)) {
      AppState.map.setPaintProperty(AppState.treeLayer, 'circle-opacity', 0.9);
    }
  },

  // Stubs UI usados arriba
  updateElement(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; },
  generateAddress() { return 'Hermosillo, Sonora'; },
  showError(msg) { console.error(msg); },
  performGlobalSearch() {},
  populateTreesGrid() {},
  renderBenefitsCharts() {}
};

// ---------------------------------------------------------------------------
// Resolver de assets pÃºblicos (funciona en /, /trees/, con <base href>, etc.)
// ---------------------------------------------------------------------------
const PublicAssets = {
  _candidates(file) {
    const list = new Set();

    // 1) Si hay <base href>, Ãºsalo
    try {
      const baseHref = document.querySelector('base')?.getAttribute('href');
      if (baseHref) list.add(new URL(file, baseHref).pathname);
    } catch {}

    // 2) Primer segmento del path (p.ej. "/trees")
    const seg = location.pathname.split('/').filter(Boolean)[0];
    if (seg) list.add(`/${seg}/${file}`);

    // 3) Relativo al documento actual
    try {
      list.add(new URL(file, document.baseURI).pathname);
    } catch { list.add(file); }

    // 4) RaÃ­z del sitio
    list.add(`/${file}`);

    // 5) ConvenciÃ³n /public
    list.add(`/public/${file}`);

    return Array.from(list);
  },

  async fetchJson(file) {
    let lastErr = '';
    for (const url of this._candidates(file)) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) return await res.json();
        lastErr = `HTTP ${res.status} en ${url}`;
      } catch (e) {
        lastErr = `${e}`;
      }
    }
    throw new Error(`No pude cargar ${file}. ${lastErr}`);
  }
};

// --- Cargador robusto de GeoRaster (multi-CDN + ESM + local) ---
const GeoLibs = {
  _ready: false,
  _pending: null,

  async ensureGeoRaster() {
    if (this._ready || typeof parseGeoraster === "function") {
      this._ready = true; return;
    }
    if (this._pending) return this._pending;

    const PIN = "@1.6.1"; // versiÃ³n estable conocida
    const TAGS = [
      "/libs/georaster.browser.min.js",
      "/georaster.browser.min.js",
      "https://cdn.jsdelivr.net/npm/georaster/dist/georaster.browser.min.js",
      "https://unpkg.com/georaster/dist/georaster.browser.min.js"
    ];

    const loadScript = (url) => new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
      s.onload = () => resolve(url);
      s.onerror = () => reject(new Error(`fallÃ³ ${url}`));
      document.head.appendChild(s);
      const guard = setInterval(() => {
        if (typeof parseGeoraster === "function") { clearInterval(guard); resolve(url); }
      }, 60);
      setTimeout(() => clearInterval(guard), 8000);
    });

    const tryDynamicImport = async () => {
      // ESM: si no hay global, importamos el mÃ³dulo y levantamos window.parseGeoraster
      const candidates = [
        `https://esm.sh/georaster${PIN}`,
        `https://cdn.skypack.dev/georaster${PIN}`
      ];
      for (const murl of candidates) {
        try {
          const mod = await import(/* @vite-ignore */ murl);
          const fn = mod?.default || mod?.parseGeoraster;
          if (typeof fn === "function") {
            window.parseGeoraster = fn;
            return true;
          }
        } catch {}
      }
      return false;
    };

    this._pending = (async () => {
      const errors = [];
      for (const url of TAGS) {
        try {
          await loadScript(url);
          if (typeof parseGeoraster === "function") { this._ready = true; return; }
        } catch (e) { errors.push(String(e?.message || e)); }
      }
      // Ãºltimo intento: ESM dinÃ¡mico
      const ok = await tryDynamicImport();
      if (ok) { this._ready = true; return; }

      throw new Error(
        "No pude cargar GeoRaster. Sube una copia local a /public/libs/ o desactiva AdBlock para los CDNs. " +
        "Detalles: " + errors.join(" | ")
      );
    })();

    return this._pending;
  }
};


// ============================================================================
// LST (Land Surface Temperature)
// Se dibuja POR ENCIMA de colonias y POR DEBAJO de Ã¡rboles.
// ============================================================================
  const LSTManager = (() => {
    const SRC_ID   = "lst-202508-src";
    const FILL_ID  = "lst-202507-fill";     // compatibilidad (vector fill)
    const OUTL_ID  = "lst-202507-outline";  // compatibilidad (vector line)
    const HEAT_ID  = "lst-202507-heat";     // compatibilidad (heatmap)
    const RST_ID   = "lst-202508-raster";   // capa raster actual
    const LST_FILE = "libs/HMO_UHIint_202508.tif";  // tu GeoTIFF

    const state = { legend: null, visible: false, ready: false, opacity: 0.75 };

    function makeLegend(map) {
    const cfg = APP_CONFIG.lstLegend || {};
    const el = document.createElement("div");
    el.className = "lst-legend";
    el.style.display = "none";
    el.innerHTML = `
      <div class="caption">${cfg.caption ?? 'Ãndice UHI'}</div>
      <div class="bar"></div>
      <div class="scale"><span id="lst-min"></span><span id="lst-max"></span></div>
    `;
    map.getContainer().appendChild(el);
    const bar = el.querySelector(".bar");

    return {
      el,
      setRange(min, max) {
        const left  = (cfg.overrideRange && cfg.minLabel != null) ? cfg.minLabel : Number(min).toFixed(1);
        const right = (cfg.overrideRange && cfg.maxLabel != null) ? cfg.maxLabel : Number(max).toFixed(1);
        el.querySelector("#lst-min").textContent = left;
        el.querySelector("#lst-max").textContent = right;
      },
      setGradient(stops) { bar.style.background = `linear-gradient(90deg, ${stops.join(",")})`; },
      show(v) { el.style.display = v ? "block" : "none"; }
    };
  }


    function setLayerOpacity(map, op) {
      const v = Math.max(0, Math.min(1, Number(op)));
      state.opacity = v;

      const apply = (id) => {
        if (!map.getLayer(id)) return;
        const type = map.getLayer(id).type;
        const prop =
          type === "raster"  ? "raster-opacity"  :
          type === "heatmap" ? "heatmap-opacity" :
          type === "fill"    ? "fill-opacity"    :
          type === "line"    ? "line-opacity"    :
          type === "circle"  ? "circle-opacity"  : null;
        if (prop) map.setPaintProperty(id, prop, v);
      };

      [RST_ID, HEAT_ID, FILL_ID, OUTL_ID].forEach(apply);
    }

    // sniff de encabezado para errores como "Invalid byte order value"
    function isTiff(ab) {
      if (!ab || ab.byteLength < 4) return false;
      const dv = new DataView(ab);
      const b0 = dv.getUint8(0), b1 = dv.getUint8(1);
      return (b0 === 0x49 && b1 === 0x49) || (b0 === 0x4D && b1 === 0x4D);
    }

    async function ensureLayers(map, anchorId) {
      await ensureStyleReady();
      if (!state.legend) state.legend = makeLegend(map);
      if (map.getSource(SRC_ID)) return; // ya creada

      // Asegura GeoRaster cargado (cargador robusto externo)
      await GeoLibs.ensureGeoRaster();

      // --- 1) Cargar el TIFF como ArrayBuffer (intenta varias rutas)
      const ab = await (async () => {
        const candidates = (PublicAssets?._candidates?.(LST_FILE)) || [
          new URL(LST_FILE, document.baseURI).pathname,
          `/${(location.pathname.split('/').filter(Boolean)[0] || '')}/${LST_FILE}`.replace('//', '/'),
          `/${LST_FILE}`,
          `/public/${LST_FILE}`
        ];
        let lastErr = "";
        for (const url of Array.from(new Set(candidates))) {
          try {
            const r = await fetch(url, { cache: "no-store" });
            if (!r.ok) { lastErr = `HTTP ${r.status} en ${url}`; continue; }
            const buf = await r.arrayBuffer();
            if (!isTiff(buf)) {
              // intenta decodificar primeros bytes para detectar HTML/JSON
              try {
                const head = new TextDecoder().decode(new Uint8Array(buf.slice(0, 80)));
                throw new Error(`Encabezado no-TIFF en ${url}: ${JSON.stringify(head)}`);
              } catch (e) {
                throw new Error(`Archivo no parece TIFF en ${url}`);
              }
            }
            return buf;
          } catch (e) { lastErr = String(e); }
        }
        throw new Error(`No pude cargar ${LST_FILE}. ${lastErr}`);
      })();

      // --- 2) Parsear GeoTIFF con GeoRaster
      const geor   = await parseGeoraster(ab);
      const width  = geor.width;
      const height = geor.height;
      const band0  = geor.values[0]; // [fila][col]
      const nodata = geor.noDataValue ?? geor.nodata_value;

      // --- 3) Calcular min/max por muestreo
      let min = +Infinity, max = -Infinity;
      const targetTex = 1024;
      const step = Math.max(1, Math.ceil(Math.max(width, height) / targetTex));
      for (let y = 0; y < height; y += step) {
        const row = band0[y];
        for (let x = 0; x < width; x += step) {
          const v = row[x];
          if (v == null || !isFinite(v) || v === nodata) continue;
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
      if (!isFinite(min) || !isFinite(max) || min === max) { min = 0; max = 1; }

      // --- 4) Render a canvas (BLANCO â†’ ROJO) con downscale suave
      const outMax = 2048;
      const scale  = Math.min(1, outMax / width, outMax / height);
      const outW   = Math.max(1, Math.round(width  * scale));
      const outH   = Math.max(1, Math.round(height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = outW; canvas.height = outH;
      const ctx = canvas.getContext("2d");
      const img = ctx.createImageData(outW, outH);
      const buf = img.data;

      // Paleta BLANCO â†’ ROJO
      const stops = [
        [0.00, [255, 255, 255]], // blanco
        [1.00, [255,   0,   0]]  // rojo puro
      ];
      const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
      const lerp  = (a,b,t)=>a+(b-a)*t;
      function ramp(t){
        t = clamp(t,0,1);
        const [p0,c0] = stops[0];
        const [p1,c1] = stops[1];
        const tt = (t - p0) / (p1 - p0 || 1);
        return [
          Math.round(lerp(c0[0], c1[0], tt)),
          Math.round(lerp(c0[1], c1[1], tt)),
          Math.round(lerp(c0[2], c1[2], tt))
        ];
      }

      const xR = width / outW, yR = height / outH;
      for (let y = 0; y < outH; y++) {
        const srcY = Math.min(height-1, Math.floor(y * yR));
        const row  = band0[srcY];
        for (let x = 0; x < outW; x++) {
          const srcX = Math.min(width-1, Math.floor(x * xR));
          const v = row[srcX];
          const k = (y*outW + x) * 4;
          if (v == null || !isFinite(v) || v === nodata) {
            buf[k+3] = 0; // transparente
          } else {
            const t = (v - min) / (max - min);
            const [r,g,b] = ramp(t);
            buf[k]   = r;
            buf[k+1] = g;
            buf[k+2] = b;
            buf[k+3] = 200; // alpha base en el PNG
          }
        }
      }
      ctx.putImageData(img, 0, 0);

      // --- 5) Coordenadas geogrÃ¡ficas para Mapbox ImageSource
      let { xmin, xmax, ymin, ymax } = geor;
      const proj = (geor.projection || geor.srs || "").toString();
      function mercToLonLat(x, y) {
        const R = 6378137;
        const lon = (x / R) * 180 / Math.PI;
        const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * 180 / Math.PI;
        return [lon, lat];
      }
      let tl = [xmin, ymax], tr = [xmax, ymax], br = [xmax, ymin], bl = [xmin, ymin];
      if (proj.includes("3857") || proj.includes("900913") || proj.toUpperCase().includes("WEB")) {
        tl = mercToLonLat(xmin, ymax);
        tr = mercToLonLat(xmax, ymax);
        br = mercToLonLat(xmax, ymin);
        bl = mercToLonLat(xmin, ymin);
      }
      const coords = [tl, tr, br, bl];

      // --- 6) Fuente + capa raster en Mapbox (oculta al crear)
      map.addSource(SRC_ID, { type: "image", url: canvas.toDataURL(), coordinates: coords });

      const before = anchorId || AppState?.treeLayer;
      map.addLayer({
        id: RST_ID,
        type: "raster",
        source: SRC_ID,
        paint: { "raster-opacity": state.opacity }
      }, (before && map.getLayer(before)) ? before : undefined);

      // de inicio oculta; el botÃ³n harÃ¡ toggle
      map.setLayoutProperty(RST_ID, "visibility", "none");

      // Leyenda y estado
      state.legend.setGradient(["#ffffff", "#ffe0e0", "#ff9999", "#ff3333", "#cc0000"]);
      state.legend.setRange(min, max);
      state.ready = true;
      state.visible = false;
    }

    function setVisible(map, v) {
      [HEAT_ID, FILL_ID, OUTL_ID, RST_ID].forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, "visibility", v ? "visible" : "none");
        }
      });
      state.legend?.show(v);
      state.visible = v;
    }

    return {
      install(map) { if (!state.legend) state.legend = makeLegend(map); state.legend.show(false); },
      async toggle(map, { anchor } = {}) {
        await ensureLayers(map, anchor);
        setVisible(map, !state.visible);
        return state.visible;
      },
      async ensure(map, { anchor } = {}) { await ensureLayers(map, anchor); },
      setVisible,
      setOpacity(op) { setLayerOpacity(AppState.map, op); }, // API para cambiar opacidad por cÃ³digo
      isVisible() { return !!state.visible; }
    };
  })();

// ----------------------------------------------------------------------------
// INICIALIZACIÃ“N
// ----------------------------------------------------------------------------
let __HTM_INITED = false;

class HermosilloTreeMap {
  constructor() { this.init(); }
  async init() {
    if (__HTM_INITED) return; __HTM_INITED = true;
    try {
      console.log('ðŸš€ Iniciando Hermosillo Tree Map...');
      if (typeof mapboxgl === 'undefined') throw new Error('Mapbox GL JS no estÃ¡ disponible');
      if (typeof turf === 'undefined') console.warn('Turf.js no disponible');
      if (typeof Chart === 'undefined') console.warn('Chart.js no disponible');

      await this.initializeComponents();
      console.log('âœ… Hermosillo Tree Map inicializada correctamente');
    } catch (error) {
      console.error('âŒ Error crÃ­tico inicializando aplicaciÃ³n:', error);
      UI.showError('Error inicializando la aplicaciÃ³n');
    }
  }
  async initializeComponents() {
    UI.init();
    await MapManager.init();
    await MapManager.loadTrees();     // Cargar puntos
    await MapManager.loadColonias();  // Cargar niveles 1 y 2
    this.setupGlobalHandlers();
  }
  setupGlobalHandlers() {
    window.addEventListener('resize', Utils.debounce(() => AppState.map && AppState.map.resize(), 250));
    window.addEventListener('orientationchange', () => setTimeout(() => AppState.map && AppState.map.resize(), 100));
  }
}

// Exponer UI (y opcional: LSTManager) para debug
window.UI = UI;
window.LST = LSTManager; // p.ej. desde consola: LST.setOpacity(0.35)

// Lanzar app
function boot() { if (!__HTM_INITED) new HermosilloTreeMap(); }
document.addEventListener('DOMContentLoaded', boot);
window.initApp = boot;

console.log('ðŸ“ Script Hermosillo Tree Map cargado');

