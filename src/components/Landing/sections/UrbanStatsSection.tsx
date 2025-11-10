import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";

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

const UrbanStatsSection: React.FC = () => (
  <section className="w-full flex flex-col items-center py-24 bg-white">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 text-center">
      Estadísticas de Desarrollo Urbano
    </h2>
    <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl">
      Análisis cuantitativo de la inversión y desarrollo en arquitectura en
      Sonora
    </p>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 w-full max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <div className="text-3xl font-extrabold mb-1 text-blue-600">
          <AnimatedNumber value={78} />
        </div>
        <div className="text-gray-500 text-center text-base font-medium">
          Proyectos Activos
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <div className="text-3xl font-extrabold mb-1 text-blue-600">
          $<AnimatedNumber value={3.2} />B
        </div>
        <div className="text-gray-500 text-center text-base font-medium">
          Inversión Total MXN
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <div className="text-3xl font-extrabold mb-1 text-blue-600">
          <AnimatedNumber value={14300} />
        </div>
        <div className="text-gray-500 text-center text-base font-medium">
          Empleos Generados
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border">
        <div className="text-3xl font-extrabold mb-1 text-blue-600">
          <AnimatedNumber value={42} />%
        </div>
        <div className="text-gray-500 text-center text-base font-medium">
          Proyectos Sostenibles
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm p-8 border">
        <h3 className="text-xl font-bold mb-4">
          Inversión por Tipo de Proyecto
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="value"
              data={[
                { name: "Residencial", value: 42 },
                { name: "Comercial", value: 28 },
                { name: "Industrial", value: 15 },
                { name: "Infraestructura", value: 8 },
                { name: "Espacios Públicos", value: 7 },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              <Cell fill="#34d399" />
              <Cell fill="#60a5fa" />
              <Cell fill="#f59e42" />
              <Cell fill="#6366f1" />
              <Cell fill="#a78bfa" />
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 border">
        <h3 className="text-xl font-bold mb-4">Proyectos por Zona</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { zona: "Norte", proyectos: 24 },
              { zona: "Centro", proyectos: 19 },
              { zona: "Sur", proyectos: 15 },
              { zona: "Este", proyectos: 11 },
              { zona: "Oeste", proyectos: 8 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="zona" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="proyectos"
              fill="#3b82f6"
              name="Número de Proyectos"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="w-full max-w-6xl mt-8">
      <div className="bg-white rounded-xl shadow-sm p-8 border">
        <h3 className="text-xl font-bold mb-4">
          Tendencia de Inversión (2020–2025)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsLineChart
            data={[
              { year: 2020, norte: 120, centro: 100, sur: 90 },
              { year: 2021, norte: 190, centro: 150, sur: 130 },
              { year: 2022, norte: 300, centro: 250, sur: 200 },
              { year: 2023, norte: 510, centro: 450, sur: 300 },
              { year: 2024, norte: 600, centro: 520, sur: 450 },
              { year: 2025, norte: 750, centro: 650, sur: 580 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              label={{
                value: "Millones de pesos",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="norte"
              name="Zona Norte"
              stroke="#22c55e"
              strokeWidth={3}
              dot
            />
            <Line
              type="monotone"
              dataKey="centro"
              name="Zona Centro"
              stroke="#3b82f6"
              strokeWidth={3}
              dot
            />
            <Line
              type="monotone"
              dataKey="sur"
              name="Zona Sur"
              stroke="#f59e42"
              strokeWidth={3}
              dot
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </section>
);

export default UrbanStatsSection;
