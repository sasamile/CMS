import Link from "next/link"
import { LogOut, UserRound } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/common/user-avatar"
import { currentUser } from "@/lib/auth-user"
import { SignOutButton } from "./sign-out-button"

interface UserButtonProps {
  className?: string
}

export async function UserButton({ className }: UserButtonProps) {
  const loggedUser = await currentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <button className="select-none">
          <UserAvatar own />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        sideOffset={5}
        className="w-[264px] lg:mr-3 ml-3 bg-slate-50 dark:bg-zinc-900"
      >
        <Link href={`/setting/profile/${loggedUser?.id}`}>
          <DropdownMenuItem className="cursor-pointer py-2">
            <UserRound className="size-4 mr-2" />
            Perfil
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <SignOutButton
            variant="ghost"
            className="flex items-center justify-start w-full px-2 py-1.5"
          >
            <LogOut className="size-4 mr-2" />
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
