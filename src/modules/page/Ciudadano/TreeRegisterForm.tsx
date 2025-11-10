import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import type { Feature, Point as GJPoint } from "geojson";

mapboxgl.accessToken = (import.meta.env.VITE_MAPBOX_TOKEN as string) || "";

export interface TreeRegisterFormProps {
  onClose: () => void;
  /** Coordenadas iniciales (opcional) */
  initialCoords?: { lng: number; lat: number };
  /** Ruta del endpoint. Por defecto: "/trees" */
  apiPath?: string;
  /** Callback al crear con éxito: se entrega el Feature para pintarlo en el mapa */
  onCreated?: (feature: Feature<GJPoint, any>) => void;
  /** Lista de especies sugeridas (datalist) */
  speciesOptions?: string[];
}

const DEFAULT_SPECIES = [
  "Mezquite Dulce",
  "Palo Verde",
  "Palo Brea",
  "Fresno de Arizona",
  "Encino Negrito",
  "Guajillo",
  "Madera Amarilla",
  "Tepeguaje",
  "Trinquete",
  "Jaguarcillo",
];

function resolveApiUrl(apiPath: string) {
  if (/^https?:\/\//i.test(apiPath)) return apiPath;
  const base = import.meta.env.VITE_BACKEND_URL as string | undefined;
  return base ? `${base}${apiPath}` : apiPath;
}

const TreeRegisterForm: React.FC<TreeRegisterFormProps> = ({
  onClose,
  initialCoords,
  apiPath = "/dashboard/modules",
  onCreated,
  speciesOptions = DEFAULT_SPECIES,
}) => {
  // ----------- estado UI -----------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // ----------- campos -----------
  const [species, setSpecies] = useState("");
  const [diameterCm, setDiameterCm] = useState<string>("");
  const [heightM, setHeightM] = useState<string>("");
  const [crownM, setCrownM] = useState<string>("");
  const [plantedYear, setPlantedYear] = useState<string>("");
  const [health, setHealth] = useState<string>("");
  const [colonia, setColonia] = useState<string>("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Coordenadas SIEMPRE {lng,lat}
  const [point, setPoint] = useState<{ lng: number; lat: number }>(
    initialCoords ?? { lng: -110.88346, lat: 29.14511 }
  );

  // ----------- refs de mapa -----------
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // cache de colonias
  const coloniasCache = useRef<any>(null);
  const loadColonias = async () => {
    if (coloniasCache.current) return coloniasCache.current;
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}colonias_hermosillo.json`", { cache: 'no-store' });
      coloniasCache.current = await res.json();
    } catch {
      coloniasCache.current = null;
    }
    return coloniasCache.current;
  };

  // Detecta colonia del punto
  const updateColoniaFor = async (lng: number, lat: number) => {
    try {
      const fc = await loadColonias();
      if (!fc) return setColonia("");
      const pt = turf.point([lng, lat]);
      let name = "";
      for (const f of fc.features || []) {
        if (turf.booleanPointInPolygon(pt, f)) {
          const p = f.properties || {};
          name =
            p.name ||
            p.nombre ||
            p.NOMBRE ||
            p.colonia ||
            p.COLONIA ||
            p.asentamien ||
            p.ASENTAMIEN ||
            "";
          break;
        }
      }
      setColonia(name);
    } catch {
      setColonia("");
    }
  };

  // ----------- montar mapa -----------
  useEffect(() => {
    if (!mapDivRef.current) return;

    const map = new mapboxgl.Map({
      container: mapDivRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [point.lng, point.lat],
      zoom: 16,
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([point.lng, point.lat])
      .addTo(map);
    markerRef.current = marker;

    const syncFromMarker = () => {
      const p = marker.getLngLat();
      setPoint({ lng: p.lng, lat: p.lat });
      updateColoniaFor(p.lng, p.lat);
    };

    marker.on("dragend", syncFromMarker);
    map.on("click", (e) => {
      marker.setLngLat(e.lngLat);
      syncFromMarker();
    });

    // primer autollenado de colonia
    updateColoniaFor(point.lng, point.lat);

    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep map centered si cambia point por geolocación
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.flyTo({ center: [point.lng, point.lat], zoom: 16, essential: true });
      markerRef.current.setLngLat([point.lng, point.lat]);
    }
  }, [point.lng, point.lat]);

  // ----------- handlers -----------
  const handleLocateUser = () => {
    if (!navigator.geolocation) return alert("Tu navegador no soporta geolocalización");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPoint({ lng: coords.longitude, lat: coords.latitude });
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert("No se pudo obtener tu ubicación");
        setIsLocating(false);
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (!/^image\/(jpe?g|png)$/i.test(file.type)) {
      alert("Sube una imagen JPG o PNG");
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const validate = () => {
    const errs: string[] = [];
    if (!species.trim()) errs.push("La especie es obligatoria");
    const d = Number(diameterCm);
    const h = Number(heightM);
    if (!Number.isFinite(d) || d <= 0) errs.push("El diámetro debe ser > 0");
    if (!Number.isFinite(h) || h <= 0) errs.push("La altura debe ser > 0");
    if (plantedYear) {
      const y = Number(plantedYear);
      const nowY = new Date().getFullYear();
      if (!Number.isFinite(y) || y < 1950 || y > nowY) errs.push("Año de plantación inválido");
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("species", species.trim());
      form.append("diameter_cm", String(Number(diameterCm)));
      form.append("height_m", String(Number(heightM)));
      if (crownM) form.append("crown_diameter", String(Number(crownM)));
      if (plantedYear) form.append("planted_year", String(Number(plantedYear)));
      if (health) form.append("health", health);
      if (colonia) form.append("colonia", colonia);
      form.append("coordinates", JSON.stringify([point.lng, point.lat]));
      if (imageFile) form.append("image", imageFile);

      const url = resolveApiUrl(apiPath);
      const res = await axios.post(url, form, {
        headers: {
          ...(import.meta.env.VITE_AUTH_TOKEN
            ? { Authorization: import.meta.env.VITE_AUTH_TOKEN as string }
            : {}),
        },
      });

      // ---------- Construir Feature para dibujar al instante ----------
      const createdId =
        res?.data?.tree?.id ??
        res?.data?.id ??
        res?.data?.reporte?.id ??
        crypto.randomUUID();

      const feature: Feature<GJPoint, any> = {
        type: "Feature",
        geometry: { type: "Point", coordinates: [point.lng, point.lat] },
        properties: {
          id: createdId,
          species: species.trim(),
          diameter_cm: Number(diameterCm),
          height_m: Number(heightM),
          crown_diameter: crownM ? Number(crownM) : Number(diameterCm) * 0.12,
          planted_year: plantedYear ? Number(plantedYear) : undefined,
          health: health || "Buena",
          colonia: colonia || undefined,
        },
      };

      onCreated?.(feature); // <<<<< React padre lo enviará al iframe
      onClose();
    } catch (err) {
      console.error("Error al registrar árbol:", err);
      alert("No se pudo registrar el árbol");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------- UI -----------
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold">Registrar árbol</h2>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cerrar
        </button>
      </div>

      {errors.length > 0 && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          <ul className="list-disc pl-5">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Especie (común)</label>
          <input
            className="w-full border rounded px-3 py-2"
            list="species-list"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="Mezquite Dulce, Palo Verde..."
            required
          />
          <datalist id="species-list">
            {speciesOptions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Diámetro (DAP) cm</label>
          <input
            type="number"
            min={1}
            step={1}
            className="w-full border rounded px-3 py-2"
            value={diameterCm}
            onChange={(e) => setDiameterCm(e.target.value)}
            placeholder="25"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Altura (m)</label>
          <input
            type="number"
            min={0.5}
            step={0.1}
            className="w-full border rounded px-3 py-2"
            value={heightM}
            onChange={(e) => setHeightM(e.target.value)}
            placeholder="6"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Diámetro de copa (m) (opcional)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            className="w-full border rounded px-3 py-2"
            value={crownM}
            onChange={(e) => setCrownM(e.target.value)}
            placeholder="(auto si lo dejas vacío)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Año de plantación (opcional)</label>
          <input
            type="number"
            min={1950}
            max={new Date().getFullYear()}
            className="w-full border rounded px-3 py-2"
            value={plantedYear}
            onChange={(e) => setPlantedYear(e.target.value)}
            placeholder="2018"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado de salud</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={health}
            onChange={(e) => setHealth(e.target.value)}
          >
            <option value="">— Selecciona —</option>
            <option>Excelente</option>
            <option>Buena</option>
            <option>Regular</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Foto (opcional)</label>
          <input type="file" accept="image/png,image/jpeg" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Vista previa"
              className="mt-2 max-h-48 rounded border object-contain"
            />
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">
            Haz click en el mapa o arrastra el marcador para ubicar el árbol.
          </p>
          <button
            type="button"
            onClick={handleLocateUser}
            disabled={isLocating}
            className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {isLocating ? "Localizando..." : "Encontrar mi ubicación"}
          </button>
        </div>
        <div ref={mapDivRef} className="w-full h-64 rounded border" />
        <p className="text-xs text-gray-700 mt-2">
          <strong>Lng:</strong> {point.lng.toFixed(6)} · <strong>Lat:</strong>{" "}
          {point.lat.toFixed(6)} {colonia ? <>· <strong>Colonia:</strong> {colonia}</> : null}
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar árbol"}
        </button>
      </div>
    </form>
  );
};

export default TreeRegisterForm;



