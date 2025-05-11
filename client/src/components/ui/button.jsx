import { cn } from "../lib/utils"

const buttonVariants = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md",
  secondary: "bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 shadow-sm",
  outline: "bg-transparent hover:bg-indigo-50 text-indigo-600 border border-indigo-200",
  ghost: "bg-transparent hover:bg-indigo-50 text-indigo-600",
  danger: "bg-rose-600 hover:bg-rose-700 text-white",
  success: "bg-emerald-600 hover:bg-emerald-700 text-white",
}

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
  icon: "p-2",
}

export function Button({ children, className, variant = "primary", size = "md", disabled = false, ...props }) {
  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2",
        buttonVariants[variant],
        buttonSizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
