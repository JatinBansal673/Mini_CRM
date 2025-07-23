import { cn } from "../lib/utils"

export function Card({ children, className, ...props }) {
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-200", className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn("text-sm text-gray-500 mt-1", className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn("px-6 py-4 bg-gray-50 border-t border-gray-200", className)} {...props}>
      {children}
    </div>
  )
}
