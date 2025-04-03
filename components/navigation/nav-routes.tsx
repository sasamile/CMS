"use client"

import { navRoutes } from "@/constants"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { SheetClose } from "../ui/sheet"

interface NavRoutesProps {
  direction?: "column" | "row"
  isMobileNav?: boolean
}

export function NavRoutes({
  direction = "row",
  isMobileNav = false,
}: NavRoutesProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (href: string) => {
    router.push(href)
  }

  return (
    <ul
      className={cn(
        "flex items-center gap-5",
        direction === "column" && "flex-col"
      )}
    >
      {navRoutes.map(({ label, href }, i) => {
        const isActive = (pathname === "/" && href === "/") || pathname === href
        // || pathname.startsWith(href)

        return (
          <>
            {!isMobileNav && (
              <li
                key={i}
                onClick={() => handleClick(href)}
                className={cn(
                  "font-medium text-muted-foreground cursor-pointer hover:text-primary transition",
                  isActive && "text-primary",
                  direction === "column" && "w-full text-start"
                )}
              >
                {label}
              </li>
            )}
            {isMobileNav && (
              <SheetClose asChild key={i}>
                <li
                  onClick={() => handleClick(href)}
                  className={cn(
                    "font-medium text-muted-foreground cursor-pointer hover:text-primary transition",
                    isActive && "text-primary",
                    direction === "column" && "w-full text-start"
                  )}
                >
                  {label}
                </li>
              </SheetClose>
            )}
          </>
        )
      })}
    </ul>
  )
}
