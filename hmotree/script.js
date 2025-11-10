// ============================================================================
// HERMOSILLO TREE MAP - APLICACIÓN PROFESIONAL
// ============================================================================

console.log('🌳 Iniciando Hermosillo Tree Map Profesional...');

// CONFIGURACIÓN GLOBAL
// ============================================================================

const APP_CONFIG = {
  map: {
    center: [-110.947542, 29.0791825], // [lng, lat]
    zoom: 17,
    maxZoom: 19,
    minZoom: 12,
    style: 'mapbox://styles/mapbox/streets-v12'
  },
  data: {
    trees: 'trees_hermosillo.geojson'
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
    speciesPanoramas: {
    'Mezquite Dulce': 'panos/mezquite-dulce-360.jpg'
  },

  animations: { fast: 150, normal: 250, slow: 350 }
};

// ============================================================================
// ESTADO GLOBAL
// ============================================================================

const AppState = {
  map: null,
  treeLayer: null,
  selectedTree: null,
  selectedSpecies: null,
  treesData: null,
  filteredTrees: null,
  currentSection: 'map',
  panelOpen: true,
  searchOpen: false,
  filters: { species: '', size: 'all', health: 'all', search: '' }
};

// ============================================================================
// UTILIDADES
// ============================================================================

const Utils = {
  getSpeciesColor(species) {
    const speciesName = species ? species.split('(')[0].trim() : 'default';
    return APP_CONFIG.speciesColors[speciesName] || APP_CONFIG.speciesColors.default;
  },
  getScientificName(species) {
    if (!species) return 'Nombre científico no disponible';
    const match = species.match(/\((.*?)\)/);
    return match ? match[1] : 'Nombre científico no disponible';
  },
  getCommonName(species) {
    return species ? species.split('(')[0].trim() : 'Especie desconocida';
  },
  calculateAge(plantedYear) {
    const currentYear = new Date().getFullYear();
    return plantedYear ? currentYear - plantedYear : 0;
  },
  formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num ?? 0);
  },
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount ?? 0);
  },
  uniqueColor(seed) {
    const n = Math.abs(Number(seed ?? 0)) || Math.floor(Math.random() * 1e6);
    const hue = (n * 137.508) % 360;
    return `hsl(${hue}, 70%, 45%)`;
  },
  normalize(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .trim().replace(/\s+/g, ' ');
  },
  canonicalSpecies(name) {
    const n = this.normalize(name);
    const alias = {
      'palo verde amarillo': 'Palo Verde',
      'palo verde azul': 'Palo Verde',
      'mezquite dulce': 'Mezquite Dulce',
      'palo brea': 'Palo Brea'
    };
    return alias[n] || this.getCommonName(name);
  },
  colorForSpecies(name) {
    const canon = this.canonicalSpecies(name);
    return APP_CONFIG.speciesColors[canon] || this.uniqueColor(canon);
  },
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
};

// ============================================================================
// CÁLCULOS DE BENEFICIOS
// ============================================================================

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
      stormwater: {
        amount: Math.round(stormwater_gallons),
        value: +stormwater_value.toFixed(2),
        unit: 'gallons',
        formatted: `${Utils.formatNumber(stormwater_gallons)} litros`
      },
      energy: {
        amount: Math.round(energy_kwh),
        value: +energy_value.toFixed(2),
        unit: 'kWh',
        formatted: `${Utils.formatNumber(energy_kwh)} kWh`
      },
      airPollutants: {
        amount: +air_pollutants_lbs.toFixed(1),
        value: +air_value.toFixed(2),
        unit: 'kg',
        formatted: `${air_pollutants_lbs.toFixed(1)} kg`
      },
      totalValue: {
        amount: +total_value.toFixed(2),
        formatted: Utils.formatCurrency(total_value)
      }
    };
  },

  calculateAggregateStats(trees) {
    if (!trees || !trees.length) {
      return {
        totalTrees: 0, speciesCount: {}, totalStormwater: 0, totalEnergy: 0,
        totalAirPollutants: 0, totalBenefitsValue: 0, avgAge: 0, mostCommonSpecies: 'N/A'
      };
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
    const mostCommonSpecies = Object.keys(speciesCount)
      .reduce((a, b) => (speciesCount[a] > speciesCount[b] ? a : b), 'N/A');

    return {
      totalTrees: trees.length,
      speciesCount,
      totalStormwater: Math.round(totalStormwater),
      totalEnergy: Math.round(totalEnergy),
      totalAirPollutants: +totalAirPollutants.toFixed(1),
      totalBenefitsValue: +totalBenefitsValue.toFixed(2),
      avgAge,
      mostCommonSpecies
    };
  }
};

