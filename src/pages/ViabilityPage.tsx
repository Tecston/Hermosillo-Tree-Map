// src/pages/ViabilityPage.tsx
import React, { useState } from "react";
import DefineStep from "../components/Viability/DefineStep";
import AnalysisStep from "../components/Viability/AnalysisStep";
import ResultsStep, {
  ViabilityReport,
} from "../components/Viability/ResultsStep";
import { fakeReport } from "../components/utils/MockReport";

export default function ViabilityPage() {
  const [tab, setTab] = useState<"definir" | "analizar" | "resultados">(
    "definir"
  );
  const [report, setReport] = useState<ViabilityReport | null>(null);

  const handleCreated = () => setTab("analizar");
  const handleReady = () => {
    setReport(fakeReport);
    setTab("resultados");
  };
  const handleExport = (fmt: "pdf" | "csv") =>
    alert(`Descargando ${fmt.toUpperCase()} (mock)`);

  return (
    <div className="h-full w-full bg-white border border-gray-6 p-2 rounded flex flex-col">
      <nav className="flex border-b px-6">
        {["definir", "analizar", "resultados"].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`px-4 py-3 text-sm font-medium ${
              tab === key ? "border-b-2 border-blue-9 text-gray-11" : ""
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-auto">
        {tab === "definir" && <DefineStep onCreated={handleCreated} />}
        {tab === "analizar" && <AnalysisStep onReady={handleReady} />}
        {tab === "resultados" && report && (
          <ResultsStep report={report} onExport={handleExport} />
        )}
      </div>
    </div>
  );
}
