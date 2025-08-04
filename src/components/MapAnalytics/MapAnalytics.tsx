import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ChevronsUpDown } from "lucide-react";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
if (!TOKEN) console.error("Falta VITE_MAPBOX_TOKEN en .env(.local)");

const AVAILABLE_INDICES = [
  { value: "temperatura", label: "Temperatura" },
  { value: "soil_water", label: "Humedad del Suelo" },
];

import localData from "./data/temp202409.json";
import lstData2023 from "./data/lst_202306.json";
import soilWaterData2025 from "./data/soil_water_202505.json";
import soilWaterData2022 from "./data/soil_water_202208.json";
import urbano2014 from "./data/urbano_2014.json";
import crecimiento1424 from "./data/crecimiento_14_24.json";
import vegetacion2025 from "./data/vegetacion_2024.json";

interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point" | "Polygon" | "MultiPolygon";
    coordinates: number[] | number[][] | number[][][] | number[][][][];
  };
  properties: {
    [key: string]: any;
  };
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

interface LocalDataStructure {
  [key: string]: any;
}

// Merge temperature categories into one FeatureCollection
function getMergedTemperaturaCollection(
  temperatureData: LocalDataStructure
): GeoJSONData {
  const tempKeys = ["hot", "mid", "cool"];
  let mergedFeatures: GeoJSONFeature[] = [];
  tempKeys.forEach((key) => {
    if (temperatureData[key] && temperatureData[key].features) {
      const featuresWithLabel = temperatureData[key].features.map(
        (f: GeoJSONFeature) => ({
          ...f,
          properties: {
            ...f.properties,
            temp_category: key,
          },
        })
      );
      mergedFeatures = mergedFeatures.concat(featuresWithLabel);
    }
  });
  return {
    type: "FeatureCollection",
    features: mergedFeatures,
  };
}

// Merge soil water categories into one FeatureCollection
function getMergedSoilWaterCollection(
  soilWaterData: LocalDataStructure
): GeoJSONData {
  const waterKeys = ["low", "mid", "high", "water"];
  let mergedFeatures: GeoJSONFeature[] = [];

  // Check if data is nested under "polygons" key
  const dataSource = soilWaterData.polygons || soilWaterData;

  waterKeys.forEach((key) => {
    if (dataSource[key] && dataSource[key].features) {
      const featuresWithLabel = dataSource[key].features.map(
        (f: GeoJSONFeature) => ({
          ...f,
          properties: {
            ...f.properties,
            water_category: key,
          },
        })
      );
      mergedFeatures = mergedFeatures.concat(featuresWithLabel);
    }
  });
  return {
    type: "FeatureCollection",
    features: mergedFeatures,
  };
}

