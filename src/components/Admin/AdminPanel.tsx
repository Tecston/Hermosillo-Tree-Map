// src/components/Admin/AdminPanel.tsx
import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { TrashIcon, CheckIcon, XIcon } from "lucide-react";

const AdminPanel: React.FC = () => {
  const { requests, projects, deleteRequest, deleteProject } = useAppContext();
  const [activeTab, setActiveTab] = useState<"requests" | "projects">(
    "requests"
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>

      {/* Pestañas */}
      <div className="flex  border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "requests"
              ? "hover:bg-gray-3 hover:text-gray-12 border-b-2 border-blue-9 text-gray-11"
              : "hover:bg-gray-3 hover:text-gray-12 border-b-1 border-gray-5 text-gray-11 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Peticiones
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "projects"
              ? "hover:bg-gray-3 hover:text-gray-12 border-b-2 border-blue-9 text-gray-11"
              : "hover:bg-gray-3 hover:text-gray-12 border-b-1 border-gray-5 text-gray-11 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          Proyectos
        </button>
      </div>

      {/* Tabla de Peticiones */}
      {activeTab === "requests" && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-3">
              <tr>
                {[
                  "Título",
                  "Autor",
                  "Categoría",
                  "Fecha",
                  "Apoyos",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-blue-10 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {req.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.authorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.supports}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Aprobar"
                      >
                        <CheckIcon size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Rechazar"
                      >
                        <XIcon size={18} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Eliminar"
                        onClick={() => deleteRequest(req.id)}
                      >
                        <TrashIcon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla de Proyectos */}
      {activeTab === "projects" && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-3">
              <tr>
                {[
                  "Título",
                  "Institución",
                  "Estado",
                  "Fecha Inicio",
                  "Valoración",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-blue-10 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((proj) => (
                <tr key={proj.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {proj.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proj.institution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        proj.status === "planning"
                          ? "bg-yellow-100 text-yellow-800"
                          : proj.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {proj.status === "planning"
                        ? "Planeación"
                        : proj.status === "in-progress"
                        ? "En progreso"
                        : "Completado"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proj.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    👍 {proj.likes} | 👎 {proj.dislikes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      title="Eliminar"
                      onClick={() => deleteProject(proj.id)}
                    >
                      <TrashIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
