import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { RoleProvider } from "./ui/RoleContext";
import RoleGate from "./ui/RoleGate";
import TreesLayout from "./TreesLayout";

import Login from "./page/Login";
import SelectRole from "./page/SelectRole";
import Denied from "./page/Denied";

import Ciudadano from "./page/Ciudadano/Ciudadano";
import Validador from "./page/Validador/Validador";
import Administrador from "./page/Administrador/Administrador";

const TreesRoutes: React.FC = () => (
  <RoleProvider>
    <Routes>
      {/* Login y selección de perfil */}
      <Route path="login" element={<Login />} />
      <Route path="seleccionar" element={<SelectRole />} />
      <Route path="denegado" element={<Denied />} />

      {/* Layout con el header del módulo */}
      <Route path="" element={<TreesLayout />}>
        {/* Al entrar a /trees -> redirige al login */}
        <Route index element={<Navigate to="login" replace />} />

        <Route
          path="ciudadano"
          element={
            <RoleGate allow={["Ciudadano", "Validador", "Administrador"]}>
              <Ciudadano />
            </RoleGate>
          }
        />

        <Route
          path="validaciones"
          element={
            <RoleGate allow={["Validador", "Administrador"]}>
              <Validador />
            </RoleGate>
          }
        />

        <Route
          path="administrador"
          element={
            <RoleGate allow={["Administrador"]}>
              <Administrador />
            </RoleGate>
          }
        />
      </Route>

      {/* Fallback dentro del módulo */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  </RoleProvider>
);

export default TreesRoutes;

