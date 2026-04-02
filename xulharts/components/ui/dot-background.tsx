import React from "react"

export function DotBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen dot-pattern">
      <div className="relative z-10">{children}</div>
    </div>
  )
}
