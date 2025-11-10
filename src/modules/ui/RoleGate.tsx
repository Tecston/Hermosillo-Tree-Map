import React from "react";
import { Navigate } from "react-router-dom";
import { Role, useRole } from "./RoleContext";

type Props = {
  allow: Role[];
  children: React.ReactNode;
};

const RoleGate: React.FC<Props> = ({ allow, children }) => {
  const { role } = useRole();

  if (!role) {
    return <Navigate to="/dashboard/modules/seleccionar" replace />;
  }

  if (!allow.includes(role)) {
    return <Navigate to="/dashboard/modules/denegado" replace />;
  }

  return <>{children}</>;
};

export default RoleGate;
