import React from "react";
import { useRole } from "../../ui/RoleContext";

export default function Administrador() {
  const { role } = useRole();

  // Si quieres abrir otra página, cambia esta ruta relativa a la carpeta Administrador/
  const startPage = new URL("./index.html", import.meta.url).toString();

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {role !== "Administrador" && (
        <header className="p-2 border-b flex justify-between">
          <div className="flex gap-4">
            <a href="/dashboard/modules/ciudadano">Ciudadano</a>
            <a href="/dashboard/modules/validaciones">Validaciones</a>
            <a className="font-semibold" href="/dashboard/modules/administrador">Admin</a>
          </div>
          <div>
            Perfil: <b>{role}</b> <a href="/dashboard/modules/seleccionar">Cambiar</a>
          </div>
        </header>
      )}

      <iframe title="Administrador Vanilla" src={startPage} style={{ display: "block", width: "100%", height: "100%", border: 0 }} />
    </div>
  );
}