// ============================================================================
// GESTOR DEL MAPA
// ============================================================================

const MapManager = {
  async init() {
    console.log('🗺️ Inicializando mapa (Mapbox)...');
    AppState.map = new mapboxgl.Map({
      container: 'map',
      style: APP_CONFIG.map.style,
      center: APP_CONFIG.map.center,
      zoom: APP_CONFIG.map.zoom,
      minZoom: APP_CONFIG.map.minZoom,
      maxZoom: APP_CONFIG.map.maxZoom
    });

    // Clic en fondo: volver a overview
    AppState.map.on('click', (e) => {
      const feats = AppState.map.queryRenderedFeatures(e.point, { layers: ['trees-circle'] });
      if (!feats.length) {
        AppState.selectedTree = null;
        UI.showOverview();
      }
    });

    // Actualiza lista de especies según lo visible
    AppState.map.on('moveend', () => UI.refreshSpeciesList());
    console.log('✅ Mapa inicializado');
  },

  async ensureStyleLoaded() {
    if (AppState.map.isStyleLoaded()) return;
    await new Promise((res) => AppState.map.on('load', res));
  },

  async loadTrees() {
    try {
      console.log('🌳 Cargando datos de árboles...');
      await this.ensureStyleLoaded();

      const resp = await fetch(APP_CONFIG.data.trees);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      const geojson = await resp.json();
      if (!geojson || !geojson.features || !geojson.features.length) {
        throw new Error('GeoJSON vacío o inválido');
      }

      geojson.features.forEach((f, idx) => {
        const p = f.properties || (f.properties = {});
        p.species_common = Utils.getCommonName(p.species);
        p.color = Utils.colorForSpecies(p.species);
      });

      AppState.treesData = geojson.features;
      AppState.filteredTrees = [...AppState.treesData];

      if (!AppState.map.getSource('trees')) {
        AppState.map.addSource('trees', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: AppState.filteredTrees }
        });

        AppState.map.addLayer({
          id: 'trees-circle',
          type: 'circle',
          source: 'trees',
          paint: {
            'circle-radius': ['max', 4, ['min', ['/', ['coalesce', ['get', 'diameter_cm'], 25], 4], 12]],
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.85,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 1
          }
        });

        const highlightRadiusExpr = ['*',
          ['max', 4, ['min', ['/', ['coalesce', ['get', 'diameter_cm'], 25], 4], 12]],
          1.6
        ];

        AppState.map.addLayer({
          id: 'trees-highlight',
          type: 'circle',
          source: 'trees',
          layout: { visibility: 'none' },
          filter: ['==', ['coalesce', ['get', 'species_common'], ''], ''],
          paint: {
            'circle-radius': highlightRadiusExpr,
            'circle-color': '#000000',
            'circle-opacity': 0.95,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2
          }
        });

        AppState.map.on('mouseenter', 'trees-circle', () => {
          AppState.map.getCanvas().style.cursor = 'pointer';
        });
        AppState.map.on('mouseleave', 'trees-circle', () => {
          AppState.map.getCanvas().style.cursor = '';
        });
        AppState.map.on('click', 'trees-circle', (e) => {
          const f = e.features[0];
          AppState.selectedTree = f;
          const p = f.properties || {};

          // Ya no necesitas el HTML ni el Popup aquí:
          // const html = `…`;

          // Solo abre tu panel de detalles:
          UI.showTreeDetails(p.id);
        });
      } else {
        AppState.map.getSource('trees').setData({
          type: 'FeatureCollection',
          features: AppState.filteredTrees
        });
      }

      const stats = BenefitsCalculator.calculateAggregateStats(AppState.treesData);
      UI.updateOverviewStats(stats);
      UI.refreshSpeciesList();
      console.log(`✅ ${AppState.treesData.length} árboles cargados`);
    } catch (err) {
      console.error('❌ Error cargando árboles:', err);
      UI.showError('Error cargando datos de árboles');
    }
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
// GESTOR DE INTERFAZ DE USUARIO
// ============================================================================

