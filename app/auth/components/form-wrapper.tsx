import { Social } from "./social"
import { BackButton } from "./back-button"
import { WrapperHeader } from "./wrapper-header"
import Image from "next/image"

interface FormWrapperProps {
  children?: React.ReactNode
  headerTitle: string
  headerSubtitle?: string
  showSocial?: boolean
  backButtonHref: string
  backButtonLabel: string
}

export function FormWrapper({
  children,
  headerTitle,
  headerSubtitle,
  showSocial,
  backButtonHref,
  backButtonLabel,
}: FormWrapperProps) {
  return (
    <div className="w-full flex flex-col items-center xs:max-w-[460px] sm:max-w-[480px] xs:px-8 px-4 py-6 space-y-1.5 my-4 mx-auto">
      <div className="mb-6 w-fit">
        <Image
          src="/icons/um-logo.png"
          alt="Logo uniminuto"
          width={255}
          height={68}
          priority
          className="mx:hidden w-[60px] h-auto"
        />
      </div>

      <WrapperHeader title={headerTitle} subtitle={headerSubtitle} />

      <div className="w-full">{children}</div>
      <div className="space-y-5 w-full">{showSocial && <Social />}</div>
      <BackButton href={backButtonHref} label={backButtonLabel} />
    </div>
  )
}
