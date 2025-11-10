// File: src/components/Timeline/HistoryTimeline.tsx
import React from 'react'

interface Milestone {
  id: string
  year: string
  description: string
}

const milestones: Milestone[] = [
  {
    id: 'm1',
    year: '2023',
    description: 'Lanzamos la versión inicial con mapa de peticiones y registro de proyectos.',
  },
  {
    id: 'm2',
    year: '2024 Q1',
    description: 'Incorporamos sistema de votación 👍👎 y comentarios en cada reporte.',
  },
  {
    id: 'm3',
    year: '2024 Q2',
    description: 'Desplegamos estadísticas interactivas y dashboards analíticos.',
  },
  {
    id: 'm4',
    year: '2025',
    description: 'Abrimos sección de recompensas y gamificación para incentivar la participación.',
  },
]

const HistoryTimeline: React.FC = () => (
  <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4">Nuestra Historia</h2>
    <div className="relative border-l-2 border-blue-200 pl-6">
      {milestones.map((m) => (
        <div key={m.id} className="mb-8">
          <span className="absolute -left-3 top-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
            {m.year}
          </span>
          <p className="text-gray-700 mt-1">{m.description}</p>
        </div>
      ))}
    </div>
  </section>
)

export default HistoryTimeline
