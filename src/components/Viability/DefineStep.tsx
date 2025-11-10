// src/components/Viability/DefineStep.tsx
import { useState } from "react";
import { Button } from "../UI/Button";
import { Label } from "../UI/Label";
import { Input } from "../UI/Input";
import { TextArea } from "../UI/TextArea"; // nuevo

interface DefineStepProps {
  onCreated: () => void;
}

export default function DefineStep({ onCreated }: DefineStepProps) {
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [stage, setStage] = useState("Idea");
  const [sector, setSector] = useState("Comercial");

  const canCreate = name.trim() && objective.trim();

  return (
    <section className="mx-auto max-w-lg space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Crear nuevo proyecto</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre del proyecto *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Centro Comercial Norte"
          />
        </div>

        <div>
          <Label htmlFor="objective">Objetivo del proyecto *</Label>
          <TextArea
            id="objective"
            rows={3}
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Describe brevemente el propósito..."
          />
        </div>

        <div>
          <Label htmlFor="stage">Etapa del proyecto</Label>
          <select
            id="stage"
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            {["Idea", "Prefactibilidad", "Ejecutivo"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="sector">Sector</Label>
          <select
            id="sector"
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            {["Comercial", "Residencial", "Equipamiento", "Mixto"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={!canCreate}
          onClick={onCreated}
          className="inline-flex items-center justify-center rounded-md bg-blue-9 px-4 py-2 text-sm font-medium text-white hover:bg-blue-10 active:bg-blue-9 disabled:opacity-50 "
        >
          Crear proyecto
        </button>
      </div>
    </section>
  );
}
