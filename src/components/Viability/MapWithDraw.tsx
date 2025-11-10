import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";  

interface MapWithDrawProps {
  onPolygonCreated: (coordinates: [number, number][]) => void;
}

export default function MapWithDraw({ onPolygonCreated }: MapWithDrawProps) {
  // Centro aproximado en Hermosillo
  const center: [number, number] = [29.072967, -110.955919];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* --- Contenedor de capas dibujadas --- */}
      <FeatureGroup>
        <EditControl
          position="topleft"
          draw={{
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
            polyline: false,
            polygon: {
              allowIntersection: false,
              shapeOptions: { color: "#1d4ed8" }, // azul Tailwind
            },
          }}
          edit={{
            remove: true,
          }}
          onCreated={(e: any) => {
            // Obtenemos las coordenadas del polígono recién creado
            const layer = e.layer;
            const latlngs = layer.getLatLngs()[0] as { lat: number; lng: number }[];
            const coords = latlngs.map(({ lat, lng }) => [lat, lng] as [number, number]);
            onPolygonCreated(coords);
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
