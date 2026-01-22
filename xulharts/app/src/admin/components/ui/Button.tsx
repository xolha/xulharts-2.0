import React from "react";

type ButtonVariants = "roxinho" | "roxo" 

type ButtonProps = React.ComponentProps<"button"> & {
    children: string
    variant?: ButtonVariants
}

export default function Button( {children, variant = "roxinho", ...rest}: ButtonProps ) {
  const variantStyles: Record<ButtonVariants, string> = {
    roxinho: "bg-roxo",
    roxo: "bg-roxo-escuro",
  }

  const baseClass = "rounded-2xl m-4 p-2.5 px-20 flex items-center justify-center text-center text-white font-inria cursor-pointer"
  const selectedVariant = variantStyles[variant]

  return (
    <button className={`${baseClass} ${selectedVariant}`}>
      {children}
    </button>
  )
}
