import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppContext } from "../../context/AppContext";

mapboxgl.accessToken = import.meta.env.VITE_BACKEND_URL;
interface RequestFormProps {
  onClose: () => void;
  initialCoords?: { lat: number; lng: number };
}

const RequestForm: React.FC<RequestFormProps> = ({
  onClose,
  initialCoords,
}) => {
  const { fetchRequests } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<[number, number]>(
    initialCoords
      ? [initialCoords.lat, initialCoords.lng]
      : [29.14511, -110.88346]
  );

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
        if (mapRef.current && markerRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true,
          });
          markerRef.current.setLngLat([longitude, latitude]);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("No se pudo obtener tu ubicación");
        setIsLocating(false);
      }
    );
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [location[1], location[0]],
      zoom: 15,
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapRef.current = map;

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([location[1], location[0]])
      .addTo(map);

    markerRef.current = marker;

    const updateCoords = () => {
      const lngLat = marker.getLngLat();
      setLocation([lngLat.lat, lngLat.lng]);
    };

    marker.on("dragend", updateCoords);

    map.on("click", (e) => {
      const { lat, lng } = e.lngLat;
      marker.setLngLat([lng, lat]);
      setLocation([lat, lng]);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/jpeg") {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert("Por favor selecciona una imagen en formato JPG");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("authorName", authorName);
    formData.append("contactPhone", contactPhone);
    formData.append(
      "location",
      JSON.stringify({ lat: location[0], lng: location[1] })
    );
    if (imageFile) formData.append("image", imageFile);

    console.log("Enviando a:", import.meta.env.VITE_BACKEND_URL);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reportes`,
        formData
      );

      await fetchRequests();
      alert("Reporte enviado con éxito");
      onClose();
    } catch (error) {
      console.error("Error al enviar el reporte", error);
      alert("Error al enviar el reporte");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Nuevo Reporte Ciudadano</h2>

      <input
        type="text"
        placeholder="Tu nombre"
        className="w-full border p-2 rounded"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Título del reporte"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Descripción del problema"
        className="w-full border p-2 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <select
        className="w-full border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Selecciona una categoría</option>
        <option value="Servicios Públicos">Servicios Públicos</option>
        <option value="Seguridad">Seguridad</option>
        <option value="Infraestructura">Infraestructura</option>
        <option value="Medio Ambiente">Medio Ambiente</option>
        <option value="Otro">Otro</option>
      </select>

      <input
        type="tel"
        placeholder="Teléfono de contacto"
        className="w-full border p-2 rounded"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
      />

      <input
        type="file"
        accept="image/jpeg"
        className="w-full border p-2 rounded"
        onChange={handleImageChange}
      />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Vista previa"
          className="w-full h-auto rounded border"
        />
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500">
            Selecciona el punto del problema en el mapa.
          </p>
          <button
            type="button"
            onClick={handleLocateUser}
            className="px-3 py-1 bg-brand-blue text-white text-sm rounded flex items-center gap-2 disabled:opacity-50"
            disabled={isLocating}
          >
            {isLocating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Localizando...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Encontrar mi ubicación
              </>
            )}
          </button>
        </div>
        <div ref={mapContainerRef} className="w-full h-64 rounded border" />
        <p className="text-xs text-gray-600 mt-2">
          Lat: {location[0].toFixed(5)}, Lng: {location[1].toFixed(5)}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-blue text-white rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Enviando...
            </>
          ) : (
            "Enviar"
          )}
        </button>
      </div>
    </form>
  );
};

export default RequestForm;
