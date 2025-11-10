// Label.tsx
import React from "react"
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = "", ...props }) => (
  <label {...props} className={`mb-1 block text-sm font-medium ${className}`} />
)