// src/components/Map/MapView.tsx
import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
mapboxgl.accessToken = TOKEN ?? "";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

if (!import.meta.env.VITE_MAPBOX_TOKEN) {
  console.error("Falta VITE_MAPBOX_TOKEN en .env.local");
}

const categories = [
  { name: "Residencial", color: "#2ECC71" },
  { name: "Comercial", color: "#3498DB" },
  { name: "Industrial", color: "#E67E22" },
  { name: "Infraestructura", color: "#5D6D7E" },
  { name: "Espacios Públicos", color: "#9B59B6" },
];

const generatePoints = (category: string, color: string) => {
  const points = [];
  for (let i = 0; i < 30; i++) {
    const lat = 28.994 + Math.random() * (29.166 - 28.994);
    const lng = -111.048 + Math.random() * 0.188;
    points.push({ lat, lng, category, color });
  }
  return points;
};

const allPoints = categories.flatMap((c) => generatePoints(c.name, c.color));

const MapView: React.FC = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCategories, setVisibleCategories] = useState(
    Object.fromEntries(categories.map((c) => [c.name, true]))
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!containerRef.current || mapRef.current || !TOKEN) return;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-110.9559, 29.0729],
      zoom: 12,
      maxBounds: [
        [-111.04815936921302, 28.994010641531702],
        [-110.8600185000724, 29.166535465688195],
      ],

      accessToken: TOKEN,
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

 useEffect(() => {
  const map = mapRef.current;
  if (!map) return;

  const renderMarkers = () => {
    // Limpia marcadores previos
    document.querySelectorAll(".mapboxgl-marker").forEach((el) => el.remove());

    allPoints.forEach((point) => {
      if (!visibleCategories[point.category]) return;

      const el = document.createElement("div");
      el.style.backgroundColor = point.color;
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 2px rgba(0,0,0,0.5)";

      new mapboxgl.Marker(el)
        .setLngLat([point.lng, point.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<strong>${point.category}</strong><br/>Lat: ${point.lat.toFixed(
              4
            )}, Lng: ${point.lng.toFixed(4)}`
          )
        )
        .addTo(map);
    });
  };

  // Espera a que el estilo cargue antes de dibujar
  if (!map.isStyleLoaded()) {
    map.once("load", renderMarkers);
  } else {
    renderMarkers();
  }

  return () => {
    map.off("load", renderMarkers);
    document.querySelectorAll(".mapboxgl-marker").forEach((el) => el.remove());
  };
}, [visibleCategories]);


  const toggleCategory = (cat: string) => {
    setVisibleCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute top-4 right-4 bg-white shadow-md rounded-lg p-3 space-y-1 z-50">
        {categories.map((c) => (
          <label key={c.name} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={visibleCategories[c.name]}
              onChange={() => toggleCategory(c.name)}
            />
            <span className="flex items-center space-x-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: c.color }}
              ></span>
              <span>{c.name}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MapView;
