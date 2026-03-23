import React from "react"

export function DotBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute inset-0 dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-roxo/[0.2]">
        <div className="absolute pointer-events-none inset-0 dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
