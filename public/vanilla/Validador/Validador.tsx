import React from "react";
import { useRole } from "../../ui/RoleContext";

export default function Validador() {
  const { role } = useRole();

  // Carga el index.html de ESTA carpeta
  const startPage = new URL("./index.html", import.meta.url).toString();

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* si NO eres Validador, muestra una barrita de navegación mínima */}
      {role !== "Validador" && (
        <header className="p-2 border-b flex justify-between">
          <div className="flex gap-4">
            <a href="/dashboard/modules/ciudadano">Inicio</a>
            <a className="font-semibold" href="/dashboard/modules/validaciones">Validaciones</a>
            <a href="/dashboard/modules/administrador">Admin</a>
          </div>
          <div>Perfil: <b>{role}</b> <a href="/dashboard/modules/seleccionar">Cambiar</a></div>
        </header>
      )}

      {/* Tu app vanilla a pantalla completa */}
      <iframe
        title="Validador Vanilla"
        src={startPage}
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
}
