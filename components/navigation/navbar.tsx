import { Logo } from "../common/logo"
import { ModeToggle } from "../common/mode-toggle"
import { UserButton } from "../common/user-button"
import { MobileNavbar } from "./mobile-navbar"
// import { NavRoutes } from "./nav-routes"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-3 border-b">
      <div className="flex items-center gap-9">
        <Logo />
        {/* <div className="max-lg:hidden">
          <NavRoutes />
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserButton />
        <MobileNavbar />
      </div>
    </nav>
  )
}
