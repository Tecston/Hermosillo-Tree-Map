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
import TreeDemo from "./components/Map/TreeDemo/TreeDemo";

// 👉 módulos (árbolado)
import ModulesRoutes from "./modules/routes";

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

          {/* ========= MÓDULO FULLSCREEN SIN SHELL ========= */}
          {/* Todo lo que esté bajo /dashboard/modules NO renderiza Header/Sidebar */}
          <Route path="/dashboard/modules/*" element={<ModulesRoutes />} />

          {/* ========= DASHBOARD CON SHELL ========= */}
          <Route
            path="/dashboard/*"
            element={
              <div className="flex h-dvh flex-col bg-gray-50">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <DashboardMain openModal={openModal} />
                </div>

                {/* Modal global */}
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
                        {modalContent === "project" && <ProjectForm onClose={closeModal} />}
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

const DashboardMain: React.FC<{
  openModal: (content: "request" | "project", coords?: { lat: number; lng: number }) => void;
}> = ({ openModal }) => {
  const { pathname } = useLocation();

  const isFullScreen =
    pathname.startsWith("/dashboard/trees") ||
    pathname.startsWith("/dashboard/map/TreeDemo");

  return (
    <main className={`flex-1 ${isFullScreen ? "p-0 overflow-hidden" : "p-4 overflow-auto"}`}>
      <Routes>
        <Route path="/" element={<Navigate to="map" replace />} />
        <Route path="map" element={<PlatformMapView openModal={openModal} />} />
        <Route path="stats" element={<DataVisualization />} />
        <Route path="map_analytics" element={<MapAnalytics />} />
        <Route path="trees" element={<TreeDemo />} />
        <Route path="map/TreeDemo" element={<TreeDemo />} />
      </Routes>
    </main>
  );
};

export default App;
