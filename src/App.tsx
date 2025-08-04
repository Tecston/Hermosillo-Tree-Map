// src/App.tsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/UI/Header";
import Sidebar from "./components/UI/Sidebar";
import PlatformMapView from "./components/Map/PlatformMapView";
import DataVisualization from "./components/Dashboard/DataVisualization";
import RequestForm from "./components/Forms/RequestForm";
import ProjectForm from "./components/Forms/ProjectForm";
import LandingPage from "./components/Landing/LandingPage";
import BlogList from "./components/Blog/BlogList";
import BlogPost from "./components/Blog/BlogPost";
import MapAnalytics from "./components/MapAnalytics/MapAnalytics";

// Arbolado (demo)
import TreeDemo from "./components/Map/TreeDemo/TreeDemo";

import { AppProvider } from "./context/AppContext";
import "./index.css";

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<"request" | "project" | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const openModal = (
    content: "request" | "project",
    coords?: { lat: number; lng: number }
  ) => {
    setModalContent(content);
    setIsModalOpen(true);
    if (coords) setSelectedCoords(coords);
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
    setSelectedCoords(null);
  };

  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* Página de inicio */}
          <Route path="/" element={<LandingPage />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* Dashboard con sidebar */}
          <Route
            path="/dashboard/*"
            element={
              <div className="flex h-dvh flex-col bg-gray-50">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  {/* Main con padding condicional */}
                  <DashboardMain openModal={openModal} />
                </div>

                {/* Modal flotante global */}
                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg bg-white shadow-xl">
                      <div className="p-4">
                        <button
                          onClick={closeModal}
                          className="float-right text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>

                        {modalContent === "request" && (
                          <RequestForm
                            onClose={closeModal}
                            initialCoords={selectedCoords || undefined}
                          />
                        )}
                        {modalContent === "project" && (
                          <ProjectForm onClose={closeModal} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            }
          />
        </Routes>
      </AppProvider>
    </Router>
  );
}

/** Separa el <main> para poder usar useLocation y quitar padding en /dashboard/trees */
const DashboardMain: React.FC<{
  openModal: (content: "request" | "project", coords?: { lat: number; lng: number }) => void;
}> = ({ openModal }) => {
  const { pathname } = useLocation();

  // Rutas donde queremos pantalla completa (sin padding en el main)
  const isFullScreen =
    pathname.startsWith("/dashboard/trees") ||
    pathname.startsWith("/dashboard/map/TreeDemo");

  return (
    <main className={`flex-1 ${isFullScreen ? "p-0 overflow-hidden" : "p-4 overflow-auto"}`}>
      <Routes>
        <Route path="/" element={<Navigate to="map" replace />} />

        {/* Mapa principal de la plataforma */}
        <Route path="map" element={<PlatformMapView openModal={openModal} />} />

        {/* Estadísticas */}
        <Route path="stats" element={<DataVisualization />} />

        {/* Análisis de Zona */}
        <Route path="map_analytics" element={<MapAnalytics />} />

        {/* Arbolado (demo) – principal */}
        <Route path="trees" element={<TreeDemo />} />

        {/* Alias opcional (si quieres que funcione /dashboard/map/TreeDemo también) */}
        <Route path="map/TreeDemo" element={<TreeDemo />} />
      </Routes>
    </main>
  );
};

export default App;
