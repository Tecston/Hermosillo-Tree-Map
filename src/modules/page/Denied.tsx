import React from "react";
export default function Denied() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="p-6 rounded-lg bg-white shadow">
        <h1 className="text-xl font-semibold mb-2">Acceso denegado</h1>
        <p>No tienes permisos para ver esta sección.</p>
      </div>
    </div>
  );
}
