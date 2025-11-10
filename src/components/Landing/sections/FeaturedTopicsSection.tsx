import React from "react";
import { Landmark, LineChart, Leaf } from "lucide-react";

const FeaturedTopicsSection: React.FC = () => (
  <section className="w-full bg-blue-50 py-16 flex flex-col items-center">
    <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <Landmark size={36} className="mb-4 text-blue-400" />
        <h3 className="text-xl font-bold mb-2 text-center">
          Proyectos Destacados
        </h3>
        <p className="text-gray-600 text-center">
          Conoce los proyectos más importantes que están transformando el
          paisaje urbano de Hermosillo.
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <LineChart size={36} className="mb-4 text-blue-400" />
        <h3 className="text-xl font-bold mb-2 text-center">
          Inversión y Desarrollo
        </h3>
        <p className="text-gray-600 text-center">
          Análisis de la inversión en infraestructura y su impacto en el
          desarrollo económico regional.
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <Leaf size={36} className="mb-4 text-blue-400" />
        <h3 className="text-xl font-bold mb-2 text-center">Sostenibilidad</h3>
        <p className="text-gray-600 text-center">
          Iniciativas para crear espacios urbanos sostenibles adaptados al clima
          desértico de Sonora.
        </p>
      </div>
    </div>
  </section>
);

export default FeaturedTopicsSection;