export default function MapAnalytics() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedIndex, setSelectedIndex] = useState("soil_water");
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layerEnabled, setLayerEnabled] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [temperatureYear, setTemperatureYear] = useState<"2025" | "2023">(
    "2025"
  );
  const [soilWaterYear, setSoilWaterYear] = useState<"2025" | "2022">("2025");
  const [urbanoYear, setUrbanoYear] = useState<"2014">("2014");
  const [showCrecimiento, setShowCrecimiento] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current) return;
    if (mapContainer.current) {
      setMapLoading(true);
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-110.9559, 29.0729],
        zoom: 10,
        accessToken: TOKEN,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Listen for map load events
      map.current.on("load", () => {
        setMapLoading(false);
      });

      map.current.on("error", () => {
        setMapLoading(false);
        setError("Error loading map");
      });
    }
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Load data based on selected index
  const loadGeoData = () => {
    if (mapLoading) return; // Don't load data if map is still loading

    setLoading(true);
    setError(null);
    try {
      let merged: GeoJSONData;

      if (selectedIndex === "temperatura") {
        const temperatureData =
          temperatureYear === "2025" ? localData : lstData2023;
        merged = getMergedTemperaturaCollection(temperatureData);
        console.log(
          `Loading temperature data (${temperatureYear}):`,
          merged.features.length,
          "features"
        );
      } else if (selectedIndex === "soil_water") {
        const soilWaterData =
          soilWaterYear === "2025" ? soilWaterData2025 : soilWaterData2022;
        merged = getMergedSoilWaterCollection(soilWaterData);
        console.log(
          `Loading soil water data (${soilWaterYear}):`,
          merged.features.length,
          "features"
        );
        console.log(
          "Soil water categories:",
          merged.features
            .map((f) => f.properties.water_category)
            .filter((v, i, a) => a.indexOf(v) === i)
        );
      } else if (selectedIndex === "urbano") {
        // Load urbano_2014 data
        const urbanoData = urbano2014 as any;
        console.log(
          `Loading urbano data (${urbanoYear}):`,
          urbanoData.features.length,
          "features"
        );

        if (showCrecimiento) {
          // Combine both urbano_2014 and crecimiento_14_24
          const crecimientoData = crecimiento1424 as any;
          console.log(
            `Loading crecimiento data:`,
            crecimientoData.features.length,
            "features"
          );

          // Merge both datasets
          const combinedFeatures = [
            ...urbanoData.features.map((f: any) => ({
              ...f,
              properties: {
                ...f.properties,
                layer_type: "urbano_2014",
              },
            })),
            ...crecimientoData.features.map((f: any) => ({
              ...f,
              properties: {
                ...f.properties,
                layer_type: "crecimiento_14_24",
              },
            })),
          ];

          merged = {
            type: "FeatureCollection",
            features: combinedFeatures,
          };
        } else {
          // Only urbano_2014
          merged = {
            type: "FeatureCollection",
            features: urbanoData.features.map((f: any) => ({
              ...f,
              properties: {
                ...f.properties,
                layer_type: "urbano_2014",
              },
            })),
          };
        }
      } else if (selectedIndex === "vegetacion") {
        merged = vegetacion2025 as any;
        console.log(
          `Loading vegetación data (2024):`,
          merged.features.length,
          "features"
        );
      } else {
        throw new Error(`Unknown index: ${selectedIndex}`);
      }

      setGeoData(merged);
      if (map.current && merged.features && merged.features.length > 0) {
        addDataToMap(merged);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  // Add GeoJSON data to the map
  const addDataToMap = (data: GeoJSONData) => {
    if (!map.current) return;
    const mapInstance = map.current;
    if (mapInstance.getSource("geojson-data")) {
      ["geojson-fill", "geojson-border", "geojson-points"].forEach((id) => {
        if (mapInstance.getLayer(id)) mapInstance.removeLayer(id);
      });
      mapInstance.removeSource("geojson-data");
    }
    if (!layerEnabled) return; // Don't add layer if disabled
    mapInstance.addSource("geojson-data", {
      type: "geojson",
      data: data as any,
    });

    // Determine color scheme based on selected index
    const getColorExpression = () => {
      if (selectedIndex === "temperatura") {
        return [
          "match",
          ["get", "temp_category"],
          "hot",
          "#a50026", // Red
          "mid",
          "#ffffbf", // Yellow
          "cool",
          "#313695", // Blue
          /* other */ "#cccccc",
        ] as any;
      } else if (selectedIndex === "soil_water") {
        return [
          "match",
          ["get", "water_category"],
          "low",
          "#8b4513", // Brown
          "mid",
          "#90ee90", // Light green=
          "high",
          "#006400", // Dark green
          "water",
          "#0000ff", // Blue
          /* other */ "#cccccc",
        ] as any;
      } else if (selectedIndex === "urbano") {
        return [
          "match",
          ["get", "layer_type"],
          "urbano_2014",
          "#ff9900", // Orange for urban polygons
          "crecimiento_14_24",
          "#ff1493", // Deep pink for growth areas
          /* other */ "#cccccc",
        ] as any;
      } else if (selectedIndex === "vegetacion") {
        return "#228B22"; // Verde para vegetación
      }
      return "#cccccc";
    };

    mapInstance.addLayer({
      id: "geojson-fill",
      type: "fill",
      source: "geojson-data",
      paint: {
        "fill-color": getColorExpression(),
        "fill-opacity": 0.7,
      },
      filter: [
        "in",
        ["geometry-type"],
        ["literal", ["Polygon", "MultiPolygon"]],
      ],
    });
    mapInstance.addLayer({
      id: "geojson-border",
      type: "line",
      source: "geojson-data",
      paint: {
        "line-color": "#000000",
        "line-width": 1,
        "line-opacity": 0.5,
      },
      filter: [
        "in",
        ["geometry-type"],
        ["literal", ["Polygon", "MultiPolygon"]],
      ],
    });
    mapInstance.addLayer({
      id: "geojson-points",
      type: "circle",
      source: "geojson-data",
      paint: {
        "circle-radius": 8,
        "circle-color": getColorExpression(),
        "circle-opacity": 0.8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#000000",
      },
      filter: ["==", ["geometry-type"], "Point"],
    });
    // Fit map to data bounds
    const bounds = new mapboxgl.LngLatBounds();
    data.features.forEach((feature) => {
      if (feature.geometry.type === "Point") {
        const coords = feature.geometry.coordinates as number[];
        if (Array.isArray(coords) && coords.length >= 2) {
          bounds.extend([coords[0], coords[1]]);
        }
      } else if (feature.geometry.type === "Polygon") {
        const coords = feature.geometry.coordinates[0] as number[][];
        coords.forEach((coord) => {
          if (Array.isArray(coord) && coord.length >= 2) {
            bounds.extend([coord[0], coord[1]]);
          }
        });
      } else if (feature.geometry.type === "MultiPolygon") {
        const polygons = feature.geometry.coordinates as number[][][];
        polygons.forEach((polygon) => {
          polygon[0].forEach((coord) => {
            if (Array.isArray(coord) && coord.length >= 2) {
              bounds.extend([coord[0], coord[1]]);
            }
          });
        });
      }
    });
    if (!bounds.isEmpty()) {
      mapInstance.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  };

  // Custom dropdown handler
  const handleDropdownSelect = (value: string) => {
    setSelectedIndex(value);
    setDropdownOpen(false);
    if (value === "none") {
      setLayerEnabled(false);
    } else {
      setLayerEnabled(true);
      loadGeoData();
    }
  };

  // Toggle layer visibility
  const handleLayerToggle = () => {
    setLayerEnabled((prev) => !prev);
  };

  // Toggle temperature year
  const handleTemperatureYearToggle = () => {
    setTemperatureYear((prev) => (prev === "2025" ? "2023" : "2025"));
  };

  // Toggle soil water year
  const handleSoilWaterYearToggle = () => {
    setSoilWaterYear((prev) => (prev === "2025" ? "2022" : "2025"));
  };

  useEffect(() => {
    if (map.current && !mapLoading) {
      loadGeoData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    map.current,
    layerEnabled,
    selectedIndex,
    temperatureYear,
    soilWaterYear,
    urbanoYear,
    showCrecimiento,
    mapLoading,
  ]);

  // Get data source info based on selected index
  const getDataSourceInfo = () => {
    if (selectedIndex === "temperatura") {
      const temperatureData =
        temperatureYear === "2025" ? localData : lstData2023;
      return `${
        (temperatureData as any).data_source || "Landsat"
      } - ${temperatureYear}/${temperatureYear === "2025" ? "05" : "06"}`;
    } else if (selectedIndex === "soil_water") {
      const soilWaterData =
        soilWaterYear === "2025" ? soilWaterData2025 : soilWaterData2022;
      return `${
        (soilWaterData as any).data_source || "Soil Data"
      } - ${soilWaterYear}/${soilWaterYear === "2025" ? "05" : "08"}`;
    } else if (selectedIndex === "urbano") {
      return showCrecimiento
        ? "Urbanización - 2014 + Crecimiento 2014-2024"
        : "Urbanización - 2014";
    } else if (selectedIndex === "vegetacion") {
      return "Cobertura Vegetal - 2024";
    }
    return "Unknown source";
  };

  // Get legend data based on selected index
  const getLegendData = () => {
    if (selectedIndex === "temperatura") {
      return [
        { label: "Caliente", color: "#a50026" },
        { label: "Medio", color: "#ffffbf" },
        { label: "Frío", color: "#313695" },
      ];
    } else if (selectedIndex === "soil_water") {
      return [
        { label: "Baja Humedad", color: "#8b4513" },
        { label: "Humedad Media", color: "#90ee90" },
        { label: "Alta Humedad", color: "#006400" },
        { label: "Cuerpos de Agua", color: "#0000ff" },
      ];
    } else if (selectedIndex === "urbano") {
      const legend = [{ label: "Urbano 2014", color: "#ff9900" }];
      if (showCrecimiento) {
        legend.push({ label: "Crecimiento 2014-2024", color: "#ff1493" });
      }
      return legend;
    } else if (selectedIndex === "vegetacion") {
      return [{ label: "Vegetación 2024", color: "#228B22" }];
    }
    return [];
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white p-4 shadow-sm border-b">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Análisis de Datos Geoespaciales
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 relative">
          <label
            htmlFor="index-selector"
            className="text-sm font-medium text-gray-700 sm:mb-0 mb-1"
          >
            Capas:
          </label>
          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              className="min-w-[160px] w-full sm:w-auto flex justify-between items-center bg-white text-gray-900 ring-1 ring-gray-300 px-2 py-1 rounded-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
              onClick={() => setDropdownOpen((open) => !open)}
              disabled={loading}
            >
              {AVAILABLE_INDICES.find((i) => i.value === selectedIndex)
                ?.label || "Seleccionar"}
              <ChevronsUpDown className="w-4 ml-2 h-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {AVAILABLE_INDICES.map((index) => (
                  <button
                    key={index.value}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-3 ${
                      selectedIndex === index.value
                        ? "bg-blue-3 text-gray-900"
                        : "text-gray-900"
                    }`}
                    onClick={() => handleDropdownSelect(index.value)}
                  >
                    {index.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Selector and Layer Toggle - in a row on mobile, grid on desktop */}
          <div className="flex flex-row gap-2 sm:grid sm:grid-cols-2 sm:gap-4 relative w-full sm:w-auto">
            {selectedIndex === "temperatura" && (
              <div className="flex flex-1">
                <button
                  type="button"
                  onClick={() => setTemperatureYear("2025")}
                  className={`flex-1 px-3 py-1.5 rounded-l-md shadow-sm border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${
                      temperatureYear === "2025"
                        ? "bg-blue-9 text-white border-blue-11"
                        : "bg-blue-2 text-blue-8 border-blue-4 hover:bg-blue-3"
                    }
                  `}
                  disabled={loading}
                >
                  2025/05
                </button>
                <button
                  type="button"
                  onClick={() => setTemperatureYear("2023")}
                  className={`flex-1 px-3 py-1.5 rounded-r-md shadow-sm border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${
                      temperatureYear === "2023"
                        ? "bg-blue-9 text-white border-blue-11"
                        : "bg-blue-2 text-blue-8 border-blue-4 hover:bg-blue-3"
                    }
                  `}
                  disabled={loading}
                >
                  2023/06
                </button>
              </div>
            )}
            {selectedIndex === "soil_water" && (
              <div className="flex flex-1">
                <button
                  type="button"
                  onClick={() => setSoilWaterYear("2025")}
                  className={`flex-1 px-3 py-1.5 rounded-l-md shadow-sm border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${
                      soilWaterYear === "2025"
                        ? "bg-blue-9 text-white border-blue-11"
                        : "bg-blue-2 text-blue-8 border-blue-4 hover:bg-blue-3"
                    }
                  `}
                  disabled={loading}
                >
                  2025/05
                </button>
                <button
                  type="button"
                  onClick={() => setSoilWaterYear("2022")}
                  className={`flex-1 px-3 py-1.5 rounded-r-md shadow-sm border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${
                      soilWaterYear === "2022"
                        ? "bg-blue-9 text-white border-blue-11"
                        : "bg-blue-2 text-blue-8 border-blue-4 hover:bg-blue-3"
                    }
                  `}
                  disabled={loading}
                >
                  2022/08
                </button>
              </div>
            )}
            {selectedIndex === "urbano" && (
              <div className="flex flex-1">
                <button
                  type="button"
                  onClick={() => setUrbanoYear("2014")}
                  className={`flex-1 px-3 py-1.5 rounded-l-md shadow-sm border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${
                      urbanoYear === "2014"
                        ? "bg-blue-9 text-white border-blue-11"
                        : "bg-blue-2 text-blue-8 border-blue-4 hover:bg-blue-3"
                    }
                  `}
                  disabled={loading}
                >
                  2014
                </button>
                <button
                  type="button"
                  onClick={() => setShowCrecimiento(!showCrecimiento)}
                  className={`flex-1 px-3 py-1.5 rounded-r-md shadow-sm border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${
                      showCrecimiento
                        ? "bg-blue-9 text-white border-blue-11"
                        : "bg-blue-2 text-blue-8 border-blue-4 hover:bg-blue-3"
                    }
                  `}
                  disabled={loading}
                >
                  Crecimiento
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={handleLayerToggle}
              className={`flex-1 px-2 py-1.5 rounded-md shadow-sm border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                layerEnabled ? "bg-blue-9 text-white" : "bg-blue-2 text-blue-8"
              }`}
              disabled={loading}
            >
              {layerEnabled ? "Ocultar capa" : "Mostrar capa"}
            </button>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Cargando datos...
            </div>
          )}
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">Error: {error}</p>
          </div>
        )}
        {geoData && (
          <div className="mt-4 p-3 bg-blue-2 border border-blue-4 rounded-md">
            <p className="text-sm text-blue-9">
              Datos cargados: {geoData.features.length} elementos
            </p>
            <p className="text-sm text-blue-8">Fuente: {getDataSourceInfo()}</p>
          </div>
        )}
      </div>
      <div className="flex-1 relative">
        <div
          ref={mapContainer}
          className="w-full h-full"
          style={{ minHeight: "500px" }}
        />

        {/* Map Loading Overlay */}
        {mapLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Cargando mapa...</p>
              <p className="text-sm text-gray-500 mt-1">
                Esperando estilos del mapa
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        {geoData && layerEnabled && !mapLoading && (
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-md shadow-lg border">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Leyenda -{" "}
              {AVAILABLE_INDICES.find((i) => i.value === selectedIndex)?.label}
            </h3>
            <div className="space-y-1">
              {getLegendData().map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
