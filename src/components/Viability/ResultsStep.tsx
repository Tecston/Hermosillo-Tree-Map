// src/components/Viability/ResultsStep.tsx
import { Button } from "../UI/Button"

import { DownloadIcon } from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts"

type BreakdownKey = "Económico" | "Social" | "Ambiental" | "Regulatorio" | "Riesgo"

export interface ViabilityReport {
  score: number
  roi: number        // 0–1
  compliance: number // 0–1
  risk: number       // 0–1
  breakdown: Record<BreakdownKey, number> // 0–100
}

interface ResultsStepProps {
  report: ViabilityReport
  onExport: (format: "pdf" | "csv") => void
}

export default function ResultsStep({ report, onExport }: ResultsStepProps) {
  const data = Object.entries(report.breakdown).map(([k, v]) => ({
    criterio: k,
    valor: v,
  }))

  return (
    <section className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Resultados finales</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onExport("csv")}>
            <DownloadIcon className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button onClick={() => onExport("pdf")}>
            <DownloadIcon className="mr-2 h-4 w-4" /> PDF
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <SummaryCard title="Score global">
          <span className="text-4xl font-bold">{report.score}</span>
        </SummaryCard>
        <SummaryCard title="ROI (10 años)">{fmtPct(report.roi)}</SummaryCard>
        <SummaryCard title="Cumplimiento">{fmtPct(report.compliance)}</SummaryCard>
        <SummaryCard title="Riesgo">
          <span className={report.risk > 0.6 ? "text-red-600" : "text-emerald-600"}>
            {report.risk.toFixed(1)}
          </span>
        </SummaryCard>
      </div>

      <div className="mx-auto w-full max-w-xl">
        <RadarChart outerRadius={120} width={450} height={320} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="criterio" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
          <Radar name="Calificación" dataKey="valor" stroke="#0066ff" fill="#0066ff" fillOpacity={0.35}/>
          <Legend />
          <Tooltip />
        </RadarChart>
      </div>

      <div className="space-y-4">
        {Object.entries(report.breakdown).map(([k, v]) => (
          <DetailRow key={k} label={k} value={`${v.toFixed(0)} / 100`} />
        ))}
      </div>
    </section>
  )
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-xs">
      <p className="text-xs text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-2">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

const fmtPct = (n: number) => <span>{(n * 100).toFixed(1)}%</span>
