import { Navbar } from "@/components/navigation/navbar"
import { currentUser } from "@/lib/auth-user"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loggedUser = await currentUser()

  if (!loggedUser?.id) {
    redirect("/auth/login")
  }

  return (
    <div className="overflow-y-hidden">
      <Navbar />
      <main className="px-4 md:px-8 py-10">{children}</main>
    </div>
  )
}
