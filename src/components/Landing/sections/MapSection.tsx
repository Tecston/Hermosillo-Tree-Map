import React from "react";
import LandingMapView from "../../Map/LandingMapView";

const MapSection: React.FC = () => (
  <section
    id="mapa"
    className="w-full flex flex-col items-center py-24 bg-white bg-opacity-90"
  >
    <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 text-center drop-shadow-sm">
      Mapa de Proyectos Arquitectónicos
    </h2>
    <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
      Explora los principales proyectos de desarrollo urbano y arquitectónico en
      tu ciudad
    </p>
    <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-gray-200 h-[500px] bg-white">
      <LandingMapView />
    </div>
  </section>
);

export default MapSection;