const UI = {
  init() {
    console.log('🎨 Inicializando interfaz...');
    this.setupNavigation();
    this.setupMapControls();
    this.setupSearch();
    this.setupFilters();
    this.setupPanelControls();
    this.showOverview();
    console.log('✅ Interfaz inicializada');
  },

  setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        this.showSection(section);
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  },

  setupMapControls() {
    const locateBtn = document.querySelector('.locate-btn');
    if (locateBtn) {
      locateBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
              AppState.map.flyTo({ center: [longitude, latitude], zoom: 16 });
            },
            (error) => {
              console.warn('Geolocalización no disponible:', error);
              this.showError('No se pudo obtener tu ubicación');
            }
          );
        }
      });
    }

    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
          fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
          document.exitFullscreen();
          fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
      });
    }

    const panelToggle = document.querySelector('.panel-toggle');
    if (panelToggle) {
      panelToggle.addEventListener('click', this.togglePanel.bind(this));
    }
  },

  setupSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.getElementById('global-search');

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        searchOverlay?.classList.add('active');
        AppState.searchOpen = true;
        setTimeout(() => searchInput && searchInput.focus(), 100);
      });
    }

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchOverlay?.classList.remove('active');
        AppState.searchOpen = false;
      });
    }

    if (searchInput) {
      const performSearch = Utils.debounce((query) => this.performGlobalSearch(query), 300);
      searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && AppState.searchOpen) {
        searchOverlay?.classList.remove('active');
        AppState.searchOpen = false;
      }
    });
  },

  setupFilters() {
    const speciesSearch = document.getElementById('species-search');
    const sizeFilter    = document.getElementById('size-filter');
    const healthFilter  = document.getElementById('health-filter');

    if (speciesSearch) {
      speciesSearch.addEventListener('input', Utils.debounce((e) => {
        AppState.filters.species = e.target.value;
        MapManager.applyFilters();
      }, 300));
    }

    if (sizeFilter) {
      sizeFilter.addEventListener('change', (e) => {
        AppState.filters.size = e.target.value;
        MapManager.applyFilters();
      });
    }

    if (healthFilter) {
      healthFilter.addEventListener('change', (e) => {
        AppState.filters.health = e.target.value;
        MapManager.applyFilters();
      });
    }
  },

  setupPanelControls() {
    const panelClose = document.querySelector('.panel-close');
    if (panelClose) panelClose.addEventListener('click', this.togglePanel.bind(this));
  },

  showSection(sectionName) {
    AppState.currentSection = sectionName;
    document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`${sectionName}-section`);
    target?.classList.add('active');

    switch (sectionName) {
      case 'map':
        setTimeout(() => AppState.map && AppState.map.resize(), 300);
        break;
      case 'explore':
        this.populateTreesGrid();
        break;
      case 'benefits':
        this.renderBenefitsCharts();
        break;
    }
  },

  togglePanel() {
    const panel = document.querySelector('.info-panel');
    if (!panel) return;
    AppState.panelOpen = !AppState.panelOpen;
    panel.classList.toggle('hidden', !AppState.panelOpen);
  },

  showOverview() {
    this.updateElement('panel-title', 'Estadísticas del Bosque Urbano');
    document.querySelectorAll('.panel-view').forEach(v => v.classList.remove('active'));
    document.getElementById('overview-content')?.classList.add('active');

    if (AppState.treesData) {
      const stats = BenefitsCalculator.calculateAggregateStats(AppState.filteredTrees || AppState.treesData);
      this.updateOverviewStats(stats);
    }
  },

  showTreeDetails(treeId) {
    const tree = (AppState.treesData || []).find(t => t.properties.id === treeId);
    if (!tree) return;

    AppState.selectedTree = tree;
    const p = tree.properties;
    this.updateElement('panel-title', Utils.getCommonName(p.species));

    document.querySelectorAll('.panel-view').forEach(v => v.classList.remove('active'));
    document.getElementById('tree-content')?.classList.add('active');

    this.updateTreeContent(tree);

    if (tree.geometry && Array.isArray(tree.geometry.coordinates)) {
      const [lng, lat] = tree.geometry.coordinates;
      AppState.map?.flyTo({ center: [lng, lat], zoom: Math.max(AppState.map.getZoom() || 17, 18) });
    }
  },

