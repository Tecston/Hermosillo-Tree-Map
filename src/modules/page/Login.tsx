// src/modules/page/Login.tsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../ui/RoleContext";

import fondo from "./Hermosilloooooo.jpg";
import logo from "./Hermosilloooooo1.png";

const DESTINOS: Record<string, { role: "Ciudadano" | "Validador" | "Administrador"; path: string }> = {
  ciudadano: { role: "Ciudadano", path: "/dashboard/modules/ciudadano" },
  validador: { role: "Validador", path: "/dashboard/modules/validaciones" },
  admin: { role: "Administrador", path: "/dashboard/modules/administrador" },
  administrador: { role: "Administrador", path: "/dashboard/modules/administrador" },
};

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { setRole } = useRole();
  const nav = useNavigate();
  const userInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const u = usuario.toLowerCase().trim();
    const destino = DESTINOS[u];

    // si coincide usuario válido y hay contraseña, navega
    if (destino && password.trim()) {
      setRole(destino.role);
      nav(destino.path);
      return;
    }

    // si NO es válido: no navega, no muestra alert; limpia y enfoca
    setUsuario("");
    setPassword("");
    userInputRef.current?.focus();
  };

  const canSubmit = Boolean(usuario) && Boolean(password);

  return (
    <div
      className="min-h-screen grid place-items-center bg-center bg-cover"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      {/* Tarjeta */}
      <div className="w-[520px] max-w-[90vw] bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.35)] border border-black/5">
        {/* Logo */}
        <div className="flex items-center justify-center mb-5">
          <img
            src={logo}
            alt="H. Ayuntamiento de Hermosillo"
            className="max-h-50 w-auto object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Usuario */}
          <div className="mb-4">
            <label className="block text-[15px] text-gray-700 mb-1" htmlFor="usuario">
              Usuario
            </label>
            <input
              id="usuario"
              ref={userInputRef}
              autoFocus
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-orange-400/60 focus:border-orange-500 outline-none transition"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-6">
            <label className="block text-[15px] text-gray-700 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-orange-400/60 focus:border-orange-500 outline-none transition"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-md transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
