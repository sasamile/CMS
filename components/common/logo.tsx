import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/">
      <Image
        src="/icons/uniminuto-logo.png"
        alt="Logo uniminuto"
        width={255}
        height={68}
        className="w-[200px] h-[45px] hidden dark:block object-cover max-lg:hidden max-lg:dark:hidden"
      />
      <Image
        src="/icons/logo-uniminuto.png"
        alt="Logo uniminuto"
        width={255}
        height={68}
        className="w-[200px] h-[45px] block dark:hidden object-cover max-lg:hidden"
      />
      <Image
        src="/icons/um-logo.png"
        alt="Uniminuto Logo"
        width={200}
        height={50}
        className="w-[30px] h-auto lg:hidden block"
      />
      {/* <Image
        src="/icons/um-logo.png"
        alt="Uniminuto Logo"
        width={200}
        height={50}
        className="w-[30px] h-auto lg:hidden block"
      /> */}
    </Link>
  )
}
