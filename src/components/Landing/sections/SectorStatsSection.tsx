import React from "react";
import * as Progress from "@radix-ui/react-progress";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { TrendingUp } from "lucide-react";

const AnimatedNumber = ({ value }: { value: number }) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.floor(latest).toLocaleString()
  );
  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [value]);
  return <motion.span>{rounded}</motion.span>;
};

const SectorStatsSection: React.FC = () => (
  <section
    id="estadisticas"
    className="w-full flex flex-col items-center py-24 bg-white"
  >
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 text-center">
      Estadísticas del Sector
    </h2>
    <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl">
      Datos relevantes sobre el desarrollo arquitectónico y urbano en Sonora
    </p>
    <div className="grid px-6 lg:px-0 grid-cols-1 md:grid-cols-4 gap-6 mb-10 w-full max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <span className="text-green-600 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
            />
          </svg>
        </span>
        <h3 className="text-xl font-bold mb-1 text-center">
          Proyectos Activos
        </h3>
        <div className="text-3xl font-extrabold mb-1">
          <AnimatedNumber value={78} />
        </div>
        <div className="text-gray-500 text-center text-sm">
          Proyectos arquitectónicos en desarrollo
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <span className="text-green-600 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
            />
          </svg>
        </span>
        <h3 className="text-xl font-bold mb-1 text-center">Inversión Total</h3>
        <div className="text-3xl font-extrabold mb-1">
          <AnimatedNumber value={1250} />
        </div>
        <div className="text-gray-500 text-center text-sm">
          MDP
          <br />
          Millones de pesos invertidos en 2025
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <span className="text-green-600 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
            />
          </svg>
        </span>
        <h3 className="text-xl font-bold mb-1 text-center">
          Empleos Generados
        </h3>
        <div className="text-3xl font-extrabold mb-1">
          <AnimatedNumber value={3450} />
        </div>
        <div className="text-gray-500 text-center text-sm">
          Puestos de trabajo en el sector
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <span className="text-green-600 mb-2">
          <TrendingUp className="size-6" />
        </span>
        <h3 className="text-xl font-bold mb-1 text-center">
          Crecimiento Anual
        </h3>
        <div className="text-3xl font-extrabold mb-1">
          <AnimatedNumber value={28} />
        </div>
        <div className="text-gray-500 text-center text-sm">
          %<br />
          Incremento respecto al año anterior
        </div>
      </div>
    </div>
    <div className="w-full px-6 lg:px-0 max-w-6xl mt-8">
      <h3 className="text-xl font-bold mb-4">
        Distribución por Tipo de Proyecto
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="font-semibold flex items-center justify-between">
            Espacios Públicos <span className="ml-2">8%</span>
          </div>
          <Progress.Root
            value={8}
            max={100}
            className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2 mt-2"
          >
            <Progress.Indicator
              className="bg-green-500 h-full transition-all duration-700"
              style={{ width: "8%" }}
            />
          </Progress.Root>
        </div>
        <div>
          <div className="font-semibold flex items-center justify-between">
            Residencial <span className="ml-2">42%</span>
          </div>
          <Progress.Root
            value={42}
            max={100}
            className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2 mt-2"
          >
            <Progress.Indicator
              className="bg-green-500 h-full transition-all duration-700"
              style={{ width: "42%" }}
            />
          </Progress.Root>
        </div>
        <div>
          <div className="font-semibold flex items-center justify-between">
            Comercial <span className="ml-2">28%</span>
          </div>
          <Progress.Root
            value={28}
            max={100}
            className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2 mt-2"
          >
            <Progress.Indicator
              className="bg-green-500 h-full transition-all duration-700"
              style={{ width: "28%" }}
            />
          </Progress.Root>
        </div>
        <div>
          <div className="font-semibold flex items-center justify-between">
            Industrial <span className="ml-2">15%</span>
          </div>
          <Progress.Root
            value={15}
            max={100}
            className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2 mt-2"
          >
            <Progress.Indicator
              className="bg-green-500 h-full transition-all duration-700"
              style={{ width: "15%" }}
            />
          </Progress.Root>
        </div>
        <div>
          <div className="font-semibold flex items-center justify-between">
            Infraestructura <span className="ml-2">7%</span>
          </div>
          <Progress.Root
            value={7}
            max={100}
            className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2 mt-2"
          >
            <Progress.Indicator
              className="bg-green-500 h-full transition-all duration-700"
              style={{ width: "7%" }}
            />
          </Progress.Root>
        </div>
      </div>
    </div>
  </section>
);

export default SectorStatsSection;
