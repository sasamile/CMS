import Link from "next/link"

import { Button } from "@/components/ui/button"

interface BackButtonProps {
  href: string
  label: string
}

export function BackButton({ href, label }: BackButtonProps) {
  return (
    <Button
      size="sm"
      variant="link"
      className="text-muted-foreground font-normal w-full"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  )
}
