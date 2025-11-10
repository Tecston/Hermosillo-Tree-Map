import React, { useState } from "react";
import {
  Landmark,
  Map,
  Users,
  Activity,
  Database,
  ClipboardList,
  Users2,
  FileText,
  Leaf,
  BarChart3,
  Shield,
  Trophy,
  Gavel,
} from "lucide-react";

const modules = [
  {
    title: "Participación ciudadana",
    desc: "Plataforma para que los ciudadanos creen peticiones georreferenciadas, apoyen o rechacen propuestas, y aporten comentarios estructurados, recibiendo incentivos canjeables por beneficios locales.",
    icon: <Users size={20} />,
  },
  {
    title: "Análisis geoespacial",
    desc: "Mapas interactivos multicapa que visualizan límites, zonas de riesgo, redes de transporte y densidad poblacional. Permite activar/desactivar capas y superponer indicadores para identificar oportunidades y vulnerabilidades.",
    icon: <Map size={20} />,
  },
  {
    title: "Análisis de viabilidad urbana",
    desc: "Evaluación profunda de factibilidad técnica, económica y social para intervenciones urbanas. Integra datos catastrales, socioeconómicos, ambientales y de mercado para generar informes con puntuaciones, alertas y recomendaciones.",
    icon: <Landmark size={20} />,
  },
  // {
  //   title: "Modelos predictivos y recomendación",
  //   desc: "Algoritmos de machine learning que estiman la probabilidad de éxito de proyectos y sugieren ajustes en ubicación, densidad, usos de suelo y cronogramas, presentados en paneles interactivos.",
  //   icon: <Activity size={20} />,
  // },
  {
    title: "Integración de datos oficiales y privados",
    desc: "Procesos ETL regulares para consolidar información de fuentes oficiales, encuestas ciudadanas y datasets privados, asegurando análisis sobre datos actualizados y completos.",
    icon: <Database size={20} />,
  },
  // {
  //   title: "Gestión de proyectos urbanos",
  //   desc: "Herramienta para que desarrolladores y gobiernos registren proyectos, asignen responsables e hitos, con tableros de seguimiento para monitorear aprobaciones, avances y comentarios ciudadanos.",
  //   icon: <ClipboardList size={20} />,
  // },
  // {
  //   title: "Colaboración multiactor",
  //   desc: "Espacio colaborativo para funcionarios, consultores, arquitectos y líderes comunitarios, con foros, mensajería y repositorio compartido de documentos, con roles y permisos diferenciados.",
  //   icon: <Users2 size={20} />,
  // },
  {
    title: "Reportes y exportación",
    desc: "Generación de reportes personalizados combinando mapas, tablas, gráficos y texto explicativo, con capacidad de exportar datasets geoespaciales o tablas.",
    icon: <FileText size={20} />,
  },
  {
    title: "Indicadores de sostenibilidad e innovación",
    desc: "Métricas específicas de huella de carbono, eficiencia energética, inclusión social y circularidad de recursos, medidas con fórmulas estandarizadas y visualizadas en dashboards dedicados.",
    icon: <Leaf size={20} />,
  },
  {
    title: "Visualización avanzada",
    desc: "Dashboards interactivos con filtros por zona, periodo y categoría, incluyendo series temporales, mapas de calor y diagramas de redes, optimizados para múltiples dispositivos.",
    icon: <BarChart3 size={20} />,
  },
  // {
  //   title: "Seguridad y permisos",
  //   desc: "Sistema con autenticación multifactor y control de acceso por roles, registrando cada acción en logs de auditoría para garantizar trazabilidad y cumplimiento normativo.",
  //   icon: <Shield size={20} />,
  // },
  {
    title: "Gamificación e incentivos",
    desc: "Sistema de badges y niveles que premian la participación ciudadana, permitiendo canjear puntos por cupones locales, sorteos de entradas o descuentos en servicios municipales.",
    icon: <Trophy size={20} />,
  },
  {
    title: "Cumplimiento regulatorio",
    desc: "Repositorio de normativas urbano-territoriales por estado y municipio, con motor de validación que alerta sobre incumplimientos para prevenir retrabajos y sanciones.",
    icon: <Gavel size={20} />,
  },
];

const ServiciosSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleModules = showAll ? modules : modules.slice(0, 3);
  return (
    <section
      id="servicios"
      className="w-full flex flex-col items-center py-24 bg-white"
    >
      <h2 className="text-3xl md:text-4xl font-bold lg:text-5xl text-gray-800 mb-2 text-center">
        Módulos Funcionales
      </h2>
      <p className="text-lg text-gray-600 mb-10 mx-2 text-center max-w-2xl">
        Soluciones integrales para la planificación urbana inteligente
      </p>
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-8">
        {visibleModules.map((mod, i) => (
          <div
            key={mod.title}
            className="bg-white rounded-xl shadow-sm p-8 flex flex-col border transition-transform duration-200 hover:shadow-lg hover:scale-[1.025] group cursor-pointer"
          >
            <div className="text-sm text-gray-400 mb-2 font-mono">
              {(i + 1).toString().padStart(2, "0")}
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">
              {mod.title}
            </h3>
            <p className="text-gray-700 mb-4 flex-1">{mod.desc}</p>
            <div className="mt-2 text-gray-500 group-hover:text-blue-500 transition-colors">
              {mod.icon}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          className="px-6 py-2 rounded-sm bg-green-100 text-green-700 font-semibold border border-green-200 hover:bg-green-200 transition"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "VER MENOS" : "VER MÁS"}
        </button>
      </div>
    </section>
  );
};

export default ServiciosSection;