updateTreeContent(tree) {
  const p = tree.properties;
  const speciesName = Utils.getCommonName(p.species);

  // — 1: foto y textos básicos —
  const img = document.getElementById('tree-image');
  const photoUrl = APP_CONFIG.speciesPhotos[speciesName]
    || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop';
  img.src = photoUrl;
  img.alt = `Foto de ${speciesName}`;
  this.updateElement('tree-id-badge', p.id);
  this.updateElement('tree-species-name', speciesName);
  this.updateElement('tree-scientific-name', Utils.getScientificName(p.species));
  this.updateElement('tree-location', this.generateAddress());
  this.updateElement('tree-diameter', p.diameter_cm ? `${p.diameter_cm} cm` : 'No disponible');
  this.updateElement('tree-height', p.height_m ? `${p.height_m} m` : 'No disponible');
  this.updateElement('tree-crown', p.crown_diameter ? `${p.crown_diameter} m` : 'No disponible');
  this.updateElement('tree-year', p.planted_year || 'No disponible');
  this.updateElement('tree-health', p.health || 'No disponible');

  // — 2: visor 360° solo para Mezquite Dulce (Google Maps JS) —
const container360 = document.getElementById('tree-360-container');
// limpiamos y ocultamos por defecto
container360.innerHTML = '';
container360.style.display = 'none';

if (speciesName.toLowerCase() === 'mezquite dulce') {
  const [lng, lat] = tree.geometry.coordinates;
  // mostramos el contenedor
  container360.style.display = 'block';
  // inicializa StreetViewPanorama SIN controles
  new google.maps.StreetViewPanorama(
    container360,
    {
      position: { lat, lng },
      pov:      { heading: 100, pitch: 0 },
      zoom:     1,
      disableDefaultUI:  true,
      linksControl:      false,
      panControl:        false,
      zoomControl:       false,
      addressControl:    false,
      fullscreenControl: false
    }
  );
}

// — 3: beneficios individuales —


  // — 3: beneficios individuales —
  const diameter = p.diameter_cm || 25;
  const height   = p.height_m    || 6;
  const crown    = p.crown_diameter || (diameter * 0.12);
  const benefits = BenefitsCalculator.calculateTreeBenefits(diameter, height, crown);
  const container = document.getElementById('individual-benefits');
  container.innerHTML = `
    <div class="tree-benefit-item">
      <span class="tree-benefit-label">Agua interceptada:</span>
      <span class="tree-benefit-value">${benefits.stormwater.formatted} (${Utils.formatCurrency(benefits.stormwater.value)})</span>
    </div>
    <div class="tree-benefit-item">
      <span class="tree-benefit-label">Energía ahorrada:</span>
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

  // — 4: centrar mapa —
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
    this.updateElement('air-value', Utils.formatCurrency(stats.totalAirPollutants * 5.15));

    this.updateElement('total-annual-benefits', Utils.formatCurrency(stats.totalBenefitsValue));

    this.updateCommonSpecies(stats.speciesCount);
  },

  updateIndividualBenefits(benefits) {
    const container = document.getElementById('individual-benefits');
    if (!container) return;
    container.innerHTML = `
      <div class="tree-benefit-item">
        <span class="tree-benefit-label">Agua interceptada:</span>
        <span class="tree-benefit-value">${benefits.stormwater.formatted} (${Utils.formatCurrency(benefits.stormwater.value)})</span>
      </div>
      <div class="tree-benefit-item">
        <span class="tree-benefit-label">Energía ahorrada:</span>
        <span class="tree-benefit-value">${benefits.energy.formatted} (${Utils.formatCurrency(benefits.energy.value)})</span>
      </div>
      <div class="tree-benefit-item">
        <span class="tree-benefit-label">Contaminantes del aire removidos:</span>
        <span class="tree-benefit-value">${benefits.airPollutants.formatted} (${Utils.formatCurrency(benefits.airPollutants.value)})</span>
      </div>
      <div class="tree-benefit-item total">
        <span class="tree-benefit-label"><strong>Valor Anual Total:</strong></span>
        <span class="tree-benefit-value"><strong>${benefits.totalValue.formatted}</strong></span>
      </div>
    `;
  },

  updateCommonSpecies(speciesCount) {
    const TOP_N = 5;
    const listEl = document.getElementById('common-species-list');
    const legendEl = document.getElementById('species-color-legend');
    if (!listEl) return;

    const sorted = Object.entries(speciesCount).sort(([, a], [, b]) => b - a);
    const top = sorted.slice(0, TOP_N);
    let others = sorted.slice(TOP_N);
    if (!others.length) others = sorted;

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

  // ======= Helpers de UI =======
  updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },
  generateAddress() { return 'Hermosillo, Sonora'; },
  showError(msg) { console.error(msg); },

  updateCommonSpeciesFromMap() {
    try {
      if (AppState?.map && AppState.map.getLayer('trees-circle')) {
        const feats = AppState.map.queryRenderedFeatures({ layers: ['trees-circle'] }) || [];
        const counts = {};
        for (const f of feats) {
          const p = f.properties || {};
          const name = p.species_common || Utils.getCommonName(p.species);
          counts[name] = (counts[name] || 0) + 1;
        }
        this.updateCommonSpecies(counts);
        return;
      }
      const list = AppState.filteredTrees || AppState.treesData || [];
      const counts = {};
      for (const t of list) {
        const p = t.properties || {};
        const name = p.species_common || Utils.getCommonName(p.species);
        counts[name] = (counts[name] || 0) + 1;
      }
      this.updateCommonSpecies(counts);
    } catch (e) {
      console.warn('No se pudo actualizar especies desde el mapa:', e);
    }
  },

  refreshSpeciesList() {
    requestAnimationFrame(() => this.updateCommonSpeciesFromMap());
  },

  toggleSpeciesHighlight(species) {
    AppState.selectedSpecies = species;
    const color = Utils.colorForSpecies(species);

    if (AppState.map.getLayer('trees-highlight')) {
      AppState.map.setLayoutProperty('trees-highlight', 'visibility', 'visible');
      AppState.map.setFilter('trees-highlight', ['==', ['get', 'species_common'], species]);
      AppState.map.setPaintProperty('trees-highlight', 'circle-color', color);
    }
    if (AppState.map.getLayer('trees-circle')) {
      AppState.map.setPaintProperty(
        'trees-circle',
        'circle-opacity',
        ['case', ['==', ['get', 'species_common'], species], 0.85, 0.15]
      );
    }
  },

  clearSpeciesHighlight() {
    AppState.selectedSpecies = null;
    if (AppState.map.getLayer('trees-highlight')) {
      AppState.map.setLayoutProperty('trees-highlight', 'visibility', 'none');
    }
    if (AppState.map.getLayer('trees-circle')) {
      AppState.map.setPaintProperty('trees-circle', 'circle-opacity', 0.85);
    }
  },

  // Stubs
  performGlobalSearch() {},
  populateTreesGrid() {},
  renderBenefitsCharts() {}
};

// ============================================================================
// INICIALIZACIÓN PRINCIPAL
// ============================================================================

class HermosilloTreeMap {
  constructor() { this.init(); }
  async init() {
    try {
      console.log('🚀 Iniciando Hermosillo Tree Map...');
      if (typeof mapboxgl === 'undefined') throw new Error('Mapbox GL JS no está disponible');
      if (typeof Chart === 'undefined') console.warn('Chart.js no disponible - gráficos deshabilitados');

      await this.initializeComponents();
      console.log('✅ Hermosillo Tree Map inicializada correctamente');
    } catch (error) {
      console.error('❌ Error crítico inicializando aplicación:', error);
      UI.showError('Error inicializando la aplicación');
    }
  }
  async initializeComponents() {
    UI.init();
    await MapManager.init();
    await MapManager.loadTrees();
    this.setupGlobalHandlers();
  }
  setupGlobalHandlers() {
    window.addEventListener('resize', Utils.debounce(() => AppState.map && AppState.map.resize(), 250));
    window.addEventListener('orientationchange', () => setTimeout(() => AppState.map && AppState.map.resize(), 100));
  }
}

// Exponer UI para handlers inline del popup
window.UI = UI;

// Lanzar app al cargar DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM cargado, inicializando aplicación...');
  new HermosilloTreeMap();
});

console.log('📝 Script Hermosillo Tree Map cargado');

// --------------------------------------------------
// Esto garantiza que initApp se llame cuando la API
// haya cargado y dispare tu DOMContentLoaded:
// --------------------------------------------------
window.initApp = function() {
  document.dispatchEvent(new Event('DOMContentLoaded'));
};
