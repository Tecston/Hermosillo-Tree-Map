// src/components/UI/TextArea.tsx
import React from "react"

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    {...props}
    className={`w-full rounded-md border px-3 py-2 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${className}`}
  />
))
TextArea.displayName = "TextArea"
