import { Copy, Server } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Badge, BadgeProps } from "../ui/badge"
import { Button } from "../ui/button"
import { toast } from "sonner"

interface ApiAlertProps {
  title: string
  description: string
  variant: "public" | "admin"
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Público",
  admin: "Admin",
}

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "light",
  admin: "destructive",
}

export function ApiAlert({
  title,
  description,
  variant = "public",
}: ApiAlertProps) {
  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description)
    toast.success("Ruta API copiada.")
  }

  return (
    <Alert className="bg-muted/50">
      <div className="flex gap-2 justify-between">
        <div className="flex items-center gap-2">
          <AlertTitle className="flex items-center justify-between gap-x-2">
            <Server className="size-4" />
            {title}
            <Badge
              variant={variantMap[variant]}
              className="font-medium py-[0.9px] "
            >
              {textMap[variant]}
            </Badge>
          </AlertTitle>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onCopy(description)}
          className="hover:bg-transparent dark:hover:bg-transparent bg-muted"
        >
          <Copy className="size-4 shrink-0" />
        </Button>
      </div>
      <AlertDescription className="flex items-center justify-between mt-3">
        <code className="relative max-sm:w-full w-fit rounded px-[0.6rem] py-[0.4rem] font-mono font-semibold bg-muted-foreground/20 dark:bg-muted-foreground/50 truncate">
          {description}
        </code>
      </AlertDescription>
    </Alert>
  )
}
