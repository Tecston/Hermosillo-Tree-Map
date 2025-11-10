import React from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../ui/RoleContext";

export default function SelectRole() {
  const { setRole } = useRole();
  const nav = useNavigate();

  const pick = (r: "Ciudadano" | "Validador" | "Administrador") => {
    setRole(r);
    if (r === "Ciudadano") nav("/dashboard/modules/ciudadano");
    if (r === "Validador") nav("/dashboard/modules/validaciones");
    if (r === "Administrador") nav("/dashboard/modules/administrador");
  };

  return (
    <div className="min-h-[70vh] grid place-items-center bg-slate-900">
      <div className="bg-white p-6 rounded-xl shadow-md w-[420px]">
        <h2 className="text-lg font-semibold mb-3">Selecciona tu perfil</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-slate-200" onClick={() => pick("Ciudadano")}>
            Ciudadano
          </button>
          <button className="px-3 py-2 rounded bg-slate-200" onClick={() => pick("Validador")}>
            Validador
          </button>
          <button className="px-3 py-2 rounded bg-orange-500 text-white" onClick={() => pick("Administrador")}>
            Administrador
          </button>
        </div>
      </div>
    </div>
  );
}
