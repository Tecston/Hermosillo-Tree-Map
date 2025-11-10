// File: src/components/Resources/AlliancesHistory.tsx
import React from "react";

interface Alliance {
  id: string;
  date: string;
  partner: string;
  initiative: string;
  logoUrl?: string;
}

const alliances: Alliance[] = [
  {
    id: "a1",
    date: "2024-10-11",
    partner: "Ayuntamiento de Hermosillo",
    initiative: "Propuesta de proyecto de urbanización",
    logoUrl: "/logos/ayuntamiento.jpeg",
  },
];

const AlliancesHistory: React.FC = () => (
  <section className="bg-white rounded-lg border border-gray-6 p-6">
    <h2 className="text-2xl font-bold mb-4">Historial de Alianzas</h2>
    <ul className="space-y-4">
      {alliances.map(({ id, date, partner, initiative, logoUrl }) => (
        <li key={id} className="flex items-start space-x-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={partner}
              className="w-12 h-12 object-cover rounded-md"
            />
          )}
          <div>
            <p className="text-sm text-gray-500">
              {new Date(date).toLocaleDateString()}
            </p>
            <p className="font-medium text-gray-800">{partner}</p>
            <p className="text-gray-600">{initiative}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default AlliancesHistory;
