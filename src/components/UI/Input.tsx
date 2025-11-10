import React from "react"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={`w-full rounded-md border px-3 py-2 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${className}`}
    />
  )
)
Input.displayName = "Input"