// src/components/Map/PlatformMapView.tsx
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PlusIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { FaMapPin } from "react-icons/fa";
import MarkerCarousel from "./MarkerCarousel";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

mapboxgl.accessToken = TOKEN ?? "";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

if (!import.meta.env.VITE_MAPBOX_TOKEN) {
  console.error("Falta VITE_MAPBOX_TOKEN en .env.local");
}


interface MapViewProps {
  openModal: (type: "request", coords?: { lat: number; lng: number }) => void;
}

interface MarkerItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  authorName?: string;
  contactPhone?: string;
  imageUrl?: string;
  supports?: number;
  institution?: string;
  likes?: number;
  dislikes?: number;
  type: "request" | "project";
  location: { lat: number; lng: number };
}

const MapView: React.FC<MapViewProps> = ({ openModal }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [carouselItems, setCarouselItems] = useState<MarkerItem[]>([]);
  const { requests, projects, supportRequest, likeProject, dislikeProject } =
    useAppContext();

  // Function to calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Function to group nearby markers
  const groupNearbyMarkers = (
    items: MarkerItem[],
    maxDistance: number = 20
  ) => {
    const groups: MarkerItem[][] = [];
    const processed = new Set<string>();

    items.forEach((item) => {
      if (processed.has(item.id)) return;

      const group: MarkerItem[] = [item];
      processed.add(item.id);

      items.forEach((otherItem) => {
        if (processed.has(otherItem.id)) return;

        const distance = calculateDistance(
          item.location.lat,
          item.location.lng,
          otherItem.location.lat,
          otherItem.location.lng
        );

        if (distance <= maxDistance) {
          group.push(otherItem);
          processed.add(otherItem.id);
        }
      });

      if (group.length > 0) {
        groups.push(group);
      }
    });

    return groups;
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true,
          });
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
    if (mapRef.current || !mapContainerRef.current) return;
    if (mapRef.current || !mapContainerRef.current || !TOKEN) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-110.8835, 29.1451],
      zoom: 15,
      minZoom: 13,
      maxZoom: 18,
      accessToken: TOKEN,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    map.on("dblclick", (e) => {
      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;
      openModal("request", { lat, lng });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [openModal]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    document.querySelectorAll(".mapboxgl-marker").forEach((el) => el.remove());

    const allItems: MarkerItem[] = [
      ...requests.map((req) => ({
        ...req,
        type: "request" as const,
        location: req.location,
      })),
      ...projects.map((proj) => ({
        ...proj,
        type: "project" as const,
        location: { lat: proj.location[0], lng: proj.location[1] },
      })),
    ];

    const markerGroups = groupNearbyMarkers(allItems);
    const markers: mapboxgl.Marker[] = [];

    markerGroups.forEach((group) => {
      const isGroup = group.length > 1;
      const firstItem = group[0];

      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor =
        firstItem.type === "request" ? "#009BDA" : "#22c55e";
      el.style.width = isGroup ? "16px" : "12px";
      el.style.height = isGroup ? "16px" : "12px";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 2px rgba(0,0,0,0.5)";

      if (isGroup) {
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.fontSize = "10px";
        el.style.color = "white";
        el.style.fontWeight = "bold";
        el.textContent = group.length.toString();
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([firstItem.location.lng, firstItem.location.lat])
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        if (isGroup) {
          setCarouselItems(group);
        } else {
          // For single items, show a simple popup
          const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(`
            <div style="font-family:sans-serif;max-width:240px;">
              <h3 style="margin:0;font-size:16px;">${firstItem.title}</h3>
              ${
                firstItem.category
                  ? `<p style="margin:4px 0;font-size:14px;"><strong>Categoría:</strong> ${firstItem.category}</p>`
                  : ""
              }
              <p style="font-size:13px;">${firstItem.description}</p>
              ${
                firstItem.authorName
                  ? `<p style="font-size:13px;"><strong>Autor:</strong> ${firstItem.authorName}</p>`
                  : ""
              }
              ${
                firstItem.contactPhone
                  ? `<!--<p style="font-size:13px;"><strong>Tel:</strong> ${firstItem.contactPhone}</p>-->`
                  : ""
              }
              ${
                firstItem.institution
                  ? `<p style="font-size:13px;"><strong>Institución:</strong> ${firstItem.institution}</p>`
                  : ""
              }
              ${
                firstItem.imageUrl
                  ? `<img src="${firstItem.imageUrl}" alt="Evidencia" style="width:100%;margin-top:8px;border-radius:6px;" />`
                  : ""
              }
              ${
                firstItem.type === "request"
                  ? `
                <button onclick="window.dispatchEvent(new CustomEvent('support-request',{detail:'${
                  firstItem.id
                }'}))"
                  style="margin-top:8px;background:#2563eb;color:#fff;padding:6px 10px;border:none;border-radius:4px;cursor:pointer;">
                  Apoyar (${firstItem.supports || 0})
                </button>
              `
                  : `
                <div style="margin-top:8px;display:flex;gap:4px;">
                  <button onclick="window.dispatchEvent(new CustomEvent('like-project',{detail:'${
                    firstItem.id
                  }'}))"
                    style="flex:1;background:#22c55e;color:#fff;padding:6px 10px;border:none;border-radius:4px;cursor:pointer;">
                    👍 (${firstItem.likes || 0})
                  </button>
                  <button onclick="window.dispatchEvent(new CustomEvent('dislike-project',{detail:'${
                    firstItem.id
                  }'}))"
                    style="flex:1;background:#ef4444;color:#fff;padding:6px 10px;border:none;border-radius:4px;cursor:pointer;">
                    👎 (${firstItem.dislikes || 0})
                  </button>
                </div>
              `
              }
            </div>
          `);
          marker.setPopup(popup);
        }
      });

      markers.push(marker);
    });

    const handleSupport = (e: any) => supportRequest(e.detail);
    const handleLike = (e: any) => likeProject(e.detail);
    const handleDislike = (e: any) => dislikeProject(e.detail);

    window.addEventListener("support-request", handleSupport);
    window.addEventListener("like-project", handleLike);
    window.addEventListener("dislike-project", handleDislike);

    return () => {
      markers.forEach((marker) => marker.remove());
      window.removeEventListener("support-request", handleSupport);
      window.removeEventListener("like-project", handleLike);
      window.removeEventListener("dislike-project", handleDislike);
    };
  }, [requests, projects, supportRequest, likeProject, dislikeProject]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50 pointer-events-none">
        <button
          className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors bg-brand-blue hover:bg-brand-blue-darker cursor-pointer text-white"
          onClick={() => {
            const center = mapRef.current?.getCenter();
            if (center) {
              openModal("request", { lat: center.lat, lng: center.lng });
            }
          }}
        >
          <PlusIcon />
        </button>
        <button
          className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors bg-brand-blue hover:bg-brand-blue-darker cursor-pointer text-white"
          onClick={handleLocateUser}
          disabled={isLocating}
        >
          {isLocating ? (
            <svg
              className="animate-spin h-6 w-6 text-white"
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
          ) : (
            <FaMapPin />
          )}
        </button>
      </div>

      {carouselItems.length > 0 && (
        <MarkerCarousel
          items={carouselItems}
          onClose={() => setCarouselItems([])}
          onSupport={supportRequest}
          onLike={likeProject}
          onDislike={dislikeProject}
        />
      )}
    </div>
  );
};

export default MapView;
