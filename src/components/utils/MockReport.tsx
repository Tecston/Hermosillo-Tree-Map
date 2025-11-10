// src/utils/MockReport.ts
import { ViabilityReport } from "../components/Viability/ResultsStep"

export const fakeReport: ViabilityReport = {
  score: 78,
  roi: 0.183,
  compliance: 0.83,
  risk: 0.2,
  breakdown: {
    Económico: 72,
    Social: 80,
    Ambiental: 65,
    Regulatorio: 90,
    Riesgo: 55,
  },
}
