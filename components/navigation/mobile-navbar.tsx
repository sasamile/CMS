"use client"

import { MenuIcon } from "lucide-react"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { NavRoutes } from "./nav-routes"

export function MobileNavbar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="">
          <MenuIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[999]">
        <SheetHeader className="text-start">
          <SheetTitle className="text-start w-full">Navegación</SheetTitle>
        </SheetHeader>

        <div className="mt-12 my-4">
          <NavRoutes isMobileNav direction="column" />
        </div>
      </SheetContent>
    </Sheet>
  )
}
