import React from "react";
import { useAppContext } from "../../context/AppContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const DataVisualization = () => {
  const { requests, projects } = useAppContext();
  // Calculate request categories
  const categoryData = requests.reduce(
    (
      acc: {
        name: string;
        value: number;
      }[],
      request
    ) => {
      const existingCategory = acc.find(
        (item) => item.name === request.category
      );
      if (existingCategory) {
        existingCategory.value += 1;
      } else {
        acc.push({
          name: request.category,
          value: 1,
        });
      }
      return acc;
    },
    []
  );
  // Calculate project status
  const statusData = [
    {
      name: "Planeación",
      value: projects.filter((p) => p.status === "planning").length,
    },
    {
      name: "En Progreso",
      value: projects.filter((p) => p.status === "in-progress").length,
    },
    {
      name: "Completado",
      value: projects.filter((p) => p.status === "completed").length,
    },
  ];
  // Calculate support by request
  const supportData = requests.map((request) => ({
    name:
      request.title.length > 20
        ? request.title.substring(0, 20) + "..."
        : request.title,
    apoyos: request.supports,
  }));
  // Colors for pie charts and visualizations
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  return (
    <div className="bg-blue-1 rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-12">
        Estadísticas y Visualización de Datos
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white border border-gray-6 p-3 sm:p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-12">
            Peticiones por Categoría
          </h3>
          <div className="h-[250px] sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => {
                    // Only show label if there's enough space
                    if (window.innerWidth < 640) {
                      return percent > 0.1
                        ? `${(percent * 100).toFixed(0)}%`
                        : "";
                    }
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-gray-6 p-3 sm:p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-12">
            Estado de Proyectos
          </h3>
          <div className="h-[250px] sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => {
                    if (window.innerWidth < 640) {
                      return percent > 0.1
                        ? `${(percent * 100).toFixed(0)}%`
                        : "";
                    }
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  <Cell fill="#FFBB28" />
                  <Cell fill="#0088FE" />
                  <Cell fill="#00C49F" />
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-gray-6 p-3 sm:p-4 rounded-lg lg:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-12">
            Apoyos por Petición
          </h3>
          <div className="h-[300px] sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={supportData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 10,
                  bottom: 60,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-gray-4)"
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-gray-11)"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="var(--color-gray-8)" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="apoyos" fill="#8884db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-500">
            Peticiones Totales
          </h3>
          <p className="text-2xl sm:text-3xl font-bold">{requests.length}</p>
        </div>
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-500">
            Proyectos Activos
          </h3>
          <p className="text-2xl sm:text-3xl font-bold">
            {projects.filter((p) => p.status !== "completed").length}
          </p>
        </div>
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-purple-500">
            Participaciones
          </h3>
          <p className="text-2xl sm:text-3xl font-bold">
            {requests.reduce((acc, req) => acc + req.supports, 0) +
              projects.reduce(
                (acc, proj) => acc + proj.likes + proj.dislikes,
                0
              )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
