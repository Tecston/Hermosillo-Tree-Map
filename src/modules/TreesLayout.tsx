// src/modules/TreesLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";

export default function TreesLayout() {
  // No barra, no wrapper — solo renderiza la página hija (iframe full screen)
  return <Outlet />;
}
