// src/components/Viability/AnalysisStep.tsx
import { useState } from "react";
import { Button } from "../UI/Button";
import MapWithDraw from "./MapWithDraw";

interface AnalysisStepProps {
  onReady: () => void;
  onPolygonReady: (coords: [number, number][]) => void;
}

export default function AnalysisStep({
  onReady,
  onPolygonReady,
}: AnalysisStepProps) {
  const [budget, setBudget] = useState(15_000_000);
  const [coords, setCoords] = useState<[number, number][] | null>(null);

  return (
    <section className="grid gap-6 p-6 sm:grid-cols-3">
      {/* Mapa */}
      <div className="sm:col-span-2">
        <MapWithDraw
          onPolygonCreated={(c) => {
            setCoords(c);
            onPolygonReady(c);
          }}
        />
      </div>

      {/* Formulario lateral */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Parámetros básicos</h2>

        <label className="block text-sm">
          Presupuesto (MXN)
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(+e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </label>

        <p className="text-xs text-gray-500">
          Coordenadas capturadas:{" "}
          {coords ? `${coords.length} vértices` : "— (dibuja un polígono)"}
        </p>

        <button
          disabled={!coords}
          className="inline-flex items-center justify-center rounded-md bg-blue-9 px-4 py-2 text-sm font-medium text-white hover:bg-blue-10 active:bg-blue-9 disabled:opacity-50  w-full"
          onClick={onReady}
        >
          Continuar
        </button>
      </div>
    </section>
  );
}
