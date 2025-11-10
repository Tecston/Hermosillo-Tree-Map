import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapIcon, LayoutDashboardIcon, Layers, TreePine, X } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

type ViewType = "map" | "stats" | "map_analytics" | "trees";

const NAV_ITEMS: {
  type: ViewType;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  path: string;
  adminOnly?: boolean;
}[] = [
  { type: "map", label: "Mapa",    icon: a => <MapIcon size={20} className={`${a ? "text-blue-500" : "text-gray-500"} mr-2`} />, path: "/dashboard/map" },
  { type: "stats", label: "Estadísticas", icon: a => <LayoutDashboardIcon size={20} className={`${a ? "text-green-500" : "text-gray-500"} mr-2`} />, path: "/dashboard/stats" },
  { type: "map_analytics", label: "Análisis de Zona", icon: a => <Layers size={20} className={`${a ? "text-blue-500" : "text-gray-500"} mr-2`} />, path: "/dashboard/map_analytics" },
  { type: "trees", label: "Arbolado", icon: a => <TreePine size={20} className={`${a ? "text-green-500" : "text-gray-500"} mr-2`} />, path: "/dashboard/modules" },
];

const SidebarModal: React.FC = () => {
  const { currentUser } = useAppContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Cierra al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (open && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed top-140 right-10 z-20 p-3 bg-white rounded-full shadow-lg"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? <X size={24} /> : <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-black" />
          <span className="block w-6 h-0.5 bg-black" />
          <span className="block w-6 h-0.5 bg-black" />
        </div>}
      </button>

      {/* Modal desplegable */}
      {open && (
        <div
          ref={modalRef}
          className="fixed top-103 right-10 z-20 w-64 bg-white rounded-lg shadow-lg overflow-hidden animate-slide-down"
        >
          <nav className="flex flex-col">
            {NAV_ITEMS.map(item => {
              if (item.adminOnly && !currentUser.isAdmin) return null;
              const active = pathname === item.path;
              return (
                <button
                  key={item.type}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className={`flex items-center px-4 py-2 transition-colors duration-150 ${
                    active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon(active)}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};

export default SidebarModal;

/* Añade en tu CSS o tailwind.config:
.animate-slide-down { animation: slide-down 200ms ease-in-out; }
@keyframes slide-down { from { opacity:0; transform: translateY(-10px);} to{ opacity:1; transform: translateY(0);} }
*/
