import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import React from "react"

interface BillboardPreviewProps {
  title: string
  description: string
  buttonLabel: string
  imageSrc: string | null
}

export default function BillboardPreview({
  title,
  description,
  buttonLabel,
  imageSrc,
}: BillboardPreviewProps) {
  return (
    <div
      className="relative flex items-center md:justify-start justify-center min-w-full h-[485px] px-4 py-2 md:px-16 rounded-lg select-none"
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
      }}
    >
      <div
        className={cn(
          "absolute inset-0 max-md:bg-primary/45 dark:max-md:bg-secondary/45 md:bg-gradient-to-r from-primary/50 via-primary/20 rounded-lg",
          imageSrc && "dark:from-secondary/50 dark:via-secondary/20"
        )}
      />
      <div className="flex flex-col justify-center md:text-left md:items-start items-center text-center lg:max-w-[65%] md:max-w-[70%] size-full space-y-6 md:px-12 sm:px-6 z-10 text-gray-50">
        <h2 className="tracking-tight text-4xl max-md:text-3xl max-xs:text-[26px] font-extrabold">
          {title}
        </h2>
        <p className="text-lg max-md:text-base max-xs:text-[15px] lg:w-[70%] text-gray-50">
          {description}
        </p>
        <Button className="rounded-sm bg-transparent text-gray-50 border-2 hover:bg-gray-100 hover:text-[#29457a] border-gray-100 z-30">
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}
