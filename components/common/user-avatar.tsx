import { User } from "lucide-react"

import { currentUser } from "@/lib/auth-user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "size-11",
      md: "size-12",
      lg: "size-[68px]",
      xl: "md:size-[120px] size-[80px]",
      xxl: "md:size-[340px] size-72",
    },
  },
})

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  src?: string
  own?: boolean
  className?: string
  fallbackClassName?: string
}

export async function UserAvatar({
  src,
  own,
  className,
  fallbackClassName,
  size,
}: UserAvatarProps) {
  const loggedUser = await currentUser()

  return (
    <Avatar className={cn("size-9", className, avatarSizes({ size }))}>
      <AvatarImage
        src={own ? loggedUser?.image ?? "" : src}
        alt="User image"
        className="object-cover"
      />
      <AvatarFallback>
        <User className={cn("size-2/5 shrink-0", fallbackClassName)} />
      </AvatarFallback>
    </Avatar>
  )
}
