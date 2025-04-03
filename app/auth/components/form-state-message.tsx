import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle } from "lucide-react"

interface FormStateMessageProps {
  type: "Error" | "Success"
  message?: string
}

export function FormStateMessage({ type, message }: FormStateMessageProps) {
  if (!message) {
    return null
  }

  return (
    <div
      className={cn(
        "bg-emerald-400/20 p-3 rounded-md flex items-center gap-x-1 text-sm text-emerald-700",
        type === "Error"
          ? "bg-rose-500/20 text-rose-500"
          : "dark:bg-emerald-500/20 dark:text-emerald-500"
      )}
    >
      {type === "Success" ? (
        <CheckCircle className="h-5 w-5 mr-3" />
      ) : (
        <AlertCircle className="h-5 w-5 mr-3 text-rose-500" />
      )}
      <p>{message}</p>
    </div>
  )
}
