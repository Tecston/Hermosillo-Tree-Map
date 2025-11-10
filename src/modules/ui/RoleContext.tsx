import React, { createContext, useContext, useMemo, useState } from "react";

export type Role = "Ciudadano" | "Validador" | "Administrador";

type RoleContextType = {
  role: Role | null;
  setRole: (r: Role | null) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // guarda el rol en localStorage para persistir entre recargas
  const [roleState, setRoleState] = useState<Role | null>(() => {
    const saved = localStorage.getItem("role");
    return (saved as Role) || null;
  });

  const setRole = (r: Role | null) => {
    setRoleState(r);
    if (r) localStorage.setItem("role", r);
    else localStorage.removeItem("role");
  };

  const value = useMemo(() => ({ role: roleState, setRole }), [roleState]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole debe usarse dentro de <RoleProvider>");
  return ctx;
};

// opcional: default export por si en algún sitio se llegara a importar por defecto
export default RoleContext;
